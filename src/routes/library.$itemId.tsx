import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/hooks/use-auth";
import { useServerFn } from "@tanstack/react-start";
import { verifyLibraryRead } from "@/lib/library.functions";
import { generateCourseReading, type GeneratedReading } from "@/lib/library-ai.functions";
import { getLibraryItem } from "@/lib/library";
import { getLibraryEntry, resolveEntry } from "@/lib/library-catalogue";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Clock, Crown, Loader2, MessageCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/library/$itemId")({
  head: ({ params }) => {
    const curated = getLibraryItem(params.itemId);
    const entry = getLibraryEntry(params.itemId);
    const code = curated?.courseCode ?? entry?.code ?? "Course";
    const name = curated?.title ?? entry?.title ?? "Reading";
    const title = `${code}: ${name} — Augur.edu Library`;
    const description =
      curated?.summary ??
      `Read full ${code} lecture notes for Nigerian universities, check your understanding and earn verified study XP on Augur.edu.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: LibraryReader,
});

function LibraryReader() {
  const { itemId } = useParams({ from: "/library/$itemId" });
  const curated = getLibraryItem(itemId);
  const entry = resolveEntry(itemId);
  const { user } = useAuth();
  const verify = useServerFn(verifyLibraryRead);
  const buildReading = useServerFn(generateCourseReading);

  const started = useRef(Date.now());
  const [seconds, setSeconds] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [generated, setGenerated] = useState<GeneratedReading | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const needsGeneration = !curated && !!entry;

  useEffect(() => {
    started.current = Date.now();
    setAnswers({});
    setResult(null);
    const t = setInterval(() => setSeconds(Math.round((Date.now() - started.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, [itemId]);

  useEffect(() => {
    if (!needsGeneration || !entry) return;
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    buildReading({ data: { entryId: entry.id } })
      .then((r) => {
        if (!cancelled) setGenerated(r as GeneratedReading);
      })
      .catch((e: any) => {
        if (!cancelled) setLoadError(e?.message ?? "Could not open this reading.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [itemId, user?.id]);

  if (!curated && !entry) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Reading not found</h1>
          <Link to="/library" className="mt-4 inline-block text-sm text-primary underline">
            Back to the library
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const code = curated?.courseCode ?? entry!.code;
  const title = curated?.title ?? entry!.title;
  const department = curated?.department ?? entry!.department;
  const faculty = curated?.faculty ?? entry!.faculty;
  const level = curated?.level ?? entry!.level;
  const minutes = curated?.minutes ?? entry!.minutes;
  const xp = curated?.xp ?? entry!.xp;
  const premium = curated?.premium ?? false;
  const summary = curated?.summary ?? generated?.summary ?? "";
  const sections = curated?.sections ?? generated?.sections ?? [];
  const quiz = curated?.quiz ?? generated?.quiz ?? [];
  const verifyId = curated?.id ?? entry!.id;

  const allAnswered = quiz.length > 0 && quiz.every((_, i) => answers[i] !== undefined);

  async function submit() {
    if (!user) {
      toast.error("Sign in to earn verified reading XP.");
      return;
    }
    setSubmitting(true);
    try {
      const correct = quiz.reduce((n, qz, i) => n + (answers[i] === qz.answer ? 1 : 0), 0);
      const r = await verify({
        data: { itemId: verifyId, secondsRead: seconds, correct, total: quiz.length },
      });
      setResult(r);
      if ((r as any).verified && (r as any).awarded > 0) {
        toast.success(`Verified, +${(r as any).awarded} XP added to your study plan.`);
      } else if ((r as any).verified) {
        toast.success("Verified. You already earned XP for this reading.");
      } else {
        toast.error((r as any).reason ?? "Not verified yet.");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Could not verify this reading.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          to="/library"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Library
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
            {code}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {department} · {level} level · {faculty}
          </span>
          {premium && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
              <Crown className="h-3 w-3" /> Pro material
            </span>
          )}
        </div>

        <h1 className="mt-3 font-display text-3xl font-bold leading-tight">{title}</h1>
        {summary && <p className="mt-2 text-sm text-muted-foreground">{summary}</p>}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {minutes} min read
          </span>
          <span>
            Time on page: {Math.floor(seconds / 60)}m {seconds % 60}s
          </span>
          <span className="font-semibold text-primary">+{xp} XP when verified</span>
          <Link
            to="/chat"
            className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 hover:bg-accent/10"
          >
            <MessageCircle className="h-3 w-3" /> Ask Augur about {code}
          </Link>
        </div>

        {needsGeneration && !user && (
          <div className="glass mt-8 rounded-2xl p-8 text-center text-sm text-muted-foreground">
            Sign in to open the full notes for {code} and earn verified reading XP.
            <div className="mt-4">
              <Link to="/auth" className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground">
                Sign in
              </Link>
            </div>
          </div>
        )}

        {loading && (
          <div className="glass mt-8 flex items-center gap-3 rounded-2xl p-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Augur is writing the {code} notes for you, this takes a few seconds.
          </div>
        )}

        {loadError && (
          <div className="mt-8 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {loadError}
          </div>
        )}

        {sections.length > 0 && (
          <article className="mt-8 space-y-7">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="font-display text-lg font-semibold">{s.heading}</h2>
                <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-muted-foreground">{s.body}</p>
              </section>
            ))}
          </article>
        )}

        {generated?.keyTerms?.length ? (
          <div className="glass mt-8 rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold">Key terms</h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              {generated.keyTerms.map((t) => (
                <div key={t.term} className="rounded-xl border border-border bg-background/50 p-3">
                  <dt className="text-sm font-semibold">{t.term}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{t.meaning}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        {generated?.examTips?.length ? (
          <div className="glass mt-6 rounded-2xl p-6">
            <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
              <Sparkles className="h-4 w-4 text-primary" /> Exam tips
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {generated.examTips.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary">{i + 1}.</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {quiz.length > 0 && (
          <div className="glass mt-10 rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold">Comprehension check</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Score at least 67% after genuinely reading to verify this material in your study plan.
            </p>

            <div className="mt-5 space-y-5">
              {quiz.map((qz, i) => (
                <div key={i}>
                  <div className="text-sm font-medium">
                    {i + 1}. {qz.q}
                  </div>
                  <div className="mt-2 grid gap-2">
                    {qz.options.map((opt, oi) => {
                      const selected = answers[i] === oi;
                      const reveal = !!result;
                      const isRight = oi === qz.answer;
                      return (
                        <button
                          key={oi}
                          onClick={() => !result && setAnswers((a) => ({ ...a, [i]: oi }))}
                          className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                            reveal && isRight
                              ? "border-emerald-500/50 bg-emerald-500/10"
                              : selected
                                ? "border-primary bg-primary/10"
                                : "border-border bg-background/60 hover:bg-accent/10"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {result ? (
              <div
                className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
                  result.verified
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-amber-500/40 bg-amber-500/10 text-amber-300"
                }`}
              >
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Score {result.scorePct}%
                  {result.verified ? ", reading verified" : ", not verified yet"}
                </div>
                {!result.verified && result.reason && <div className="mt-1 text-xs">{result.reason}</div>}
                <div className="mt-3 flex gap-2">
                  <Link
                    to="/study-plan"
                    className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground"
                  >
                    Go to study plan
                  </Link>
                  {!result.verified && (
                    <button
                      onClick={() => {
                        setResult(null);
                        setAnswers({});
                      }}
                      className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold"
                    >
                      Try again
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={submit}
                disabled={!allAnswered || submitting}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Verify my reading
              </button>
            )}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
