import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { pageMeta, canonical } from "@/lib/seo";
import { DEPARTMENTS } from "@/lib/course-catalogue";
import { toast } from "sonner";
import { Users, MapPin, Clock, Save, Plus, LogIn, LogOut, Loader2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/campus")({
  head: () => ({
    meta: pageMeta({
      title: "Cross Campus Study Matching and Study Group Sync | Augur.edu",
      description:
        "Find Nigerian students studying the same course at your level, match by campus area and hostel, and join or create a study group that meets on a real timetable.",
      path: "/campus",
    }),
    links: canonical("/campus"),
  }),
  component: CampusPage,
});

const LEVELS = ["100", "200", "300", "400", "500", "600"];
const STYLES = [
  { id: "mixed", label: "A bit of both" },
  { id: "quiet", label: "Quiet solo reading" },
  { id: "discussion", label: "Group discussion" },
  { id: "past-questions", label: "Past question drilling" },
];

type Profile = {
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
};

type Group = {
  id: string;
  created_by: string;
  name: string;
  school: string;
  department: string;
  level: string;
  topic: string;
  meeting_place: string;
  meeting_time: string;
  capacity: number;
};

const EMPTY: Profile = {
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
};

function matchScore(me: Profile, other: Profile) {
  let s = 0;
  if (me.department && me.department === other.department) s += 40;
  if (me.level && me.level === other.level) s += 20;
  if (me.school && me.school.toLowerCase() === other.school.toLowerCase()) s += 20;
  if (me.campus_area && me.campus_area.toLowerCase() === other.campus_area.toLowerCase()) s += 10;
  if (me.hostel && me.hostel.toLowerCase() === other.hostel.toLowerCase()) s += 5;
  if (me.study_style && me.study_style === other.study_style) s += 5;
  return s;
}

function CampusPage() {
  const { user } = useAuth();
  const [me, setMe] = useState<Profile>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [peers, setPeers] = useState<Profile[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<string[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [creating, setCreating] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    topic: "",
    meeting_place: "",
    meeting_time: "",
    capacity: 10,
  });

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const [{ data: mine }, { data: allProfiles }, { data: allGroups }, { data: members }] = await Promise.all([
      supabase.from("study_profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("study_profiles").select("*").eq("discoverable", true).limit(300),
      supabase.from("study_groups").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("study_group_members").select("group_id, user_id"),
    ]);
    if (mine) setMe({ ...EMPTY, ...(mine as any) });
    setPeers(((allProfiles ?? []) as any[]).filter((p) => p.user_id !== user.id));
    setGroups((allGroups ?? []) as any[]);
    const tally: Record<string, number> = {};
    const mineIds: string[] = [];
    for (const m of (members ?? []) as any[]) {
      tally[m.group_id] = (tally[m.group_id] ?? 0) + 1;
      if (m.user_id === user.id) mineIds.push(m.group_id);
    }
    setCounts(tally);
    setMyGroups(mineIds);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const matches = useMemo(() => {
    return peers
      .map((p) => ({ p, score: matchScore(me, p) }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }, [peers, me]);

  async function saveProfile() {
    if (!user) return toast.error("Sign in to set up your study profile.");
    if (!me.school.trim() || !me.department.trim()) return toast.error("Add your school and department first.");
    setSaving(true);
    const { error } = await supabase.from("study_profiles").upsert({ ...me, user_id: user.id } as any);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Study profile saved, you are now matchable.");
    load();
  }

  async function createGroup() {
    if (!user) return toast.error("Sign in to create a group.");
    if (!newGroup.name.trim()) return toast.error("Give the group a name.");
    setCreating(true);
    const { data, error } = await supabase
      .from("study_groups")
      .insert({
        ...newGroup,
        created_by: user.id,
        school: me.school,
        department: me.department,
        level: me.level,
      } as any)
      .select()
      .maybeSingle();
    if (!error && data) {
      await supabase.from("study_group_members").insert({ group_id: (data as any).id, user_id: user.id } as any);
    }
    setCreating(false);
    if (error) return toast.error(error.message);
    setNewGroup({ name: "", topic: "", meeting_place: "", meeting_time: "", capacity: 10 });
    toast.success("Study group created.");
    load();
  }

  async function toggleGroup(id: string, joined: boolean) {
    if (!user) return toast.error("Sign in to join a group.");
    const { error } = joined
      ? await supabase.from("study_group_members").delete().eq("group_id", id).eq("user_id", user.id)
      : await supabase.from("study_group_members").insert({ group_id: id, user_id: user.id } as any);
    if (error) return toast.error(error.message);
    toast.success(joined ? "You left the group." : "You joined the group.");
    load();
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Cross campus study matching</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Tell Augur where you study and how you read, and we will match you with students on the same course, level and
          campus area, then sync you into a study group with a real meeting place and time.
        </p>

        {!user ? (
          <div className="glass mt-8 rounded-3xl p-10 text-center text-sm text-muted-foreground">
            <Link to="/auth" className="text-primary underline">
              Sign in
            </Link>{" "}
            to set up your study profile and see matches.
          </div>
        ) : loading ? (
          <div className="glass mt-8 flex items-center gap-2 rounded-3xl p-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading your campus
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <section className="glass h-fit rounded-3xl p-6">
              <h2 className="font-display text-lg font-semibold">Your study profile</h2>
              <div className="mt-4 grid gap-3">
                <label className="text-sm">
                  <span className="text-muted-foreground">School</span>
                  <input
                    value={me.school}
                    onChange={(e) => setMe({ ...me, school: e.target.value })}
                    placeholder="e.g. Lagos State University"
                    className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
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
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-sm">
                    <span className="text-muted-foreground">Campus area</span>
                    <input
                      value={me.campus_area}
                      onChange={(e) => setMe({ ...me, campus_area: e.target.value })}
                      placeholder="e.g. Ojo main campus"
                      className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
                    />
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
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save profile
                </button>
              </div>
            </section>

            <div className="space-y-6">
              <section className="glass rounded-3xl p-6">
                <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
                  <Sparkles className="h-4 w-4 text-primary" /> Your matches
                </h2>
                {matches.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    No matches yet. Save your profile with your school, department and level, and check back as more
                    students join.
                  </p>
                ) : (
                  <div className="mt-4 grid gap-3">
                    {matches.map(({ p, score }) => (
                      <div key={p.user_id} className="rounded-2xl border border-border bg-background/50 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                            {score}% match
                          </span>
                          <span className="text-sm font-medium">
                            {p.department || "Student"} · {p.level} level
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          {[p.school, p.campus_area, p.hostel].filter(Boolean).join(" · ")}
                        </p>
                        {p.about && <p className="mt-1.5 text-xs text-muted-foreground">{p.about}</p>}
                        <p className="mt-2 text-[11px] text-muted-foreground">
                          {p.availability && (
                            <span className="mr-3 inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {p.availability}
                            </span>
                          )}
                          {p.contact_handle && <span>Reach: {p.contact_handle}</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="glass rounded-3xl p-6">
                <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
                  <Users className="h-4 w-4 text-primary" /> Study groups
                </h2>

                <div className="mt-4 grid gap-2 rounded-2xl border border-border bg-background/50 p-4">
                  <input
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    placeholder="Group name, e.g. CSC 201 night readers"
                    className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <input
                    value={newGroup.topic}
                    onChange={(e) => setNewGroup({ ...newGroup, topic: e.target.value })}
                    placeholder="What you are studying"
                    className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      value={newGroup.meeting_place}
                      onChange={(e) => setNewGroup({ ...newGroup, meeting_place: e.target.value })}
                      placeholder="Meeting place, e.g. Main library"
                      className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    <input
                      value={newGroup.meeting_time}
                      onChange={(e) => setNewGroup({ ...newGroup, meeting_time: e.target.value })}
                      placeholder="Meeting time, e.g. Tue and Thu 6pm"
                      className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    onClick={createGroup}
                    disabled={creating}
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                  >
                    {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create group
                  </button>
                </div>

                <div className="mt-4 grid gap-3">
                  {groups.length === 0 && (
                    <p className="text-sm text-muted-foreground">No groups yet, be the first to start one.</p>
                  )}
                  {groups.map((g) => {
                    const joined = myGroups.includes(g.id);
                    return (
                      <div key={g.id} className="rounded-2xl border border-border bg-background/50 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold">{g.name}</h3>
                          <span className="text-[11px] text-muted-foreground">
                            {counts[g.id] ?? 0}/{g.capacity} members
                          </span>
                        </div>
                        {g.topic && <p className="mt-1 text-xs text-muted-foreground">{g.topic}</p>}
                        <p className="mt-1.5 text-[11px] text-muted-foreground">
                          {[g.school, g.department, g.level && `${g.level} level`].filter(Boolean).join(" · ")}
                        </p>
                        <p className="mt-1.5 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                          {g.meeting_place && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {g.meeting_place}
                            </span>
                          )}
                          {g.meeting_time && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {g.meeting_time}
                            </span>
                          )}
                        </p>
                        <button
                          onClick={() => toggleGroup(g.id, joined)}
                          className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold ${
                            joined
                              ? "border border-border hover:bg-accent/10"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {joined ? <LogOut className="h-3 w-3" /> : <LogIn className="h-3 w-3" />}
                          {joined ? "Leave group" : "Join group"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
