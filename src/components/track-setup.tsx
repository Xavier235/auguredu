import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { DEPARTMENTS } from "@/lib/course-catalogue";
import { TRACKS, STREAMS, subjectsFor, splitSubjects } from "@/lib/track";
import { toast } from "sonner";
import { Loader2, Save, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const LEVELS = ["100", "200", "300", "400", "500", "600"];

/**
 * The short guided setup Augur uses to know each student: exam board or
 * university, stream or department, and the subjects they are sitting.
 */
export function TrackSetup({ compact = false }: { compact?: boolean }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [track, setTrack] = useState("");
  const [stream, setStream] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("100");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [configured, setConfigured] = useState(false);
  const [editing, setEditing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return setLoading(false);
    const { data } = await supabase
      .from("study_profiles")
      .select("track, stream, subjects, department, level")
      .eq("user_id", user.id)
      .maybeSingle();
    const d = (data ?? {}) as any;
    setTrack(d.track ?? "");
    setStream(d.stream ?? "");
    setDepartment(d.department ?? "");
    setLevel(d.level || "100");
    setSubjects(splitSubjects(d.subjects));
    setConfigured(Boolean(d.track));
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const isUni = track === "university";
  const options = subjectsFor(stream);

  function toggleSubject(s: string) {
    setSubjects((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  async function save() {
    if (!user) return toast.error("Sign in first.");
    if (!track) return toast.error("Tell Augur which exam you are sitting.");
    if (!isUni && !stream) return toast.error("Pick your stream: science, commercial or art.");
    if (isUni && !department.trim()) return toast.error("Pick your department.");
    setSaving(true);
    const { error } = await supabase.from("study_profiles").upsert(
      {
        user_id: user.id,
        track,
        stream: isUni ? "" : stream,
        subjects: subjects.join(", "),
        department,
        level,
      } as any,
      { onConflict: "user_id" },
    );
    setSaving(false);
    if (error) return toast.error(error.message);
    setConfigured(true);
    setEditing(false);
    toast.success("Saved. Augur will tailor everything to this.");
  }

  if (!user) return null;

  return (
    <section className={`glass rounded-3xl p-5 sm:p-6 ${compact ? "" : "mt-6"}`}>
      <div className="flex items-center gap-2">
        <GraduationCap className="h-4 w-4 text-primary" />
        <h2 className="font-display text-lg font-semibold">Who are you studying as?</h2>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Augur uses this everywhere: drills, the exam simulator, the library and campus matching.
      </p>

      {loading ? (
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" /> Loading
        </div>
      ) : configured && !editing ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3">
          <div>
            <p className="text-sm font-medium">
              {TRACKS.find((item) => item.id === track)?.label ?? "Student"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {isUni
                ? [department, `${level} level`].filter(Boolean).join(" · ")
                : [STREAMS.find((item) => item.id === stream)?.label, ...subjects].filter(Boolean).join(" · ")}
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => setEditing(true)}>
            Change setup
          </Button>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">I am a</div>
            <div className="flex flex-wrap gap-2">
              {TRACKS.map((t) => (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  key={t.id}
                  onClick={() => {
                    setTrack(t.id);
                    setStream("");
                    setSubjects([]);
                  }}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                    track === t.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background/60"
                  }`}
                >
                  {t.label}
                </Button>
              ))}
            </div>
          </div>

          {track && !isUni && (
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                My stream
              </div>
              <div className="flex flex-wrap gap-2">
                {STREAMS.map((s) => (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    key={s.id}
                    onClick={() => {
                      setStream(s.id);
                      setSubjects([]);
                    }}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                      stream === s.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background/60"
                    }`}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {track && !isUni && stream && (
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Subjects I am sitting
              </div>
              <div className="flex flex-wrap gap-2">
                {options.map((s) => (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    key={s}
                    onClick={() => toggleSubject(s)}
                    className={`rounded-full border px-3 py-1 text-xs ${
                      subjects.includes(s)
                        ? "border-primary bg-primary/15 text-foreground"
                        : "border-border bg-background/60 text-muted-foreground"
                    }`}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {isUni && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Department
                </span>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  <option value="">Choose your department</option>
                  {DEPARTMENTS.map((d: any) => (
                    <option key={typeof d === "string" ? d : d.id} value={typeof d === "string" ? d : d.name}>
                      {typeof d === "string" ? d : d.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Level</span>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l} level
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <Button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-full px-5"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save my setup
          </Button>
        </div>
      )}
    </section>
  );
}
