import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  GraduationCap,
  Trash2,
  Sparkles,
  Calendar,
  TrendingUp,
} from "lucide-react";
import type { PredictorInput, PredictorResult } from "@/lib/predictor";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Predictions — Augur.edu" },
      {
        name: "description",
        content: "View and manage your saved LASU course predictions.",
      },
    ],
  }),
  component: ProfilePage,
});

type SavedPrediction = {
  id: string;
  label: string | null;
  input: PredictorInput;
  result: PredictorResult;
  jamb_score: number;
  aggregate_score: number;
  top_course: string | null;
  top_course_chance: number | null;
  created_at: string;
};

function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<SavedPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<SavedPrediction | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth" });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("predictions")
        .select("*")
        .order("created_at", { ascending: false });
      if (!alive) return;
      if (!error && data) setItems(data as unknown as SavedPrediction[]);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [user]);

  const remove = async (id: string) => {
    if (!confirm("Delete this saved prediction?")) return;
    const { error } = await supabase.from("predictions").delete().eq("id", id);
    if (!error) {
      setItems((p) => p.filter((i) => i.id !== id));
      if (active?.id === id) setActive(null);
    }
  };

  return (
    <div className="bg-grid min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 pt-16 pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            Your saved predictions
          </div>
          <h1 className="font-display text-4xl font-semibold md:text-5xl">
            My <span className="text-gradient">profile</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Every prediction you save lands here. Track how your scores evolve as
            you prep for JAMB and Post-UTME.
          </p>
        </div>

        <div className="mt-12">
          {loading ? (
            <div className="glass rounded-3xl p-10 text-center text-muted-foreground">
              Loading your saved predictions…
            </div>
          ) : items.length === 0 ? (
            <div className="glass rounded-3xl p-10 text-center">
              <GraduationCap className="mx-auto h-10 w-10 text-primary" />
              <h2 className="mt-4 font-display text-2xl font-semibold">
                No saved predictions yet
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Run a prediction and tap "Save to my profile" to keep it here.
              </p>
              <Link
                to="/predictor"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:glow-primary"
              >
                <Sparkles className="h-4 w-4" />
                Run a prediction
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {items.map((it) => (
                <div key={it.id} className="glass rounded-3xl p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-display text-lg font-semibold truncate">
                        {it.label || it.top_course || "Untitled prediction"}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(it.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <button
                      onClick={() => remove(it.id)}
                      className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <Stat label="JAMB" value={`${it.jamb_score}`} />
                    <Stat
                      label="Aggregate"
                      value={`${Number(it.aggregate_score).toFixed(1)}`}
                    />
                    <Stat
                      label="Top chance"
                      value={`${it.top_course_chance ?? 0}%`}
                      accent
                    />
                  </div>

                  {it.top_course && (
                    <div className="mt-4 rounded-xl border border-border/60 bg-surface/40 px-3 py-2.5">
                      <div className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                        Best fit
                      </div>
                      <div className="text-sm font-medium">{it.top_course}</div>
                    </div>
                  )}

                  <button
                    onClick={() => setActive(it)}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-primary/20"
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    View breakdown
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {active && <DetailModal item={active} onClose={() => setActive(null)} />}
      </main>

      <SiteFooter />
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-border/60 px-3 py-2.5 ${
        accent ? "bg-primary/10" : "bg-surface/40"
      }`}
    >
      <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-0.5 font-display text-lg font-semibold ${
          accent ? "text-gradient" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function DetailModal({
  item,
  onClose,
}: {
  item: SavedPrediction;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-6 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass relative my-10 w-full max-w-2xl rounded-3xl p-8"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
        <div className="text-xs font-medium uppercase tracking-widest text-primary">
          Saved {new Date(item.created_at).toLocaleString()}
        </div>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          {item.label || item.top_course || "Prediction"}
        </h2>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat label="JAMB" value={`${item.jamb_score}`} />
          <Stat label="Aggregate" value={`${Number(item.aggregate_score).toFixed(1)}`} />
          <Stat label="Top chance" value={`${item.top_course_chance ?? 0}%`} accent />
        </div>

        <div className="mt-6">
          <h3 className="font-display text-base font-semibold">Top courses</h3>
          <div className="mt-3 space-y-2">
            {item.result.topCourses.map((c) => (
              <div
                key={c.course}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-surface/40 px-3 py-2.5 text-sm"
              >
                <span className="font-medium">{c.course}</span>
                <span className="text-xs text-muted-foreground">
                  Cutoff {c.cutoff} • {c.admissionChance}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-display text-base font-semibold">Recommendations</h3>
          <ol className="mt-3 space-y-2 text-sm">
            {item.result.recommendations.map((r, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-primary">{i + 1}.</span>
                <span>{r}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
