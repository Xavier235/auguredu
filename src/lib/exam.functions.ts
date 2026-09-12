import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

/** Saves a finished practice test so Augur can build a weakness report. */
export const saveExamAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        board: z.string().max(20).default("jamb"),
        subject: z.string().max(120).default(""),
        score: z.number().int().min(0).max(200),
        total: z.number().int().min(1).max(200),
        topics: z
          .array(
            z.object({
              topic: z.string().max(120),
              correct: z.number().int().min(0).max(200),
              total: z.number().int().min(0).max(200),
            }),
          )
          .max(60)
          .default([]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase.from("exam_attempts").insert({ ...data, user_id: userId } as any);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export type WeaknessRow = { topic: string; correct: number; total: number; pct: number };
export type WeaknessReport = {
  attempts: number;
  answered: number;
  correct: number;
  pct: number;
  weak: WeaknessRow[];
  strong: WeaknessRow[];
  subjects: { subject: string; pct: number; total: number }[];
};

/** Rolls every saved attempt into strengths, weaknesses and per subject accuracy. */
export const getWeaknessReport = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<WeaknessReport> => {
    const { supabase, userId } = context as any;
    const { data, error } = await supabase
      .from("exam_attempts")
      .select("board, subject, score, total, topics, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(60);
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as any[];

    const byTopic = new Map<string, WeaknessRow>();
    const bySubject = new Map<string, { correct: number; total: number }>();
    let answered = 0;
    let correct = 0;

    for (const r of rows) {
      answered += Number(r.total ?? 0);
      correct += Number(r.score ?? 0);
      const s = String(r.subject || "General");
      const sub = bySubject.get(s) ?? { correct: 0, total: 0 };
      sub.correct += Number(r.score ?? 0);
      sub.total += Number(r.total ?? 0);
      bySubject.set(s, sub);
      for (const t of (r.topics ?? []) as any[]) {
        const key = String(t.topic || "General").trim() || "General";
        const cur = byTopic.get(key) ?? { topic: key, correct: 0, total: 0, pct: 0 };
        cur.correct += Number(t.correct ?? 0);
        cur.total += Number(t.total ?? 0);
        byTopic.set(key, cur);
      }
    }

    const topics = Array.from(byTopic.values())
      .filter((t) => t.total > 0)
      .map((t) => ({ ...t, pct: Math.round((t.correct / t.total) * 100) }));

    return {
      attempts: rows.length,
      answered,
      correct,
      pct: answered ? Math.round((correct / answered) * 100) : 0,
      weak: topics.filter((t) => t.pct < 70).sort((a, b) => a.pct - b.pct).slice(0, 8),
      strong: topics.filter((t) => t.pct >= 70).sort((a, b) => b.pct - a.pct).slice(0, 6),
      subjects: Array.from(bySubject.entries())
        .filter(([, v]) => v.total > 0)
        .map(([subject, v]) => ({ subject, pct: Math.round((v.correct / v.total) * 100), total: v.total }))
        .sort((a, b) => a.pct - b.pct),
    };
  });
