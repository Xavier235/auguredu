import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Send, Hash, Users, Trash2, MessageCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Augur Chat — Talk to Professors & Peers" },
      {
        name: "description",
        content:
          "Live chat rooms for Augur students and professors. Share ideas, references and study tips in real time.",
      },
      { property: "og:title", content: "Augur Chat" },
      {
        property: "og:description",
        content: "Real-time chat rooms for Nigerian students and professors.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = {
  id: string;
  user_id: string;
  room: string;
  content: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

const ROOMS = [
  { id: "general", label: "General", desc: "Open lounge for everyone" },
  { id: "jamb", label: "JAMB Prep", desc: "UTME questions & tips" },
  { id: "professors", label: "Professors", desc: "Ask the lecturers" },
  { id: "study-buddies", label: "Study Buddies", desc: "Find your group" },
];

function ChatPage() {
  const { user, loading } = useAuth();
  const [room, setRoom] = useState("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentRoom = useMemo(
    () => ROOMS.find((r) => r.id === room) ?? ROOMS[0],
    [room],
  );

  // Load + subscribe
  useEffect(() => {
    if (!user) return;
    let active = true;

    (async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("room", room)
        .order("created_at", { ascending: true })
        .limit(100);
      if (!active) return;
      if (error) {
        toast.error("Couldn't load messages");
        return;
      }
      setMessages(data as Message[]);
    })();

    const channel = supabase
      .channel(`chat:${room}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room=eq.${room}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "chat_messages",
          filter: `room=eq.${room}`,
        },
        (payload) => {
          setMessages((prev) => prev.filter((m) => m.id !== (payload.old as Message).id));
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [room, user]);

  // Autoscroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send() {
    const content = input.trim();
    if (!content || !user || sending) return;
    setSending(true);

    // Fetch profile snapshot
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    const { error } = await supabase.from("chat_messages").insert({
      user_id: user.id,
      room,
      content,
      display_name: profile?.display_name ?? user.email?.split("@")[0] ?? "Student",
      avatar_url: profile?.avatar_url ?? null,
    });

    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setInput("");
  }

  async function remove(id: string) {
    const { error } = await supabase.from("chat_messages").delete().eq("id", id);
    if (error) toast.error(error.message);
  }

  return (
    <div className="bg-grid min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" /> Now live
          </div>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">
            <MessageCircle className="mr-2 inline h-6 w-6 text-primary" />
            Augur Chat
          </h1>
        </div>

        {!user && !loading ? (
          <SignedOut />
        ) : (
          <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
            {/* Rooms */}
            <aside className="rounded-2xl border border-border/60 bg-card/40 p-3">
              <div className="mb-2 flex items-center gap-1.5 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> Rooms
              </div>
              <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
                {ROOMS.map((r) => {
                  const active = r.id === room;
                  return (
                    <li key={r.id} className="shrink-0 lg:shrink">
                      <button
                        onClick={() => setRoom(r.id)}
                        className={`flex w-full min-w-0 items-start gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <Hash className="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{r.label}</span>
                          <span
                            className={`hidden text-xs lg:block ${
                              active ? "text-primary-foreground/80" : "text-muted-foreground"
                            }`}
                          >
                            {r.desc}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            {/* Messages */}
            <section className="flex h-[calc(100vh-16rem)] min-h-[500px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/30">
              <header className="flex items-center justify-between border-b border-border/60 px-5 py-3">
                <div>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    {currentRoom.label}
                  </div>
                  <div className="text-xs text-muted-foreground">{currentRoom.desc}</div>
                </div>
              </header>

              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-5">
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Be the first to say hi in #{currentRoom.label} 👋
                  </div>
                ) : (
                  messages.map((m) => {
                    const mine = m.user_id === user?.id;
                    const initial =
                      (m.display_name ?? "?").trim().charAt(0).toUpperCase() || "?";
                    return (
                      <div
                        key={m.id}
                        className={`flex items-start gap-3 ${mine ? "flex-row-reverse" : ""}`}
                      >
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-semibold text-primary-foreground">
                          {m.avatar_url ? (
                            <img
                              src={m.avatar_url}
                              alt=""
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            initial
                          )}
                        </div>
                        <div className={`group max-w-[75%] min-w-0 ${mine ? "text-right" : ""}`}>
                          <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground/80">
                              {m.display_name ?? "Student"}
                            </span>
                            <span>
                              {formatDistanceToNow(new Date(m.created_at), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <div
                            className={`inline-block whitespace-pre-wrap break-words rounded-2xl px-4 py-2 text-sm ${
                              mine
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            {m.content}
                          </div>
                          {mine && (
                            <button
                              onClick={() => remove(m.id)}
                              className="ml-2 inline-flex items-center text-xs text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                              aria-label="Delete message"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex items-center gap-2 border-t border-border/60 p-3"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Message #${currentRoom.label}`}
                  className="flex-1 rounded-full border border-border bg-background/70 px-4 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
                  maxLength={2000}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary/90 hover:glow-primary disabled:opacity-50"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </section>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function SignedOut() {
  return (
    <div className="rounded-3xl border border-border/60 bg-card/40 p-10 text-center">
      <h2 className="font-display text-2xl font-semibold">Sign in to join the chat</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Augur Chat is free and open to every signed-in student. Create an account
        or sign in to start talking to professors and peers.
      </p>
      <Link
        to="/auth"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 hover:glow-primary"
      >
        Sign in to continue
      </Link>
    </div>
  );
}
