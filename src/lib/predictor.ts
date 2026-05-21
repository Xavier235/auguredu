// Nigerian universities — JAMB course predictor

export type OLevelGrade = "A1" | "B2" | "B3" | "C4" | "C5" | "C6" | "D7" | "E8" | "F9";

export type PredictorInput = {
  universityId: string;
  jambScore: number; // 0-400
  postUtmeScore: number; // 0-100
  oLevelGrades: OLevelGrade[]; // 5 core subjects (English, Maths, + 3 relevant)
  subjectCombo: string; // "science" | "arts" | "commercial"
  isIndigene: boolean; // indigene of the university's host state
  interests: string[];
};

export type CoursePrediction = {
  course: string;
  faculty: string;
  cutoff: number;
  oLevelRequired: string;
  admissionChance: number;
  fit: number;
  verdict: "Very High" | "High" | "Moderate" | "Low" | "Very Low";
};

export type ScoreBreakdownItem = {
  label: string;
  value: number;
  weight: number;
  detail: string;
};

export type PredictorResult = {
  universityId: string;
  universityName: string;
  aggregateScore: number;
  jambPercent: number;
  oLevelPoints: number;
  topCourses: CoursePrediction[];
  alternativeCourses: CoursePrediction[];
  breakdown: ScoreBreakdownItem[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
};

// ─── Universities ────────────────────────────────────────────────
export type University = {
  id: string;
  name: string;
  shortName: string;
  type: "Federal" | "State" | "Private";
  state: string;
  // Screening: weights for [JAMB, Post-UTME, O'Level] (must sum to 100)
  formula: { jamb: number; postUtme: number; oLevel: number };
  // Competitiveness adjustment added to every base cutoff (e.g. UI/UNILAG +15, FUNAAB -5)
  competitivenessMod: number;
  // Bonus JAMB marks given to host-state indigenes (state unis usually have one)
  indigeneBonus: number;
  // General minimum JAMB cutoff this uni accepts
  generalCutoff: number;
  notes?: string;
};

export const UNIVERSITIES: University[] = [
  {
    id: "lasu",
    name: "Lagos State University",
    shortName: "LASU",
    type: "State",
    state: "Lagos",
    formula: { jamb: 50, postUtme: 30, oLevel: 20 },
    competitivenessMod: 0,
    indigeneBonus: 8,
    generalCutoff: 180,
  },
  {
    id: "unilag",
    name: "University of Lagos",
    shortName: "UNILAG",
    type: "Federal",
    state: "Lagos",
    formula: { jamb: 50, postUtme: 30, oLevel: 20 },
    competitivenessMod: 15,
    indigeneBonus: 0,
    generalCutoff: 200,
  },
  {
    id: "ui",
    name: "University of Ibadan",
    shortName: "UI",
    type: "Federal",
    state: "Oyo",
    formula: { jamb: 60, postUtme: 40, oLevel: 0 },
    competitivenessMod: 20,
    indigeneBonus: 0,
    generalCutoff: 200,
    notes: "UI screening: 60% JAMB + 40% Post-UTME (O'Level used only for eligibility).",
  },
  {
    id: "oau",
    name: "Obafemi Awolowo University",
    shortName: "OAU",
    type: "Federal",
    state: "Osun",
    formula: { jamb: 50, postUtme: 30, oLevel: 20 },
    competitivenessMod: 10,
    indigeneBonus: 0,
    generalCutoff: 200,
  },
  {
    id: "unn",
    name: "University of Nigeria, Nsukka",
    shortName: "UNN",
    type: "Federal",
    state: "Enugu",
    formula: { jamb: 50, postUtme: 30, oLevel: 20 },
    competitivenessMod: 8,
    indigeneBonus: 0,
    generalCutoff: 200,
  },
  {
    id: "unilorin",
    name: "University of Ilorin",
    shortName: "UNILORIN",
    type: "Federal",
    state: "Kwara",
    formula: { jamb: 50, postUtme: 30, oLevel: 20 },
    competitivenessMod: 5,
    indigeneBonus: 0,
    generalCutoff: 180,
  },
  {
    id: "uniben",
    name: "University of Benin",
    shortName: "UNIBEN",
    type: "Federal",
    state: "Edo",
    formula: { jamb: 50, postUtme: 30, oLevel: 20 },
    competitivenessMod: 8,
    indigeneBonus: 0,
    generalCutoff: 200,
  },
  {
    id: "uniabuja",
    name: "University of Abuja",
    shortName: "UNIABUJA",
    type: "Federal",
    state: "FCT",
    formula: { jamb: 50, postUtme: 30, oLevel: 20 },
    competitivenessMod: -5,
    indigeneBonus: 5,
    generalCutoff: 180,
  },
  {
    id: "abu",
    name: "Ahmadu Bello University",
    shortName: "ABU",
    type: "Federal",
    state: "Kaduna",
    formula: { jamb: 50, postUtme: 30, oLevel: 20 },
    competitivenessMod: 5,
    indigeneBonus: 0,
    generalCutoff: 180,
  },
  {
    id: "futa",
    name: "Federal University of Technology, Akure",
    shortName: "FUTA",
    type: "Federal",
    state: "Ondo",
    formula: { jamb: 50, postUtme: 30, oLevel: 20 },
    competitivenessMod: 0,
    indigeneBonus: 0,
    generalCutoff: 180,
    notes: "Tech-focused: best fit for Engineering, Sciences and Tech.",
  },
  {
    id: "funaab",
    name: "Federal University of Agriculture, Abeokuta",
    shortName: "FUNAAB",
    type: "Federal",
    state: "Ogun",
    formula: { jamb: 50, postUtme: 30, oLevel: 20 },
    competitivenessMod: -5,
    indigeneBonus: 0,
    generalCutoff: 180,
  },
  {
    id: "oou",
    name: "Olabisi Onabanjo University",
    shortName: "OOU",
    type: "State",
    state: "Ogun",
    formula: { jamb: 50, postUtme: 30, oLevel: 20 },
    competitivenessMod: -5,
    indigeneBonus: 8,
    generalCutoff: 180,
  },
  {
    id: "ekiti",
    name: "Ekiti State University",
    shortName: "EKSU",
    type: "State",
    state: "Ekiti",
    formula: { jamb: 50, postUtme: 30, oLevel: 20 },
    competitivenessMod: -10,
    indigeneBonus: 8,
    generalCutoff: 160,
  },
  {
    id: "covenant",
    name: "Covenant University",
    shortName: "Covenant",
    type: "Private",
    state: "Ogun",
    formula: { jamb: 50, postUtme: 30, oLevel: 20 },
    competitivenessMod: 5,
    indigeneBonus: 0,
    generalCutoff: 180,
    notes: "Private — no indigene bias; weight on Post-UTME and character screening.",
  },
  {
    id: "babcock",
    name: "Babcock University",
    shortName: "Babcock",
    type: "Private",
    state: "Ogun",
    formula: { jamb: 60, postUtme: 20, oLevel: 20 },
    competitivenessMod: -5,
    indigeneBonus: 0,
    generalCutoff: 160,
  },
];

export const getUniversity = (id: string): University =>
  UNIVERSITIES.find((u) => u.id === id) ?? UNIVERSITIES[0];

// ─── Base course catalogue (cutoffs are the LASU baseline; each uni shifts) ─
type BaseCourse = {
  name: string;
  faculty: string;
  cutoff: number;
  combo: ("science" | "arts" | "commercial")[];
  oLevel: string;
  interests: string[];
};

export const BASE_COURSES: BaseCourse[] = [
  // Medicine & Health Sciences
  { name: "Medicine & Surgery (MBBS)", faculty: "College of Medicine", cutoff: 280, combo: ["science"], oLevel: "Bio, Chem, Phy", interests: ["medicine", "science"] },
  { name: "Nursing Science", faculty: "College of Medicine", cutoff: 250, combo: ["science"], oLevel: "Bio, Chem, Phy", interests: ["medicine", "science"] },
  { name: "Physiology", faculty: "College of Medicine", cutoff: 220, combo: ["science"], oLevel: "Bio, Chem, Phy", interests: ["medicine", "science"] },
  { name: "Anatomy", faculty: "College of Medicine", cutoff: 220, combo: ["science"], oLevel: "Bio, Chem, Phy", interests: ["medicine", "science"] },
  { name: "Public Health", faculty: "College of Medicine", cutoff: 210, combo: ["science"], oLevel: "Bio, Chem, Phy", interests: ["medicine", "social"] },
  { name: "Medical Laboratory Science", faculty: "College of Medicine", cutoff: 240, combo: ["science"], oLevel: "Bio, Chem, Phy", interests: ["medicine", "science"] },
  { name: "Pharmacy", faculty: "College of Medicine", cutoff: 250, combo: ["science"], oLevel: "Bio, Chem, Phy", interests: ["medicine", "science"] },
  { name: "Dentistry", faculty: "College of Medicine", cutoff: 260, combo: ["science"], oLevel: "Bio, Chem, Phy", interests: ["medicine", "science"] },
  // Law
  { name: "Law (LLB)", faculty: "Faculty of Law", cutoff: 250, combo: ["arts", "commercial"], oLevel: "Lit-in-Eng, Govt, any", interests: ["law", "social", "writing"] },
  // Engineering
  { name: "Computer Engineering", faculty: "Faculty of Engineering", cutoff: 230, combo: ["science"], oLevel: "Phy, Chem, Further Maths", interests: ["tech", "engineering"] },
  { name: "Electrical & Electronics Eng.", faculty: "Faculty of Engineering", cutoff: 220, combo: ["science"], oLevel: "Phy, Chem, Further Maths", interests: ["engineering", "tech"] },
  { name: "Mechanical Engineering", faculty: "Faculty of Engineering", cutoff: 220, combo: ["science"], oLevel: "Phy, Chem, Further Maths", interests: ["engineering"] },
  { name: "Civil Engineering", faculty: "Faculty of Engineering", cutoff: 220, combo: ["science"], oLevel: "Phy, Chem, Further Maths", interests: ["engineering"] },
  { name: "Chemical & Polymer Eng.", faculty: "Faculty of Engineering", cutoff: 210, combo: ["science"], oLevel: "Phy, Chem, Further Maths", interests: ["engineering", "science"] },
  // Science
  { name: "Computer Science", faculty: "Faculty of Science", cutoff: 220, combo: ["science"], oLevel: "Phy, Chem, Bio/Geo", interests: ["tech", "math"] },
  { name: "Microbiology", faculty: "Faculty of Science", cutoff: 200, combo: ["science"], oLevel: "Bio, Chem, Phy", interests: ["science", "medicine"] },
  { name: "Biochemistry", faculty: "Faculty of Science", cutoff: 200, combo: ["science"], oLevel: "Bio, Chem, Phy", interests: ["science", "medicine"] },
  { name: "Industrial Chemistry", faculty: "Faculty of Science", cutoff: 190, combo: ["science"], oLevel: "Chem, Phy, Bio/Maths", interests: ["science"] },
  { name: "Mathematics", faculty: "Faculty of Science", cutoff: 190, combo: ["science"], oLevel: "Phy, Chem, Further Maths", interests: ["math"] },
  { name: "Physics", faculty: "Faculty of Science", cutoff: 190, combo: ["science"], oLevel: "Phy, Chem, Further Maths", interests: ["science", "math"] },
  { name: "Botany", faculty: "Faculty of Science", cutoff: 180, combo: ["science"], oLevel: "Bio, Chem, Phy", interests: ["science"] },
  { name: "Zoology & Environmental Bio.", faculty: "Faculty of Science", cutoff: 180, combo: ["science"], oLevel: "Bio, Chem, Phy", interests: ["science"] },
  // Management
  { name: "Accounting", faculty: "Faculty of Management Sci.", cutoff: 220, combo: ["commercial", "arts"], oLevel: "Economics, Maths, Comm", interests: ["business", "math"] },
  { name: "Banking & Finance", faculty: "Faculty of Management Sci.", cutoff: 210, combo: ["commercial", "arts"], oLevel: "Economics, Maths, Comm", interests: ["business", "math"] },
  { name: "Business Administration", faculty: "Faculty of Management Sci.", cutoff: 210, combo: ["commercial", "arts"], oLevel: "Economics, Maths, Comm", interests: ["business"] },
  { name: "Insurance", faculty: "Faculty of Management Sci.", cutoff: 190, combo: ["commercial", "arts"], oLevel: "Economics, Maths, Comm", interests: ["business"] },
  { name: "Industrial Relations & Personnel Mgmt", faculty: "Faculty of Management Sci.", cutoff: 190, combo: ["commercial", "arts"], oLevel: "Economics, Maths, Govt", interests: ["business", "social"] },
  // Social Sciences
  { name: "Economics", faculty: "Faculty of Social Sciences", cutoff: 220, combo: ["arts", "commercial", "science"], oLevel: "Economics, Maths, any", interests: ["business", "math", "social"] },
  { name: "Mass Communication", faculty: "Faculty of Social Sciences", cutoff: 230, combo: ["arts", "commercial"], oLevel: "Lit-in-Eng, Govt, any", interests: ["writing", "arts", "social"] },
  { name: "Political Science", faculty: "Faculty of Social Sciences", cutoff: 200, combo: ["arts", "commercial"], oLevel: "Govt, Econs, Lit", interests: ["social", "law"] },
  { name: "Sociology", faculty: "Faculty of Social Sciences", cutoff: 190, combo: ["arts", "commercial"], oLevel: "Govt, Econs, Lit", interests: ["social"] },
  { name: "Psychology", faculty: "Faculty of Social Sciences", cutoff: 200, combo: ["arts", "science"], oLevel: "Bio/Govt, Lit, any", interests: ["social", "medicine"] },
  { name: "Geography & Planning", faculty: "Faculty of Social Sciences", cutoff: 180, combo: ["arts", "science"], oLevel: "Geography, Econs, any", interests: ["social", "science"] },
  // Arts
  { name: "English Language", faculty: "Faculty of Arts", cutoff: 200, combo: ["arts"], oLevel: "Lit-in-Eng, Govt, any", interests: ["writing", "arts"] },
  { name: "History & International Studies", faculty: "Faculty of Arts", cutoff: 180, combo: ["arts"], oLevel: "Govt, Lit, any", interests: ["writing", "social"] },
  { name: "Philosophy", faculty: "Faculty of Arts", cutoff: 180, combo: ["arts"], oLevel: "Govt, Lit, any", interests: ["writing", "social"] },
  { name: "Religious Studies", faculty: "Faculty of Arts", cutoff: 180, combo: ["arts"], oLevel: "CRS/IRS, Lit, any", interests: ["writing", "social"] },
  // Education
  { name: "Education & Economics", faculty: "Faculty of Education", cutoff: 180, combo: ["arts", "commercial"], oLevel: "Economics, Maths, any", interests: ["social", "business"] },
  { name: "Education & English", faculty: "Faculty of Education", cutoff: 180, combo: ["arts"], oLevel: "Lit-in-Eng, Govt, any", interests: ["writing", "social"] },
  { name: "Education & Maths", faculty: "Faculty of Education", cutoff: 180, combo: ["science"], oLevel: "Maths, Phy, Chem", interests: ["math", "social"] },
  // Agriculture (relevant for FUNAAB etc.)
  { name: "Agriculture", faculty: "Faculty of Agriculture", cutoff: 180, combo: ["science"], oLevel: "Bio/Agric, Chem, Phy", interests: ["science"] },
  { name: "Agricultural Engineering", faculty: "Faculty of Engineering", cutoff: 200, combo: ["science"], oLevel: "Phy, Chem, Maths", interests: ["engineering", "science"] },
];

export const INTEREST_OPTIONS = [
  { id: "medicine", label: "Medicine & Health" },
  { id: "engineering", label: "Engineering" },
  { id: "tech", label: "Tech & Computing" },
  { id: "science", label: "Pure Sciences" },
  { id: "math", label: "Mathematics" },
  { id: "law", label: "Law" },
  { id: "business", label: "Business & Finance" },
  { id: "social", label: "Social Sciences" },
  { id: "arts", label: "Arts & Humanities" },
  { id: "writing", label: "Media & Writing" },
];

export const GRADE_POINTS: Record<OLevelGrade, number> = {
  A1: 6, B2: 5, B3: 4, C4: 3, C5: 2, C6: 1, D7: 0, E8: 0, F9: 0,
};

export const GRADE_OPTIONS: OLevelGrade[] = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"];

export const SUBJECT_COMBOS = [
  { id: "science", label: "Science" },
  { id: "arts", label: "Arts" },
  { id: "commercial", label: "Commercial" },
] as const;

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));

const verdictFor = (chance: number): CoursePrediction["verdict"] => {
  if (chance >= 85) return "Very High";
  if (chance >= 65) return "High";
  if (chance >= 45) return "Moderate";
  if (chance >= 25) return "Low";
  return "Very Low";
};

export function predict(input: PredictorInput): PredictorResult {
  const uni = getUniversity(input.universityId);
  const jambPercent = (input.jambScore / 400) * 100;
  const oLevelPoints = input.oLevelGrades.reduce((s, g) => s + GRADE_POINTS[g], 0);
  const oLevelPercent = (oLevelPoints / 30) * 100;

  const aggregateScore = clamp(
    jambPercent * (uni.formula.jamb / 100) +
      input.postUtmeScore * (uni.formula.postUtme / 100) +
      oLevelPercent * (uni.formula.oLevel / 100),
  );

  const indigeneBonus = input.isIndigene ? uni.indigeneBonus : 0;

  const breakdown: ScoreBreakdownItem[] = [
    {
      label: "JAMB UTME",
      value: Math.round(jambPercent * (uni.formula.jamb / 100) * 10) / 10,
      weight: uni.formula.jamb,
      detail: `${input.jambScore}/400 → ${jambPercent.toFixed(1)}% × ${uni.formula.jamb}% weight`,
    },
    {
      label: "Post-UTME / Screening",
      value: Math.round(input.postUtmeScore * (uni.formula.postUtme / 100) * 10) / 10,
      weight: uni.formula.postUtme,
      detail: `${input.postUtmeScore}/100 × ${uni.formula.postUtme}% weight`,
    },
    {
      label: "O'Level (WAEC/NECO)",
      value: Math.round(oLevelPercent * (uni.formula.oLevel / 100) * 10) / 10,
      weight: uni.formula.oLevel,
      detail:
        uni.formula.oLevel > 0
          ? `${oLevelPoints}/30 grade points × ${uni.formula.oLevel}% weight`
          : `Not in aggregate at ${uni.shortName} — used for eligibility only`,
    },
    {
      label: `${uni.state} indigene bonus`,
      value: indigeneBonus,
      weight: uni.indigeneBonus,
      detail: input.isIndigene
        ? uni.indigeneBonus > 0
          ? `Indigene cutoffs at ${uni.shortName} are typically ~${uni.indigeneBonus} marks lower`
          : `${uni.shortName} (${uni.type}) does not apply an indigene bonus`
        : "Non-indigene — standard cutoffs apply",
    },
  ];

  const scored = BASE_COURSES.map((c) => {
    const comboOK = c.combo.includes(input.subjectCombo as "science" | "arts" | "commercial");
    const adjustedCutoff = Math.max(140, c.cutoff + uni.competitivenessMod);
    const effectiveJamb = input.jambScore + indigeneBonus;
    const marginAboveCutoff = effectiveJamb - adjustedCutoff;

    let chance = 50 + marginAboveCutoff * 1.6;
    chance += (input.postUtmeScore - 60) * 0.5;
    chance += (oLevelPoints - 18) * 1.2;
    if (!comboOK) chance -= 60;
    if (effectiveJamb < uni.generalCutoff) chance -= 15;
    chance = clamp(chance);

    const overlap = c.interests.filter((i) => input.interests.includes(i)).length;
    const fit = clamp(40 + overlap * 25 + (overlap > 0 ? 10 : 0));

    return {
      course: c.name,
      faculty: c.faculty,
      cutoff: adjustedCutoff,
      oLevelRequired: `English + Maths + ${c.oLevel}`,
      admissionChance: Math.round(chance),
      fit: Math.round(fit),
      verdict: verdictFor(chance),
      _comboOK: comboOK,
      _combined: chance * 0.65 + fit * 0.35,
    };
  });

  const eligible = scored.filter((s) => s._comboOK).sort((a, b) => b._combined - a._combined);
  const topCourses = eligible.slice(0, 5).map(({ _comboOK, _combined, ...rest }) => rest);
  const alternativeCourses = eligible
    .slice(5, 10)
    .filter((c) => c.admissionChance >= 25)
    .map(({ _comboOK, _combined, ...rest }) => rest);

  const strengths: string[] = [];
  if (input.jambScore >= 250) strengths.push(`Strong JAMB score (${input.jambScore}) — opens most courses`);
  else if (input.jambScore >= 200) strengths.push(`Above-average JAMB score (${input.jambScore})`);
  if (oLevelPoints >= 24) strengths.push("Excellent O'Level grades (mostly A1/B2)");
  else if (oLevelPoints >= 18) strengths.push("Good O'Level grades — meets most requirements");
  if (input.postUtmeScore >= 75) strengths.push("Strong Post-UTME / screening score");
  if (input.isIndigene && uni.indigeneBonus > 0)
    strengths.push(`${uni.state} State indigene — benefits from lower cutoffs at ${uni.shortName}`);
  if (input.interests.length >= 2) strengths.push("Clear interest profile aids course matching");
  if (!strengths.length) strengths.push("Profile complete — room to strengthen each pillar");

  const weaknesses: string[] = [];
  if (input.jambScore < uni.generalCutoff)
    weaknesses.push(
      `JAMB score (${input.jambScore}) below ${uni.shortName}'s general ${uni.generalCutoff} cutoff — consider a rewrite or another school`,
    );
  else if (input.jambScore < uni.generalCutoff + 20)
    weaknesses.push(`JAMB score limits you to lower-demand courses at ${uni.shortName}`);
  if (oLevelPoints < 15) weaknesses.push("O'Level grades are weak — sit a NECO/GCE rewrite for credits");
  if (input.postUtmeScore < 50) weaknesses.push("Post-UTME score is low — practise past questions");
  if (input.oLevelGrades.filter((g) => GRADE_POINTS[g] === 0).length > 0)
    weaknesses.push("One or more O'Level subjects failed (D7/E8/F9) — must be rewritten");
  if (!weaknesses.length) weaknesses.push("No major weaknesses — focus on Post-UTME prep");

  const recommendations: string[] = [];
  if (topCourses[0]) {
    recommendations.push(
      `Apply for ${topCourses[0].course} at ${uni.shortName} as first choice (${topCourses[0].admissionChance}% chance).`,
    );
  }
  if (topCourses[1]) {
    recommendations.push(
      `Use ${topCourses[1].course} as a strong second choice / change-of-course backup.`,
    );
  }
  if (input.jambScore < uni.generalCutoff + 20) {
    recommendations.push(
      `Target Education or Arts faculties at ${uni.shortName} — cutoffs are near ${Math.max(160, uni.generalCutoff)}.`,
    );
  }
  if (input.postUtmeScore < 70) {
    recommendations.push(`Do at least 10 ${uni.shortName} Post-UTME past-question sets before screening.`);
  }
  if (!input.isIndigene && uni.indigeneBonus > 0) {
    recommendations.push(
      `As a non-indigene at ${uni.shortName}, aim 15-20 marks above the published cutoff for safety.`,
    );
  }
  if (uni.notes) recommendations.push(uni.notes);
  recommendations.push(`Verify the latest ${uni.shortName} brochure — cutoffs shift yearly by 5-15 marks.`);

  return {
    universityId: uni.id,
    universityName: uni.name,
    aggregateScore: Math.round(aggregateScore * 10) / 10,
    jambPercent: Math.round(jambPercent * 10) / 10,
    oLevelPoints,
    topCourses,
    alternativeCourses,
    breakdown,
    strengths,
    weaknesses,
    recommendations,
  };
}
