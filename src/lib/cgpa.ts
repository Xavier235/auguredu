// LASU CGPA predictor + study-plan workflow (5.0 scale)

export type CourseLoad = {
  code: string;
  units: number; // credit units (1-6 typical)
  expectedGrade: LetterGrade;
};

export type LetterGrade = "A" | "B" | "C" | "D" | "E" | "F";

export const GRADE_POINTS: Record<LetterGrade, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  F: 0,
};

export const GRADE_MIN_SCORE: Record<LetterGrade, number> = {
  A: 70,
  B: 60,
  C: 50,
  D: 45,
  E: 40,
  F: 0,
};

export type CgpaInput = {
  currentCgpa: number; // 0-5
  unitsCompleted: number; // total credits passed so far
  semesterCourses: CourseLoad[]; // upcoming semester
};

export type CgpaResult = {
  semesterGpa: number;
  projectedCgpa: number;
  classification: string;
  totalNewUnits: number;
  qualityPoints: number;
  delta: number; // change vs current
};

export function computeCgpa(input: CgpaInput): CgpaResult {
  const totalNewUnits = input.semesterCourses.reduce((s, c) => s + c.units, 0);
  const qualityPoints = input.semesterCourses.reduce(
    (s, c) => s + c.units * GRADE_POINTS[c.expectedGrade],
    0,
  );
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
    qualityPoints,
    delta: round2(projectedCgpa - input.currentCgpa),
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
  weeklyStudyHours: number; // current
  attendancePct: number; // 0-100
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

  // base hours-per-unit scales with required GPA (a 2:1 push ~ 2.5h/unit, first class ~ 4h/unit)
  const baseHoursPerUnit =
    requiredSemesterGpa >= 4.5
      ? 4
      : requiredSemesterGpa >= 3.5
        ? 3
        : requiredSemesterGpa >= 2.4
          ? 2
          : 1.5;

  // penalty if attendance low or sleep poor
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
      `Target requires a semester GPA of ${requiredSemesterGpa.toFixed(2)} which exceeds the 5.0 cap. Consider extending the timeline or lowering the target.`,
    );
  }
  if (input.attendancePct < 75) {
    warnings.push(
      `Attendance at ${input.attendancePct}% is below the 75% threshold — many LASU courses bar exams below this.`,
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
    actions.push(
      "Current study volume is sufficient — optimize quality, not quantity.",
    );
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
  // Heavier weekdays, lighter weekends with one rest day
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

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
