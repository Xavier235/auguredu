import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { getLibraryItem } from "@/lib/library";
import { getLibraryEntry } from "@/lib/library-catalogue";

const verifySchema = z.object({
  itemId: z.string().min(2).max(120),
  secondsRead: z.number().int().min(0).max(60 * 60 * 4),
  correct: z.number().int().min(0).max(20),
  total: z.number().int().min(1).max(20),
});

export const listMyLibraryReads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await (context.supabase as any)
      .from("library_reads")
      .select("*")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as any[];
  });

/**
 * Verify a completed library reading: requires enough time on the page and a
 * passing comprehension score. Awards XP once per item.
 */
export const verifyLibraryRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => verifySchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const item = getLibraryItem(data.itemId);
    if (!item) throw new Error("Unknown library item");

    // Premium material is gated by subscription tier.
    if (item.premium) {
      const { data: profile } = await (supabase as any)
        .from("profiles")
        .select("subscription_tier, subscription_expires_at")
        .eq("id", userId)
        .maybeSingle();
      const tier = (profile as any)?.subscription_tier ?? "free";
      const exp = (profile as any)?.subscription_expires_at;
      const active = tier !== "free" && (!exp || new Date(exp).getTime() > Date.now());
      if (!active) throw new Error("This material is part of Pro. Upgrade to unlock it.");
    }

    const scorePct = Math.round((data.correct / data.total) * 100);
    const minSeconds = Math.max(45, Math.round(item.minutes * 60 * 0.4));
    const enoughTime = data.secondsRead >= minSeconds;
    const passed = scorePct >= 67;
    const verified = enoughTime && passed;

    const { data: existing } = await (supabase as any)
      .from("library_reads")
      .select("id, verified, seconds_read, quiz_score")
      .eq("user_id", userId)
      .eq("item_id", item.id)
      .maybeSingle();

    const alreadyVerified = !!(existing as any)?.verified;

    if (existing) {
      await (supabase as any)
        .from("library_reads")
        .update({
          seconds_read: Math.max((existing as any).seconds_read ?? 0, data.secondsRead),
          quiz_score: Math.max((existing as any).quiz_score ?? 0, scorePct),
          verified: alreadyVerified || verified,
        })
        .eq("id", (existing as any).id);
    } else {
      await (supabase as any).from("library_reads").insert({
        user_id: userId,
        item_id: item.id,
        item_title: item.title,
        department: item.department,
        level: item.level,
        seconds_read: data.secondsRead,
        quiz_score: scorePct,
        verified,
      });
    }

    let awarded = 0;
    if (verified && !alreadyVerified) {
      awarded = item.xp;
      await (supabase as any).from("xp_events").insert({
        user_id: userId,
        kind: "library_read",
        points: awarded,
        meta: { item_id: item.id, course_code: item.courseCode, score: scorePct },
      });

      const { data: xpRow } = await (supabase as any)
        .from("user_xp")
        .select("xp, level")
        .eq("user_id", userId)
        .maybeSingle();
      const newXp = ((xpRow as any)?.xp ?? 0) + awarded;
      const newLevel = Math.max(1, Math.floor(newXp / 250) + 1);
      if (xpRow) {
        await (supabase as any).from("user_xp").update({ xp: newXp, level: newLevel }).eq("user_id", userId);
      } else {
        await (supabase as any).from("user_xp").insert({ user_id: userId, xp: newXp, level: newLevel });
      }

      await (supabase as any).from("notifications").insert({
        user_id: userId,
        kind: "xp",
        title: `+${awarded} XP — ${item.courseCode} verified`,
        body: `You passed the check on "${item.title}" with ${scorePct}%. It now counts towards your study plan.`,
        href: "/study-plan",
      });
    }

    return {
      verified,
      alreadyVerified,
      scorePct,
      awarded,
      reason: verified ? null : !enoughTime ? "Spend a bit more time reading before the check." : "Score at least 67% to verify.",
    };
  });
