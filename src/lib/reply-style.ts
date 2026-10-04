// Reply styles students can pick for Augur, plus the live-exam question guard.

export const REPLY_STYLES = {
  balanced: { label: "Balanced", prompt: "" },
  short: { label: "Short and direct", prompt: "REPLY STYLE: Short and direct. Answer in at most four sentences or five short bullets. No long intros." },
  steps: { label: "Step by step", prompt: "REPLY STYLE: Step by step. Break every answer into numbered steps and include one worked example." },
  simple: { label: "Explain like I'm new", prompt: "REPLY STYLE: Very simple. Use everyday words and a relatable Nigerian example, as if the topic is brand new to the student." },
  examiner: { label: "Examiner style", prompt: "REPLY STYLE: Examiner. Answer the way a model exam answer is written and show where marks are won and lost." },
} as const;

export type ReplyStyle = keyof typeof REPLY_STYLES;
export const REPLY_STYLE_KEYS = Object.keys(REPLY_STYLES) as [ReplyStyle, ...ReplyStyle[]];
export const REPLY_STYLE_STORAGE = "augur-reply-style";

export const EXAM_BLOCK_MESSAGE =
  "That looks like a question from the exam you are taking right now, so I cannot answer it. Finish and submit the exam first, then I will happily explain it.";

function words(s: string) {
  return new Set(
    s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2),
  );
}

/** True when the message is essentially the same as one of the exam questions. */
export function matchesExamQuestion(message: string, questions: string[]): boolean {
  const m = words(message);
  if (m.size < 3) return false;
  for (const q of questions) {
    const qs = words(q);
    if (qs.size < 3) continue;
    let shared = 0;
    for (const w of qs) if (m.has(w)) shared++;
    if (shared / qs.size >= 0.7) return true;
  }
  return false;
}

/** Server helper: questions from the student's exam started in the last 4 hours. */
export async function liveExamQuestions(supabase: any, userId: string): Promise<string[]> {
  const since = new Date(Date.now() - 4 * 3600_000).toISOString();
  const { data } = await supabase
    .from("exam_live_questions")
    .select("question")
    .eq("user_id", userId)
    .gte("created_at", since)
    .limit(200);
  return ((data as any[]) ?? []).map((r) => String(r.question));
}
