import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  computeCgpa,
  buildStudyPlan,
  classify,
  GRADE_POINTS,
  type CourseLoad,
  type LetterGrade,
} from "@/lib/cgpa";
import {
  GraduationCap,
  Plus,
  Trash2,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Target,
} from "lucide-react";

export const Route = createFileRoute("/cgpa")({
  head: () => ({
    meta: [
      { title: "CGPA Predictor & Study Planner — Augur.edu" },
      {
        name: "description",
        content:
          "Project your next-semester CGPA, see your degree classification, and get a weekly study workflow tuned to your current grades and habits.",
      },
      { property: "og:title", content: "CGPA Predictor & Study Planner — Augur.edu" },
      {
        property: "og:description",
        content:
          "For LASU students already in school: forecast CGPA and get an honest study plan.",
      },
    ],
  }),
  component: CgpaPage,
});

const LETTERS: LetterGrade[] = ["A", "B", "C", "D", "E", "F"];
const newCourse = (i: number): CourseLoad => ({
  code: `Course ${i}`,
  units: 3,
  expectedGrade: "B",
});

function CgpaPage() {
  // CGPA predictor state
  const [currentCgpa, setCurrentCgpa] = useState(3.2);
  const [unitsCompleted, setUnitsCompleted] = useState(60);
  const [courses, setCourses] = useState<CourseLoad[]>([
    newCourse(1),
    newCourse(2),
    newCourse(3),
    newCourse(4),
  ]);

  // Study plan state
  const [targetCgpa, setTargetCgpa] = useState(4.0);
  const [weeklyStudyHours, setWeeklyStudyHours] = useState(15);
  const [attendancePct, setAttendancePct] = useState(80);
  const [sleepHours, setSleepHours] = useState(6);
  const [level, setLevel] = useState<"100" | "200" | "300" | "400" | "500">("200");

  const cgpaResult = useMemo(
    () =>
      computeCgpa({
        currentCgpa,
        unitsCompleted,
        semesterCourses: courses,
      }),
    [currentCgpa, unitsCompleted, courses],
  );

  const upcomingUnits = cgpaResult.totalNewUnits;

  const planResult = useMemo(
    () =>
      buildStudyPlan({
        currentCgpa,
        targetCgpa,
        unitsCompleted,
        upcomingUnits,
        weeklyStudyHours,
        attendancePct,
        sleepHoursPerNight: sleepHours,
        level,
      }),
    [
      currentCgpa,
      targetCgpa,
      unitsCompleted,
      upcomingUnits,
      weeklyStudyHours,
      attendancePct,
      sleepHours,
      level,
    ],
  );

  function updateCourse(idx: number, patch: Partial<CourseLoad>) {
    setCourses((cs) => cs.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  }

  return (
    <div className="bg-grid min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-12">
        <header className="mb-12 max-w-3xl">
          <div className="text-xs font-medium uppercase tracking-widest text-primary">
            For students already in LASU
          </div>
          <h1 className="mt-3 font-display text-4xl font-semibold md:text-6xl">
            CGPA forecast & <span className="text-gradient">study workflow</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Plug in your current CGPA, the courses you're carrying, and your habits.
            We'll project your next CGPA and tell you exactly how much to study.
          </p>
        </header>

        {/* SECTION 1 — CGPA PREDICTOR */}
        <section className="mb-16">
          <SectionHeading
            icon={GraduationCap}
            tag="Section 1"
            title="CGPA Predictor"
            subtitle="Estimate your end-of-semester GPA and projected CGPA."
          />

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Inputs */}
            <div className="glass space-y-6 rounded-3xl p-6 lg:col-span-3">
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  label="Current CGPA (out of 5.0)"
                  value={currentCgpa}
                  onChange={setCurrentCgpa}
                  step={0.01}
                  min={0}
                  max={5}
                />
                <NumberField
                  label="Units completed so far"
                  value={unitsCompleted}
                  onChange={setUnitsCompleted}
                  step={1}
                  min={0}
                  max={300}
                />
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-medium">This semester's courses</div>
                  <button
                    onClick={() =>
                      setCourses((cs) => [...cs, newCourse(cs.length + 1)])
                    }
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium hover:bg-accent/20"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add course
                  </button>
                </div>

                <div className="space-y-2">
                  {courses.map((c, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-12 items-center gap-2 rounded-xl border border-border/60 bg-surface/40 p-2"
                    >
                      <input
                        value={c.code}
                        onChange={(e) => updateCourse(i, { code: e.target.value })}
                        className="col-span-5 rounded-md bg-transparent px-2 py-1.5 text-sm outline-none focus:bg-surface"
                      />
                      <input
                        type="number"
                        min={1}
                        max={6}
                        value={c.units}
                        onChange={(e) =>
                          updateCourse(i, { units: Number(e.target.value) || 0 })
                        }
                        className="col-span-3 rounded-md bg-surface/60 px-2 py-1.5 text-sm outline-none"
                      />
                      <select
                        value={c.expectedGrade}
                        onChange={(e) =>
                          updateCourse(i, {
                            expectedGrade: e.target.value as LetterGrade,
                          })
                        }
                        className="col-span-3 rounded-md bg-surface/60 px-2 py-1.5 text-sm outline-none"
                      >
                        {LETTERS.map((g) => (
                          <option key={g} value={g}>
                            {g} ({GRADE_POINTS[g]})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() =>
                          setCourses((cs) => cs.filter((_, idx) => idx !== i))
                        }
                        className="col-span-1 flex justify-center text-muted-foreground hover:text-destructive"
                        aria-label="Remove course"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  LASU scale: A=5, B=4, C=3, D=2, E=1, F=0.
                </p>
              </div>
            </div>

            {/* Result */}
            <div className="glass space-y-5 rounded-3xl p-6 lg:col-span-2">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Projected CGPA
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-semibold text-gradient">
                    {cgpaResult.projectedCgpa.toFixed(2)}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      cgpaResult.delta >= 0 ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {cgpaResult.delta >= 0 ? "+" : ""}
                    {cgpaResult.delta.toFixed(2)}
                  </span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {cgpaResult.classification}
                </div>
              </div>

              <Stat
                label="This semester GPA"
                value={cgpaResult.semesterGpa.toFixed(2)}
              />
              <Stat label="Quality points" value={cgpaResult.qualityPoints} />
              <Stat label="New units" value={cgpaResult.totalNewUnits} />

              <div className="rounded-2xl border border-border/60 bg-surface/40 p-4 text-xs leading-relaxed text-muted-foreground">
                Formula: <span className="text-foreground">(prior CGPA × prior units + Σ unit×grade) / total units</span>.
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — STUDY PLAN */}
        <section>
          <SectionHeading
            icon={Target}
            tag="Section 2"
            title="Study workflow"
            subtitle="How much you need to study to hit your target CGPA — built from your habits."
          />

          <div className="grid gap-6 lg:grid-cols-5">
            <div className="glass space-y-5 rounded-3xl p-6 lg:col-span-2">
              <div>
                <label className="text-sm font-medium">
                  Target CGPA — currently aiming for{" "}
                  <span className="text-gradient">{targetCgpa.toFixed(2)}</span>{" "}
                  ({classify(targetCgpa)})
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={0.05}
                  value={targetCgpa}
                  onChange={(e) => setTargetCgpa(Number(e.target.value))}
                  className="mt-3 w-full accent-primary"
                />
              </div>

              <NumberField
                label="Current weekly study hours"
                value={weeklyStudyHours}
                onChange={setWeeklyStudyHours}
                step={1}
                min={0}
                max={80}
              />
              <NumberField
                label="Lecture attendance %"
                value={attendancePct}
                onChange={setAttendancePct}
                step={1}
                min={0}
                max={100}
              />
              <NumberField
                label="Sleep hours / night"
                value={sleepHours}
                onChange={setSleepHours}
                step={0.5}
                min={3}
                max={12}
              />

              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">
                  Current level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as typeof level)}
                  className="w-full rounded-xl border border-border bg-surface/60 px-3 py-2.5 text-sm outline-none"
                >
                  {["100", "200", "300", "400", "500"].map((l) => (
                    <option key={l} value={l}>
                      {l} level
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-5 lg:col-span-3">
              <div className="glass grid gap-4 rounded-3xl p-6 sm:grid-cols-3">
                <PlanStat
                  icon={TrendingUp}
                  label="Required semester GPA"
                  value={planResult.requiredSemesterGpa.toFixed(2)}
                  hint={planResult.feasibility}
                  tone={
                    planResult.feasibility === "Impossible" ||
                    planResult.feasibility === "Very tough"
                      ? "warn"
                      : "good"
                  }
                />
                <PlanStat
                  icon={Clock}
                  label="Recommended hours / week"
                  value={`${planResult.recommendedWeeklyHours}h`}
                  hint={`${planResult.hoursPerUnit}h per unit`}
                />
                <PlanStat
                  icon={Calendar}
                  label="Daily average"
                  value={`${(planResult.recommendedWeeklyHours / 7).toFixed(1)}h`}
                  hint="Across 6 active days"
                />
              </div>

              {/* Weekly plan */}
              <div className="glass rounded-3xl p-6">
                <h3 className="font-display text-lg font-semibold">
                  Your week, mapped out
                </h3>
                <div className="mt-4 space-y-2">
                  {planResult.dailyBreakdown.map((d) => (
                    <div
                      key={d.day}
                      className="grid grid-cols-12 items-center gap-3 rounded-xl border border-border/60 bg-surface/40 px-4 py-3"
                    >
                      <div className="col-span-2 font-display font-semibold">
                        {d.day}
                      </div>
                      <div className="col-span-2 font-display text-lg text-gradient">
                        {d.hours}h
                      </div>
                      <div className="col-span-8 text-sm text-muted-foreground">
                        {d.focus}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {planResult.warnings.length > 0 && (
                <div className="rounded-3xl border border-destructive/40 bg-destructive/10 p-6">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-destructive">
                    <AlertTriangle className="h-4 w-4" /> Warnings
                  </div>
                  <ul className="space-y-2 text-sm">
                    {planResult.warnings.map((w, i) => (
                      <li key={i} className="text-muted-foreground">
                        • {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="glass rounded-3xl p-6">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Action items
                </div>
                <ul className="space-y-2 text-sm">
                  {planResult.actions.map((a, i) => (
                    <li key={i} className="flex gap-2 text-muted-foreground">
                      <span className="text-primary">→</span> {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  tag,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 ring-1 ring-primary/40">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-widest text-primary">
          {tag}
        </div>
        <h2 className="mt-1 font-display text-3xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        type="number"
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-xl border border-border bg-surface/60 px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between border-t border-border/60 pt-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-display font-semibold">{value}</span>
    </div>
  );
}

function PlanStat({
  icon: Icon,
  label,
  value,
  hint,
  tone = "good",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
  tone?: "good" | "warn";
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface/40 p-4">
      <Icon className="h-4 w-4 text-primary" />
      <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-2xl font-semibold">{value}</div>
      {hint && (
        <div
          className={`mt-1 text-xs ${
            tone === "warn" ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {hint}
        </div>
      )}
    </div>
  );
}
