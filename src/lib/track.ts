/**
 * Who a student is: the exam board they are sitting (or university), the
 * stream they belong to, and the subjects they registered for. Everything
 * Augur personalises hangs off this.
 */

export const TRACKS = [
  { id: "jamb", label: "JAMB / UTME candidate" },
  { id: "waec", label: "WAEC (WASSCE) candidate" },
  { id: "neco", label: "NECO (SSCE) candidate" },
  { id: "university", label: "University student" },
] as const;

export type TrackId = (typeof TRACKS)[number]["id"];

export const STREAMS = [
  { id: "science", label: "Science" },
  { id: "commercial", label: "Commercial" },
  { id: "art", label: "Art" },
] as const;

export type StreamId = (typeof STREAMS)[number]["id"];

export const CORE_SUBJECTS = ["English Language", "Mathematics"];

export const STREAM_SUBJECTS: Record<StreamId, string[]> = {
  science: [
    "Physics",
    "Chemistry",
    "Biology",
    "Further Mathematics",
    "Agricultural Science",
    "Geography",
    "Technical Drawing",
    "Computer Studies",
    "Civic Education",
  ],
  commercial: [
    "Economics",
    "Financial Accounting",
    "Commerce",
    "Business Studies",
    "Government",
    "Geography",
    "Marketing",
    "Office Practice",
    "Civic Education",
  ],
  art: [
    "Literature in English",
    "Government",
    "Christian Religious Studies",
    "Islamic Studies",
    "History",
    "Geography",
    "Economics",
    "Visual Arts",
    "Civic Education",
  ],
};

export function subjectsFor(stream?: string | null) {
  const s = (stream ?? "") as StreamId;
  return [...CORE_SUBJECTS, ...(STREAM_SUBJECTS[s] ?? [])];
}

export const splitSubjects = (v?: string | null) =>
  (v ?? "")
    .split(/[,;\n]+/)
    .map((x) => x.trim())
    .filter(Boolean);

export function trackLabel(track?: string | null) {
  return TRACKS.find((t) => t.id === track)?.label ?? "Student";
}

export function streamLabel(stream?: string | null) {
  return STREAMS.find((s) => s.id === stream)?.label ?? "";
}

/** Free students get three assisted explanations a day; paid plans are open. */
export const FREE_EXPLAIN_LIMIT = 3;
