import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  predict,
  INTEREST_OPTIONS,
  type PredictorInput,
  type PredictorResult,
} from "@/lib/predictor";
import {
  Sparkles,
  TrendingUp,
  Award,
  AlertTriangle,
  BookOpen,
  GraduationCap,
  RotateCcw,
} from "lucide-react";

export const Route = createFileRoute("/predictor")({
  head: () => ({
    meta: [
      { title: "Run my prediction — Augur.edu" },
      {
        name: "description",
        content:
          "Fill six fields and get your predicted GPA, college admit chances, recommended majors, and a custom study plan.",
      },
      { property: "og:title", content: "Run my prediction — Augur.edu" },
      {
        property: "og:description",
        content: "Your academic forecast in under a minute.",
      },
    ],
  }),
  component: PredictorPage,
});

const DEFAULTS: PredictorInput = {
  currentGPA: 3.4,
  studyHoursPerWeek: 12,
  attendance: 88,
  pastTestAvg: 78,
  sleepHours: 7,
  extracurriculars: 3,
  targetTier: "top50",
  interests: ["tech", "math"],
};

function PredictorPage() {
  const [input, setInput] = useState<PredictorInput>(DEFAULTS);
  const [result, setResult] = useState<PredictorResult | null>(null);

  const update = <K extends keyof PredictorInput>(k: K, v: PredictorInput[K]) =>
    setInput((p) => ({ ...p, [k]: v }));

  const toggleInterest = (id: string) =>
    setInput((p) => ({
      ...p,
      interests: p.interests.includes(id)
        ? p.interests.filter((i) => i !== id)
        : [...p.interests, id],
    }));

  const run = () => {
    setResult(predict(input));
    setTimeout(() => {
      document.getElementById("result")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const reset = () => {
    setInput(DEFAULTS);
    setResult(null);
  };

  return (
    <div className="bg-grid min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 pt-16 pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            Step 1 of 1 — six fields, that's it
          </div>
          <h1 className="font-display text-4xl font-semibold md:text-5xl">
            Tell us about <span className="text-gradient">you</span>.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Be honest — the model is calibrated for actual numbers, not aspirational ones.
          </p>
        </div>

        {/* Form */}
        <div className="mt-12 glass rounded-3xl p-8 md:p-10">
          <div className="grid gap-7 md:grid-cols-2">
            <SliderField
              label="Current GPA"
              suffix=" / 4.0"
              value={input.currentGPA}
              min={0}
              max={4}
              step={0.1}
              onChange={(v) => update("currentGPA", v)}
            />
            <SliderField
              label="Past test average"
              suffix="%"
              value={input.pastTestAvg}
              min={0}
              max={100}
              step={1}
              onChange={(v) => update("pastTestAvg", v)}
            />
            <SliderField
              label="Study hours per week"
              suffix=" hrs"
              value={input.studyHoursPerWeek}
              min={0}
              max={40}
              step={1}
              onChange={(v) => update("studyHoursPerWeek", v)}
            />
            <SliderField
              label="Class attendance"
              suffix="%"
              value={input.attendance}
              min={0}
              max={100}
              step={1}
              onChange={(v) => update("attendance", v)}
            />
            <SliderField
              label="Average sleep"
              suffix=" hrs"
              value={input.sleepHours}
              min={4}
              max={11}
              step={0.5}
              onChange={(v) => update("sleepHours", v)}
            />
            <SliderField
              label="Extracurriculars"
              suffix=" activities"
              value={input.extracurriculars}
              min={0}
              max={8}
              step={1}
              onChange={(v) => update("extracurriculars", v)}
            />
          </div>

          {/* Target tier */}
          <div className="mt-8">
            <label className="text-sm font-medium text-muted-foreground">
              Target school tier
            </label>
            <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
              {(
                [
                  { id: "ivy", label: "Ivy / Elite" },
                  { id: "top50", label: "Top 50" },
                  { id: "state", label: "State Flagship" },
                  { id: "regional", label: "Regional" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => update("targetTier", t.id)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    input.targetTier === t.id
                      ? "border-primary bg-primary/15 text-foreground glow-primary"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="mt-8">
            <label className="text-sm font-medium text-muted-foreground">
              Subjects you enjoy
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((opt) => {
                const active = input.interests.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleInterest(opt.id)}
                    className={`rounded-full border px-4 py-2 text-sm transition-all ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              onClick={run}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:glow-primary"
            >
              <Sparkles className="h-4 w-4" />
              Generate prediction
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Result */}
        {result && <ResultPanel result={result} />}
      </main>

      <SiteFooter />
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-muted-foreground">{label}</label>
        <span className="font-display text-xl font-semibold text-foreground">
          {value}
          <span className="text-sm font-normal text-muted-foreground">{suffix}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-3 w-full accent-primary"
      />
    </div>
  );
}

function ResultPanel({ result }: { result: PredictorResult }) {
  return (
    <div id="result" className="mt-16 scroll-mt-20 space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
          Your forecast
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
          Here's where you're <span className="text-gradient">headed</span>.
        </h2>
      </div>

      {/* Top metrics */}
      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard
          icon={TrendingUp}
          label="Predicted score"
          value={`${result.predictedScore}`}
          unit="/100"
          hint={`Projected GPA ${result.predictedGPA.toFixed(2)}`}
        />
        <MetricCard
          icon={GraduationCap}
          label="Admit probability"
          value={`${result.admitChance}`}
          unit="%"
          hint="At your target tier"
          accent
        />
        <MetricCard
          icon={Award}
          label="Top major fit"
          value={result.recommendedMajors[0]?.name ?? "Pick interests"}
          hint={
            result.recommendedMajors[0]
              ? `${result.recommendedMajors[0].fit}% match`
              : "Add at least one interest"
          }
          small
        />
      </div>

      {/* Majors */}
      {result.recommendedMajors.length > 0 && (
        <div className="glass rounded-3xl p-8">
          <h3 className="font-display text-xl font-semibold">
            Recommended majors
          </h3>
          <div className="mt-5 space-y-3">
            {result.recommendedMajors.map((m) => (
              <div key={m.name} className="flex items-center gap-4">
                <div className="w-48 text-sm font-medium">{m.name}</div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                    style={{ width: `${m.fit}%` }}
                  />
                </div>
                <div className="w-12 text-right font-display text-sm font-semibold">
                  {m.fit}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths & improvements */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="glass rounded-3xl p-8">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="font-display text-xl font-semibold">Strengths</h3>
          </div>
          <ul className="mt-5 space-y-3">
            {result.strengths.map((s) => (
              <li key={s} className="flex items-start gap-3 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-3xl p-8">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-accent" />
            <h3 className="font-display text-xl font-semibold">Highest-impact fixes</h3>
          </div>
          <ul className="mt-5 space-y-3">
            {result.improvements.map((s) => (
              <li
                key={s.area}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-surface/40 px-4 py-3 text-sm"
              >
                <span className="font-medium">{s.area}</span>
                <span className="text-xs text-muted-foreground">{s.impact}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Study plan */}
      <div className="glass rounded-3xl p-8">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="font-display text-xl font-semibold">Your study plan</h3>
        </div>
        <ol className="mt-5 space-y-3">
          {result.studyPlan.map((s, i) => (
            <li key={i} className="flex items-start gap-4 text-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display text-xs font-semibold text-primary">
                {i + 1}
              </span>
              <span className="pt-1">{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  hint,
  accent,
  small,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  accent?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={`glass relative overflow-hidden rounded-3xl p-7 ${
        accent ? "ring-1 ring-primary/40 glow-primary" : ""
      }`}
    >
      <Icon className="h-5 w-5 text-primary" />
      <div className="mt-6 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-2 font-display font-semibold leading-none ${
          small ? "text-2xl" : "text-5xl text-gradient"
        }`}
      >
        {value}
        {unit && <span className="text-2xl text-muted-foreground">{unit}</span>}
      </div>
      {hint && <div className="mt-3 text-sm text-muted-foreground">{hint}</div>}
    </div>
  );
}
