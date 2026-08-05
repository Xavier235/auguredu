import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { listMyLibraryReads } from "@/lib/library.functions";
import {
  buildBadges,
  isBadgeEarned,
  nextReadMilestone,
  readingStats,
  type ReadRow,
} from "@/lib/reading-milestones";
import { Crown, Flame, Lock, Sparkles } from "lucide-react";

export function ReadingBadges({ premiumActive }: { premiumActive: boolean }) {
  const readsFn = useServerFn(listMyLibraryReads);
  const [reads, setReads] = useState<ReadRow[]>([]);

  useEffect(() => {
    readsFn()
      .then((r) => setReads((r as ReadRow[]) ?? []))
      .catch(() => setReads([]));
  }, []);

  const stats = useMemo(() => readingStats(reads), [reads]);
  const badges = useMemo(() => buildBadges(stats), [stats]);
  const earned = badges.filter((b) => isBadgeEarned(b, premiumActive));
  const target = nextReadMilestone(stats.verifiedCount);
  const pct = Math.min(100, Math.round((stats.verifiedCount / target) * 100));

  return (
    <section className="glass mt-6 rounded-3xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
            <Sparkles className="h-5 w-5 text-primary" /> Reading milestones
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Earned from the courses you have actually read and verified in the library.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-400/10 px-3 py-1.5 text-sm font-medium text-orange-300">
          <Flame className="h-4 w-4" /> {stats.currentStreak} day reading streak
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Mini label="Verified reads" value={stats.verifiedCount} />
        <Mini label="Minutes read" value={stats.minutes} />
        <Mini label="Avg check" value={`${stats.avgScore}%`} />
        <Mini label="Badges earned" value={`${earned.length}/${badges.length}`} />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>Next milestone: {target} verified reads</span>
          <span>
            {stats.verifiedCount}/{target}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-400 via-primary to-accent transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {badges.map((b) => {
          const done = isBadgeEarned(b, premiumActive);
          const locked = b.premium && !premiumActive;
          const p = Math.min(100, Math.round((b.progress / b.target) * 100));
          return (
            <div
              key={b.id}
              className={`rounded-2xl border p-4 transition-colors ${
                done
                  ? "border-primary/50 bg-gradient-to-br from-primary/15 to-accent/10"
                  : "border-border/60 bg-surface/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`text-3xl ${done ? "" : "opacity-40 grayscale"}`}>{b.emoji}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold">{b.title}</span>
                    {b.premium && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-medium text-amber-300">
                        <Crown className="h-2.5 w-2.5" /> Premium
                      </span>
                    )}
                    {done && <span className="text-[10px] font-semibold text-primary">Earned 🎉</span>}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{b.blurb}</div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background/60">
                    <div
                      className={`h-full rounded-full ${done ? "bg-primary" : "bg-muted-foreground/40"}`}
                      style={{ width: `${p}%` }}
                    />
                  </div>
                  {locked && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-amber-300">
                      <Lock className="h-3 w-3" /> Unlocks with premium
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!premiumActive && (
        <div className="mt-5 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
          Premium unlocks streak badges, cross department milestones and celebratory rewards.{" "}
          <Link to="/upgrade" className="font-semibold underline">
            Go premium
          </Link>
        </div>
      )}
    </section>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-surface/40 p-3 text-center">
      <div className="font-display text-lg font-semibold">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}
