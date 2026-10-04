import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/hooks/use-auth";
import { getWeaknessReport } from "@/lib/exam.functions";
import { pageMeta, canonical } from "@/lib/seo";
import { Loader2, TrendingDown, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/weakness")({
  head: () => ({
    meta: pageMeta({
      title: "My Weakness Report, Topics to Revise | Augur.edu",
      description:
        "See the JAMB, WAEC, NECO and university topics you keep missing in practice tests, and what to revise next.",
      path: "/weakness",
    }),
    links: canonical("/weakness"),
  }),
  component: WeaknessPage,
});

function Bar({ pct }: { pct: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-border">
      <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${pct}%` }} />
    </div>
  );
}

function WeaknessPage() {
  const { user, loading } = useAuth() as any;
  const fetchReport = useServerFn(getWeaknessReport);
  const q = useQuery({ queryKey: ["weakness", user?.id], queryFn: () => fetchReport(), enabled: !!user });
  const r = q.data;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Your weakness report</h1>
        <p className="mt-2 text-sm text-muted-foreground">Built from every practice test you finish in Exams.</p>

        {!user && !loading ? (
          <p className="mt-8 text-sm">
            <Link to="/auth" className="text-primary underline">Sign in</Link> to see your report.
          </p>
        ) : q.isLoading || !r ? (
          <Loader2 className="mt-8 h-5 w-5 animate-spin text-muted-foreground" />
        ) : r.attempts === 0 ? (
          <div className="glass mt-8 rounded-3xl p-6 text-sm">
            No tests yet.{" "}
            <Link to="/exam" className="text-primary underline">Sit your first practice test</Link> and come back.
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            <div className="glass grid grid-cols-3 gap-3 rounded-3xl p-6 text-center">
              <div><div className="text-2xl font-bold">{r.attempts}</div><div className="text-xs text-muted-foreground">Tests</div></div>
              <div><div className="text-2xl font-bold">{r.answered}</div><div className="text-xs text-muted-foreground">Questions</div></div>
              <div><div className="text-2xl font-bold">{r.pct}%</div><div className="text-xs text-muted-foreground">Accuracy</div></div>
            </div>

            <section className="glass rounded-3xl p-6">
              <h2 className="inline-flex items-center gap-2 font-semibold"><TrendingDown className="h-4 w-4 text-destructive" /> Revise these first</h2>
              {r.weak.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No weak topics. Great work.</p> : (
                <div className="mt-3 space-y-3">
                  {r.weak.map((t) => (
                    <div key={t.topic}>
                      <div className="flex justify-between text-sm"><span>{t.topic}</span><span>{t.correct}/{t.total} · {t.pct}%</span></div>
                      <Bar pct={t.pct} />
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="glass rounded-3xl p-6">
              <h2 className="inline-flex items-center gap-2 font-semibold"><TrendingUp className="h-4 w-4 text-primary" /> Your strong topics</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {r.strong.map((t) => (
                  <span key={t.topic} className="rounded-full border border-border px-3 py-1 text-xs">{t.topic} · {t.pct}%</span>
                ))}
              </div>
            </section>

            <section className="glass rounded-3xl p-6">
              <h2 className="font-semibold">By subject</h2>
              <div className="mt-3 space-y-3">
                {r.subjects.map((s) => (
                  <div key={s.subject}>
                    <div className="flex justify-between text-sm"><span>{s.subject}</span><span>{s.pct}%</span></div>
                    <Bar pct={s.pct} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
