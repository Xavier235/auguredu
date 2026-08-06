import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: pageMeta({
      title: "How Augur Predicts Your Results | Augur.edu",
      description:
        "Inside the Augur model: the signals, the weights and how admission, CGPA and course-fit predictions are calculated.",
      path: "/how-it-works",
    }),
    links: canonical("/how-it-works"),
  }),

  component: HowPage,
});

function HowPage() {
  return (
    <div className="bg-grid min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-6 pt-16 pb-20">
        <div className="text-center">
          <div className="text-xs font-medium uppercase tracking-widest text-primary">
            The method
          </div>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-tight md:text-6xl">
            Honest math. <br />
            <span className="text-gradient">No black box.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Every number Augur shows you comes from a weighted combination of the inputs you provide. Here's the recipe.
          </p>
        </div>

        <div className="mt-16 space-y-12">
          <Section title="1. Grade & GPA forecast">
            <p>
              Your predicted score is the weighted average of six signals. We don't pretend any single number tells the whole story, so we combine them — and tell you the exact weights.
            </p>
            <Weights
              rows={[
                ["Current GPA", 30],
                ["Past test average", 25],
                ["Study hours per week", 18],
                ["Class attendance", 15],
                ["Sleep consistency", 7],
                ["Extracurriculars", 5],
              ]}
            />
            <p>
              Predicted GPA is the score, scaled to a 4.0 — useful for fast comparisons, not a substitute for an official transcript.
            </p>
          </Section>

          <Section title="2. Admission probability">
            <p>
              Each target tier has a baseline admit rate. We then lift or lower that baseline based on how far your predicted score sits above or below the tier's typical admit profile, with a smaller adjustment for extracurricular depth.
            </p>
            <div className="grid gap-3 md:grid-cols-4">
              {[
                { t: "Ivy / Elite", v: "8%" },
                { t: "Top 50", v: "22%" },
                { t: "State Flagship", v: "55%" },
                { t: "Regional", v: "78%" },
              ].map((b) => (
                <div key={b.t} className="rounded-2xl border border-border/60 bg-surface/40 p-5">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    {b.t}
                  </div>
                  <div className="mt-2 font-display text-3xl font-semibold text-gradient">
                    {b.v}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Baseline</div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="3. Major & career fit">
            <p>
              Your selected interests map to a curated list of majors. Each interest contributes a ranked vote; the top four become your recommendations, with a fit score that also factors in your overall predicted academic performance.
            </p>
          </Section>

          <Section title="4. What we don't do">
            <ul className="list-disc space-y-2 pl-5">
              <li>We don't sell your data. The form is local-only until you ask us to save it.</li>
              <li>We don't replace counselors. Augur is a sharper second opinion, not the verdict.</li>
              <li>We don't optimize for a flattering answer. The numbers are the numbers.</li>
            </ul>
          </Section>
        </div>

        <div className="mt-20 rounded-3xl bg-gradient-to-br from-primary to-accent p-12 text-center">
          <h2 className="font-display text-3xl font-semibold text-primary-foreground md:text-4xl">
            Ready to see your forecast?
          </h2>
          <Link
            to="/predictor"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 text-sm font-medium text-foreground hover:bg-surface-elevated"
          >
            Run the predictor
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-3xl p-8 md:p-10">
      <h2 className="font-display text-2xl font-semibold md:text-3xl">{title}</h2>
      <div className="mt-5 space-y-5 text-muted-foreground leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Weights({ rows }: { rows: [string, number][] }) {
  return (
    <div className="space-y-2.5">
      {rows.map(([label, w]) => (
        <div key={label} className="flex items-center gap-4">
          <div className="w-48 text-sm text-foreground">{label}</div>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              style={{ width: `${w * 3.2}%` }}
            />
          </div>
          <div className="w-10 text-right font-display text-sm font-semibold text-foreground">
            {w}%
          </div>
        </div>
      ))}
    </div>
  );
}
