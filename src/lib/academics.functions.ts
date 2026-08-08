import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { cleanAugurText, STYLE_RULES } from "@/lib/text-clean";
import { getLibraryEntry } from "@/lib/library-catalogue";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.6-flash";

async function askJson(system: string, prompt: string): Promise<any> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: `${system}\n\nYou always reply with strict JSON only, no code fences.\n\n${STYLE_RULES}` },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) {
    if (res.status === 429) throw new Error("Augur is busy right now, please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted, please contact support.");
    throw new Error(`Augur could not complete that (${res.status}).`);
  }
  const json = await res.json();
  const raw: string = json?.choices?.[0]?.message?.content ?? "";
  const match = raw.match(/[[{][\s\S]*[\]}]/);
  if (!match) throw new Error("Augur returned an unreadable answer, please try again.");
  try {
    return JSON.parse(match[0]);
  } catch {
    throw new Error("Augur returned an unreadable answer, please try again.");
  }
}

const clean = (s: unknown) => cleanAugurText(String(s ?? ""));

// ---------------- Live CBT exam simulator ----------------

export type ExamQuestion = {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
  topic: string;
};

export const generateExam = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        subject: z.string().min(2).max(80),
        mode: z.enum(["jamb", "post-utme", "course"]),
        count: z.number().int().min(5).max(40),
        difficulty: z.enum(["easy", "standard", "hard"]).default("standard"),
      })
      .parse(d),
  )
  .handler(async ({ data }): Promise<{ questions: ExamQuestion[]; title: string }> => {
    const framing =
      data.mode === "jamb"
        ? "Use real JAMB UTME syllabus topics and the exact JAMB question style and difficulty spread."
        : data.mode === "post-utme"
          ? "Use Nigerian university Post UTME screening style: short, fast, mixed use of English and the candidate's subject."
          : "Use the Nigerian university course syllabus for this course code, first semester and second semester content, exactly as it is examined.";

    const parsed = await askJson(
      "You are a Nigerian examiner writing accurate computer based test questions with verified answers.",
      `Write ${data.count} multiple choice questions on: ${data.subject}.
${framing}
Difficulty: ${data.difficulty}.
Every question must have exactly four options and one correct option. The explanation must be two or three lines and must justify the correct answer.

Return ONLY JSON:
{"title":"short exam title","questions":[{"q":"string","options":["a","b","c","d"],"answer":0,"explanation":"string","topic":"string"}]}`,
    );

    const questions: ExamQuestion[] = (parsed?.questions ?? [])
      .filter((q: any) => q?.q && Array.isArray(q.options) && q.options.length === 4)
      .slice(0, data.count)
      .map((q: any) => ({
        q: clean(q.q),
        options: q.options.map((o: unknown) => clean(o)),
        answer: Math.max(0, Math.min(3, Number(q.answer) || 0)),
        explanation: clean(q.explanation),
        topic: clean(q.topic),
      }));

    if (questions.length === 0) throw new Error("Could not build that exam, please try another subject.");
    return { questions, title: clean(parsed?.title) || `${data.subject} practice test` };
  });

// ---------------- Project topic generator + outline builder ----------------

export type ProjectTopic = { topic: string; rationale: string; scope: string; methods: string };

export const generateProjectTopics = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        department: z.string().min(2).max(80),
        interest: z.string().max(200).optional(),
        level: z.string().max(10).default("400"),
      })
      .parse(d),
  )
  .handler(async ({ data }): Promise<ProjectTopic[]> => {
    const parsed = await askJson(
      "You are a Nigerian university project supervisor who approves final year project topics.",
      `Suggest 6 final year project topics for a ${data.level} level ${data.department} student in a Nigerian university.${
        data.interest ? ` The student is interested in: ${data.interest}.` : ""
      }
Each topic must be feasible in Nigeria within one academic session, with data the student can realistically collect locally.

Return ONLY JSON:
{"topics":[{"topic":"string","rationale":"why it matters in the Nigerian context","scope":"what is covered and what is excluded","methods":"data sources, sample and analysis method"}]}`,
    );
    return (parsed?.topics ?? [])
      .slice(0, 8)
      .map((t: any) => ({
        topic: clean(t.topic),
        rationale: clean(t.rationale),
        scope: clean(t.scope),
        methods: clean(t.methods),
      }))
      .filter((t: ProjectTopic) => t.topic);
  });

export type ResearchOutline = {
  title: string;
  abstract: string;
  chapters: { heading: string; points: string[] }[];
  references: string[];
};

export const buildResearchOutline = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ topic: z.string().min(5).max(300), department: z.string().max(80).default("") }).parse(d),
  )
  .handler(async ({ data }): Promise<ResearchOutline> => {
    const parsed = await askJson(
      "You are a Nigerian university project supervisor who structures undergraduate research projects.",
      `Build the full five chapter research outline for this project topic: ${data.topic}${
        data.department ? ` (${data.department} department)` : ""
      }.
Follow the standard Nigerian undergraduate project format: Chapter One Introduction, Chapter Two Literature Review, Chapter Three Methodology, Chapter Four Results and Discussion, Chapter Five Summary Conclusion and Recommendations. Give the real sub headings under each chapter and what the student must write in each, with word budgets.

Return ONLY JSON:
{"title":"refined project title","abstract":"150 word abstract draft","chapters":[{"heading":"string","points":["string"]}],"references":["APA style reference suggestions"]}`,
    );
    return {
      title: clean(parsed?.title) || data.topic,
      abstract: clean(parsed?.abstract),
      chapters: (parsed?.chapters ?? []).slice(0, 8).map((c: any) => ({
        heading: clean(c.heading),
        points: (c.points ?? []).slice(0, 12).map((p: unknown) => clean(p)),
      })),
      references: (parsed?.references ?? []).slice(0, 10).map((r: unknown) => clean(r)),
    };
  });

// ---------------- Smart flashcards from library notes ----------------

export type Flashcard = { q: string; a: string };

export const generateCourseFlashcards = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ entryId: z.string().min(2).max(120), notes: z.string().max(12000).default("") }).parse(d),
  )
  .handler(async ({ data }): Promise<Flashcard[]> => {
    const entry = getLibraryEntry(data.entryId);
    const label = entry ? `${entry.code} ${entry.title} (${entry.department}, ${entry.level} level)` : data.entryId;
    const parsed = await askJson(
      "You are a Nigerian lecturer turning lecture notes into revision flashcards.",
      `Make 12 exam focused flashcards for ${label}.${
        data.notes ? `\n\nBase them strictly on these notes:\n${data.notes.slice(0, 10000)}` : ""
      }
Front is a short recall question, back is a complete but compact answer a student can memorise.

Return ONLY JSON: {"cards":[{"q":"string","a":"string"}]}`,
    );
    return (parsed?.cards ?? [])
      .slice(0, 20)
      .map((c: any) => ({ q: clean(c.q), a: clean(c.a) }))
      .filter((c: Flashcard) => c.q && c.a);
  });

// ---------------- Audio summary text ----------------

export const summariseForAudio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ text: z.string().min(50).max(20000), label: z.string().max(120).default("") }).parse(d))
  .handler(async ({ data }): Promise<{ script: string }> => {
    const parsed = await askJson(
      "You are a Nigerian lecturer recording a short spoken revision summary for students.",
      `Turn this material into a spoken summary script of about 250 words that a student can listen to and understand without seeing the text.${
        data.label ? ` The material is ${data.label}.` : ""
      }
Speak in flowing sentences, no bullet points, no headings.

Material:
${data.text.slice(0, 15000)}

Return ONLY JSON: {"script":"string"}`,
    );
    const script = clean(parsed?.script);
    if (!script) throw new Error("Could not build the audio summary, please try again.");
    return { script };
  });
