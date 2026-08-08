import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/hooks/use-auth";
import { generateExam, type ExamQuestion } from "@/lib/academics.functions";
import { pageMeta, canonical } from "@/lib/seo";
import { toast } from "sonner";
import { Loader2, Timer, Play, RotateCcw, CheckCircle2, XCircle, Trophy } from "lucide-react";

export const Route = createFileRoute("/exam")({
  head: () => ({
    meta: pageMeta({
      title: "Live CBT Exam Simulator, JAMB and University Practice | Augur.edu",
      description:
        "Sit a timed computer based test for JAMB, Post UTME or any Nigerian university course code, get instant scoring and full explanations for every question.",
      path: "/exam",
    }),
    links: canonical("/exam"),
  }),
  component: ExamPage,
});

const JAMB_SUBJECTS = [
  "Use of English",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Government",
  "Literature in English",
  "Commerce",
  "Accounting",
  "Geography",
  "Agricultural Science",
  "Christian Religious Studies",
  "Islamic Studies",
];

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function ExamPage() {
  const { user } = useAuth();
  const build = useServerFn(generateExam);

  const [mode, setMode] = useState<"jamb" | "post-utme" | "course">("jamb");
  const [subject, setSubject] = useState("Use of English");
  const [custom, setCustom] = useState("");
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState<"easy" | "standard" | "hard">("standard");
  const [minutesPerQ, setMinutesPerQ] = useState(1);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<ExamQuestion[] | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [index, setIndex] = useState(0);
  const [left, setLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const running = !!questions && !submitted;

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setSubmitted(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  const score = useMemo(() => {
    if (!questions) return 0;
    return questions.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0);
  }, [questions, answers]);

  const topicName = mode === "course" || custom.trim() ? custom.trim() || subject : subject;

  async function start() {
    if (!user) {
      toast.error("Sign in to sit a practice test.");
      return;
    }
    const s = mode === "jamb" && !custom.trim() ? subject : custom.trim();
    if (!s || s.length < 2) {
      toast.error(mode === "course" ? "Enter a course code, for example CSC 201." : "Choose or type a subject.");
      return;
    }
    setLoading(true);
    try {
      const r = await build({ data: { subject: s, mode, count, difficulty } });
      setQuestions(r.questions);
      setTitle(r.title);
      setAnswers({});
      setIndex(0);
      setSubmitted(false);
      setLeft(r.questions.length * minutesPerQ * 60);
    } catch (e: any) {
      toast.error(e?.message ?? "Could not start that test.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setQuestions(null);
    setSubmitted(false);
    setAnswers({});
    setIndex(0);
  }

  const q = questions?.[index];
  const pct = questions?.length ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Live CBT exam simulator</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Sit a real timed computer based test. Pick JAMB, Post UTME screening or any university course code, answer
          under the clock, then see your score with a full explanation for every question.
        </p>

        {!questions && (
          <div className="glass mt-8 space-y-5 rounded-3xl p-6">
            <div>
              <h2 className="font-display text-lg font-semibold">Set up your test</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {(
                  [
                    ["jamb", "JAMB UTME"],
                    ["post-utme", "Post UTME"],
                    ["course", "University course"],
                  ] as const
                ).map(([m, label]) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                      mode === m ? "border-primary bg-primary/15 text-primary" : "border-border hover:bg-accent/10"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {mode === "jamb" && (
                <label className="text-sm">
                  <span className="text-muted-foreground">JAMB subject</span>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    {JAMB_SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label className="text-sm">
                <span className="text-muted-foreground">
                  {mode === "course" ? "Course code or title" : "Or type your own topic"}
                </span>
                <input
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  placeholder={mode === "course" ? "e.g. CSC 201 Computer Programming" : "e.g. Organic chemistry"}
                  className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="text-sm">
                <span className="text-muted-foreground">Questions</span>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  {[5, 10, 15, 20, 30, 40].map((n) => (
                    <option key={n} value={n}>
                      {n} questions
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className="text-muted-foreground">Difficulty</span>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  <option value="easy">Easy warm up</option>
                  <option value="standard">Standard exam level</option>
                  <option value="hard">Hard, top scorer level</option>
                </select>
              </label>
              <label className="text-sm">
                <span className="text-muted-foreground">Time per question</span>
                <select
                  value={minutesPerQ}
                  onChange={(e) => setMinutesPerQ(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  <option value={1}>1 minute (JAMB pace)</option>
                  <option value={2}>2 minutes</option>
                  <option value={3}>3 minutes</option>
                </select>
              </label>
            </div>

            <button
              onClick={start}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {loading ? "Building your test" : "Start test"}
            </button>
            {!user && (
              <p className="text-xs text-muted-foreground">
                <Link to="/auth" className="text-primary underline">
                  Sign in
                </Link>{" "}
                to sit a test and keep your scores.
              </p>
            )}
          </div>
        )}

        {questions && q && !submitted && (
          <div className="glass mt-8 rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold">{title}</h2>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${
                  left < 60 ? "border-destructive/50 bg-destructive/10 text-destructive" : "border-border"
                }`}
              >
                <Timer className="h-3.5 w-3.5" /> {fmt(left)}
              </span>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                style={{ width: `${((index + 1) / questions.length) * 100}%` }}
              />
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Question {index + 1} of {questions.length} · {q.topic}
            </p>
            <p className="mt-2 text-[15px] font-medium leading-relaxed">{q.q}</p>

            <div className="mt-4 grid gap-2">
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  onClick={() => setAnswers((a) => ({ ...a, [index]: oi }))}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    answers[index] === oi
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background/60 hover:bg-accent/10"
                  }`}
                >
                  <span className="mr-2 font-semibold text-muted-foreground">{"ABCD"[oi]}.</span>
                  {opt}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                disabled={index === 0}
                className="rounded-full border border-border px-4 py-1.5 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              {index < questions.length - 1 ? (
                <button
                  onClick={() => setIndex((i) => i + 1)}
                  className="rounded-full bg-primary px-5 py-1.5 text-sm font-semibold text-primary-foreground"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => setSubmitted(true)}
                  className="rounded-full bg-primary px-5 py-1.5 text-sm font-semibold text-primary-foreground"
                >
                  Submit test
                </button>
              )}
              <span className="ml-auto text-xs text-muted-foreground">
                Answered {Object.keys(answers).length}/{questions.length}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-7 w-7 rounded-md border text-[11px] font-semibold ${
                    i === index
                      ? "border-primary bg-primary text-primary-foreground"
                      : answers[i] !== undefined
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {questions && submitted && (
          <div className="mt-8 space-y-5">
            <div className="glass rounded-3xl p-6 text-center">
              <Trophy className="mx-auto h-8 w-8 text-primary" />
              <h2 className="mt-3 font-display text-2xl font-bold">
                {score} of {questions.length} correct
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {pct}% on {topicName}.{" "}
                {pct >= 70 ? "That is admission level, keep the pace." : "Review the explanations below and retake it."}
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> New test
                </button>
                <Link to="/study-plan" className="rounded-full border border-border px-5 py-2 text-sm font-semibold">
                  Back to study plan
                </Link>
              </div>
            </div>

            {questions.map((qq, i) => {
              const right = answers[i] === qq.answer;
              return (
                <div key={i} className="glass rounded-2xl p-5">
                  <div className="flex items-start gap-2">
                    {right ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    )}
                    <p className="text-sm font-medium">
                      {i + 1}. {qq.q}
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Your answer: {answers[i] !== undefined ? qq.options[answers[i]] : "not answered"}
                  </p>
                  <p className="mt-1 text-xs text-emerald-300">Correct: {qq.options[qq.answer]}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{qq.explanation}</p>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
