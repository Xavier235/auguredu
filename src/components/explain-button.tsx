import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { explainQuestion } from "@/lib/assist.functions";
import { Lightbulb, Loader2 } from "lucide-react";

/**
 * "Explain this question" — a premium feature with a small free daily
 * allowance, used inside the CBT exam and the past question papers.
 */
export function ExplainButton({
  question,
  options,
  correctIndex = null,
  chosenIndex = null,
  subject = "",
  board = "jamb",
  hintOnly = false,
  label,
}: {
  question: string;
  options: string[];
  correctIndex?: number | null;
  chosenIndex?: number | null;
  subject?: string;
  board?: "jamb" | "waec" | "neco" | "post-utme" | "course";
  hintOnly?: boolean;
  label?: string;
}) {
  const explain = useServerFn(explainQuestion);
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState("");
  const [err, setErr] = useState("");
  const [left, setLeft] = useState<number | null>(null);

  async function run() {
    if (busy) return;
    setBusy(true);
    setErr("");
    try {
      const r: any = await explain({
        data: { question, options, correctIndex, chosenIndex, subject, board, hintOnly },
      });
      setAnswer(r.answer);
      setLeft(r.unlimited ? -1 : r.left);
    } catch (e: any) {
      setErr(e?.message ?? "Augur could not explain that right now.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3">
      <button
        onClick={run}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Lightbulb className="h-3 w-3" />}
        {label ?? (hintOnly ? "I am stuck, give me a hint" : "Explain this question")}
      </button>

      {left !== null && left >= 0 && (
        <span className="ml-2 text-[11px] text-muted-foreground">{left} free explanations left today</span>
      )}

      {err && (
        <p className="mt-2 text-xs text-destructive">
          {err}{" "}
          <Link to="/upgrade" className="underline">
            See plans
          </Link>
        </p>
      )}

      {answer && (
        <div className="mt-2 whitespace-pre-wrap rounded-2xl border border-border bg-background/60 p-3 text-[13px] leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}
