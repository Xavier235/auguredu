import { CheckCircle2, Circle, Flag } from "lucide-react";
import { useEffect, useState } from "react";

const KEY = "augur.roadmap.done.v1";

export type RoadmapPhase = {
  weeks: string;
  title: string;
  focus: string;
  tasks: string[];
};

/** A 15 week semester roadmap tuned to how hard the target CGPA is. */
export function buildRoadmap(opts: {
  requiredSemesterGpa: number;
  recommendedWeeklyHours: number;
  targetCgpa: number;
}): RoadmapPhase[] {
  const hard = opts.requiredSemesterGpa >= 4.2;
  const hoursDaily = Math.max(1, Math.round(opts.recommendedWeeklyHours / 6));

  return [
    {
      weeks: "Week 1 – 2",
      title: "Set the ground",
      focus: `Collect every course outline and lock a ${hoursDaily}h daily slot.`,
      tasks: [
        "Write out all course codes, units and lecturers",
        "Collect the outline or syllabus for each course",
        "Block the same study hours every day on your phone calendar",
        "Start your reading streak on Augur",
      ],
    },
    {
      weeks: "Week 3 – 5",
      title: "Build understanding",
      focus: "Read ahead of the lecturer so class becomes revision, not first contact.",
      tasks: [
        "Read the next topic before each lecture",
        "Summarise every topic in your own words the same day",
        "Ask Professor Augur anything you did not understand that week",
        "Attend at least 90% of lectures for attendance marks",
      ],
    },
    {
      weeks: "Week 6 – 8",
      title: "First tests and CA",
      focus: "CA is 30 marks you can almost fully control. Protect it.",
      tasks: [
        "Revise past tests and class questions before every CA",
        "Submit every assignment, none skipped",
        "Target 25+ out of 30 in continuous assessment",
        "Log CA scores into the CGPA forecaster to see where you stand",
      ],
    },
    {
      weeks: "Week 9 – 11",
      title: "Past questions mode",
      focus: hard
        ? "This is the stretch that decides a hard target. Double drilling here."
        : "Turn understanding into speed with repeated past questions.",
      tasks: [
        "Drill past questions for each course, timed",
        "Rewrite every wrong answer until it is correct from memory",
        "Form or join a study group and teach one topic out loud",
        "Flag your two weakest courses and give them extra hours",
      ],
    },
    {
      weeks: "Week 12 – 13",
      title: "Consolidate",
      focus: "Compress each course into one page you can revise in 20 minutes.",
      tasks: [
        "Make a one page summary sheet per course",
        "Turn each summary into flashcards on Augur",
        "Do one full mock exam per course under exam conditions",
      ],
    },
    {
      weeks: "Week 14 – 15",
      title: "Exam sprint",
      focus: `Hold your streak, protect sleep, and finish at ${opts.targetCgpa.toFixed(2)}.`,
      tasks: [
        "Revise only summaries and flashcards, no new material",
        "Sleep at least 6 hours before every paper",
        "Answer the highest scoring question first in every exam",
        "Record your results and re-forecast your CGPA",
      ],
    },
  ];
}

export function StudyRoadmap({ phases }: { phases: RoadmapPhase[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  function toggle(key: string) {
    setDone((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  const total = phases.reduce((n, p) => n + p.tasks.length, 0);
  const completed = Object.values(done).filter(Boolean).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
          <Flag className="h-4 w-4 text-primary" /> Your semester roadmap
        </h2>
        <span className="text-xs text-muted-foreground">
          {completed}/{total} steps done · {pct}%
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ol className="mt-6 space-y-5 border-l border-border/70 pl-5">
        {phases.map((p, pi) => (
          <li key={p.weeks} className="relative">
            <span className="absolute -left-[27px] top-1 flex h-4 w-4 items-center justify-center rounded-full border border-primary/50 bg-background text-[9px] font-bold text-primary">
              {pi + 1}
            </span>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{p.weeks}</div>
            <div className="font-display text-base font-semibold">{p.title}</div>
            <p className="mt-1 text-xs text-muted-foreground">{p.focus}</p>
            <ul className="mt-2 space-y-1.5">
              {p.tasks.map((t, ti) => {
                const key = `${pi}-${ti}`;
                const isDone = !!done[key];
                return (
                  <li key={key}>
                    <button
                      onClick={() => toggle(key)}
                      className="flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors hover:bg-surface/60"
                    >
                      {isDone ? (
                        <CheckCircle2 className="mt-[1px] h-3.5 w-3.5 shrink-0 text-primary" />
                      ) : (
                        <Circle className="mt-[1px] h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      )}
                      <span className={isDone ? "text-muted-foreground line-through" : ""}>{t}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
