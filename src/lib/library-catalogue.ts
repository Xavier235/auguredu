// Full NUC-wide library index.
//
// Every course in the NUC course catalogue becomes a readable library entry.
// Entries that have hand written material in src/lib/library.ts are marked as
// "curated"; the rest are opened as a live reading generated for that exact
// course code by Augur.

import { COURSES, DEPARTMENTS, type AcademicLevel } from "./course-catalogue";
import { LIBRARY } from "./library";

export type LibraryEntry = {
  id: string; // route param
  code: string;
  title: string;
  units: number;
  departmentId: string;
  department: string;
  faculty: string;
  level: AcademicLevel;
  curated: boolean;
  curatedId: string | null;
  minutes: number;
  xp: number;
};

const DEPT_BY_ID = new Map(DEPARTMENTS.map((d) => [d.id, d]));

const norm = (c: string) => c.replace(/\s+/g, "").toUpperCase();

const CURATED_BY_CODE = new Map(LIBRARY.map((i) => [norm(i.courseCode), i]));

export function courseSlug(code: string, departmentId: string) {
  return `${departmentId}-${code.toLowerCase().replace(/\s+/g, "")}`;
}

export const LIBRARY_INDEX: LibraryEntry[] = COURSES.map((c) => {
  const isGst = c.department === "*";
  const dept = isGst ? null : DEPT_BY_ID.get(c.department);
  const curated = CURATED_BY_CODE.get(norm(c.code)) ?? null;
  const departmentId = isGst ? "gst" : c.department;
  return {
    id: courseSlug(c.code, departmentId),
    code: c.code,
    title: c.title,
    units: c.units,
    departmentId,
    department: isGst ? "General Studies" : (dept?.name ?? c.department),
    faculty: isGst ? "General Studies" : (dept?.faculty ?? "General"),
    level: c.level,
    curated: !!curated,
    curatedId: curated?.id ?? null,
    minutes: curated?.minutes ?? Math.max(6, Math.min(14, c.units * 4)),
    xp: curated?.xp ?? 15 + c.units * 5,
  };
});

export const LIBRARY_FACULTIES = Array.from(new Set(LIBRARY_INDEX.map((e) => e.faculty))).sort();

export const LIBRARY_DEPT_OPTIONS = [
  { id: "gst", name: "General Studies", faculty: "General Studies" },
  ...DEPARTMENTS,
].filter((d) => LIBRARY_INDEX.some((e) => e.departmentId === d.id));

export function getLibraryEntry(id: string): LibraryEntry | null {
  return LIBRARY_INDEX.find((e) => e.id === id) ?? null;
}

/** Accepts either a catalogue slug or a legacy curated item id. */
export function resolveEntry(id: string): LibraryEntry | null {
  const direct = getLibraryEntry(id);
  if (direct) return direct;
  return LIBRARY_INDEX.find((e) => e.curatedId === id) ?? null;
}

export function levelsAvailable(departmentId: string) {
  return Array.from(
    new Set(
      LIBRARY_INDEX.filter((e) => departmentId === "all" || e.departmentId === departmentId).map((e) => e.level),
    ),
  ).sort();
}
