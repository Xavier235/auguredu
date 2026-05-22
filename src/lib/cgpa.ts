// CGPA forecaster + study workflow (Nigerian 5.0 scale).
//
// Per-course scoring (standard Nigerian convention):
//   Total = Continuous Assessment (max 30) + Exam (max 70)  →  0..100
//   Letter grade is derived from the 100-point total via GRADE_BANDS.
//
// Field reference (matches the example schema):
//   Student_ID   alphanumeric    e.g. "RUN/CMP/21/1001"
//   Gender       "M" | "F"
//   CA_Score     0..30
//   Exam_Score   0..70

export type LetterGrade = "A" | "B" | "C" | "D" | "E" | "F";

export type CourseLoad = {
  code: string;
  units: number; // credit units (1-6 typical)
  caScore: number; // 0..30
  examScore: number; // 0..70
};

export const GRADE_POINTS: Record<LetterGrade, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  F: 0,
};

export const GRADE_BANDS: { letter: LetterGrade; min: number; label: string }[] = [
  { letter: "A", min: 70, label: "A · Excellent (70–100)" },
  { letter: "B", min: 60, label: "B · Very Good (60–69)" },
  { letter: "C", min: 50, label: "C · Good (50–59)" },
  { letter: "D", min: 45, label: "D · Fair (45–49)" },
  { letter: "E", min: 40, label: "E · Pass (40–44)" },
  { letter: "F", min: 0, label: "F · Fail (<40)" },
];

export function totalScore(c: CourseLoad): number {
  return clamp(c.caScore, 0, 30) + clamp(c.examScore, 0, 70);
}

export function gradeFromScore(score: number): LetterGrade {
  for (const b of GRADE_BANDS) if (score >= b.min) return b.letter;
  return "F";
}

export type CgpaInput = {
  currentCgpa: number;
  unitsCompleted: number;
  semesterCourses: CourseLoad[];
};

export type CourseProjection = CourseLoad & {
  total: number;
  letter: LetterGrade;
  gradePoints: number;
  qualityPoints: number;
};

export type CgpaResult = {
  semesterGpa: number;
  projectedCgpa: number;
  classification: string;
  totalNewUnits: number;
  qualityPoints: number;
  delta: number;
  courses: CourseProjection[];
};

export function computeCgpa(input: CgpaInput): CgpaResult {
  const courses: CourseProjection[] = input.semesterCourses.map((c) => {
    const total = totalScore(c);
    const letter = gradeFromScore(total);
    const gp = GRADE_POINTS[letter];
    return { ...c, total, letter, gradePoints: gp, qualityPoints: gp * c.units };
  });

  const totalNewUnits = courses.reduce((s, c) => s + c.units, 0);
  const qualityPoints = courses.reduce((s, c) => s + c.qualityPoints, 0);
  const semesterGpa = totalNewUnits > 0 ? qualityPoints / totalNewUnits : 0;

  const priorPoints = input.currentCgpa * input.unitsCompleted;
  const totalUnits = input.unitsCompleted + totalNewUnits;
  const projectedCgpa =
    totalUnits > 0 ? (priorPoints + qualityPoints) / totalUnits : semesterGpa;

  return {
    semesterGpa: round2(semesterGpa),
    projectedCgpa: round2(projectedCgpa),
    classification: classify(projectedCgpa),
    totalNewUnits,
    qualityPoints: round2(qualityPoints),
    delta: round2(projectedCgpa - input.currentCgpa),
    courses,
  };
}

export function classify(cgpa: number): string {
  if (cgpa >= 4.5) return "First Class";
  if (cgpa >= 3.5) return "Second Class Upper (2:1)";
  if (cgpa >= 2.4) return "Second Class Lower (2:2)";
  if (cgpa >= 1.5) return "Third Class";
  if (cgpa >= 1.0) return "Pass";
  return "Probation / Fail";
}

// ----- Study-plan workflow -----

export type StudyPlanInput = {
  currentCgpa: number;
  targetCgpa: number;
  unitsCompleted: number;
  upcomingUnits: number;
  weeklyStudyHours: number;
  attendancePct: number;
  sleepHoursPerNight: number;
  level: "100" | "200" | "300" | "400" | "500";
};

export type StudyPlanResult = {
  requiredSemesterGpa: number;
  feasibility: "Easy" | "Realistic" | "Stretch" | "Very tough" | "Impossible";
  recommendedWeeklyHours: number;
  hoursPerUnit: number;
  dailyBreakdown: { day: string; hours: number; focus: string }[];
  actions: string[];
  warnings: string[];
};

export function buildStudyPlan(input: StudyPlanInput): StudyPlanResult {
  const priorPoints = input.currentCgpa * input.unitsCompleted;
  const totalUnits = input.unitsCompleted + input.upcomingUnits;
  const requiredQualityPoints = input.targetCgpa * totalUnits - priorPoints;
  const requiredSemesterGpa =
    input.upcomingUnits > 0 ? requiredQualityPoints / input.upcomingUnits : 0;

  let feasibility: StudyPlanResult["feasibility"];
  if (requiredSemesterGpa <= 0) feasibility = "Easy";
  else if (requiredSemesterGpa <= input.currentCgpa + 0.2) feasibility = "Easy";
  else if (requiredSemesterGpa <= 4.0) feasibility = "Realistic";
  else if (requiredSemesterGpa <= 4.6) feasibility = "Stretch";
  else if (requiredSemesterGpa <= 5.0) feasibility = "Very tough";
  else feasibility = "Impossible";

  const baseHoursPerUnit =
    requiredSemesterGpa >= 4.5 ? 4
    : requiredSemesterGpa >= 3.5 ? 3
    : requiredSemesterGpa >= 2.4 ? 2
    : 1.5;

  const attendancePenalty = input.attendancePct < 75 ? 1.2 : 1;
  const sleepPenalty = input.sleepHoursPerNight < 6 ? 1.15 : 1;
  const levelMultiplier =
    input.level === "400" || input.level === "500" ? 1.15 : 1;

  const hoursPerUnit =
    baseHoursPerUnit * attendancePenalty * sleepPenalty * levelMultiplier;
  const recommendedWeeklyHours = Math.round(hoursPerUnit * input.upcomingUnits);

  const dailyBreakdown = distributeHours(recommendedWeeklyHours);

  const actions: string[] = [];
  const warnings: string[] = [];

  if (requiredSemesterGpa > 5) {
    warnings.push(
      `Target requires a semester GPA of ${requiredSemesterGpa.toFixed(2)} — above the 5.0 cap. Extend the timeline or lower the target.`,
    );
  }
  if (input.attendancePct < 75) {
    warnings.push(
      `Attendance at ${input.attendancePct}% is below the 75% threshold — most lecturers bar exams below this.`,
    );
    actions.push("Raise lecture attendance to 90%+ this semester.");
  }
  if (input.sleepHoursPerNight < 6) {
    warnings.push("Sleeping under 6 hours nightly hurts retention.");
    actions.push("Sleep at least 7 hours; protect the night before tests.");
  }
  if (recommendedWeeklyHours > input.weeklyStudyHours) {
    actions.push(
      `Add ${recommendedWeeklyHours - input.weeklyStudyHours} hours/week of focused study (from ${input.weeklyStudyHours}h → ${recommendedWeeklyHours}h).`,
    );
  } else {
    actions.push("Current study volume is sufficient — optimize quality, not quantity.");
  }
  actions.push("Group courses by difficulty; spend 60% of hours on the hardest 30%.");
  actions.push("Do one past-question session per course every week.");
  actions.push("Form a 3-person study group for collaborative problem-solving.");
  if (input.level === "400" || input.level === "500") {
    actions.push("Carve out a fixed daily slot for project / seminar work.");
  }

  return {
    requiredSemesterGpa: round2(Math.min(5, Math.max(0, requiredSemesterGpa))),
    feasibility,
    recommendedWeeklyHours,
    hoursPerUnit: round2(hoursPerUnit),
    dailyBreakdown,
    actions,
    warnings,
  };
}

function distributeHours(total: number) {
  const weights = [1, 1.2, 1.2, 1.1, 1.1, 0.6, 0];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const focus = [
    "Hardest course • deep work",
    "Problem sets & tutorials",
    "Hardest course • deep work",
    "Past questions",
    "Review + quiz yourself",
    "Group study / project",
    "Rest & light reading",
  ];
  const sum = weights.reduce((a, b) => a + b, 0);
  return days.map((d, i) => ({
    day: d,
    hours: Math.round(((weights[i] / sum) * total) * 10) / 10,
    focus: focus[i],
  }));
}

// ----- Streak / rewards (localStorage-backed) -----

export type StreakState = {
  current: number;
  longest: number;
  lastCompletedDate: string | null; // YYYY-MM-DD
  totalDaysCompleted: number;
};

const STREAK_KEY = "augur:study-streak";

const EMPTY: StreakState = {
  current: 0,
  longest: 0,
  lastCompletedDate: null,
  totalDaysCompleted: 0,
};

export function loadStreak(): StreakState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return EMPTY;
    const s = JSON.parse(raw) as StreakState;
    if (s.lastCompletedDate) {
      const diff = daysBetween(s.lastCompletedDate, todayIso());
      if (diff > 1) s.current = 0; // missed a day → reset current streak
    }
    return s;
  } catch {
    return EMPTY;
  }
}

export function saveStreak(s: StreakState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STREAK_KEY, JSON.stringify(s));
}

export function markTodayComplete(prev: StreakState): {
  next: StreakState;
  reward: Reward | null;
  alreadyDone: boolean;
} {
  const today = todayIso();
  if (prev.lastCompletedDate === today) {
    return { next: prev, reward: null, alreadyDone: true };
  }
  const diff = prev.lastCompletedDate
    ? daysBetween(prev.lastCompletedDate, today)
    : Infinity;
  const newCurrent = diff === 1 ? prev.current + 1 : 1;
  const next: StreakState = {
    current: newCurrent,
    longest: Math.max(prev.longest, newCurrent),
    lastCompletedDate: today,
    totalDaysCompleted: prev.totalDaysCompleted + 1,
  };
  saveStreak(next);
  return { next, reward: rewardFor(newCurrent), alreadyDone: false };
}

export function resetStreak() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STREAK_KEY);
}

export type Reward = {
  emoji: string;
  title: string;
  message: string;
  milestone?: number;
};

export const MILESTONES = [3, 7, 14, 30, 60, 100, 180, 365];

export function rewardFor(streak: number): Reward {
  if (streak >= 365) return { emoji: "👑", title: "Year-long scholar", message: "365 days. You're built different.", milestone: 365 };
  if (streak >= 180) return { emoji: "🏆", title: "Half-year hero", message: "180 days of consistent study.", milestone: 180 };
  if (streak >= 100) return { emoji: "💯", title: "Centurion", message: "100 days — habit fully formed.", milestone: 100 };
  if (streak >= 60) return { emoji: "🚀", title: "Cruising", message: "60 days. Velocity unlocked.", milestone: 60 };
  if (streak >= 30) return { emoji: "🌟", title: "30-day legend", message: "A full month of discipline.", milestone: 30 };
  if (streak >= 14) return { emoji: "⚡", title: "Two-week surge", message: "14 days strong — keep stacking.", milestone: 14 };
  if (streak >= 7) return { emoji: "🔥", title: "One-week streak!", message: "7 days in a row. You're on fire.", milestone: 7 };
  if (streak >= 3) return { emoji: "💪", title: "3-day momentum", message: "Three days down. Don't break the chain.", milestone: 3 };
  return { emoji: "✅", title: "Day logged", message: "Nice — see you tomorrow." };
}

export function nextMilestone(current: number): number {
  for (const m of MILESTONES) if (current < m) return m;
  return current + 100;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86400000);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
