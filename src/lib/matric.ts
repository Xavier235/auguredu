// Lightweight matric-number validator for common Nigerian university formats.
// Accepts patterns like: UNILAG 210401234, UI 226543, RUN/CMP/21/1001,
// LASU 210591234, OAU CSC/2019/104, ABU U19CS1001, COVENANT 21CG022345.
// We validate SHAPE only (not the specific school registry).

export type MatricInfo = {
  valid: boolean;
  format?: string;   // human label of the matched pattern
  school?: string;   // best-guess school if the prefix reveals it
};

const PATTERNS: Array<{ re: RegExp; format: string; school?: string }> = [
  { re: /^[A-Z]{2,4}\/[A-Z]{2,4}\/\d{2}\/\d{3,5}$/i, format: "SCHOOL/DEPT/YY/NNNN", school: "Redeemer's / Babcock / Bowen style" },
  { re: /^[A-Z]{2,4}\/\d{4}\/\d{2,4}$/i, format: "DEPT/YEAR/NNN", school: "OAU / UNN style" },
  { re: /^U\d{2}[A-Z]{2}\d{4}$/i, format: "UYYDDNNNN", school: "ABU / Bayero style" },
  { re: /^\d{2}[A-Z]{2}\d{5,6}$/i, format: "YYDDNNNNN", school: "Covenant / Landmark style" },
  { re: /^\d{9,10}$/, format: "9–10 digit matric", school: "UNILAG / LASU / UI style" },
  { re: /^[A-Z]{3}\/\d{2}\/\d{4}$/i, format: "DEPT/YY/NNNN", school: "UNIBEN / Delsu style" },
];

export function validateMatric(raw: string): MatricInfo {
  const s = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (!s) return { valid: false };
  for (const p of PATTERNS) {
    if (p.re.test(s)) return { valid: true, format: p.format, school: p.school };
  }
  return { valid: false };
}

export const MATRIC_EXAMPLES = [
  "210401234 (UNILAG)",
  "RUN/CMP/21/1001 (Redeemer's)",
  "CSC/2019/104 (OAU)",
  "U19CS1001 (ABU)",
  "21CG022345 (Covenant)",
];
