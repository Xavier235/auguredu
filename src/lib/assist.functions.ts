import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { cleanAugurText, STYLE_RULES } from "@/lib/text-clean";
import { FREE_EXPLAIN_LIMIT, trackLabel, streamLabel } from "@/lib/track";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.6-flash";

async function ask(system: string, user: string) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: `${system}\n\n${STYLE_RULES}` },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) {
    if (res.status === 429) throw new Error("Augur is busy right now, try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted, please contact support.");
    throw new Error(`Augur could not answer that (${res.status}).`);
  }
  const json: any = await res.json();
  return cleanAugurText(json?.choices?.[0]?.message?.content ?? "");
}

/** Records which parts of Augur a student actually uses, so Augur can learn. */
async function bumpUsage(supabase: any, userId: string, feature: string) {
  try {
    const { data } = await supabase
      .from("feature_usage")
      .select("count")
      .eq("user_id", userId)
      .eq("feature", feature)
      .maybeSingle();
    await supabase.from("feature_usage").upsert(
      {
        user_id: userId,
        feature,
        count: ((data as any)?.count ?? 0) + 1,
        last_used_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,feature" },
    );
  } catch {
    // Usage learning is best effort.
  }
}

async function tierOf(supabase: any, userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", userId)
    .maybeSingle();
  return String((data as any)?.subscription_tier ?? "free");
}

/**
 * Free students get a small daily allowance of assisted explanations.
 * Any paid plan removes the cap entirely.
 */
async function spendExplain(supabase: any, userId: string) {
  const tier = await tierOf(supabase, userId);
  if (tier !== "free") return { tier, left: -1 };
  const { data, error } = await supabase.rpc("consume_quota", {
    _feature: "explain",
    _limit: FREE_EXPLAIN_LIMIT,
  });
  if (error) throw new Error(error.message);
  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.allowed) {
    throw new Error(
      `You have used your ${FREE_EXPLAIN_LIMIT} free explanations for today. Upgrade to Basic or Lecturer Premium for unlimited help, or come back after midnight.`,
    );
  }
  return { tier, left: Math.max(0, FREE_EXPLAIN_LIMIT - Number(row.new_count ?? 0)) };
}

/** Compact "who am I helping" block used by the bubble and the exam helper. */
async function whoIsThis(supabase: any, userId: string) {
  const [prof, study, usage] = await Promise.all([
    supabase.from("profiles").select("display_name, school, level, subscription_tier").eq("id", userId).maybeSingle(),
    supabase
      .from("study_profiles")
      .select("track, stream, subjects, department, level, school, courses, goal")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase.from("feature_usage").select("feature, count").eq("user_id", userId).order("count", { ascending: false }).limit(6),
  ]);
  const p = (prof?.data ?? {}) as any;
  const s = (study?.data ?? {}) as any;
  const lines: string[] = [];
  if (p.display_name) lines.push(`Name: ${p.display_name}`);
  if (s.track) lines.push(`They are a ${trackLabel(s.track)}.`);
  if (s.stream) lines.push(`Stream: ${streamLabel(s.stream)}`);
  if (s.subjects) lines.push(`Exam subjects they registered for: ${s.subjects}`);
  if (s.department) lines.push(`Department: ${s.department}`);
  if (p.school || s.school) lines.push(`School: ${p.school || s.school}`);
  if (p.level || s.level) lines.push(`Level: ${p.level || s.level}`);
  if (s.courses) lines.push(`Courses: ${s.courses}`);
  if (s.goal) lines.push(`Goal: ${s.goal}`);
  const rows = ((usage?.data as any[]) ?? []).filter((r) => r.count > 0);
  if (rows.length) {
    lines.push(
      `Tools they use most: ${rows.map((r) => `${r.feature} x${r.count}`).join(", ")}. Lean on what they already use and only suggest a new tool when it clearly helps.`,
    );
  }
  return lines.length
    ? `\n\nWHO YOU ARE HELPING, tailor every example to them and never ask for details listed here.\n${lines.join("\n")}`
    : "";
}

export const getAssistStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as any;
    const tier = await tierOf(supabase, userId);
    const { data } = await supabase.rpc("my_usage_today");
    const rows = (Array.isArray(data) ? data : []) as Array<{ feature: string; count: number }>;
    const used = rows.find((r) => r.feature === "explain")?.count ?? 0;
    return {
      tier,
      unlimited: tier !== "free",
      used,
      limit: FREE_EXPLAIN_LIMIT,
      left: tier !== "free" ? -1 : Math.max(0, FREE_EXPLAIN_LIMIT - used),
    };
  });

/** "I am stuck on this question" — works inside the CBT exam and elsewhere. */
export const explainQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        question: z.string().min(3).max(2000),
        options: z.array(z.string().max(400)).max(6).default([]),
        correctIndex: z.number().int().min(0).max(5).nullable().default(null),
        chosenIndex: z.number().int().min(0).max(5).nullable().default(null),
        subject: z.string().max(120).default(""),
        board: z.enum(["jamb", "waec", "neco", "post-utme", "course"]).default("jamb"),
        hintOnly: z.boolean().default(false),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const quota = await spendExplain(supabase, userId);
    const who = await whoIsThis(supabase, userId);
    await bumpUsage(supabase, userId, "explain");

    const optionText = data.options.length
      ? data.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join("\n")
      : "(no options given)";

    const answer = await ask(
      `You are Augur, a patient Nigerian teacher sitting beside a student during a ${data.board.toUpperCase()} practice test. ${
        data.hintOnly
          ? "The student is stuck but has not answered yet. Give a nudge that unlocks the thinking without ever naming the correct option."
          : "Explain the question fully: restate what is being asked in plain words, work through the reasoning step by step, name the correct option and say clearly why each tempting wrong option fails."
      } Finish with one line on the exam trick being tested so they recognise it next time. Keep it under 180 words.${who}`,
      `Subject: ${data.subject || "general"}\nQuestion: ${data.question}\nOptions:\n${optionText}\n${
        data.correctIndex !== null && !data.hintOnly
          ? `Correct option: ${String.fromCharCode(65 + data.correctIndex)}\n`
          : ""
      }${
        data.chosenIndex !== null ? `The student picked: ${String.fromCharCode(65 + data.chosenIndex)}\n` : ""
      }`,
    );

    return { answer, left: quota.left, unlimited: quota.left === -1 };
  });

/** The floating Augur helper that lives on every page. */
export const augurAssist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        message: z.string().min(1).max(1500),
        page: z.string().max(120).default("/"),
        history: z
          .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(3000) }))
          .max(12)
          .default([]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const who = await whoIsThis(supabase, userId);
    await bumpUsage(supabase, userId, "assist");

    const transcript = data.history
      .map((m) => `${m.role === "user" ? "Student" : "Augur"}: ${m.content}`)
      .join("\n");

    const answer = await ask(
      `You are Augur, a Nigerian study companion embedded in the Augur.edu app. The student is on the ${data.page} page right now, so answer in the context of what that page does. Be brief and useful: two short paragraphs at most, or a tight list of steps. If a full lesson is needed, answer the core of it and mention they can continue in the full chat.${who}`,
      transcript ? `${transcript}\nStudent: ${data.message}` : data.message,
    );

    return { answer };
  });
