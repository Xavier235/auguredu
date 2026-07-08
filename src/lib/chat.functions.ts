import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

const SYSTEM_PROMPT = `You are Augur AI, a friendly Nigerian university study buddy. You help students with JAMB prep, coursework, CGPA planning, and study skills. You know Nigerian university course codes (e.g. MTH 101, CSC 202, GST 105) and reference them precisely. Keep answers concise, use markdown, and cite course codes when relevant. You are NOT a lecturer — for lecturer-verified answers, tell users the Lecturer tier is coming.`;

const LECTURER_PROMPT = `You are Augur Lecturer — a premium, exam-focused Nigerian university lecturer AI. Answer at a lecturer's depth: define terms, derive formulas, walk through worked examples, and reference the exact Nigerian syllabus course code (e.g. CSC 202, MTH 201) when possible. Structure answers with clear headings, numbered steps, and always end with a short "Study checklist" of 3 bullet points.`;

// Per-feature free-tier daily caps. Paid users bypass via profiles.subscription_tier.
const FREE_LIMITS = { chat: 30, flashcards: 5, lecturer: 5 } as const;
type Feature = keyof typeof FREE_LIMITS;

async function enforceQuota(supabase: any, userId: string, feature: Feature) {
  const { data: prof } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", userId)
    .maybeSingle();
  if ((prof as any)?.subscription_tier && (prof as any).subscription_tier !== "free") {
    return { allowed: true as const, count: 0, limit: -1 };
  }
  const { data, error } = await supabase.rpc("consume_quota", {
    _feature: feature,
    _limit: FREE_LIMITS[feature],
  });
  if (error) throw new Error(error.message);
  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.allowed) {
    throw new Error(
      `Daily ${feature} limit reached (${row?.day_limit ?? FREE_LIMITS[feature]}/day on the free plan). Resets at midnight UTC — or upgrade for unlimited.`,
    );
  }
  return { allowed: true as const, count: row.new_count as number, limit: row.day_limit as number };
}

type Attachment = {
  url: string;
  mimeType: string;
  name: string;
};

type ChatMsg = {
  role: "system" | "user" | "assistant";
  content: string | Array<Record<string, unknown>>;
};

async function callGateway(messages: ChatMsg[]): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("AI is busy — please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please contact support.");
    throw new Error(`AI error (${res.status}): ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

async function signAttachment(
  supabase: any,
  path: string,
): Promise<string | null> {
  const { data } = await supabase.storage
    .from("chat-uploads")
    .createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? null;
}

// -------- Threads --------

export const listThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await (context.supabase as any)
      .from("chat_threads")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as Array<{ id: string; title: string; room: string; updated_at: string }>;
  });

export const createThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ room: z.string().default("study-buddy"), title: z.string().default("New chat") }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await (context.supabase as any).from("chat_threads")
      .insert({ user_id: context.userId, room: data.room, title: data.title })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row as unknown as { id: string; title: string; room: string };
  });

export const deleteThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ threadId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await (context.supabase as any).from("chat_threads").delete().eq("id", data.threadId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ threadId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await (context.supabase as any).from("chat_messages_v2")
      .select("*")
      .eq("thread_id", data.threadId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return rows as unknown as Array<{
      id: string;
      role: "user" | "assistant" | "system";
      content: string;
      attachments: Attachment[];
      created_at: string;
    }>;
  });

// -------- Send chat message --------

const sendSchema = z.object({
  threadId: z.string().uuid(),
  content: z.string().min(1).max(4000),
  attachments: z
    .array(
      z.object({
        path: z.string(),
        name: z.string(),
        mimeType: z.string(),
      }),
    )
    .default([]),
});

export const sendChatMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => sendSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    await enforceQuota(supabase, userId, "chat");

    // Sign attachments
    const signed: Attachment[] = [];
    for (const a of data.attachments) {
      const url = await signAttachment(supabase, a.path);
      if (url) signed.push({ url, name: a.name, mimeType: a.mimeType });
    }

    // Insert user message
    const { error: userErr } = await (supabase as any).from("chat_messages_v2").insert({
      thread_id: data.threadId,
      user_id: userId,
      role: "user",
      content: data.content,
      attachments: signed,
    });
    if (userErr) throw new Error(userErr.message);

    // Load recent history
    const { data: history } = await (supabase as any)
      .from("chat_messages_v2")
      .select("role, content, attachments")
      .eq("thread_id", data.threadId)
      .order("created_at", { ascending: true })
      .limit(30);

    const messages: ChatMsg[] = [{ role: "system", content: SYSTEM_PROMPT }];
    for (const h of (history as any[]) ?? []) {
      const parts: Array<Record<string, unknown>> = [{ type: "text", text: h.content }];
      if (Array.isArray(h.attachments)) {
        for (const att of h.attachments as Attachment[]) {
          if (att.mimeType?.startsWith("image/")) {
            parts.push({ type: "image_url", image_url: { url: att.url } });
          } else if (att.mimeType === "application/pdf") {
            parts.push({
              type: "file",
              file: { filename: att.name, file_data: att.url },
            });
          }
        }
      }
      messages.push({ role: h.role, content: parts.length > 1 ? parts : h.content });
    }

    const assistantContent = await callGateway(messages);

    // Save assistant reply
    const { error: aErr } = await (supabase as any).from("chat_messages_v2").insert({
      thread_id: data.threadId,
      user_id: userId,
      role: "assistant",
      content: assistantContent,
      attachments: [],
    });
    if (aErr) throw new Error(aErr.message);

    // Touch thread & auto-title if still default
    const { data: thread } = await (supabase as any)
      .from("chat_threads")
      .select("title")
      .eq("id", data.threadId)
      .single();
    const patch: any = { updated_at: new Date().toISOString() };
    if ((thread as any)?.title === "New chat") {
      patch.title = data.content.slice(0, 60);
    }
    await (supabase as any).from("chat_threads").update(patch).eq("id", data.threadId);

    return { ok: true, reply: assistantContent };
  });

// -------- Flashcards from PDF/image --------

const flashSchema = z.object({
  attachmentPath: z.string(),
  mimeType: z.string(),
  name: z.string(),
});

export const generateFlashcardsFromAttachment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => flashSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const url = await signAttachment(supabase, data.attachmentPath);
    if (!url) throw new Error("Could not access file");

    // Register PDF document row (for read-to-earn tracking)
    let pdfId: string | null = null;
    if (data.mimeType === "application/pdf" || data.mimeType.startsWith("image/")) {
      const { data: doc } = await (supabase as any)
        .from("pdf_documents")
        .insert({
          user_id: userId,
          storage_path: data.attachmentPath,
          title: data.name,
          mime_type: data.mimeType,
          page_count: 1,
        })
        .select()
        .single();
      pdfId = (doc as any)?.id ?? null;
    }

    const userParts: Array<Record<string, unknown>> = [
      {
        type: "text",
        text: 'Generate 8 study flashcards from this material. Respond with ONLY a JSON array like [{"q":"question","a":"answer"}]. No prose, no code fences.',
      },
    ];
    if (data.mimeType.startsWith("image/")) {
      userParts.push({ type: "image_url", image_url: { url } });
    } else {
      userParts.push({ type: "file", file: { filename: data.name, file_data: url } });
    }

    const raw = await callGateway([
      { role: "system", content: "You are an expert tutor who creates concise, high-yield flashcards." },
      { role: "user", content: userParts },
    ]);

    // Extract JSON array
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("AI did not return a valid card set");
    let cards: Array<{ q: string; a: string }>;
    try {
      cards = JSON.parse(match[0]);
    } catch {
      throw new Error("AI response was not valid JSON");
    }
    cards = cards.filter((c) => c?.q && c?.a).slice(0, 12);
    if (cards.length === 0) throw new Error("No cards generated");

    const deckName = data.name.replace(/\.(pdf|png|jpg|jpeg|webp)$/i, "").slice(0, 60);
    const rows = cards.map((c) => ({
      user_id: userId,
      source_pdf_id: pdfId,
      deck_name: deckName,
      question: c.q,
      answer: c.a,
    }));
    const { error } = await (supabase as any).from("flashcards").insert(rows);
    if (error) throw new Error(error.message);

    return { deckName, cards, pdfId };
  });

// -------- Read-to-earn --------

const xpSchema = z.object({
  pdfId: z.string().uuid(),
  page: z.number().int().min(1).max(500),
  dwellMs: z.number().int().min(0),
});

export const awardReadingXp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => xpSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    if (data.dwellMs < 15000) {
      return { awarded: 0, reason: "keep reading — minimum 15 seconds per page" };
    }

    // Insert dedupe event (unique index prevents double-award)
    const points = 1;
    const { error: evErr } = await (supabase as any).from("xp_events").insert({
      user_id: userId,
      kind: "pdf_page_read",
      points,
      meta: { pdf_id: data.pdfId, page: data.page },
    });
    if (evErr) {
      if (evErr.code === "23505") return { awarded: 0, reason: "already rewarded" };
      throw new Error(evErr.message);
    }

    // Daily cap
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const { count } = await (supabase as any)
      .from("xp_events")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", today.toISOString());
    if ((count ?? 0) > 200) return { awarded: 0, reason: "daily reading cap reached" };

    // Upsert user_xp
    const { data: existing } = await (supabase as any)
      .from("user_xp")
      .select("xp, level")
      .eq("user_id", userId)
      .maybeSingle();
    const newXp = ((existing as any)?.xp ?? 0) + points;
    const newLevel = Math.max(1, Math.floor(newXp / 50) + 1);
    if (existing) {
      await (supabase as any).from("user_xp").update({ xp: newXp, level: newLevel }).eq("user_id", userId);
    } else {
      await (supabase as any)
        .from("user_xp")
        .insert({ user_id: userId, xp: newXp, level: newLevel });
    }

    return { awarded: points, total: newXp, level: newLevel };
  });

export const getMyXp = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await (context.supabase as any).from("user_xp")
      .select("xp, level, show_on_leaderboard")
      .eq("user_id", context.userId)
      .maybeSingle();
    return (data as any) ?? { xp: 0, level: 1, show_on_leaderboard: true };
  });

export const getLeaderboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: xp } = await (context.supabase as any).from("user_xp")
      .select("user_id, xp, level")
      .eq("show_on_leaderboard", true)
      .order("xp", { ascending: false })
      .limit(20);
    if (!xp || xp.length === 0) return [];
    const ids = (xp as any[]).map((r) => r.user_id);
    const { data: profiles } = await context.supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", ids);
    const map = new Map<string, any>();
    for (const p of (profiles as any[]) ?? []) map.set(p.id, p);
    return (xp as any[]).map((r) => ({
      user_id: r.user_id,
      xp: r.xp,
      level: r.level,
      display_name: map.get(r.user_id)?.display_name ?? "Student",
      avatar_url: map.get(r.user_id)?.avatar_url ?? null,
    }));
  });

export const getPdfSignedUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ pdfId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: doc, error } = await (context.supabase as any).from("pdf_documents")
      .select("*")
      .eq("id", data.pdfId)
      .single();
    if (error || !doc) throw new Error("PDF not found");
    const url = await signAttachment(context.supabase, (doc as any).storage_path);
    return { url, title: (doc as any).title, mimeType: (doc as any).mime_type, pageCount: (doc as any).page_count };
  });
