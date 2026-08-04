import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/hooks/use-auth";
import { useServerFn } from "@tanstack/react-start";
import { listMyLibraryReads } from "@/lib/library.functions";
import { LIBRARY_INDEX, LIBRARY_DEPT_OPTIONS, LIBRARY_FACULTIES } from "@/lib/library-catalogue";
import { BookOpen, CheckCircle2, Clock, Filter, Sparkles, Star } from "lucide-react";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "NUC Course Library — Read Any Course & Earn XP | Augur.edu" },
      {
        name: "description",
        content:
          "Open any Nigerian university course code from the NUC catalogue, read full lecture notes written by Augur, pass the comprehension check and earn verified study XP.",
      },
      { property: "og:title", content: "NUC Course Library — Augur.edu" },
      {
        property: "og:description",
        content: "Every NUC course code, readable notes, comprehension checks and verified reading XP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LibraryPage,
});

const LEVELS = ["100", "200", "300", "400", "500", "600"];

function LibraryPage() {
  const { user } = useAuth();
  const readsFn = useServerFn(listMyLibraryReads);
  const [reads, setReads] = useState<any[]>([]);
  const [faculty, setFaculty] = useState("all");
  const [dept, setDept] = useState("all");
  const [level, setLevel] = useState("all");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(60);

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

  const depts = useMemo(
    () => LIBRARY_DEPT_OPTIONS.filter((d) => faculty === "all" || d.faculty === faculty),
    [faculty],
  );

  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return LIBRARY_INDEX.filter(
      (i) =>
        (faculty === "all" || i.faculty === faculty) &&
        (dept === "all" || i.departmentId === dept) &&
        (level === "all" || i.level === level) &&
        (!needle ||
          i.title.toLowerCase().includes(needle) ||
          i.code.toLowerCase().includes(needle) ||
          i.department.toLowerCase().includes(needle)),
    );
  }, [faculty, dept, level, q]);

  useEffect(() => setLimit(60), [faculty, dept, level, q]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" /> {LIBRARY_INDEX.length} NUC course codes, read and earn XP
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Nigerian University Library</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Every course code in the NUC catalogue, from 100 level to 600 level. Open any course and Augur writes the
            full lecture notes for it, with key terms, exam tips and a comprehension check that verifies the reading in
            your study plan.
          </p>
        </div>

        <div className="glass mb-6 flex flex-wrap items-center gap-3 rounded-2xl p-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search course code or topic, e.g. CSC 201"
            className="min-w-[12rem] flex-1 rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <select
            value={faculty}
            onChange={(e) => {
              setFaculty(e.target.value);
              setDept("all");
            }}
            className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="all">All faculties</option>
            {LIBRARY_FACULTIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="all">All departments</option>
            {depts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="all">All levels</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l} level
              </option>
            ))}
          </select>
        </div>

        <p className="mb-3 text-xs text-muted-foreground">
          Showing {Math.min(limit, items.length)} of {items.length} courses
        </p>

        {items.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
            No course matches those filters yet.
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.slice(0, limit).map((i) => {
                const done = verifiedIds.has(i.id) || (i.curatedId ? verifiedIds.has(i.curatedId) : false);
                return (
                  <Link
                    key={i.id}
                    to="/library/$itemId"
                    params={{ itemId: i.id }}
                    className="glass group flex flex-col rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                        {i.code}
                      </span>
                      {done ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </span>
                      ) : i.curated ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                          <Star className="h-3 w-3" /> Curated
                        </span>
                      ) : null}
                    </div>
                    <h2 className="font-display text-base font-semibold leading-snug">{i.title}</h2>
                    <p className="mt-1.5 flex-1 text-xs text-muted-foreground">
                      {i.department} · {i.faculty}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <BookOpen className="h-3 w-3" /> {i.level}L · {i.units} units
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
            {limit < items.length && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setLimit((l) => l + 60)}
                  className="rounded-full border border-border px-5 py-2 text-sm font-semibold hover:bg-accent/10"
                >
                  Load more courses
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
