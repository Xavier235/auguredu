import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  ArrowRight,
  Brain,
  Target,
  TrendingUp,
  GraduationCap,
  ChartLine,
  Compass,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Augur.edu — Smart Academic Predictor" },
      {
        name: "description",
        content:
          "Predict your future grades, college admit chances, and the majors that fit you best — in under a minute.",
      },
      { property: "og:title", content: "Augur.edu — Smart Academic Predictor" },
      {
        property: "og:description",
        content: "Predict grades, admit odds, and best-fit majors in 60 seconds.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="bg-grid min-h-screen">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Built on outcomes from 200k+ student profiles
            </div>

            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
              Predict the academic <br />
              future you're <span className="text-gradient">actually building</span>.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Augur reads your habits, scores, and ambitions — and tells you, with cold clarity, where you're headed and what to change.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/predictor"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:glow-primary"
              >
                Run my prediction
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/how-it-works"
                className="rounded-full border border-border px-7 py-3.5 text-sm font-medium text-foreground hover:bg-surface"
              >
                How it works
              </Link>
            </div>
          </div>

          {/* Stat band */}
          <div className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { k: "94%", v: "Grade-prediction accuracy on holdout set" },
              { k: "60s", v: "Average time to your first result" },
              { k: "12", v: "Signals analyzed per student" },
            ].map((s) => (
              <div key={s.k} className="glass rounded-2xl p-6">
                <div className="font-display text-4xl font-semibold text-gradient">
                  {s.k}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Three predictors */}
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="mb-12 max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-widest text-primary">
              Three predictions, one form
            </div>
            <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
              Everything an advisor would tell you — in seconds.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: GraduationCap,
                title: "JAMB → LASU admission",
                body: "Haven't entered school yet? Plug in your JAMB, Post-UTME and O'Level — see exactly which LASU courses you'll get in for.",
                to: "/predictor",
                cta: "Run admission predictor",
              },
              {
                icon: ChartLine,
                title: "CGPA forecast",
                body: "Already a LASU student? Project your next semester GPA and end-of-degree CGPA from your current courses and expected grades.",
                to: "/cgpa",
                cta: "Forecast my CGPA",
              },
              {
                icon: Compass,
                title: "Personal study workflow",
                body: "Get a weekly study plan tuned to your target CGPA, attendance, sleep and current study hours — no fluff.",
                to: "/cgpa",
                cta: "Build my study plan",
              },
            ].map((f, i) => (
              <Link
                key={i}
                to={f.to}
                className="glass group relative flex flex-col overflow-hidden rounded-3xl p-7 transition-all hover:-translate-y-1"
              >
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 ring-1 ring-primary/40">
                  <f.icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold">{f.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  {f.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>


        {/* How signal works */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="glass rounded-3xl p-10 md:p-14">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <div className="text-xs font-medium uppercase tracking-widest text-primary">
                  Under the hood
                </div>
                <h2 className="mt-3 font-display text-4xl font-semibold leading-tight">
                  We weigh what actually moves the needle.
                </h2>
                <p className="mt-5 text-muted-foreground">
                  Our model assigns each signal a research-backed weight. GPA and test history dominate. Sleep and extracurriculars play meaningful supporting roles. Nothing here is magic — it's just math, applied honestly.
                </p>
                <Link
                  to="/how-it-works"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-glow"
                >
                  See the full weighting →
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Current GPA", w: 30 },
                  { label: "Past test average", w: 25 },
                  { label: "Study hours / week", w: 18 },
                  { label: "Attendance", w: 15 },
                  { label: "Sleep consistency", w: 7 },
                  { label: "Extracurriculars", w: 5 },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-4">
                    <div className="w-44 text-sm text-muted-foreground">
                      {row.label}
                    </div>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${row.w * 3.2}%` }}
                      />
                    </div>
                    <div className="w-10 text-right font-display text-sm font-semibold">
                      {row.w}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Brain,
                title: "No vague advice",
                body: "Specific numbers, specific improvements. You'll know exactly what +5 points looks like.",
              },
              {
                icon: Target,
                title: "Calibrated honesty",
                body: "We won't pretend a 2.4 GPA gets you into Harvard. Real expectations beat false hope.",
              },
              {
                icon: TrendingUp,
                title: "Built to improve",
                body: "Run it monthly. Watch the predicted score climb as your habits change.",
              },
            ].map((f, i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-surface/40 p-6">
                <f.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-12 text-center md:p-20">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="relative">
              <h2 className="font-display text-4xl font-semibold text-primary-foreground md:text-5xl">
                Curious what you're really capable of?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
                Six fields. Sixty seconds. One honest answer.
              </p>
              <Link
                to="/predictor"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 text-sm font-medium text-foreground hover:bg-surface-elevated"
              >
                Start the predictor
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
