import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { listMyLibraryReads } from "@/lib/library.functions";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, CheckCircle2, Clock, Library, ArrowRight } from "lucide-react";

type Read = {
  item_id: string;
  item_title: string;
  department: string | null;
  level: string | null;
  seconds_read: number;
  quiz_score: number;
  verified: boolean;
  updated_at: string;
};

export function LibraryReadingLog() {
  const { user } = useAuth();
  const readsFn = useServerFn(listMyLibraryReads);
  const [reads, setReads] = useState<Read[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setReads([]);
      return;
    }
    setLoading(true);
    readsFn()
      .then((r) => setReads((r as Read[]) ?? []))
      .catch(() => setReads([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const stats = useMemo(() => {
    const s = readingStats(reads as any);
    return { verified: s.verifiedCount, minutes: s.minutes, avg: s.avgScore, streak: s.currentStreak };
  }, [reads]);

  return (
    <section className="glass mb-8 rounded-3xl p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Library className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-semibold">Courses you have read</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Every course you open in the library and pass the check on is documented here.
          </p>
        </div>
        <Link
          to="/library"
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-accent/10"
        >
          Open the library <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {!user ? (
        <div className="mt-6 rounded-2xl border border-border/60 bg-surface/40 p-6 text-center text-sm text-muted-foreground">
          Sign in to track the courses you read and count them towards your study plan.
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 text-center md:grid-cols-4">
            <Stat label="Verified reads" value={stats.verified} />
            <Stat label="Minutes read" value={stats.minutes} />
            <Stat label="Avg check score" value={`${stats.avg}%`} />
            <Stat label="Reading streak" value={`${stats.streak}d`} />
          </div>

          <div className="mt-5 space-y-2">
            {loading && <div className="text-sm text-muted-foreground">Loading your reading log…</div>}
            {!loading && reads.length === 0 && (
              <div className="rounded-2xl border border-border/60 bg-surface/40 p-6 text-center text-sm text-muted-foreground">
                Nothing read yet. Tap any course in the library, read it end to end and it lands here.
              </div>
            )}
            {reads.slice(0, 8).map((r) => (
              <Link
                key={r.item_id}
                to="/library/$itemId"
                params={{ itemId: r.item_id }}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-surface/40 px-4 py-3 transition-colors hover:bg-accent/10"
              >
                <BookOpen className="h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{r.item_title}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {[r.department, r.level ? `${r.level} level` : null].filter(Boolean).join(" · ")}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {Math.max(1, Math.round((r.seconds_read ?? 0) / 60))}m
                </span>
                {r.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" /> Verified {r.quiz_score}%
                  </span>
                ) : (
                  <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                    In progress
                  </span>
                )}
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-surface/40 p-3">
      <div className="font-display text-lg font-semibold">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}
