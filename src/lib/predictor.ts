// LASU (Lagos State University) JAMB-based course predictor

export type OLevelGrade = "A1" | "B2" | "B3" | "C4" | "C5" | "C6" | "D7" | "E8" | "F9";

export type PredictorInput = {
  jambScore: number; // 0-400
  postUtmeScore: number; // 0-100 (LASU does post-UTME / screening; default 70)
  oLevelGrades: OLevelGrade[]; // 5 core subjects (English, Maths, + 3 relevant)
  subjectCombo: string; // e.g. "science", "arts", "commercial"
  state: "lagos" | "other"; // Lagos indigene gets a slight cutoff advantage
  interests: string[];
};

export type CoursePrediction = {
  course: string;
  faculty: string;
  cutoff: number; // LASU departmental cutoff (JAMB)
  oLevelRequired: string;
  admissionChance: number; // 0-100
  fit: number; // 0-100 interest alignment
  verdict: "Very High" | "High" | "Moderate" | "Low" | "Very Low";
};

export type ScoreBreakdownItem = {
  label: string;
  value: number; // raw contribution out of weight
  weight: number; // weight in %
  detail: string;
};

export type PredictorResult = {
  aggregateScore: number; // 0-100 LASU-style screening aggregate
  jambPercent: number; // jamb / 400 * 100
  oLevelPoints: number; // 0-30 (six grade points * 5 subjects)
  topCourses: CoursePrediction[];
  alternativeCourses: CoursePrediction[];
  breakdown: ScoreBreakdownItem[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
};

// LASU course catalogue with realistic JAMB departmental cutoffs (recent years)
type LasuCourse = {
  name: string;
  faculty: string;
  cutoff: number;
  combo: ("science" | "arts" | "commercial")[];
  oLevel: string; // required O'Level subjects beyond Eng + Maths
  interests: string[];
};

export const LASU_COURSES: LasuCourse[] = [
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
  { name: "Fisheries", faculty: "Faculty of Science", cutoff: 180, combo: ["science"], oLevel: "Bio, Chem, Phy", interests: ["science"] },
  // Management Sciences
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
  const jambPercent = (input.jambScore / 400) * 100;
  const oLevelPoints = input.oLevelGrades.reduce((s, g) => s + GRADE_POINTS[g], 0); // max 30
  const oLevelPercent = (oLevelPoints / 30) * 100;

  // LASU-style aggregate (similar to UNILAG-style): 50% JAMB + 30% Post-UTME + 20% O'Level
  const aggregateScore = clamp(
    jambPercent * 0.5 + input.postUtmeScore * 0.3 + oLevelPercent * 0.2,
  );

  const indigeneBonus = input.state === "lagos" ? 8 : 0; // LASU favours Lagos indigenes

  const breakdown: ScoreBreakdownItem[] = [
    {
      label: "JAMB UTME",
      value: Math.round(jambPercent * 0.5 * 10) / 10,
      weight: 50,
      detail: `${input.jambScore}/400 → ${jambPercent.toFixed(1)}% × 50% weight`,
    },
    {
      label: "Post-UTME / Screening",
      value: Math.round(input.postUtmeScore * 0.3 * 10) / 10,
      weight: 30,
      detail: `${input.postUtmeScore}/100 × 30% weight`,
    },
    {
      label: "O'Level (WAEC/NECO)",
      value: Math.round(oLevelPercent * 0.2 * 10) / 10,
      weight: 20,
      detail: `${oLevelPoints}/30 grade points × 20% weight`,
    },
    {
      label: "Lagos State indigene bonus",
      value: indigeneBonus,
      weight: 8,
      detail: input.state === "lagos"
        ? "Indigene cutoffs are typically ~8 marks lower than non-indigene"
        : "Non-indigene — standard cutoffs apply",
    },
  ];

  // Score each course
  const scored = LASU_COURSES.map((c) => {
    // Combination match: hard requirement
    const comboOK = c.combo.includes(input.subjectCombo as "science" | "arts" | "commercial");
    const effectiveJamb = input.jambScore + indigeneBonus;
    const marginAboveCutoff = effectiveJamb - c.cutoff;

    // Admission chance: logistic-ish around cutoff, plus post-UTME, plus O'Level
    let chance = 50 + marginAboveCutoff * 1.6;
    chance += (input.postUtmeScore - 60) * 0.5;
    chance += (oLevelPoints - 18) * 1.2;
    if (!comboOK) chance -= 60;
    chance = clamp(chance);

    // Interest fit
    const overlap = c.interests.filter((i) => input.interests.includes(i)).length;
    const fit = clamp(40 + overlap * 25 + (overlap > 0 ? 10 : 0));

    return {
      course: c.name,
      faculty: c.faculty,
      cutoff: c.cutoff,
      oLevelRequired: `English + Maths + ${c.oLevel}`,
      admissionChance: Math.round(chance),
      fit: Math.round(fit),
      verdict: verdictFor(chance),
      _comboOK: comboOK,
      _combined: chance * 0.65 + fit * 0.35,
    };
  });

  // Sort: combo-eligible first, then by combined score
  const eligible = scored.filter((s) => s._comboOK).sort((a, b) => b._combined - a._combined);
  const topCourses = eligible.slice(0, 5).map(({ _comboOK, _combined, ...rest }) => rest);
  const alternativeCourses = eligible
    .slice(5, 10)
    .filter((c) => c.admissionChance >= 25)
    .map(({ _comboOK, _combined, ...rest }) => rest);

  // Strengths
  const strengths: string[] = [];
  if (input.jambScore >= 250) strengths.push(`Strong JAMB score (${input.jambScore}) — opens most courses`);
  else if (input.jambScore >= 200) strengths.push(`Above-average JAMB score (${input.jambScore})`);
  if (oLevelPoints >= 24) strengths.push("Excellent O'Level grades (mostly A1/B2)");
  else if (oLevelPoints >= 18) strengths.push("Good O'Level grades — meets most requirements");
  if (input.postUtmeScore >= 75) strengths.push("Strong Post-UTME / screening score");
  if (input.state === "lagos") strengths.push("Lagos State indigene — benefits from lower cutoffs");
  if (input.interests.length >= 2) strengths.push("Clear interest profile aids course matching");
  if (!strengths.length) strengths.push("Profile complete — room to strengthen each pillar");

  // Weaknesses
  const weaknesses: string[] = [];
  if (input.jambScore < 180)
    weaknesses.push(`JAMB score (${input.jambScore}) below LASU's 180 general cutoff — consider a rewrite`);
  else if (input.jambScore < 200)
    weaknesses.push("JAMB score limits you to lower-demand courses");
  if (oLevelPoints < 15) weaknesses.push("O'Level grades are weak — sit a NECO/GCE rewrite for credits");
  if (input.postUtmeScore < 50) weaknesses.push("Post-UTME score is low — practise past questions");
  if (input.oLevelGrades.filter((g) => GRADE_POINTS[g] === 0).length > 0)
    weaknesses.push("One or more O'Level subjects failed (D7/E8/F9) — must be rewritten");
  if (!weaknesses.length) weaknesses.push("No major weaknesses — focus on Post-UTME prep");

  // Recommendations
  const recommendations: string[] = [];
  if (topCourses[0]) {
    recommendations.push(
      `Apply for ${topCourses[0].course} as first choice (${topCourses[0].admissionChance}% chance).`,
    );
  }
  if (topCourses[1]) {
    recommendations.push(
      `Use ${topCourses[1].course} as a strong second choice / change-of-course backup.`,
    );
  }
  if (input.jambScore < 200) {
    recommendations.push("Target Faculty of Education or Arts courses — cutoffs are around 180.");
  }
  if (input.postUtmeScore < 70) {
    recommendations.push("Do at least 10 LASU Post-UTME past-question sets before screening.");
  }
  if (input.state !== "lagos") {
    recommendations.push("As a non-indigene, aim 15-20 marks above the published cutoff for safety.");
  }
  recommendations.push("Verify the latest LASU brochure — cutoffs shift yearly by 5-15 marks.");

  return {
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
