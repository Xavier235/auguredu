import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  buildStudyPlan,
  classify,
  loadStreak,
  markTodayComplete,
  rewardFor,
  nextMilestone,
  MILESTONES,
  type StreakState,
  type Reward,
} from "@/lib/cgpa";
import {
  Target,
  TrendingUp,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Flame,
  Trophy,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/study-plan")({
  head: () => ({
    meta: [
      { title: "Personal Study Workflow — Augur.edu" },
      {
        name: "description",
        content:
          "Get a weekly study plan tuned to your target CGPA, attendance and sleep. Build a streak — earn rewards as you log each day.",
      },
      { property: "og:title", content: "Personal Study Workflow — Augur.edu" },
      {
        property: "og:description",
        content:
          "Hit your CGPA target with a daily study workflow, streaks and milestone rewards.",
      },
    ],
  }),
  component: StudyPlanPage,
});

function StudyPlanPage() {
  const [currentCgpa, setCurrentCgpa] = useState(3.2);
  const [targetCgpa, setTargetCgpa] = useState(4.0);
  const [unitsCompleted, setUnitsCompleted] = useState(60);
  const [upcomingUnits, setUpcomingUnits] = useState(18);
  const [weeklyStudyHours, setWeeklyStudyHours] = useState(15);
  const [attendancePct, setAttendancePct] = useState(80);
  const [sleepHours, setSleepHours] = useState(6);
  const [level, setLevel] = useState<"100" | "200" | "300" | "400" | "500">("200");

  // Streak state — loaded from localStorage on mount
  const [streak, setStreak] = useState<StreakState>({
    current: 0,
    longest: 0,
    lastCompletedDate: null,
    totalDaysCompleted: 0,
  });
  const [reward, setReward] = useState<Reward | null>(null);
  const [justLogged, setJustLogged] = useState(false);

  useEffect(() => {
    setStreak(loadStreak());
  }, []);

  const plan = useMemo(
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

  const todayIso = new Date().toISOString().slice(0, 10);
  const alreadyToday = streak.lastCompletedDate === todayIso;
  const target = nextMilestone(streak.current);
  const milestoneProgress = Math.min(100, (streak.current / target) * 100);

  function logToday() {
    const { next, reward, alreadyDone } = markTodayComplete(streak);
    setStreak(next);
    if (!alreadyDone && reward) {
      setReward(reward);
      setJustLogged(true);
      setTimeout(() => setJustLogged(false), 2500);
    }
  }

  return (
    <div className="bg-grid min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-12">
        <header className="mb-10 max-w-3xl">
          <div className="text-xs font-medium uppercase tracking-widest text-primary">
            For students already in university
          </div>
          <h1 className="mt-3 font-display text-4xl font-semibold md:text-6xl">
            Personal <span className="text-gradient">study workflow</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Tell us your target. We'll tell you exactly how many hours to study
            and turn each day you show up into a streak with rewards.
          </p>
          <div className="mt-5">
            <Link
              to="/cgpa"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Forecast my CGPA first → <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        {/* Streak hero */}
        <section className="glass mb-8 rounded-3xl p-6 md:p-8">
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Flame
                    className={`h-12 w-12 ${
                      streak.current > 0 ? "text-orange-400" : "text-muted-foreground"
                    }`}
                  />
                  {justLogged && (
                    <Sparkles className="absolute -right-2 -top-2 h-5 w-5 animate-ping text-primary" />
                  )}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    Current streak
                  </div>
                  <div className="font-display text-5xl font-semibold">
                    {streak.current}
                    <span className="ml-2 text-base font-normal text-muted-foreground">
                      day{streak.current === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Next milestone: {target} days</span>
                  <span>
                    {streak.current}/{target}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-400 via-primary to-accent transition-all"
                    style={{ width: `${milestoneProgress}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <MiniStat label="Longest" value={streak.longest} icon={Trophy} />
                <MiniStat label="Total days" value={streak.totalDaysCompleted} icon={CheckCircle2} />
                <MiniStat
                  label="Today"
                  value={alreadyToday ? "✓" : "—"}
                  icon={Calendar}
                />
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={logToday}
                disabled={alreadyToday}
                className={`w-full rounded-2xl px-6 py-5 text-sm font-semibold transition-all ${
                  alreadyToday
                    ? "cursor-not-allowed bg-surface text-muted-foreground"
                    : "bg-primary text-primary-foreground hover:glow-primary"
                }`}
              >
                {alreadyToday
                  ? "✓ Today's study already logged — see you tomorrow"
                  : "I studied today — log it 🔥"}
              </button>

              {reward && (
                <div
                  className={`rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/15 to-accent/10 p-5 ${
                    justLogged ? "animate-in fade-in zoom-in" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{reward.emoji}</div>
                    <div>
                      <div className="font-display text-lg font-semibold">
                        {reward.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {reward.message}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                  Milestones
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {MILESTONES.map((m) => {
                    const reached = streak.longest >= m;
                    const r = rewardFor(m);
                    return (
                      <div
                        key={m}
                        title={`${m} days — ${r.title}`}
                        className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${
                          reached
                            ? "border-primary/60 bg-primary/10 text-foreground"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        <span>{r.emoji}</span>
                        <span>{m}d</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs + plan */}
        <section className="grid gap-6 lg:grid-cols-5">
          <div className="glass space-y-5 rounded-3xl p-6 lg:col-span-2">
            <div>
              <label className="text-sm font-medium">
                Target CGPA — aiming for{" "}
                <span className="text-gradient">{targetCgpa.toFixed(2)}</span> (
                {classify(targetCgpa)})
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

            <NumberField label="Current CGPA" value={currentCgpa} onChange={setCurrentCgpa} step={0.01} min={0} max={5} />
            <NumberField label="Units completed so far" value={unitsCompleted} onChange={setUnitsCompleted} step={1} min={0} max={300} />
            <NumberField label="Units this upcoming semester" value={upcomingUnits} onChange={setUpcomingUnits} step={1} min={1} max={40} />
            <NumberField label="Current weekly study hours" value={weeklyStudyHours} onChange={setWeeklyStudyHours} step={1} min={0} max={80} />
            <NumberField label="Lecture attendance %" value={attendancePct} onChange={setAttendancePct} step={1} min={0} max={100} />
            <NumberField label="Sleep hours / night" value={sleepHours} onChange={setSleepHours} step={0.5} min={3} max={12} />

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
                value={plan.requiredSemesterGpa.toFixed(2)}
                hint={plan.feasibility}
                tone={
                  plan.feasibility === "Impossible" ||
                  plan.feasibility === "Very tough"
                    ? "warn"
                    : "good"
                }
              />
              <PlanStat
                icon={Clock}
                label="Recommended hours / week"
                value={`${plan.recommendedWeeklyHours}h`}
                hint={`${plan.hoursPerUnit}h per unit`}
              />
              <PlanStat
                icon={Calendar}
                label="Daily average"
                value={`${(plan.recommendedWeeklyHours / 7).toFixed(1)}h`}
                hint="Across 6 active days"
              />
            </div>

            <div className="glass rounded-3xl p-6">
              <h3 className="font-display text-lg font-semibold">
                Your week, mapped out
              </h3>
              <div className="mt-4 space-y-2">
                {plan.dailyBreakdown.map((d) => (
                  <div
                    key={d.day}
                    className="grid grid-cols-12 items-center gap-3 rounded-xl border border-border/60 bg-surface/40 px-4 py-3"
                  >
                    <div className="col-span-2 font-display font-semibold">{d.day}</div>
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

            {plan.warnings.length > 0 && (
              <div className="rounded-3xl border border-destructive/40 bg-destructive/10 p-6">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-destructive">
                  <AlertTriangle className="h-4 w-4" /> Warnings
                </div>
                <ul className="space-y-2 text-sm">
                  {plan.warnings.map((w, i) => (
                    <li key={i} className="text-muted-foreground">• {w}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="glass rounded-3xl p-6">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Target className="h-4 w-4 text-primary" /> Action items
              </div>
              <ul className="space-y-2 text-sm">
                {plan.actions.map((a, i) => (
                  <li key={i} className="flex gap-2 text-muted-foreground">
                    <span className="text-primary">→</span> {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
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

function MiniStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-surface/40 p-3">
      <Icon className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
      <div className="mt-1 font-display text-lg font-semibold">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
