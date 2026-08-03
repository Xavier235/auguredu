import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/hooks/use-auth";
import { useServerFn } from "@tanstack/react-start";
import { listMyLibraryReads } from "@/lib/library.functions";
import { LIBRARY, LIBRARY_DEPARTMENTS } from "@/lib/library";
import { BookOpen, CheckCircle2, Clock, Crown, Filter, Sparkles } from "lucide-react";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Nigerian University Library — Read & Earn XP | Augur.edu" },
      {
        name: "description",
        content:
          "Read exam-focused course material from Nigerian universities, pass a quick comprehension check and earn verified reading XP for your study plan.",
      },
      { property: "og:title", content: "Nigerian University Library — Augur.edu" },
      {
        property: "og:description",
        content: "Course notes by department and level, with verified reading rewards for your study plan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const { user } = useAuth();
  const readsFn = useServerFn(listMyLibraryReads);
  const [reads, setReads] = useState<any[]>([]);
  const [dept, setDept] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!user) {
      setReads([]);
      return;
    }
    readsFn()
      .then((r) => setReads(r as any[]))
      .catch(() => setReads([]));
  }, [user?.id]);

  const verifiedIds = useMemo(
    () => new Set(reads.filter((r) => r.verified).map((r) => r.item_id)),
    [reads],
  );

  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return LIBRARY.filter(
      (i) =>
        (dept === "all" || i.department === dept) &&
        (level === "all" || i.level === level) &&
        (!needle ||
          i.title.toLowerCase().includes(needle) ||
          i.courseCode.toLowerCase().includes(needle) ||
          i.department.toLowerCase().includes(needle)),
    );
  }, [dept, level, q]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" /> Read → pass the check → earn XP
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Nigerian University Library</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Exam-focused course material across faculties and levels. Every reading ends with a short comprehension
            check — pass it and the reading is verified in your study plan.
          </p>
        </div>

        <div className="glass mb-6 flex flex-wrap items-center gap-3 rounded-2xl p-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search course code or topic…"
            className="min-w-[12rem] flex-1 rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="all">All departments</option>
            {LIBRARY_DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="all">All levels</option>
            {["100", "200", "300", "400"].map((l) => (
              <option key={l} value={l}>
                {l} level
              </option>
            ))}
          </select>
        </div>

        {items.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
            No material matches those filters yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((i) => {
              const done = verifiedIds.has(i.id);
              return (
                <Link
                  key={i.id}
                  to="/library/$itemId"
                  params={{ itemId: i.id }}
                  className="glass group flex flex-col rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      {i.courseCode}
                    </span>
                    {i.premium ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                        <Crown className="h-3 w-3" /> Pro
                      </span>
                    ) : done ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    ) : null}
                  </div>
                  <h2 className="font-display text-base font-semibold leading-snug">{i.title}</h2>
                  <p className="mt-1.5 flex-1 text-xs text-muted-foreground">{i.summary}</p>
                  <div className="mt-4 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> {i.department} · {i.level}L
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {i.minutes} min
                    </span>
                    <span className="ml-auto font-semibold text-primary">+{i.xp} XP</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
