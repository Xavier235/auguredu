import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { BOARDS, subjectsForBoard, streamsOf, type ExamBoard } from "@/lib/exam-library";
import { ExplainButton } from "@/components/explain-button";
import { FileText } from "lucide-react";

/** WAEC, NECO and JAMB past questions and syllabus, filtered by the student's track and stream. */
export function ExamPapers() {
  const { user } = useAuth();
  const [board, setBoard] = useState<ExamBoard>("jamb");
  const [stream, setStream] = useState("");
  const [track, setTrack] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("study_profiles")
      .select("track, stream")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        const d = (data ?? {}) as any;
        setTrack(d.track ?? "");
        setStream(d.stream ?? "");
        if (d.track === "waec" || d.track === "neco" || d.track === "jamb") setBoard(d.track);
      });
  }, [user?.id]);

  if (track === "university") return null;

  const subjects = subjectsForBoard(board).filter((s) => !stream || streamsOf(s).includes(stream as any));

  return (
    <section className="glass mb-8 rounded-3xl p-6">
      <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
        <FileText className="h-4 w-4 text-primary" /> Past questions and syllabus
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        {stream ? `Showing ${stream} subjects for your profile. ` : ""}Every practice paper is freshly randomised, so no two attempts match.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {BOARDS.map((b) => (
          <button
            key={b.id}
            onClick={() => setBoard(b.id)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              board === b.id ? "border-primary bg-primary/15 text-primary" : "border-border"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((s) => (
          <div key={s} className="rounded-2xl border border-border bg-background/50 p-3">
            <div className="text-sm font-medium">{s}</div>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
              <Link to="/exam" className="rounded-full bg-primary px-2.5 py-1 font-semibold text-primary-foreground">
                Practice past questions
              </Link>
              <Link
                to="/chat"
                className="rounded-full border border-border px-2.5 py-1"
              >
                Ask for syllabus
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Re-exported so pages can offer explanations alongside papers.
export { ExplainButton };
