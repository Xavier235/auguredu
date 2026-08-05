/**
 * Reading milestones and badges, computed from the courses a student has
 * actually read and verified in the library.
 */

export type ReadRow = {
  item_id: string;
  item_title: string;
  department: string | null;
  level: string | null;
  seconds_read: number;
  quiz_score: number;
  verified: boolean;
  updated_at: string;
  created_at?: string;
};

export type ReadingStats = {
  verifiedCount: number;
  minutes: number;
  avgScore: number;
  perfectChecks: number;
  departments: number;
  levels: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
};

export type Badge = {
  id: string;
  title: string;
  blurb: string;
  emoji: string;
  premium: boolean;
  target: number;
  progress: number;
};

function dayKey(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}

function streaks(days: string[]): { current: number; longest: number } {
  if (days.length === 0) return { current: 0, longest: 0 };
  const sorted = [...new Set(days)].sort();
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]!).getTime();
    const cur = new Date(sorted[i]!).getTime();
    run = cur - prev === 86400000 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const last = sorted[sorted.length - 1]!;
  const current = last === today || last === yesterday ? run : 0;
  return { current, longest };
}

export function readingStats(reads: ReadRow[]): ReadingStats {
  const verified = reads.filter((r) => r.verified);
  const minutes = Math.round(reads.reduce((n, r) => n + (r.seconds_read ?? 0), 0) / 60);
  const avgScore = verified.length
    ? Math.round(verified.reduce((n, r) => n + (r.quiz_score ?? 0), 0) / verified.length)
    : 0;
  const days = verified.map((r) => dayKey(r.updated_at));
  const { current, longest } = streaks(days);
  return {
    verifiedCount: verified.length,
    minutes,
    avgScore,
    perfectChecks: verified.filter((r) => (r.quiz_score ?? 0) >= 100).length,
    departments: new Set(verified.map((r) => r.department).filter(Boolean)).size,
    levels: new Set(verified.map((r) => r.level).filter(Boolean)).size,
    activeDays: new Set(days).size,
    currentStreak: current,
    longestStreak: longest,
  };
}

export const READ_MILESTONES = [1, 3, 5, 10, 25, 50, 100];

export function nextReadMilestone(count: number): number {
  for (const m of READ_MILESTONES) if (count < m) return m;
  return READ_MILESTONES[READ_MILESTONES.length - 1]!;
}

export function buildBadges(s: ReadingStats): Badge[] {
  return [
    {
      id: "first-read",
      title: "First page turned",
      blurb: "Verify your first course reading",
      emoji: "📖",
      premium: false,
      target: 1,
      progress: s.verifiedCount,
    },
    {
      id: "five-reads",
      title: "Serious reader",
      blurb: "Verify 5 course readings",
      emoji: "📚",
      premium: false,
      target: 5,
      progress: s.verifiedCount,
    },
    {
      id: "streak-3",
      title: "Three day streak",
      blurb: "Read on 3 days in a row",
      emoji: "🔥",
      premium: false,
      target: 3,
      progress: s.longestStreak,
    },
    {
      id: "hour-club",
      title: "Hour club",
      blurb: "Spend 60 minutes reading in the library",
      emoji: "⏱️",
      premium: false,
      target: 60,
      progress: s.minutes,
    },
    {
      id: "cross-faculty",
      title: "Cross department",
      blurb: "Read courses from 3 different departments",
      emoji: "🧭",
      premium: true,
      target: 3,
      progress: s.departments,
    },
    {
      id: "sharp-shooter",
      title: "Sharp shooter",
      blurb: "Score 100% on 3 comprehension checks",
      emoji: "🎯",
      premium: true,
      target: 3,
      progress: s.perfectChecks,
    },
    {
      id: "streak-14",
      title: "Fortnight scholar",
      blurb: "Read on 14 days in a row",
      emoji: "🏅",
      premium: true,
      target: 14,
      progress: s.longestStreak,
    },
    {
      id: "century",
      title: "Century of courses",
      blurb: "Verify 100 course readings",
      emoji: "👑",
      premium: true,
      target: 100,
      progress: s.verifiedCount,
    },
  ];
}

export function isBadgeEarned(b: Badge, premiumActive: boolean) {
  return b.progress >= b.target && (!b.premium || premiumActive);
}
