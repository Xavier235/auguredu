import { UNIVERSITIES } from "@/lib/predictor";

/** Real Nigerian universities, reused from the admission predictor registry. */
export const SCHOOLS = UNIVERSITIES.map((u) => ({
  id: u.id,
  name: u.name,
  short: u.shortName,
  state: u.state,
  type: u.type,
})).sort((a, b) => a.name.localeCompare(b.name));

/**
 * Real campuses / study areas per school. Keyed by university id.
 * Anything not listed falls back to GENERIC_AREAS so every school still works.
 */
export const CAMPUS_AREAS: Record<string, string[]> = {
  unilag: ["Akoka main campus", "College of Medicine, Idi-Araba", "Distance Learning Institute", "Main Library", "Faculty of Science"],
  lasu: ["Ojo main campus", "Ikeja Law campus", "Epe campus", "LASUCOM Ikeja", "Main Library"],
  ui: ["UI main campus", "Faculty of Science", "Kenneth Dike Library", "UCH Ibadan", "Awo Hall area"],
  oau: ["Ile-Ife main campus", "OAUTHC Ilesa", "Hezekiah Oluwasanmi Library", "Sports Complex area", "Angola/Awo halls"],
  unn: ["Nsukka main campus", "Enugu campus", "Nnamdi Azikiwe Library", "Faculty of Engineering"],
  unilorin: ["Main campus, Ilorin", "Mini campus", "University Library", "Faculty of Science"],
  uniben: ["Ugbowo main campus", "Ekehuan campus", "John Harris Library", "Faculty of Engineering"],
  abu: ["Samaru main campus", "Kongo campus", "Kashim Ibrahim Library", "Faculty of Science"],
  futa: ["Obakekere main campus", "South gate campus", "University Library"],
  uniport: ["Choba main campus", "Abuja campus, Choba", "Delta Park", "Donald Ekong Library"],
  covenant: ["Ota main campus", "Centre for Learning Resources", "Cafeteria 1 area"],
  babcock: ["Ilishan-Remo campus", "Laz Otti Memorial Library"],
  futo: ["Owerri main campus", "SOSC area", "University Library"],
  uniabuja: ["Gwagwalada main campus", "Mini campus, Abuja"],
  buk: ["Old campus, Kano", "New campus, Gwarzo road"],
};

export const GENERIC_AREAS = [
  "Main campus",
  "Second campus",
  "University library",
  "Faculty building",
  "Hostel common room",
  "Off campus",
];

export function areasFor(schoolId?: string | null) {
  return (schoolId && CAMPUS_AREAS[schoolId]) || GENERIC_AREAS;
}

export function schoolByName(name?: string | null) {
  if (!name) return null;
  const n = name.trim().toLowerCase();
  return SCHOOLS.find((s) => s.name.toLowerCase() === n || s.short.toLowerCase() === n) ?? null;
}
