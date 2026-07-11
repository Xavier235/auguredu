import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const planSchema = z.enum(["lecturer_monthly", "lecturer_yearly", "pro_monthly", "pro_yearly"]);

// Only accept common receipt formats (matches storage path suffix)
const ALLOWED_EXT = /\.(png|jpe?g|webp|heic|heif|pdf)$/i;

const submitSchema = z.object({
  plan: planSchema,
  amountNaira: z.number().int().min(500, "Amount too low").max(10_000_000, "Amount too high"),
  receiptPath: z
    .string()
    .min(6, "Missing receipt")
    .max(400)
    .regex(ALLOWED_EXT, "Receipt must be an image (PNG/JPG/WEBP/HEIC) or a PDF"),
  senderName: z
    .string()
    .trim()
    .min(2, "Sender name too short")
    .max(120)
    .regex(/^[\p{L}\p{M}'\-.\s]+$/u, "Sender name has invalid characters")
    .optional(),
  note: z.string().trim().max(500).optional(),
});

export const submitPaymentRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => submitSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await (supabase as any)
      .from("payment_requests")
      .insert({
        user_id: userId,
        plan: data.plan,
        amount_naira: data.amountNaira,
        receipt_path: data.receiptPath,
        sender_name: data.senderName ?? null,
        note: data.note ?? null,
        status: "pending",
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const listMyPaymentRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await (context.supabase as any)
      .from("payment_requests")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as any[];
  });

async function ensureAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden — admin only");
}

export const listAllPaymentRequests = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ status: z.enum(["pending", "approved", "rejected", "all"]).default("pending") }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    let q = (context.supabase as any).from("payment_requests").select("*").order("created_at", { ascending: false });
    if (data.status !== "all") q = q.eq("status", data.status);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    // Attach profile display info + signed receipt URLs
    const ids = (rows ?? []).map((r: any) => r.user_id);
    let profiles: Record<string, any> = {};
    if (ids.length) {
      const { data: p } = await context.supabase
        .from("profiles")
        .select("id, display_name, avatar_url, school")
        .in("id", ids);
      for (const row of (p as any[]) ?? []) profiles[row.id] = row;
    }
    const out: any[] = [];
    for (const r of rows ?? []) {
      const { data: signed } = await (context.supabase as any).storage
        .from("receipts")
        .createSignedUrl(r.receipt_path, 60 * 60);
      out.push({
        ...r,
        receipt_url: signed?.signedUrl ?? null,
        profile: profiles[r.user_id] ?? null,
      });
    }
    return out;
  });

export const decidePaymentRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        decision: z.enum(["approved", "rejected"]),
        adminNotes: z.string().max(500).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { error } = await (context.supabase as any)
      .from("payment_requests")
      .update({
        status: data.decision,
        admin_notes: data.adminNotes ?? null,
        reviewed_by: context.userId,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const amIAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { admin: !!data };
  });
