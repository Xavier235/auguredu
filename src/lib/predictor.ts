export type PredictorInput = {
  currentGPA: number; // 0-4
  studyHoursPerWeek: number; // 0-60
  attendance: number; // 0-100
  pastTestAvg: number; // 0-100
  sleepHours: number; // 0-12
  extracurriculars: number; // 0-10
  targetTier: "ivy" | "top50" | "state" | "regional";
  interests: string[];
};

export type PredictorResult = {
  predictedScore: number; // 0-100
  predictedGPA: number; // 0-4
  admitChance: number; // 0-100
  recommendedMajors: { name: string; fit: number }[];
  strengths: string[];
  improvements: { area: string; impact: string }[];
  studyPlan: string[];
};

const TIER_BASELINE: Record<PredictorInput["targetTier"], number> = {
  ivy: 8,
  top50: 22,
  state: 55,
  regional: 78,
};

const MAJOR_MAP: Record<string, string[]> = {
  math: ["Computer Science", "Data Science", "Actuarial Science", "Economics"],
  science: ["Biology", "Chemistry", "Biomedical Engineering", "Neuroscience"],
  tech: ["Computer Science", "Software Engineering", "AI & ML", "Cybersecurity"],
  arts: ["Graphic Design", "Film Studies", "Creative Writing", "Architecture"],
  writing: ["Journalism", "English Literature", "Communications", "Law"],
  business: ["Finance", "Marketing", "Entrepreneurship", "International Business"],
  social: ["Psychology", "Sociology", "Political Science", "Public Health"],
  engineering: ["Mechanical Eng.", "Electrical Eng.", "Civil Eng.", "Aerospace Eng."],
};

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));

export function predict(input: PredictorInput): PredictorResult {
  const gpaScore = (input.currentGPA / 4) * 100;
  const studyScore = clamp((input.studyHoursPerWeek / 25) * 100);
  const attendanceScore = input.attendance;
  const sleepScore = clamp(100 - Math.abs(input.sleepHours - 8) * 12);
  const ecScore = clamp((input.extracurriculars / 5) * 100);

  // Weighted predicted score
  const predictedScore = clamp(
    gpaScore * 0.3 +
      input.pastTestAvg * 0.25 +
      studyScore * 0.18 +
      attendanceScore * 0.15 +
      sleepScore * 0.07 +
      ecScore * 0.05,
  );

  const predictedGPA = Math.round((predictedScore / 100) * 4 * 100) / 100;

  // Admit chance: baseline by tier, modulated by score
  const baseline = TIER_BASELINE[input.targetTier];
  const scoreLift = (predictedScore - 70) * 1.4;
  const ecLift = (input.extracurriculars - 3) * 2.5;
  const admitChance = clamp(baseline + scoreLift + ecLift);

  // Recommended majors
  const pool: Record<string, number> = {};
  input.interests.forEach((i) => {
    (MAJOR_MAP[i] || []).forEach((m, idx) => {
      pool[m] = (pool[m] || 0) + (100 - idx * 8);
    });
  });
  const recommendedMajors = Object.entries(pool)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, raw]) => ({
      name,
      fit: clamp(Math.round(60 + (raw / 400) * 35 + (predictedScore - 70) * 0.2)),
    }));

  // Strengths & improvements
  const strengths: string[] = [];
  if (gpaScore >= 80) strengths.push("Strong academic baseline");
  if (input.pastTestAvg >= 80) strengths.push("Excellent test performance");
  if (attendanceScore >= 90) strengths.push("Consistent attendance");
  if (input.extracurriculars >= 4) strengths.push("Well-rounded profile");
  if (sleepScore >= 85) strengths.push("Healthy sleep schedule");
  if (strengths.length === 0) strengths.push("Room to grow across the board");

  const improvements: { area: string; impact: string }[] = [];
  if (studyScore < 60)
    improvements.push({ area: "Study hours", impact: "+8 pts potential" });
  if (attendanceScore < 85)
    improvements.push({ area: "Attendance", impact: "+5 pts potential" });
  if (sleepScore < 70)
    improvements.push({ area: "Sleep consistency", impact: "+4 pts potential" });
  if (input.pastTestAvg < 75)
    improvements.push({ area: "Test prep", impact: "+10 pts potential" });
  if (input.extracurriculars < 3)
    improvements.push({ area: "Extracurriculars", impact: "Boosts admit odds" });
  if (improvements.length === 0)
    improvements.push({ area: "Maintain momentum", impact: "You're on track" });

  // Study plan
  const studyPlan: string[] = [];
  studyPlan.push(`Aim for ${Math.max(15, Math.round(input.studyHoursPerWeek * 1.15))} focused study hours per week`);
  studyPlan.push("Use spaced repetition for hard subjects (Anki, 25-min Pomodoros)");
  if (input.pastTestAvg < 80) studyPlan.push("Schedule 2 full practice tests per month under timed conditions");
  if (attendanceScore < 90) studyPlan.push("Block calendar 10 min before each class — attendance compounds");
  if (input.extracurriculars < 3) studyPlan.push("Pick 1 deep extracurricular that ties to your target major");
  studyPlan.push("Review past mistakes weekly — they predict the next test's blind spots");

  return {
    predictedScore: Math.round(predictedScore * 10) / 10,
    predictedGPA,
    admitChance: Math.round(admitChance),
    recommendedMajors,
    strengths,
    improvements,
    studyPlan,
  };
}

export const INTEREST_OPTIONS: { id: string; label: string }[] = [
  { id: "math", label: "Math" },
  { id: "science", label: "Science" },
  { id: "tech", label: "Tech" },
  { id: "engineering", label: "Engineering" },
  { id: "business", label: "Business" },
  { id: "arts", label: "Arts" },
  { id: "writing", label: "Writing" },
  { id: "social", label: "Social Studies" },
];
