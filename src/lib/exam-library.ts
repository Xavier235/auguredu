// WAEC, NECO and JAMB material in the library: past question practice sets and
// the official syllabus for every subject a candidate can register for.

import { CORE_SUBJECTS, STREAM_SUBJECTS, type StreamId } from "./track";

export type ExamBoard = "waec" | "neco" | "jamb";
export type PaperKind = "past" | "syllabus";

export const BOARDS: { id: ExamBoard; label: string; short: string }[] = [
  { id: "jamb", label: "JAMB UTME", short: "JAMB" },
  { id: "waec", label: "WAEC (WASSCE)", short: "WAEC" },
  { id: "neco", label: "NECO (SSCE)", short: "NECO" },
];

export const JAMB_SUBJECTS = [
  "Use of English",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Government",
  "Literature in English",
  "Commerce",
  "Financial Accounting",
  "Geography",
  "Agricultural Science",
  "Christian Religious Studies",
  "Islamic Studies",
];

const unique = (xs: string[]) => Array.from(new Set(xs));

export const SSCE_SUBJECTS = unique([
  ...CORE_SUBJECTS,
  ...STREAM_SUBJECTS.science,
  ...STREAM_SUBJECTS.commercial,
  ...STREAM_SUBJECTS.art,
]);

export function subjectsForBoard(board: ExamBoard) {
  return board === "jamb" ? JAMB_SUBJECTS : SSCE_SUBJECTS;
}

/** Which streams a subject belongs to, used to filter by the student's stream. */
export function streamsOf(subject: string): StreamId[] {
  if (CORE_SUBJECTS.includes(subject)) return ["science", "commercial", "art"];
  const out: StreamId[] = [];
  (["science", "commercial", "art"] as StreamId[]).forEach((s) => {
    if (STREAM_SUBJECTS[s].includes(subject)) out.push(s);
  });
  return out.length ? out : ["science", "commercial", "art"];
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export type ExamPaper = {
  id: string;
  board: ExamBoard;
  boardLabel: string;
  kind: PaperKind;
  subject: string;
  title: string;
  blurb: string;
  streams: StreamId[];
  minutes: number;
  xp: number;
};

function build(): ExamPaper[] {
  const out: ExamPaper[] = [];
  for (const b of BOARDS) {
    for (const subject of subjectsForBoard(b.id)) {
      const streams = streamsOf(subject);
      out.push({
        id: `${b.id}-past-${slugify(subject)}`,
        board: b.id,
        boardLabel: b.label,
        kind: "past",
        subject,
        title: `${b.short} ${subject} past questions`,
        blurb: `Fresh ${b.short} style questions built from real past paper patterns, reshuffled every time you open it.`,
        streams,
        minutes: 20,
        xp: 40,
      });
      out.push({
        id: `${b.id}-syllabus-${slugify(subject)}`,
        board: b.id,
        boardLabel: b.label,
        kind: "syllabus",
        subject,
        title: `${b.short} ${subject} syllabus`,
        blurb: `Every topic ${b.short} can examine in ${subject}, with what to read and how it is tested.`,
        streams,
        minutes: 12,
        xp: 25,
      });
    }
  }
  return out;
}

export const EXAM_PAPERS: ExamPaper[] = build();

export function getPaper(id: string): ExamPaper | null {
  return EXAM_PAPERS.find((p) => p.id === id) ?? null;
}

export function boardForTrack(track?: string | null): ExamBoard | null {
  if (track === "waec" || track === "neco" || track === "jamb") return track;
  return null;
}
