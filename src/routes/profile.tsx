import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  GraduationCap,
  Trash2,
  Sparkles,
  Calendar,
  TrendingUp,
  Pencil,
  Check,
  X,
  User as UserIcon,
  Mail,
  School,
  BookOpen,
  Target,
  Award,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { PredictorInput, PredictorResult } from "@/lib/predictor";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My profile — Augur.edu" },
      {
        name: "description",
        content: "Your academic profile, saved predictions and progress.",
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

type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  school: string | null;
  level: string | null;
  bio: string | null;
};

const LEVELS = ["Prospective (JAMB)", "100L", "200L", "300L", "400L", "500L", "600L", "Graduate"];

function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<SavedPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<SavedPrediction | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState<"overview" | "predictions">("overview");
  const [form, setForm] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      setLoading(true);
      const [{ data: preds }, { data: prof }] = await Promise.all([
        supabase.from("predictions").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      ]);
      if (!alive) return;
      if (preds) setItems(preds as unknown as SavedPrediction[]);
      if (prof) {
        setProfile(prof as Profile);
        setForm(prof as Profile);
      }
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
      toast.success("Prediction deleted");
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const payload = {
      id: user.id,
      display_name: form.display_name?.trim() || null,
      school: form.school?.trim() || null,
      level: form.level || null,
      bio: form.bio?.trim() || null,
      avatar_url: form.avatar_url?.trim() || null,
    };
    const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setProfile((p) => ({ ...(p || { id: user.id, display_name: null, avatar_url: null, school: null, level: null, bio: null }), ...payload }));
    setEditing(false);
    toast.success("Profile saved");
  };

  const stats = useMemo(() => {
    const count = items.length;
    const avgAgg = count ? items.reduce((s, i) => s + Number(i.aggregate_score || 0), 0) / count : 0;
    const bestChance = count ? Math.max(...items.map((i) => i.top_course_chance ?? 0)) : 0;
    const bestJamb = count ? Math.max(...items.map((i) => i.jamb_score || 0)) : 0;
    return { count, avgAgg, bestChance, bestJamb };
  }, [items]);

  const initials = (profile?.display_name || user?.email || "?")
    .split(/[ @.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className="bg-grid min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 pt-12 pb-20">
        {/* Profile header card */}
        <div className="glass relative overflow-hidden rounded-3xl p-6 md:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4 md:gap-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-accent text-2xl font-semibold text-primary-foreground glow-primary flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="font-display">{initials || "?"}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium uppercase tracking-widest text-primary">
                  Academic profile
                </div>
                <h1 className="mt-1 font-display text-2xl font-semibold md:text-3xl truncate">
                  {profile?.display_name || user?.email?.split("@")[0] || "Your profile"}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface/40 px-2.5 py-1">
                    <Mail className="h-3 w-3" /> {user?.email}
                  </span>
                  {profile?.school && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface/40 px-2.5 py-1">
                      <School className="h-3 w-3" /> {profile.school}
                    </span>
                  )}
                  {profile?.level && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-foreground">
                      <BookOpen className="h-3 w-3" /> {profile.level}
                    </span>
                  )}
                </div>
                {profile?.bio && !editing && (
                  <p className="mt-3 max-w-xl text-sm text-muted-foreground">{profile.bio}</p>
                )}
              </div>
            </div>
            <div>
              {!editing ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setForm(profile || {});
                    setEditing(true);
                  }}
                >
                  <Pencil className="mr-2 h-3.5 w-3.5" /> Edit profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>
                    <X className="mr-1.5 h-3.5 w-3.5" /> Cancel
                  </Button>
                  <Button onClick={saveProfile} disabled={saving}>
                    <Check className="mr-1.5 h-3.5 w-3.5" /> {saving ? "Saving…" : "Save"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Edit form */}
          {editing && (
            <div className="relative mt-6 grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="dn">Display name</Label>
                <Input
                  id="dn"
                  value={form.display_name || ""}
                  onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                  placeholder="Ada Lovelace"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sch">School / University</Label>
                <Input
                  id="sch"
                  value={form.school || ""}
                  onChange={(e) => setForm({ ...form, school: e.target.value })}
                  placeholder="Lagos State University"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lvl">Level</Label>
                <select
                  id="lvl"
                  value={form.level || ""}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Select level…</option>
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="av">Avatar URL (optional)</Label>
                <Input
                  id="av"
                  value={form.avatar_url || ""}
                  onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                  placeholder="https://…"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={form.bio || ""}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="A short line about your academic goals…"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        {/* Stat strip */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <BigStat icon={<Sparkles className="h-4 w-4" />} label="Predictions" value={`${stats.count}`} />
          <BigStat icon={<Target className="h-4 w-4" />} label="Avg aggregate" value={stats.avgAgg.toFixed(1)} />
          <BigStat icon={<Award className="h-4 w-4" />} label="Best chance" value={`${stats.bestChance}%`} accent />
          <BigStat icon={<TrendingUp className="h-4 w-4" />} label="Best JAMB" value={`${stats.bestJamb}`} />
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-2 rounded-full border border-border/60 bg-surface/40 p-1 w-fit">
          {(["overview", "predictions"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "overview" ? (
            <OverviewPanel user={user?.email || ""} profile={profile} items={items} />
          ) : loading ? (
            <div className="glass rounded-3xl p-10 text-center text-muted-foreground">
              Loading your saved predictions…
            </div>
          ) : items.length === 0 ? (
            <div className="glass rounded-3xl p-10 text-center">
              <GraduationCap className="mx-auto h-10 w-10 text-primary" />
              <h2 className="mt-4 font-display text-2xl font-semibold">No saved predictions yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Run a prediction and tap "Save to my profile" to keep it here.
              </p>
              <Link
                to="/predictor"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:glow-primary"
              >
                <Sparkles className="h-4 w-4" /> Run a prediction
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="glass group rounded-3xl p-6 transition-transform hover:-translate-y-0.5"
                >
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
                    <Stat label="Aggregate" value={`${Number(it.aggregate_score).toFixed(1)}`} />
                    <Stat label="Top chance" value={`${it.top_course_chance ?? 0}%`} accent />
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
                    <TrendingUp className="h-3.5 w-3.5" /> View breakdown
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

function OverviewPanel({
  user,
  profile,
  items,
}: {
  user: string;
  profile: Profile | null;
  items: SavedPrediction[];
}) {
  const recent = items.slice(0, 3);
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="glass rounded-3xl p-6">
        <h3 className="font-display text-lg font-semibold flex items-center gap-2">
          <UserIcon className="h-4 w-4 text-primary" /> Account
        </h3>
        <dl className="mt-4 space-y-3 text-sm">
          <Row label="Email" value={user} />
          <Row label="Display name" value={profile?.display_name || "—"} />
          <Row label="School" value={profile?.school || "—"} />
          <Row label="Level" value={profile?.level || "—"} />
        </dl>
      </div>
      <div className="glass rounded-3xl p-6">
        <h3 className="font-display text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Recent activity
        </h3>
        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No predictions yet — head to the predictor to run your first one.
          </p>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {recent.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-surface/40 px-3 py-2.5 text-sm"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{r.label || r.top_course || "Prediction"}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span className="text-xs font-medium text-primary">
                  {r.top_course_chance ?? 0}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-2 last:border-0 last:pb-0">
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="truncate text-right text-sm font-medium">{value}</dd>
    </div>
  );
}

function BigStat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`glass rounded-2xl p-4 ${accent ? "ring-1 ring-primary/40" : ""}`}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
        <span className="text-primary">{icon}</span> {label}
      </div>
      <div
        className={`mt-1.5 font-display text-2xl font-semibold ${
          accent ? "text-gradient" : ""
        }`}
      >
        {value}
      </div>
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
