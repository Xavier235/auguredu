import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { getLibraryEntry } from "@/lib/library-catalogue";
import { cleanAugurText, STYLE_RULES } from "@/lib/text-clean";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.6-flash";

export type GeneratedReading = {
  summary: string;
  sections: { heading: string; body: string }[];
  keyTerms: { term: string; meaning: string }[];
  examTips: string[];
  quiz: { q: string; options: string[]; answer: number }[];
};

/**
 * Builds a full, readable lecture note for any course in the NUC catalogue.
 * This is what makes every course code in the library openable and readable
 * instead of a template stub.
 */
export const generateCourseReading = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ entryId: z.string().min(2).max(120) }).parse(d))
  .handler(async ({ data }): Promise<GeneratedReading> => {
    const entry = getLibraryEntry(data.entryId);
    if (!entry) throw new Error("Unknown course");

    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const today = new Date().toISOString().slice(0, 10);

    const prompt = `Today is ${today}. Write full Nigerian university lecture notes for this course.

Course code: ${entry.code}
Course title: ${entry.title}
Department: ${entry.department}
Faculty: ${entry.faculty}
Level: ${entry.level} level
Credit units: ${entry.units}

Follow the NUC BMAS syllabus and the way this course is actually taught and examined in Nigerian universities such as UNILAG, LASU, UI, OAU, UNN and ABU. Explain properly with worked examples, definitions and Nigerian exam framing, not a summary outline.

Return ONLY valid JSON with this exact shape and no code fences:
{
  "summary": "two sentence overview of the course",
  "sections": [{ "heading": "string", "body": "at least 120 words of real teaching prose" }],
  "keyTerms": [{ "term": "string", "meaning": "string" }],
  "examTips": ["string"],
  "quiz": [{ "q": "string", "options": ["a","b","c","d"], "answer": 0 }]
}

Give 6 sections, 6 key terms, 4 exam tips and 4 quiz questions. "answer" is the zero based index of the correct option.

${STYLE_RULES}`;

    const res = await fetch(GATEWAY, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a senior Nigerian university lecturer writing accurate, exam focused course notes. You always reply with strict JSON only.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      if (res.status === 429) throw new Error("The library is busy right now, please try again in a moment.");
      if (res.status === 402) throw new Error("Reading credits exhausted, please contact support.");
      throw new Error(`Could not build this reading (${res.status}).`);
    }

    const json = await res.json();
    const raw: string = json?.choices?.[0]?.message?.content ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Could not build this reading, please try again.");

    let parsed: GeneratedReading;
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      throw new Error("Could not build this reading, please try again.");
    }

    const clean = (s: unknown) => cleanAugurText(String(s ?? ""));

    return {
      summary: clean(parsed.summary),
      sections: (parsed.sections ?? [])
        .filter((s) => s?.heading && s?.body)
        .slice(0, 10)
        .map((s) => ({ heading: clean(s.heading), body: clean(s.body) })),
      keyTerms: (parsed.keyTerms ?? [])
        .filter((t) => t?.term)
        .slice(0, 10)
        .map((t) => ({ term: clean(t.term), meaning: clean(t.meaning) })),
      examTips: (parsed.examTips ?? []).slice(0, 8).map((t) => clean(t)),
      quiz: (parsed.quiz ?? [])
        .filter((q) => q?.q && Array.isArray(q.options) && q.options.length >= 2)
        .slice(0, 6)
        .map((q) => ({
          q: clean(q.q),
          options: q.options.slice(0, 5).map((o) => clean(o)),
          answer: Math.max(0, Math.min((q.options?.length ?? 1) - 1, Number(q.answer) || 0)),
        })),
    };
  });
