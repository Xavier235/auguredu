import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { jsPDF } from "jspdf";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  predict,
  INTEREST_OPTIONS,
  GRADE_OPTIONS,
  SUBJECT_COMBOS,
  type PredictorInput,
  type PredictorResult,
  type CoursePrediction,
  type OLevelGrade,
} from "@/lib/predictor";
import {
  Sparkles,
  TrendingUp,
  Award,
  AlertTriangle,
  BookOpen,
  GraduationCap,
  RotateCcw,
  Download,
  CheckCircle2,
  XCircle,
  Save,
  Check,
} from "lucide-react";


export const Route = createFileRoute("/predictor")({
  head: () => ({
    meta: [
      { title: "LASU Course Predictor — Augur.edu" },
      {
        name: "description",
        content:
          "Predict the LASU course you can study based on your JAMB score, Post-UTME, and O'Level grades. Download a full PDF report.",
      },
      { property: "og:title", content: "LASU Course Predictor" },
      {
        property: "og:description",
        content: "Know your LASU admission chances before you apply.",
      },
    ],
  }),
  component: PredictorPage,
});

const DEFAULT_GRADES: OLevelGrade[] = ["B3", "B3", "C4", "C4", "C5"];

const O_LEVEL_LABELS = ["English Language", "Mathematics", "Subject 3", "Subject 4", "Subject 5"];

const DEFAULTS: PredictorInput = {
  jambScore: 220,
  postUtmeScore: 65,
  oLevelGrades: DEFAULT_GRADES,
  subjectCombo: "science",
  state: "lagos",
  interests: ["tech", "science"],
};

function PredictorPage() {
  const [input, setInput] = useState<PredictorInput>(DEFAULTS);
  const [result, setResult] = useState<PredictorResult | null>(null);

  const update = <K extends keyof PredictorInput>(k: K, v: PredictorInput[K]) =>
    setInput((p) => ({ ...p, [k]: v }));

  const updateGrade = (idx: number, grade: OLevelGrade) =>
    setInput((p) => {
      const next = [...p.oLevelGrades];
      next[idx] = grade;
      return { ...p, oLevelGrades: next };
    });

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

  const downloadPdf = () => {
    if (!result) return;
    generatePdf(input, result);
  };

  return (
    <div className="bg-grid min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 pt-16 pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            Lagos State University — JAMB course predictor
          </div>
          <h1 className="font-display text-4xl font-semibold md:text-5xl">
            What can I study at <span className="text-gradient">LASU</span>?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Enter your JAMB score, Post-UTME and O'Level results. We'll match you with
            LASU courses you actually have a shot at — and you can download the full
            breakdown as a PDF.
          </p>
        </div>

        {/* Form */}
        <div className="mt-12 glass rounded-3xl p-8 md:p-10">
          <div className="grid gap-7 md:grid-cols-2">
            <SliderField
              label="JAMB UTME score"
              suffix=" / 400"
              value={input.jambScore}
              min={120}
              max={400}
              step={1}
              onChange={(v) => update("jambScore", v)}
            />
            <SliderField
              label="Post-UTME / Screening"
              suffix=" / 100"
              value={input.postUtmeScore}
              min={0}
              max={100}
              step={1}
              onChange={(v) => update("postUtmeScore", v)}
            />
          </div>

          {/* O'Level grades */}
          <div className="mt-8">
            <label className="text-sm font-medium text-muted-foreground">
              O'Level grades (WAEC/NECO) — 5 best subjects
            </label>
            <div className="mt-3 grid gap-3 md:grid-cols-5">
              {input.oLevelGrades.map((g, i) => (
                <div key={i}>
                  <div className="mb-1.5 text-xs text-muted-foreground">
                    {O_LEVEL_LABELS[i]}
                  </div>
                  <select
                    value={g}
                    onChange={(e) => updateGrade(i, e.target.value as OLevelGrade)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                  >
                    {GRADE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Subject combo */}
          <div className="mt-8">
            <label className="text-sm font-medium text-muted-foreground">
              SSCE / JAMB subject combination
            </label>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {SUBJECT_COMBOS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => update("subjectCombo", t.id)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    input.subjectCombo === t.id
                      ? "border-primary bg-primary/15 text-foreground glow-primary"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* State */}
          <div className="mt-8">
            <label className="text-sm font-medium text-muted-foreground">
              State of origin
            </label>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(
                [
                  { id: "lagos" as const, label: "Lagos State (Indigene)" },
                  { id: "other" as const, label: "Other state" },
                ]
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => update("state", t.id)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    input.state === t.id
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
              Areas you're interested in
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
              Predict my LASU course
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
        {result && <ResultPanel result={result} input={input} onDownload={downloadPdf} />}
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

function ResultPanel({
  result,
  input,
  onDownload,
}: {
  result: PredictorResult;
  input: PredictorInput;
  onDownload: () => void;
}) {
  const top = result.topCourses[0];
  return (
    <div id="result" className="mt-16 scroll-mt-20 space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
          Your LASU forecast
        </div>
        <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
          Here's where you'll likely <span className="text-gradient">land</span>.
        </h2>
        <button
          onClick={onDownload}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-primary/20 hover:glow-primary"
        >
          <Download className="h-4 w-4" />
          Download full PDF report
        </button>
      </div>

      {/* Top metrics */}
      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard
          icon={TrendingUp}
          label="Aggregate screening score"
          value={`${result.aggregateScore}`}
          unit="/100"
          hint={`JAMB ${input.jambScore} • Post-UTME ${input.postUtmeScore} • O'Level ${result.oLevelPoints}/30`}
        />
        <MetricCard
          icon={GraduationCap}
          label="Best-fit course chance"
          value={`${top?.admissionChance ?? 0}`}
          unit="%"
          hint={top ? top.course : "No eligible course found"}
          accent
        />
        <MetricCard
          icon={Award}
          label="Top course match"
          value={top?.course ?? "—"}
          hint={top ? `${top.faculty} • Cutoff ${top.cutoff}` : "Adjust your combo"}
          small
        />
      </div>

      {/* Score breakdown */}
      <div className="glass rounded-3xl p-8">
        <h3 className="font-display text-xl font-semibold">Predictor breakdown</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          How LASU's screening formula composes your aggregate score (50% JAMB + 30%
          Post-UTME + 20% O'Level, with indigene adjustment).
        </p>
        <div className="mt-6 space-y-4">
          {result.breakdown.map((b) => (
            <div key={b.label}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-medium text-foreground">{b.label}</span>
                <span className="font-display text-base font-semibold text-foreground">
                  {b.value}
                  <span className="ml-1 text-xs text-muted-foreground">
                    / {b.weight}
                  </span>
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  style={{
                    width: `${Math.min(100, (b.value / Math.max(b.weight, 1)) * 100)}%`,
                  }}
                />
              </div>
              <div className="mt-1.5 text-xs text-muted-foreground">{b.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top courses */}
      <div className="glass rounded-3xl p-8">
        <h3 className="font-display text-xl font-semibold">
          Top {result.topCourses.length} recommended LASU courses
        </h3>
        <div className="mt-5 space-y-3">
          {result.topCourses.map((c) => (
            <CourseRow key={c.course} c={c} />
          ))}
          {result.topCourses.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No eligible courses for your subject combination. Try a different combo.
            </p>
          )}
        </div>
      </div>

      {/* Alternatives */}
      {result.alternativeCourses.length > 0 && (
        <div className="glass rounded-3xl p-8">
          <h3 className="font-display text-xl font-semibold">
            Backup / change-of-course options
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Lower cutoffs — solid safety nets if your first choice falls through.
          </p>
          <div className="mt-5 space-y-3">
            {result.alternativeCourses.map((c) => (
              <CourseRow key={c.course} c={c} />
            ))}
          </div>
        </div>
      )}

      {/* Strengths & weaknesses */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="glass rounded-3xl p-8">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h3 className="font-display text-xl font-semibold">Your strengths</h3>
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
            <XCircle className="h-5 w-5 text-accent" />
            <h3 className="font-display text-xl font-semibold">Weak spots</h3>
          </div>
          <ul className="mt-5 space-y-3">
            {result.weaknesses.map((s) => (
              <li key={s} className="flex items-start gap-3 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass rounded-3xl p-8">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="font-display text-xl font-semibold">What to do next</h3>
        </div>
        <ol className="mt-5 space-y-3">
          {result.recommendations.map((s, i) => (
            <li key={i} className="flex items-start gap-4 text-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display text-xs font-semibold text-primary">
                {i + 1}
              </span>
              <span className="pt-1">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={onDownload}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:glow-primary"
        >
          <Download className="h-4 w-4" />
          Download full PDF report
        </button>
      </div>

      <p className="pt-2 text-center text-xs text-muted-foreground">
        Estimates are based on recent LASU JAMB departmental cutoffs and the
        50/30/20 screening formula. Always confirm with the official LASU
        admissions brochure for the current year.
      </p>
    </div>
  );
}

function CourseRow({ c }: { c: CoursePrediction }) {
  const color =
    c.verdict === "Very High"
      ? "text-primary"
      : c.verdict === "High"
        ? "text-primary"
        : c.verdict === "Moderate"
          ? "text-foreground"
          : "text-accent";

  return (
    <div className="rounded-2xl border border-border/60 bg-surface/40 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="font-display text-base font-semibold">{c.course}</div>
          <div className="text-xs text-muted-foreground">
            {c.faculty} • Cutoff {c.cutoff} • {c.oLevelRequired}
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl font-semibold text-gradient">
            {c.admissionChance}%
          </div>
          <div className={`text-xs font-medium ${color}`}>{c.verdict} chance</div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            style={{ width: `${c.admissionChance}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground">Fit {c.fit}%</div>
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
        className={`mt-2 font-display font-semibold leading-tight ${
          small ? "text-xl" : "text-5xl text-gradient"
        }`}
      >
        {value}
        {unit && <span className="text-2xl text-muted-foreground">{unit}</span>}
      </div>
      {hint && <div className="mt-3 text-sm text-muted-foreground">{hint}</div>}
    </div>
  );
}

// ============= PDF GENERATION =============
function generatePdf(input: PredictorInput, result: PredictorResult) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const heading = (text: string, size = 18) => {
    ensureSpace(size + 12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(20, 20, 50);
    doc.text(text, margin, y);
    y += size + 8;
  };

  const subheading = (text: string) => {
    ensureSpace(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 100);
    doc.text(text, margin, y);
    y += 16;
  };

  const body = (text: string, size = 10) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(40, 40, 40);
    const lines = doc.splitTextToSize(text, pageW - margin * 2);
    lines.forEach((line: string) => {
      ensureSpace(size + 4);
      doc.text(line, margin, y);
      y += size + 4;
    });
  };

  const divider = () => {
    ensureSpace(14);
    doc.setDrawColor(200, 200, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);
    y += 12;
  };

  // ========== HEADER ==========
  doc.setFillColor(15, 23, 60);
  doc.rect(0, 0, pageW, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("LASU Course Predictor", margin, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Personalised JAMB / Admission Report — Augur.edu", margin, 70);
  y = 120;

  // ========== INPUT SUMMARY ==========
  heading("Your Profile", 16);
  body(`JAMB UTME Score: ${input.jambScore} / 400`);
  body(`Post-UTME / Screening Score: ${input.postUtmeScore} / 100`);
  body(`Subject Combination: ${input.subjectCombo.toUpperCase()}`);
  body(`State of Origin: ${input.state === "lagos" ? "Lagos State (Indigene)" : "Non-indigene"}`);
  body(`O'Level Grades: ${input.oLevelGrades.join(", ")}  (${result.oLevelPoints}/30 grade points)`);
  body(`Interests: ${input.interests.join(", ") || "None selected"}`);
  y += 6;
  divider();

  // ========== AGGREGATE ==========
  heading("Aggregate Screening Score", 16);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  doc.setTextColor(79, 70, 229);
  ensureSpace(46);
  doc.text(`${result.aggregateScore} / 100`, margin, y + 30);
  y += 44;
  body(
    "LASU computes admission using a weighted formula: 50% JAMB + 30% Post-UTME + 20% O'Level. Lagos State indigenes typically benefit from cutoffs ~8 marks lower.",
  );
  y += 4;
  divider();

  // ========== BREAKDOWN ==========
  heading("Score Breakdown", 16);
  result.breakdown.forEach((b) => {
    subheading(`${b.label}  —  ${b.value} / ${b.weight}`);
    body(b.detail);
    y += 2;
  });
  divider();

  // ========== TOP COURSES ==========
  heading("Top Recommended Courses", 16);
  if (result.topCourses.length === 0) {
    body("No eligible courses found for your subject combination.");
  }
  result.topCourses.forEach((c, i) => {
    ensureSpace(60);
    subheading(`${i + 1}.  ${c.course}  —  ${c.admissionChance}% (${c.verdict})`);
    body(`Faculty: ${c.faculty}`);
    body(`JAMB Cutoff: ${c.cutoff}    •    O'Level Required: ${c.oLevelRequired}`);
    body(`Interest fit: ${c.fit}%`);
    y += 4;
  });
  divider();

  // ========== ALTERNATIVES ==========
  if (result.alternativeCourses.length) {
    heading("Backup / Change-of-Course Options", 16);
    result.alternativeCourses.forEach((c, i) => {
      ensureSpace(50);
      subheading(`${i + 1}.  ${c.course}  —  ${c.admissionChance}% (${c.verdict})`);
      body(`${c.faculty}  •  Cutoff ${c.cutoff}  •  ${c.oLevelRequired}`);
      y += 2;
    });
    divider();
  }

  // ========== STRENGTHS ==========
  heading("Strengths", 14);
  result.strengths.forEach((s) => body(`•  ${s}`));
  y += 4;

  heading("Weak Spots", 14);
  result.weaknesses.forEach((s) => body(`•  ${s}`));
  y += 4;
  divider();

  // ========== RECOMMENDATIONS ==========
  heading("What to Do Next", 16);
  result.recommendations.forEach((s, i) => {
    body(`${i + 1}.  ${s}`);
  });

  // ========== FOOTER on every page ==========
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 160);
    doc.text(
      "Estimates based on recent LASU JAMB cutoffs. Confirm with the official LASU brochure for the current admission year.",
      margin,
      pageH - 24,
    );
    doc.text(`Page ${i} of ${pageCount}`, pageW - margin - 60, pageH - 24);
  }

  doc.save(`LASU-Course-Prediction-${input.jambScore}.pdf`);
}
