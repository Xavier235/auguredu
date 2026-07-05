import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Search, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().optional().default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: ({ match }) => ({
    meta: [
      {
        title: match.search.q
          ? `Search: ${match.search.q} — Augur`
          : "Search — Augur",
      },
      {
        name: "description",
        content: "Search across Augur's tools, predictors and resources.",
      },
    ],
  }),
  component: SearchPage,
});

type Entry = {
  to: string;
  title: string;
  desc: string;
  keywords: string[];
};

const INDEX: Entry[] = [
  {
    to: "/",
    title: "Home",
    desc: "Augur.edu overview and getting started.",
    keywords: ["home", "landing", "augur", "start"],
  },
  {
    to: "/predictor",
    title: "JAMB Predictor",
    desc: "Predict admission chances from your JAMB and O-level scores.",
    keywords: ["jamb", "utme", "admission", "predict", "score", "aggregate", "university"],
  },
  {
    to: "/cgpa",
    title: "CGPA Calculator",
    desc: "Compute and project your cumulative GPA across semesters.",
    keywords: ["cgpa", "gpa", "grade", "calculator", "semester"],
  },
  {
    to: "/study-plan",
    title: "Study Plan",
    desc: "Get a personalised study roadmap for your target course.",
    keywords: ["study", "plan", "schedule", "roadmap", "revision"],
  },
  {
    to: "/chat",
    title: "Chat (Premium — Coming Soon)",
    desc: "Professor & peer chat, flashcards and PDF rewards.",
    keywords: ["chat", "message", "professor", "peers", "flashcards", "pdf", "premium"],
  },
  {
    to: "/profile",
    title: "My Profile",
    desc: "Your saved profile, stats and prediction history.",
    keywords: ["profile", "account", "avatar", "stats", "history"],
  },
  {
    to: "/settings",
    title: "Settings",
    desc: "Change your password, sign out and manage account.",
    keywords: ["settings", "password", "sign out", "account", "security"],
  },
  {
    to: "/how-it-works",
    title: "How it works",
    desc: "Learn how Augur builds its predictions.",
    keywords: ["how", "works", "explain", "faq", "about"],
  },
  {
    to: "/auth",
    title: "Sign in",
    desc: "Sign in or create your Augur account.",
    keywords: ["auth", "login", "signin", "signup", "register"],
  },
];

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [value, setValue] = useState(q ?? "");

  const results = useMemo(() => {
    const query = (q ?? "").trim().toLowerCase();
    if (!query) return [];
    return INDEX.map((e) => {
      const hay = `${e.title} ${e.desc} ${e.keywords.join(" ")}`.toLowerCase();
      let score = 0;
      for (const term of query.split(/\s+/)) {
        if (!term) continue;
        if (hay.includes(term)) score += term.length;
        if (e.title.toLowerCase().includes(term)) score += 3;
      }
      return { ...e, score };
    })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [q]);

  return (
    <div className="bg-grid min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold md:text-4xl">
          Search Augur
        </h1>
        <p className="mt-2 text-muted-foreground">
          Find any tool, page or feature. Tip: you can share the URL{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            /search?q=jamb
          </code>{" "}
          directly.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/search", search: { q: value.trim() } });
          }}
          className="mt-8 flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search predictors, tools, pages…"
            className="flex-1 bg-transparent py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Search
          </button>
        </form>

        <section className="mt-10">
          {q ? (
            results.length > 0 ? (
              <>
                <p className="mb-4 text-sm text-muted-foreground">
                  {results.length} result{results.length === 1 ? "" : "s"} for{" "}
                  <span className="font-medium text-foreground">"{q}"</span>
                </p>
                <ul className="space-y-3">
                  {results.map((r) => (
                    <li key={r.to}>
                      <Link
                        to={r.to}
                        className="group flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-card/40 p-5 transition-all hover:border-primary/40 hover:bg-card/70"
                      >
                        <div>
                          <div className="font-semibold group-hover:text-primary">
                            {r.title}
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {r.desc}
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground/70">
                            {r.to}
                          </div>
                        </div>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="rounded-2xl border border-border/60 bg-card/40 p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No results for{" "}
                  <span className="font-medium text-foreground">"{q}"</span>.
                  Try "jamb", "cgpa", "study plan" or "chat".
                </p>
              </div>
            )
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {INDEX.slice(0, 6).map((r) => (
                <Link
                  key={r.to}
                  to={r.to}
                  className="rounded-xl border border-border/60 bg-card/40 p-4 text-sm hover:border-primary/40"
                >
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{r.desc}</div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
