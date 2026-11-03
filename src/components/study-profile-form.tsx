import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { DEPARTMENTS } from "@/lib/course-catalogue";
import { SCHOOLS, areasFor, schoolByName } from "@/lib/campus-data";
import { Input } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, Loader2, GraduationCap } from "lucide-react";

const LEVELS = ["100", "200", "300", "400", "500", "600"];
const STYLES = [
  { id: "mixed", label: "A bit of both" },
  { id: "quiet", label: "Quiet solo reading" },
  { id: "discussion", label: "Group discussion" },
  { id: "past-questions", label: "Past question drilling" },
];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const GOALS = [
  "First class",
  "Second class upper",
  "Pull my CGPA back up",
  "Pass every carryover",
  "Prepare for professional exams",
  "Final year project support",
];

export type StudyProfile = {
  user_id: string;
  school: string;
  department: string;
  level: string;
  campus_area: string;
  hostel: string;
  study_style: string;
  availability: string;
  about: string;
  contact_handle: string;
  discoverable: boolean;
  courses: string;
  goal: string;
  days: string;
  track?: string;
  stream?: string;
};

export const EMPTY_PROFILE: StudyProfile = {
  user_id: "",
  school: "",
  department: "",
  level: "100",
  campus_area: "",
  hostel: "",
  study_style: "mixed",
  availability: "",
  about: "",
  contact_handle: "",
  discoverable: true,
  courses: "",
  goal: "",
  days: "",
};

export const splitList = (v: string) =>
  (v ?? "")
    .split(/[,\n;]+/)
    .map((x) => x.trim().toUpperCase().replace(/\s+/g, " "))
    .filter(Boolean);

/** Loads the signed-in student's campus study profile row (or null). */
export async function fetchStudyProfile(userId: string): Promise<StudyProfile | null> {
  const { data } = await supabase.from("study_profiles").select("*").eq("user_id", userId).maybeSingle();
  return data ? { ...EMPTY_PROFILE, ...(data as any) } : null;
}

/**
 * Full study profile editor, used in Settings. Campus only shows a summary and
 * links here, because profile setup is a low frequency task.
 */
export function StudyProfileForm({ onSaved }: { onSaved?: (p: StudyProfile) => void }) {
  const { user } = useAuth();
  const [me, setMe] = useState<StudyProfile>(EMPTY_PROFILE);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchStudyProfile(user.id)
      .then((p) => p && setMe(p))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const mySchool = schoolByName(me.school);
  const myDays = useMemo(() => splitList(me.days), [me.days]);
  const toggleDay = (day: string) => {
    const d = day.toUpperCase();
    const next = myDays.includes(d) ? myDays.filter((x) => x !== d) : [...myDays, d];
    setMe({ ...me, days: next.join(", ") });
  };

  async function saveProfile() {
    if (!user) return toast.error("Sign in to set up your study profile.");
    if (!me.school.trim() || !me.department.trim())
      return toast.error("Add your school and department first.");
    setSaving(true);
    const { error } = await supabase.from("study_profiles").upsert({ ...me, user_id: user.id } as any);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Study profile saved, you are now matchable.");
    onSaved?.(me);
  }

  if (!user) {
    return <p className="text-sm text-muted-foreground">Sign in to set up your study profile.</p>;
  }

  return (
    <div className="grid gap-3">
      <label className="text-sm">
        <span className="text-muted-foreground">School</span>
        <select
          value={me.school}
          onChange={(e) => setMe({ ...me, school: e.target.value })}
          className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">Choose your university</option>
          {SCHOOLS.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name} ({s.short})
            </option>
          ))}
        </select>
        {mySchool && (
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <GraduationCap className="h-3 w-3" /> {mySchool.type} · {mySchool.state} State
          </span>
        )}
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="text-muted-foreground">Department</span>
          <select
            value={me.department}
            onChange={(e) => setMe({ ...me, department: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="">Choose</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="text-muted-foreground">Level</span>
          <select
            value={me.level}
            onChange={(e) => setMe({ ...me, level: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l} level
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="text-sm">
        <span className="text-muted-foreground">Course codes you are taking</span>
        <input
          value={me.courses}
          onChange={(e) => setMe({ ...me, courses: e.target.value })}
          placeholder="e.g. CSC 201, MTH 201, GST 202"
          className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm uppercase outline-none focus:border-primary"
        />
        <span className="mt-1 block text-[11px] text-muted-foreground">
          Separate with commas. Shared courses give the strongest matches.
        </span>
      </label>
      <label className="text-sm">
        <span className="text-muted-foreground">What you are chasing this semester</span>
        <select
          value={me.goal}
          onChange={(e) => setMe({ ...me, goal: e.target.value })}
          className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">Choose a goal</option>
          {GOALS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>
      <div className="text-sm">
        <span className="text-muted-foreground">Days you are free to read together</span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {DAYS.map((d) => {
            const on = myDays.includes(d.toUpperCase());
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDay(d)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  on
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:bg-surface/60"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="text-muted-foreground">Campus area</span>
          <select
            value={me.campus_area}
            onChange={(e) => setMe({ ...me, campus_area: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="">Choose</option>
            {areasFor(mySchool?.id).map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="text-muted-foreground">Hostel or area you stay</span>
          <input
            value={me.hostel}
            onChange={(e) => setMe({ ...me, hostel: e.target.value })}
            placeholder="e.g. Iba hostel"
            className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="text-muted-foreground">How you study best</span>
          <select
            value={me.study_style}
            onChange={(e) => setMe({ ...me, study_style: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
          >
            {STYLES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="text-muted-foreground">When you are free</span>
          <input
            value={me.availability}
            onChange={(e) => setMe({ ...me, availability: e.target.value })}
            placeholder="e.g. Evenings and Saturdays"
            className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </label>
      </div>
      <label className="text-sm">
        <span className="text-muted-foreground">How classmates can reach you</span>
        <input
          value={me.contact_handle}
          onChange={(e) => setMe({ ...me, contact_handle: e.target.value })}
          placeholder="e.g. @yourhandle"
          className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </label>
      <label className="text-sm">
        <span className="text-muted-foreground">About your study goals</span>
        <textarea
          value={me.about}
          onChange={(e) => setMe({ ...me, about: e.target.value })}
          rows={3}
          placeholder="e.g. Chasing a first class, need partners for MTH 201 tutorials."
          className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={me.discoverable}
          onChange={(e) => setMe({ ...me, discoverable: e.target.checked })}
          className="h-4 w-4 rounded border-border"
        />
        <span className="text-muted-foreground">Let other students find me</span>
      </label>
      <Button onClick={saveProfile} disabled={saving} className="w-fit">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save study profile
      </Button>
      {loading && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" /> Loading your saved details…
        </p>
      )}
    </div>
  );
}

/** One-line summary used on the Campus page card. */
export function studyProfileSummary(p: StudyProfile): string {
  const bits = [
    p.school,
    p.department,
    p.level && `${p.level} level`,
    p.campus_area,
    p.goal,
  ].filter(Boolean);
  return bits.length ? bits.join(" · ") : "";
}
