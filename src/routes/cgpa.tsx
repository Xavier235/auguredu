import { pageMeta, canonical, serviceJsonLd } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  computeCgpa,
  totalScore,
  gradeFromScore,
  GRADE_POINTS,
  GRADE_BANDS,
  type CourseLoad,
  type LetterGrade,
} from "@/lib/cgpa";
import {
  DEPARTMENTS,
  LEVELS,
  coursesFor,
  type AcademicLevel,
} from "@/lib/course-catalogue";
import {
  GraduationCap,
  Plus,
  Trash2,
  ArrowRight,
  IdCard,
  BookOpen,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { validateMatric, MATRIC_EXAMPLES } from "@/lib/matric";



export const Route = createFileRoute("/cgpa")({
  head: () => ({
    meta: pageMeta({
      title: "CGPA Forecaster for Nigerian Students | Augur.edu",
      description:
        "Enter your CA (out of 30) and Exam (out of 70) per course to get letter grades, semester GPA and your projected CGPA.",
      path: "/cgpa",
    }),
    links: canonical("/cgpa"),
    scripts: serviceJsonLd({
      name: "CGPA Forecaster",
      serviceType: "Academic performance forecasting",
      description: "Forecast semester GPA and cumulative CGPA from continuous assessment and exam scores.",
      path: "/cgpa",
    }),
  }),

  component: CgpaPage,
});

const newCourse = (i: number): CourseLoad => ({
  code: `CSC${100 + i}`,
  units: 3,
  caScore: 22,
  examScore: 50,
});

function CgpaPage() {
  // Student context (for the report header — purely informational)
  const [studentId, setStudentId] = useState("RUN/CMP/21/1001");
  const [gender, setGender] = useState<"M" | "F">("M");

  // Department + level for the course catalogue picker
  const [departmentId, setDepartmentId] = useState<string>("csc");
  const [level, setLevel] = useState<AcademicLevel>("200");

  // CGPA forecaster state
  const [currentCgpa, setCurrentCgpa] = useState(3.2);
  const [unitsCompleted, setUnitsCompleted] = useState(60);
  const [courses, setCourses] = useState<CourseLoad[]>([
    newCourse(1),
    newCourse(2),
    newCourse(3),
    newCourse(4),
  ]);

  // Custom/external course adder
  const [showCustomAdd, setShowCustomAdd] = useState(false);
  const [customCode, setCustomCode] = useState("");
  const [customUnits, setCustomUnits] = useState(3);

  const catalogue = useMemo(
    () => coursesFor(departmentId, level),
    [departmentId, level],
  );
  const selectedCodes = useMemo(
    () => new Set(courses.map((c) => c.code.trim().toUpperCase())),
    [courses],
  );

  const result = useMemo(
    () =>
      computeCgpa({
        currentCgpa,
        unitsCompleted,
        semesterCourses: courses,
      }),
    [currentCgpa, unitsCompleted, courses],
  );

  function updateCourse(idx: number, patch: Partial<CourseLoad>) {
    setCourses((cs) => cs.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  }

  function addFromCatalogue(code: string, units: number) {
    if (selectedCodes.has(code.toUpperCase())) return;
    setCourses((cs) => [...cs, { code, units, caScore: 20, examScore: 45 }]);
  }

  function loadAllForLevel() {
    const next: CourseLoad[] = catalogue.map((c) => ({
      code: c.code,
      units: c.units,
      caScore: 20,
      examScore: 45,
    }));
    setCourses(next);
  }

  function addCustomCourse() {
    const code = customCode.trim().toUpperCase() || "EXT 101";
    if (selectedCodes.has(code)) return;
    setCourses((cs) => [
      ...cs,
      { code, units: Math.max(1, Math.min(6, customUnits)), caScore: 20, examScore: 45 },
    ]);
    setCustomCode("");
    setCustomUnits(3);
    setShowCustomAdd(false);
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
            CGPA <span className="text-gradient">forecaster</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Enter each course's <strong>CA score (out of 30)</strong> and{" "}
            <strong>Exam score (out of 70)</strong>. We compute totals, derive
            letter grades, then project your semester GPA and end-of-year CGPA
            on the standard 5.0 scale.
          </p>
          <div className="mt-5">
            <Link
              to="/study-plan"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Build a personal study workflow → <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        {/* Student context */}
        <section className="glass mb-6 rounded-3xl p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <IdCard className="h-4 w-4 text-primary" /> Student details (for your report)
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">
                Matric number
              </span>
              <input
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                placeholder="e.g. 210401234 or RUN/CMP/21/1001"
                className="w-full rounded-xl border border-border bg-surface/60 px-3 py-2.5 text-sm font-mono outline-none focus:border-primary"
              />
              {(() => {
                const m = validateMatric(studentId);
                if (!studentId.trim()) return null;
                return m.valid ? (
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-primary">
                    <CheckCircle2 className="h-3 w-3" />
                    Valid matric ({m.format}
                    {m.school ? ` · ${m.school}` : ""})
                  </div>
                ) : (
                  <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-orange-400">
                    <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
                    <span>
                      Doesn't look like a Nigerian matric number. Examples: {MATRIC_EXAMPLES.slice(0, 3).join(", ")}
                    </span>
                  </div>
                );
              })()}
            </div>

            <div>
              <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">
                Gender
              </span>
              <div className="grid grid-cols-2 gap-2">
                {(["M", "F"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                      gender === g
                        ? "border-primary bg-primary/15 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {g === "M" ? "Male" : "Female"}
                  </button>
                ))}
              </div>
            </div>
            <NumberField
              label="Current CGPA (out of 5.0)"
              value={currentCgpa}
              onChange={setCurrentCgpa}
              step={0.01}
              min={0}
              max={5}
            />
          </div>
          <div className="mt-4">
            <NumberField
              label="Units already completed"
              value={unitsCompleted}
              onChange={setUnitsCompleted}
              step={1}
              min={0}
              max={300}
            />
          </div>
        </section>

        {/* Course catalogue picker */}
        <section className="glass mb-6 rounded-3xl p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <BookOpen className="h-4 w-4 text-primary" /> Pick courses from your department
            </div>
            <button
              onClick={loadAllForLevel}
              className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
            >
              Load all {level}L courses
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">
                Department
              </span>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface/60 px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.faculty}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">
                Level
              </span>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as AcademicLevel)}
                className="w-full rounded-xl border border-border bg-surface/60 px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l} Level
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {catalogue.length === 0 && (
              <p className="col-span-full text-xs text-muted-foreground">
                No courses listed yet for this department/level. Add one manually below
                or pick a different level.
              </p>
            )}
            {catalogue.map((c) => {
              const added = selectedCodes.has(c.code.toUpperCase());
              return (
                <button
                  key={c.code + c.department}
                  onClick={() => addFromCatalogue(c.code, c.units)}
                  disabled={added}
                  className={`flex items-start justify-between gap-2 rounded-xl border p-3 text-left text-xs transition-all ${
                    added
                      ? "border-primary/40 bg-primary/10 text-muted-foreground"
                      : "border-border/60 bg-surface/40 hover:border-primary/50 hover:bg-surface/70"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground">{c.code}</div>
                    <div className="truncate text-muted-foreground">{c.title}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {c.units}u
                    </div>
                    <div className={`text-[10px] font-medium ${added ? "text-primary" : "text-muted-foreground"}`}>
                      {added ? "Added" : "+ Add"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Don't see your course? Add it manually with the "Add course" button below
            and type any code (e.g. ELT 312).
          </p>
        </section>

        {/* Forecaster */}
        <section className="grid gap-6 lg:grid-cols-5">

          <div className="glass space-y-4 rounded-3xl p-6 lg:col-span-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <GraduationCap className="h-4 w-4 text-primary" /> This
                semester's courses
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCustomAdd((s) => !s)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
                >
                  <Plus className="h-3.5 w-3.5" /> Add external course
                </button>
                <button
                  onClick={() => setCourses((cs) => [...cs, newCourse(cs.length + 1)])}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium hover:bg-accent/20"
                >
                  <Plus className="h-3.5 w-3.5" /> Add course
                </button>
              </div>
            </div>

            {/* Custom add inline form */}
            {showCustomAdd && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
                <div className="text-xs font-semibold text-primary">Add an external / elective course</div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="block">
                    <span className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">Course code</span>
                    <input
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value)}
                      placeholder="e.g. ELT 312, GST 107"
                      className="w-full rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">Units</span>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={customUnits}
                      onChange={(e) => setCustomUnits(Number(e.target.value))}
                      className="w-full rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </label>
                  <div className="flex items-end gap-2">
                    <button
                      onClick={addCustomCourse}
                      className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      Add to list
                    </button>
                    <button
                      onClick={() => setShowCustomAdd(false)}
                      className="shrink-0 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Header row */}
            <div className="grid grid-cols-12 gap-2 px-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              <div className="col-span-3">Course</div>
              <div className="col-span-2 text-center">Units</div>
              <div className="col-span-2 text-center">CA / 30</div>
              <div className="col-span-2 text-center">Exam / 70</div>
              <div className="col-span-2 text-center">Total → Grade</div>
              <div className="col-span-1" />
            </div>

            <div className="space-y-2">
              {courses.map((c, i) => {
                const total = totalScore(c);
                const letter = gradeFromScore(total);
                return (
                  <div
                    key={i}
                    className="grid grid-cols-12 items-center gap-2 rounded-xl border border-border/60 bg-surface/40 p-2"
                  >
                    <input
                      value={c.code}
                      onChange={(e) => updateCourse(i, { code: e.target.value })}
                      className="col-span-3 rounded-md bg-transparent px-2 py-1.5 text-sm outline-none focus:bg-surface"
                    />
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={c.units}
                      onChange={(e) =>
                        updateCourse(i, { units: Number(e.target.value) || 0 })
                      }
                      className="col-span-2 rounded-md bg-surface/60 px-2 py-1.5 text-center text-sm outline-none"
                    />
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={c.caScore}
                      onChange={(e) =>
                        updateCourse(i, {
                          caScore: clampN(Number(e.target.value), 0, 30),
                        })
                      }
                      className="col-span-2 rounded-md bg-surface/60 px-2 py-1.5 text-center text-sm outline-none"
                    />
                    <input
                      type="number"
                      min={0}
                      max={70}
                      value={c.examScore}
                      onChange={(e) =>
                        updateCourse(i, {
                          examScore: clampN(Number(e.target.value), 0, 70),
                        })
                      }
                      className="col-span-2 rounded-md bg-surface/60 px-2 py-1.5 text-center text-sm outline-none"
                    />
                    <div className="col-span-2 text-center">
                      <div className="font-display text-sm font-semibold">{total}</div>
                      <div className={`text-[10px] font-medium ${gradeColor(letter)}`}>
                        {letter} · {GRADE_POINTS[letter]} pts
                      </div>
                    </div>
                    <button
                      onClick={() => setCourses((cs) => cs.filter((_, idx) => idx !== i))}
                      className="col-span-1 flex justify-center text-muted-foreground hover:text-destructive"
                      aria-label="Remove course"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Grading scale legend */}
            <details className="rounded-xl border border-border/60 bg-surface/40 p-3 text-xs">
              <summary className="cursor-pointer font-medium">
                Grading scale (5.0) — how letters & points are derived
              </summary>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {GRADE_BANDS.map((b) => (
                  <div
                    key={b.letter}
                    className="rounded-lg border border-border/40 px-3 py-2"
                  >
                    <div className={`font-semibold ${gradeColor(b.letter)}`}>
                      {b.label}
                    </div>
                    <div className="text-muted-foreground">
                      Grade point: {GRADE_POINTS[b.letter]}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-muted-foreground">
                Formula: <span className="text-foreground">Total = CA + Exam</span>;{" "}
                <span className="text-foreground">
                  GPA = Σ(units × grade points) ÷ Σ(units)
                </span>;{" "}
                <span className="text-foreground">
                  CGPA = (prior CGPA × prior units + new quality points) ÷ total units
                </span>.
              </p>
            </details>
          </div>

          {/* Result */}
          <div className="glass space-y-5 rounded-3xl p-6 lg:col-span-2">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Projected CGPA · {studentId} · {gender === "M" ? "Male" : "Female"}
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-5xl font-semibold text-gradient">
                  {result.projectedCgpa.toFixed(2)}
                </span>
                <span
                  className={`text-sm font-medium ${
                    result.delta >= 0 ? "text-primary" : "text-destructive"
                  }`}
                >
                  {result.delta >= 0 ? "+" : ""}
                  {result.delta.toFixed(2)}
                </span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {result.classification}
              </div>
            </div>

            <Stat label="This semester GPA" value={result.semesterGpa.toFixed(2)} />
            <Stat label="Quality points earned" value={result.qualityPoints} />
            <Stat label="New units" value={result.totalNewUnits} />
            <Stat label="Total units after semester" value={unitsCompleted + result.totalNewUnits} />

            <div className="rounded-2xl border border-border/60 bg-surface/40 p-4">
              <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                Per-course breakdown
              </div>
              <div className="space-y-1.5 text-xs">
                {result.courses.map((c) => (
                  <div key={c.code} className="flex justify-between">
                    <span className="text-foreground">{c.code}</span>
                    <span className="text-muted-foreground">
                      {c.total}/100 ·{" "}
                      <span className={gradeColor(c.letter)}>{c.letter}</span> ·{" "}
                      {c.qualityPoints} qp
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function gradeColor(g: LetterGrade) {
  if (g === "A") return "text-emerald-400";
  if (g === "B") return "text-primary";
  if (g === "C") return "text-yellow-400";
  if (g === "D" || g === "E") return "text-orange-400";
  return "text-destructive";
}

function clampN(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
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

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
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
