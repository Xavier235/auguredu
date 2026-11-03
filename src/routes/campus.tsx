import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GroupChat } from "@/components/group-chat";
import { DirectChat } from "@/components/direct-chat";
import {
  EMPTY_PROFILE,
  fetchStudyProfile,
  splitList,
  studyProfileSummary,
  type StudyProfile,
} from "@/components/study-profile-form";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { pageMeta, canonical } from "@/lib/seo";
import { toast } from "sonner";
import {
  Users,
  MapPin,
  Clock,
  Plus,
  LogIn,
  LogOut,
  Loader2,
  Sparkles,
  MessageCircle,
  MessagesSquare,
  Settings2,
} from "lucide-react";

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

type Tab = "matches" | "groups" | "chats";

const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "matches", label: "Matches", icon: Sparkles },
  { id: "groups", label: "Groups", icon: Users },
  { id: "chats", label: "Active chats", icon: MessagesSquare },
];

/**
 * Weighted match. Shared course codes and overlapping free days matter most
 * after department and level, because those decide whether two students can
 * actually sit down and read together.
 */
function matchDetail(me: StudyProfile, other: StudyProfile) {
  let s = 0;
  const reasons: string[] = [];

  const myCourses = splitList(me.courses);
  const theirCourses = splitList(other.courses);
  const sharedCourses = myCourses.filter((c) => theirCourses.includes(c));
  if (sharedCourses.length) {
    s += Math.min(30, sharedCourses.length * 12);
    reasons.push(`${sharedCourses.length} shared course${sharedCourses.length > 1 ? "s" : ""}: ${sharedCourses.slice(0, 4).join(", ")}`);
  }

  if (me.department && me.department === other.department) {
    s += 25;
    reasons.push("Same department");
  }
  if (me.level && me.level === other.level) {
    s += 15;
    reasons.push(`Both in ${other.level} level`);
  }
  if (me.school && other.school && me.school.toLowerCase() === other.school.toLowerCase()) {
    s += 15;
    reasons.push("Same school");
  }

  if (me.track && me.track === other.track) {
    s += 20;
    reasons.push(`Both ${other.track === "university" ? "university students" : other.track.toUpperCase() + " candidates"}`);
  }
  if (me.stream && me.stream === other.stream) {
    s += 10;
    reasons.push(`Same ${other.stream} stream`);
  }

  const myDays = splitList(me.days);
  const sharedDays = splitList(other.days).filter((d) => myDays.includes(d));
  if (sharedDays.length) {
    s += Math.min(10, sharedDays.length * 3);
    reasons.push(`Both free ${sharedDays.join(", ")}`);
  }

  if (me.campus_area && other.campus_area && me.campus_area.toLowerCase() === other.campus_area.toLowerCase()) {
    s += 8;
    reasons.push("Same campus area");
  }
  if (me.hostel && other.hostel && me.hostel.toLowerCase() === other.hostel.toLowerCase()) {
    s += 4;
    reasons.push("Stay in the same place");
  }
  if (me.study_style && me.study_style === other.study_style) {
    s += 3;
    reasons.push("Same study style");
  }
  if (me.goal && other.goal && me.goal.trim().toLowerCase() === other.goal.trim().toLowerCase()) {
    s += 5;
    reasons.push("Chasing the same goal");
  }

  return { score: Math.min(100, s), reasons, sharedCourses };
}

function CampusPage() {
  const { user } = useAuth();
  const [me, setMe] = useState<StudyProfile>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [peers, setPeers] = useState<StudyProfile[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<string[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [creating, setCreating] = useState(false);
  const [tab, setTab] = useState<Tab>("matches");
  const [dmWith, setDmWith] = useState<string | null>(null);
  const [openChat, setOpenChat] = useState<string | null>(null);
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
    const [{ data: allProfiles }, { data: allGroups }, { data: members }] = await Promise.all([
      supabase.from("study_profiles").select("*").eq("discoverable", true).limit(300),
      supabase.from("study_groups").select("*, member_count").order("created_at", { ascending: false }).limit(100),
      supabase.from("study_group_members").select("group_id, user_id").eq("user_id", user.id),
    ]);
    setPeers(((allProfiles ?? []) as any[]).filter((p) => p.user_id !== user.id));
    setGroups((allGroups ?? []) as any[]);
    const tally: Record<string, number> = {};
    const mineIds: string[] = [];
    for (const g of (allGroups ?? []) as any[]) tally[g.id] = Number(g.member_count) || 0;
    for (const m of (members ?? []) as any[]) mineIds.push(m.group_id);
    setCounts(tally);
    setMyGroups(mineIds);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  // Refresh the local summary whenever the student saves their profile in Settings.
  useEffect(() => {
    if (!user) return;
    const onStorage = () => {
      fetchStudyProfile(user.id).then((p) => p && setMe(p));
    };
    onStorage();
    window.addEventListener("focus", onStorage);
    return () => window.removeEventListener("focus", onStorage);
  }, [user?.id]);

  const matches = useMemo(() => {
    if (!me.school && !me.department) return [];
    return peers
      .map((p) => ({ p, ...matchDetail(me, p) }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }, [peers, me]);

  const joinedGroups = useMemo(
    () => groups.filter((g) => myGroups.includes(g.id)),
    [groups, myGroups],
  );

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
    if (!joined) setOpenChat(id);
    load();
  }

  const summary = studyProfileSummary(me);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Cross campus study matching</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Match with students on the same course, level and campus area, then read together in a study group chat with
          a real meeting place and time.
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
          <div className="mt-8 space-y-6">
            {/* Compact profile summary */}
            <section className="glass flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6">
              <div className="min-w-0">
                <h2 className="font-display text-lg font-semibold">Your study profile</h2>
                {summary ? (
                  <>
                    <p className="mt-1 text-sm text-muted-foreground">{summary}</p>
                    {me.about && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{me.about}</p>}
                  </>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">
                    No study profile yet. Set it up once and you will start appearing in matches.
                  </p>
                )}
              </div>
              <Link
                to="/settings"
                className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20"
              >
                <Settings2 className="h-4 w-4" />
                {summary ? "Edit study profile" : "Set up study profile"}
              </Link>
            </section>

            {/* Mobile tabs */}
            <div className="flex gap-1.5 lg:hidden">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                    tab === t.id
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  <t.icon className="h-3.5 w-3.5" /> {t.label}
                  {t.id === "chats" && joinedGroups.length > 0 && (
                    <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                      {joinedGroups.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Active chats */}
            <section className={`glass rounded-3xl p-6 ${tab === "chats" ? "block" : "hidden"} lg:block`}>
              <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
                <MessagesSquare className="h-4 w-4 text-primary" /> Active chats
              </h2>
              {joinedGroups.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Join a study group and its chat opens here, right on this page.
                </p>
              ) : (
                <div className="mt-4 grid gap-4">
                  {joinedGroups.map((g) => (
                    <div key={g.id} className="rounded-2xl border border-border bg-background/50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold">{g.name}</h3>
                        <span className="text-[11px] text-muted-foreground">
                          {counts[g.id] ?? 0}/{g.capacity} members
                        </span>
                      </div>
                      {g.meeting_place || g.meeting_time ? (
                        <p className="mt-1 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
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
                      ) : null}
                      {user && openChat !== null && openChat !== g.id ? null : null}
                      <GroupChat
                        groupId={g.id}
                        userId={user.id}
                        senderName={String(
                          user.user_metadata?.display_name ?? user.email?.split("@")[0] ?? "Student",
                        ).slice(0, 60)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
              {/* Matches */}
              <section className={`glass rounded-3xl p-6 ${tab === "matches" ? "block" : "hidden"} lg:block`}>
                <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
                  <Sparkles className="h-4 w-4 text-primary" /> Your matches
                </h2>
                {matches.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {me.school
                      ? "No matches yet, check back as more students join."
                      : "Set up your study profile with your school, department and level, and matches will appear here."}
                  </p>
                ) : (
                  <div className="mt-4 grid gap-3">
                    {matches.map(({ p, score, reasons }) => (
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
                        {reasons.length > 0 && (
                          <p className="mt-1 text-[11px] text-muted-foreground">{reasons.slice(0, 3).join(" · ")}</p>
                        )}
                        {p.about && <p className="mt-1.5 text-xs text-muted-foreground">{p.about}</p>}
                        <p className="mt-2 text-[11px] text-muted-foreground">
                          {p.availability && (
                            <span className="mr-3 inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {p.availability}
                            </span>
                          )}
                          {p.contact_handle && <span>Reach: {p.contact_handle}</span>}
                        </p>
                        {user && (dmWith === p.user_id ? (
                          <DirectChat
                            userId={user.id}
                            peerId={p.user_id}
                            peerLabel={p.department || "your match"}
                            senderName={user.email?.split("@")[0] ?? "Student"}
                            onClose={() => setDmWith(null)}
                          />
                        ) : (
                          <button
                            onClick={() => setDmWith(p.user_id)}
                            className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                          >
                            <MessageCircle className="h-3 w-3" /> Message
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Groups */}
              <section className={`glass rounded-3xl p-6 ${tab === "groups" ? "block" : "hidden"} lg:block`}>
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
                        {joined && (
                          <button
                            onClick={() => setTab("chats")}
                            className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                          >
                            <MessagesSquare className="h-3 w-3" /> Open chat
                          </button>
                        )}
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
