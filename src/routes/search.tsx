import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Search, ArrowRight, X, BookOpen, User, Building2, Wrench, Home } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().optional().default(""),
  cat: z.enum(["all", "tools", "courses", "professors", "universities"]).optional().default("all"),
});

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: ({ match }) => ({
    meta: [
      {
        title: match.search.q ? `Search: ${match.search.q} — Augur` : "Search — Augur",
      },
      {
        name: "description",
        content:
          "Search Augur for tools, Nigerian university courses, professors and campuses. Live autocomplete — share URLs like /search?q=jamb.",
      },
    ],
  }),
  component: SearchPage,
});

type Category = "tools" | "courses" | "professors" | "universities";
type Entry = {
  to: string;
  title: string;
  desc: string;
  keywords: string[];
  category: Category;
};

const CATEGORY_META: Record<Category, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  tools: { label: "Tools", icon: Wrench },
  courses: { label: "Courses", icon: BookOpen },
  professors: { label: "Professors", icon: User },
  universities: { label: "Universities", icon: Building2 },
};

const TOOLS: Entry[] = [
  { to: "/", title: "Home", desc: "Augur.edu overview and getting started.", keywords: ["home", "landing"], category: "tools" },
  { to: "/predictor", title: "JAMB Predictor", desc: "Predict admission chances from JAMB, Post-UTME and O-Level scores.", keywords: ["jamb", "utme", "admission", "predict", "aggregate"], category: "tools" },
  { to: "/cgpa", title: "CGPA Forecaster", desc: "Project semester GPA and cumulative CGPA.", keywords: ["cgpa", "gpa", "grade", "calculator", "matric"], category: "tools" },
  { to: "/study-plan", title: "Study Plan", desc: "Personalised study roadmap for your target course.", keywords: ["study", "plan", "schedule", "revision"], category: "tools" },
  { to: "/chat", title: "Augur AI Chat", desc: "AI study buddy, PDF flashcards and read-to-earn XP.", keywords: ["chat", "ai", "flashcards", "pdf", "xp"], category: "tools" },
  { to: "/profile", title: "My Profile", desc: "Saved predictions, XP and level.", keywords: ["profile", "account", "stats"], category: "tools" },
  { to: "/settings", title: "Settings", desc: "Password, sign out and account management.", keywords: ["settings", "password", "signout"], category: "tools" },
  { to: "/how-it-works", title: "How it works", desc: "How Augur builds its predictions.", keywords: ["how", "faq", "about"], category: "tools" },
  { to: "/auth", title: "Sign in", desc: "Sign in or create an Augur account.", keywords: ["auth", "login", "signup"], category: "tools" },
];

const COURSES: Entry[] = [
  ["MTH 101", "General Mathematics I", "Sets, functions, real numbers, sequences."],
  ["MTH 102", "Elementary Mathematics II", "Trigonometry, complex numbers, matrices."],
  ["CSC 101", "Introduction to Computer Science", "History, hardware/software, basic programming."],
  ["CSC 201", "Computer Programming I", "Structured programming with C/Python."],
  ["CSC 202", "Data Structures", "Arrays, lists, trees, hashing."],
  ["CSC 301", "Algorithms and Complexity", "Big-O, sorting, graph algorithms."],
  ["PHY 101", "General Physics I", "Mechanics, thermodynamics."],
  ["CHM 101", "General Chemistry I", "Atomic structure, stoichiometry."],
  ["BIO 101", "General Biology I", "Cell biology, taxonomy."],
  ["GST 101", "Use of English I", "Communication skills."],
  ["GST 103", "Nigerian Peoples & Culture", "Ethnic groups and heritage."],
  ["ECO 101", "Principles of Economics I", "Micro fundamentals."],
  ["ACC 101", "Principles of Accounting I", "Double entry, ledgers."],
  ["LAW 101", "Nigerian Legal System", "Sources of Nigerian law."],
  ["ENG 201", "Engineering Mathematics", "Vector calculus, ODEs."],
  ["EEE 301", "Circuit Theory", "Kirchhoff, transient/steady state."],
  ["MEE 201", "Engineering Mechanics", "Statics and dynamics."],
  ["MBBS 200", "Anatomy & Physiology", "Human systems overview."],
].map(([code, title, desc]) => ({
  to: `/chat?t=`,
  title: `${code} — ${title}`,
  desc,
  keywords: [code.toLowerCase(), code.replace(" ", "").toLowerCase(), title.toLowerCase()],
  category: "courses" as const,
}));

const PROFESSORS: Entry[] = [
  ["Prof. A. Okafor", "Computer Science, UNILAG", "Algorithms & complexity"],
  ["Dr. Chinwe Adeyemi", "Mathematics, UI", "Numerical analysis"],
  ["Prof. Musa Ibrahim", "Physics, ABU", "Solid-state physics"],
  ["Dr. Bola Ajayi", "Economics, OAU", "Development economics"],
  ["Prof. Ngozi Eze", "Law, UNN", "Constitutional law"],
  ["Dr. Segun Balogun", "Electrical Eng., LASU", "Power systems"],
  ["Prof. Halima Yusuf", "Medicine, ABU", "Public health"],
  ["Dr. Emeka Nwosu", "Chemistry, UNIBEN", "Organic chemistry"],
].map(([name, dept, focus]) => ({
  to: `/chat?t=`,
  title: name,
  desc: `${dept} · ${focus}`,
  keywords: [name.toLowerCase(), dept.toLowerCase(), focus.toLowerCase()],
  category: "professors" as const,
}));

const UNIVERSITIES: Entry[] = [
  ["UNILAG", "University of Lagos", "Federal · Lagos"],
  ["LASU", "Lagos State University", "State · Lagos"],
  ["UI", "University of Ibadan", "Federal · Oyo"],
  ["OAU", "Obafemi Awolowo University", "Federal · Osun"],
  ["UNN", "University of Nigeria, Nsukka", "Federal · Enugu"],
  ["ABU", "Ahmadu Bello University", "Federal · Kaduna"],
  ["UNIBEN", "University of Benin", "Federal · Edo"],
  ["Covenant", "Covenant University", "Private · Ogun"],
  ["Babcock", "Babcock University", "Private · Ogun"],
  ["RUN", "Redeemer's University", "Private · Osun"],
].map(([short, full, meta]) => ({
  to: `/predictor`,
  title: `${full} (${short})`,
  desc: meta,
  keywords: [short.toLowerCase(), full.toLowerCase(), meta.toLowerCase()],
  category: "universities" as const,
}));

const INDEX: Entry[] = [...TOOLS, ...COURSES, ...PROFESSORS, ...UNIVERSITIES];

function scoreEntry(e: Entry, query: string): number {
  const hay = `${e.title} ${e.desc} ${e.keywords.join(" ")}`.toLowerCase();
  let score = 0;
  for (const term of query.split(/\s+/)) {
    if (!term) continue;
    if (hay.includes(term)) score += term.length;
    if (e.title.toLowerCase().includes(term)) score += 4;
    if (e.title.toLowerCase().startsWith(term)) score += 3;
  }
  return score;
}

function SearchPage() {
  const { q, cat } = Route.useSearch();
  const navigate = useNavigate();
  const [value, setValue] = useState(q ?? "");
  const [focused, setFocused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced URL sync so /search?q= updates while typing
  useEffect(() => {
    const t = setTimeout(() => {
      if ((value ?? "") !== (q ?? "")) {
        navigate({ to: "/search", search: { q: value.trim(), cat }, replace: true });
      }
    }, 200);
    return () => clearTimeout(t);
  }, [value]);

  // Sync input if URL changes externally
  useEffect(() => {
    if ((q ?? "") !== value) setValue(q ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const filtered = useMemo(() => {
    const query = value.trim().toLowerCase();
    const pool = cat === "all" ? INDEX : INDEX.filter((e) => e.category === cat);
    if (!query) return pool.slice(0, 12).map((e) => ({ ...e, score: 1 }));
    return pool
      .map((e) => ({ ...e, score: scoreEntry(e, query) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [value, cat]);

  const suggestions = filtered.slice(0, 8);

  useEffect(() => setActiveIdx(0), [value, cat]);

  function selectSuggestion(e: Entry) {
    navigate({ to: e.to });
  }

  function onKey(ev: React.KeyboardEvent) {
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (ev.key === "Enter") {
      if (suggestions[activeIdx]) {
        ev.preventDefault();
        selectSuggestion(suggestions[activeIdx]);
      }
    } else if (ev.key === "Escape") {
      setFocused(false);
    }
  }

  const CATS: Array<{ id: "all" | Category; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: "all", label: "All", icon: Home },
    { id: "tools", label: "Tools", icon: Wrench },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "professors", label: "Professors", icon: User },
    { id: "universities", label: "Universities", icon: Building2 },
  ];

  return (
    <div className="bg-grid min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold md:text-4xl">Search Augur</h1>
        <p className="mt-2 text-muted-foreground">
          Live autocomplete — tools, Nigerian courses, professors and campuses. Share URLs like{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/search?q=csc%20201</code>.
        </p>

        {/* Search box */}
        <div className="relative mt-8">
          <div className="flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              ref={inputRef}
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              onKeyDown={onKey}
              placeholder="Try 'CSC 201', 'UNILAG', 'Prof. Okafor' or 'jamb'…"
              className="flex-1 bg-transparent py-2 text-sm outline-none"
              aria-autocomplete="list"
              aria-expanded={focused}
            />
            {value && (
              <button
                onClick={() => {
                  setValue("");
                  inputRef.current?.focus();
                }}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                aria-label="Clear"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete dropdown */}
          {focused && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-30 mt-2 max-h-96 overflow-auto rounded-2xl border border-border bg-popover/95 p-1.5 shadow-xl backdrop-blur">
              {suggestions.map((s, i) => {
                const Icon = CATEGORY_META[s.category].icon;
                const active = i === activeIdx;
                return (
                  <li key={`${s.to}-${s.title}`}>
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectSuggestion(s)}
                      onMouseEnter={() => setActiveIdx(i)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm ${
                        active ? "bg-primary/15 text-foreground" : "hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-primary" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{s.title}</div>
                        <div className="truncate text-xs text-muted-foreground">{s.desc}</div>
                      </div>
                      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {CATEGORY_META[s.category].label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Filter chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          {CATS.map((c) => {
            const active = cat === c.id;
            return (
              <button
                key={c.id}
                onClick={() =>
                  navigate({ to: "/search", search: { q: value.trim(), cat: c.id }, replace: true })
                }
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                <c.icon className="h-3.5 w-3.5" />
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Full results */}
        <section className="mt-10">
          {value.trim() ? (
            filtered.length > 0 ? (
              <>
                <p className="mb-4 text-sm text-muted-foreground">
                  {filtered.length} result{filtered.length === 1 ? "" : "s"} for{" "}
                  <span className="font-medium text-foreground">"{value.trim()}"</span>
                  {cat !== "all" && (
                    <>
                      {" "}in <span className="font-medium text-foreground">{CATEGORY_META[cat as Category].label}</span>
                    </>
                  )}
                </p>
                <ul className="space-y-3">
                  {filtered.map((r) => {
                    const Icon = CATEGORY_META[r.category].icon;
                    return (
                      <li key={`${r.to}-${r.title}`}>
                        <Link
                          to={r.to}
                          className="group flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-card/40 p-5 transition-all hover:border-primary/40 hover:bg-card/70"
                        >
                          <div className="flex min-w-0 items-start gap-3">
                            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <div className="min-w-0">
                              <div className="font-semibold group-hover:text-primary">{r.title}</div>
                              <div className="mt-1 text-sm text-muted-foreground">{r.desc}</div>
                              <div className="mt-2 text-xs text-muted-foreground/70">
                                {CATEGORY_META[r.category].label}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <div className="rounded-2xl border border-border/60 bg-card/40 p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No results for <span className="font-medium text-foreground">"{value.trim()}"</span>. Try
                  "jamb", "csc", "unilag" or "prof".
                </p>
              </div>
            )
          ) : (
            <div>
              <p className="mb-4 text-sm text-muted-foreground">Popular right now</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {TOOLS.slice(0, 6).map((r) => (
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
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
