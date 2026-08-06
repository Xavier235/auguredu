import { pageMeta, canonical, serviceJsonLd } from "@/lib/seo";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import {
  listThreads,
  createThread,
  deleteThread,
  listMessages,
  sendChatMessage,
  generateFlashcardsFromAttachment,
  CHAT_MODES,
  type ChatMode,
} from "@/lib/chat.functions";
import { cleanAugurText } from "@/lib/text-clean";
import { MicButton, SpeakButton } from "@/components/voice";
import {
  Send,
  Plus,
  Trash2,
  Sparkles,
  Paperclip,
  Loader2,
  FileText,
  ImageIcon,
  Lock,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const searchSchema = z.object({ t: z.string().uuid().optional() });

export const Route = createFileRoute("/chat")({
  validateSearch: searchSchema,
  head: () => ({
    meta: pageMeta({
      title: "Augur AI — Nigerian University Study Buddy",
      description:
        "Ask Augur AI about JAMB, coursework and study plans by text or voice, upload PDFs for flashcards and earn reading XP.",
      path: "/chat",
    }),
    links: canonical("/chat"),
    scripts: serviceJsonLd({
      name: "Augur AI Study Buddy",
      serviceType: "AI tutoring",
      description:
        "AI tutoring for Nigerian students covering JAMB drills, coursework explanations, past questions and study blueprints.",
      path: "/chat",
    }),
  }),

  component: ChatPage,
});

type Thread = { id: string; title: string; room: string; updated_at: string };
type Attachment = { url: string; name: string; mimeType: string };
type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  attachments: Attachment[];
  created_at: string;
};

const ROOMS = [
  { id: "study-buddy", label: "Study Buddy", desc: "General AI help", icon: Sparkles },
  { id: "jamb-tutor", label: "JAMB Tutor", desc: "UTME prep drills", icon: BookOpen },
  { id: "essay-coach", label: "Essay Coach", desc: "Writing feedback", icon: FileText },
];

function ChatPage() {
  const { user, loading } = useAuth();
  const { t: activeIdParam } = Route.useSearch();
  const navigate = useNavigate();

  const list = useServerFn(listThreads);
  const create = useServerFn(createThread);
  const remove = useServerFn(deleteThread);
  const loadMsgs = useServerFn(listMessages);
  const send = useServerFn(sendChatMessage);
  const genCards = useServerFn(generateFlashcardsFromAttachment);

  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [mode, setMode] = useState<ChatMode>("study-buddy");
  const [uploading, setUploading] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<
    { path: string; name: string; mimeType: string } | null
  >(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeThread = useMemo(
    () => threads.find((t) => t.id === activeIdParam) ?? null,
    [threads, activeIdParam],
  );

  // Load threads on sign-in
  useEffect(() => {
    if (!user) return;
    list().then((rows) => {
      setThreads(rows);
      if (!activeIdParam && rows.length > 0) {
        navigate({ to: "/chat", search: { t: rows[0].id }, replace: true });
      }
    }).catch((e) => toast.error(e.message));
  }, [user]);

  // Load messages
  useEffect(() => {
    if (!activeIdParam) {
      setMessages([]);
      return;
    }
    loadMsgs({ data: { threadId: activeIdParam } })
      .then(setMessages)
      .catch((e) => toast.error(e.message));
  }, [activeIdParam]);

  // Autoscroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function newThread(room = "study-buddy") {
    const t = await create({ data: { room, title: "New chat" } });
    setThreads((cur) => [{ ...t, updated_at: new Date().toISOString() }, ...cur]);
    navigate({ to: "/chat", search: { t: t.id } });
    setSidebarOpen(false);
  }

  async function deleteT(id: string) {
    await remove({ data: { threadId: id } });
    setThreads((cur) => cur.filter((t) => t.id !== id));
    if (activeIdParam === id) navigate({ to: "/chat", search: {} });
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File too large (max 20MB)");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() || "bin";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("chat-uploads").upload(path, file);
    setUploading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setPendingAttachment({ path, name: file.name, mimeType: file.type || "application/octet-stream" });
    toast.success(`${file.name} attached`);
  }

  async function submit() {
    if (!input.trim() && !pendingAttachment) return;
    if (sending) return;
    let threadId = activeIdParam;
    if (!threadId) {
      const t = await create({ data: { room: "study-buddy", title: "New chat" } });
      setThreads((cur) => [{ ...t, updated_at: new Date().toISOString() }, ...cur]);
      threadId = t.id;
      navigate({ to: "/chat", search: { t: threadId } });
    }

    setSending(true);
    // Optimistic user message
    const attachments = pendingAttachment
      ? [{ url: "", name: pendingAttachment.name, mimeType: pendingAttachment.mimeType }]
      : [];
    const optimistic: Message = {
      id: `tmp-${Date.now()}`,
      role: "user",
      content: input || "(attached file)",
      attachments,
      created_at: new Date().toISOString(),
    };
    setMessages((cur) => [...cur, optimistic]);
    const contentToSend = input || `I've attached ${pendingAttachment?.name}. Please summarise it and help me understand it.`;
    const attToSend = pendingAttachment ? [pendingAttachment] : [];
    setInput("");
    setPendingAttachment(null);

    try {
      await send({
        data: { threadId, content: contentToSend, attachments: attToSend, mode },
      });
      // Reload messages fresh (gets real IDs + signed URLs)
      const fresh = await loadMsgs({ data: { threadId } });
      setMessages(fresh);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to send");
      setMessages((cur) => cur.filter((m) => m.id !== optimistic.id));
    } finally {
      setSending(false);
    }
  }

  async function generateFlashcards() {
    if (!pendingAttachment) {
      toast.error("Attach a PDF or image first");
      return;
    }
    setSending(true);
    try {
      const res = await genCards({
        data: {
          attachmentPath: pendingAttachment.path,
          mimeType: pendingAttachment.mimeType,
          name: pendingAttachment.name,
        },
      });
      toast.success(`Generated ${res.cards.length} flashcards from "${res.deckName}"`);
      // Post a system-like assistant message showing cards
      const summary = res.cards
        .map((c, i) => `**Q${i + 1}.** ${c.q}\n**A.** ${c.a}`)
        .join("\n\n");
      setMessages((cur) => [
        ...cur,
        {
          id: `flash-${Date.now()}`,
          role: "assistant",
          content: `📇 **Flashcards from ${res.deckName}**\n\n${summary}${res.pdfId ? `\n\n[Open reader & earn XP →](/read/${res.pdfId})` : ""}`,
          attachments: [],
          created_at: new Date().toISOString(),
        },
      ]);
      setPendingAttachment(null);
    } catch (e: any) {
      toast.error(e.message ?? "Couldn't generate flashcards");
    } finally {
      setSending(false);
    }
  }

  if (!user && !loading) {
    return (
      <div className="bg-grid min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="font-display text-3xl font-semibold">Sign in to chat with Augur AI</h1>
          <p className="mt-2 text-muted-foreground">Free, private, and made for Nigerian students.</p>
          <Link
            to="/auth"
            className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Sign in
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="bg-grid min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-border/60 p-2 lg:hidden"
              aria-label="Open chats"
            >
              <Menu className="h-4 w-4" />
            </button>
            <h1 className="font-display text-xl font-semibold sm:text-2xl">
              <Sparkles className="mr-2 inline h-5 w-5 text-primary" />
              Augur AI
            </h1>
          </div>
          <button
            onClick={() => newThread()}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" /> New chat
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside
            className={`fixed inset-0 z-40 bg-background/95 backdrop-blur p-4 lg:static lg:z-auto lg:bg-transparent lg:p-0 lg:backdrop-blur-none ${
              sidebarOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="flex items-center justify-between lg:hidden">
              <div className="text-sm font-semibold">Your chats</div>
              <button onClick={() => setSidebarOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 space-y-4 lg:mt-0">
              <div>
                <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Start a new chat
                </div>
                <div className="grid gap-1.5">
                  {ROOMS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => newThread(r.id)}
                      className="flex items-start gap-2 rounded-xl border border-border/60 bg-card/40 p-2.5 text-left text-sm hover:border-primary/40 hover:bg-card/70"
                    >
                      <r.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <div className="font-medium">{r.label}</div>
                        <div className="text-xs text-muted-foreground">{r.desc}</div>
                      </div>
                    </button>
                  ))}
                  <Link
                    to="/upgrade"
                    className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-500/5 p-2.5 text-left text-sm hover:border-amber-500/70 hover:bg-amber-500/10"
                  >
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                    <div>
                      <div className="font-medium">Talk to a Professor</div>
                      <div className="text-xs text-muted-foreground">
                        Premium — human-style worked examples & syllabus mapping.
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              <div>
                <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Recent
                </div>
                <ul className="space-y-1">
                  {threads.length === 0 && (
                    <li className="px-2 text-xs text-muted-foreground">No chats yet.</li>
                  )}
                  {threads.map((t) => {
                    const active = t.id === activeIdParam;
                    return (
                      <li key={t.id} className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            navigate({ to: "/chat", search: { t: t.id } });
                            setSidebarOpen(false);
                          }}
                          className={`flex-1 truncate rounded-lg px-3 py-2 text-left text-sm ${
                            active
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          {t.title}
                        </button>
                        <button
                          onClick={() => deleteT(t.id)}
                          className="rounded p-1.5 text-muted-foreground opacity-60 hover:bg-destructive/10 hover:text-destructive hover:opacity-100"
                          aria-label="Delete chat"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </aside>

          {/* Chat pane */}
          <section className="flex h-[calc(100vh-14rem)] min-h-[500px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/30">
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
              {messages.length === 0 && !sending && (
                <EmptyHint activeRoom={activeThread?.room ?? "study-buddy"} />
              )}
              {messages.map((m) => (
                <Bubble key={m.id} m={m} />
              ))}
              {sending && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Augur is thinking…
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-border/60 p-3">
              {pendingAttachment && (
                <div className="mb-2 flex items-center justify-between gap-2 rounded-lg bg-muted/60 px-3 py-2 text-xs">
                  <div className="flex min-w-0 items-center gap-2">
                    {pendingAttachment.mimeType.startsWith("image/") ? (
                      <ImageIcon className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span className="truncate">{pendingAttachment.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={generateFlashcards}
                      className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-foreground hover:bg-accent/80"
                    >
                      ✨ Flashcards
                    </button>
                    <button
                      onClick={() => setPendingAttachment(null)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
              <div className="mb-2 flex flex-wrap gap-1.5">
                {(Object.keys(CHAT_MODES) as ChatMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                      mode === m
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-background/60 text-muted-foreground hover:bg-accent/10"
                    }`}
                  >
                    {CHAT_MODES[m]}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
                className="flex items-end gap-2"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,image/*"
                  className="hidden"
                  onChange={onFile}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background/70 hover:bg-muted disabled:opacity-50"
                  aria-label="Attach"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
                </button>
                <MicButton
                  disabled={sending}
                  onTranscript={(t) => setInput((cur) => (cur ? `${cur} ${t}` : t))}
                />
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Augur anything, type, speak or attach a PDF…"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  className="flex-1 resize-none rounded-2xl border border-border bg-background/70 px-4 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
                />
                <button
                  type="submit"
                  disabled={sending || (!input.trim() && !pendingAttachment)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function EmptyHint({ activeRoom }: { activeRoom: string }) {
  const room = ROOMS.find((r) => r.id === activeRoom) ?? ROOMS[0];
  const suggestions =
    activeRoom === "jamb-tutor"
      ? ["Give me 5 JAMB Chemistry MCQs on organic chem", "Explain the periodic table trends", "Quiz me on Mathematics probability"]
      : activeRoom === "essay-coach"
      ? ["Outline a 500-word essay on climate change in Nigeria", "Review this paragraph for clarity", "Give me a strong intro for my GST report"]
      : ["Explain CGPA calculation with an example", "What's MTH 101 usually about?", "Plan a 2-week revision for JAMB Physics"];

  return (
    <div className="mx-auto max-w-lg py-10 text-center">
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
        <room.icon className="h-6 w-6" />
      </div>
      <h3 className="font-display text-lg font-semibold">{room.label}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{room.desc}</p>
      <div className="mt-6 grid gap-2">
        {suggestions.map((s) => (
          <div key={s} className="rounded-xl border border-border/60 bg-card/40 p-3 text-left text-sm">
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

// Renders assistant markdown-ish content with course-code chips
function renderContent(text: string) {
  // Split by course code pattern MTH 101 / MTH101 / CSC 202
  const re = /\b([A-Z]{2,4})\s?(\d{3})\b/g;
  const parts: Array<{ t: "text" | "chip"; v: string }> = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ t: "text", v: text.slice(last, m.index) });
    parts.push({ t: "chip", v: `${m[1]} ${m[2]}` });
    last = re.lastIndex;
  }
  if (last < text.length) parts.push({ t: "text", v: text.slice(last) });
  return parts.map((p, i) =>
    p.t === "chip" ? (
      <span
        key={i}
        className="mx-0.5 inline-flex items-center rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary"
      >
        {p.v}
      </span>
    ) : (
      <span key={i}>{p.v}</span>
    ),
  );
}

function Bubble({ m }: { m: Message }) {
  const mine = m.role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
          mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
        }`}
      >
        {m.attachments?.length > 0 && (
          <div className={`mb-2 flex flex-wrap gap-2 ${mine ? "justify-end" : ""}`}>
            {m.attachments.map((a, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-1.5 rounded-md bg-background/50 px-2 py-1 text-xs text-foreground"
              >
                {a.mimeType?.startsWith("image/") ? <ImageIcon className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                <span className="max-w-[180px] truncate">{a.name}</span>
              </div>
            ))}
          </div>
        )}
        <div className="whitespace-pre-wrap break-words leading-relaxed">
          {cleanAugurText(m.content).split("\n").map((line, i) => (
            <div key={i}>{renderContent(line)}</div>
          ))}
        </div>
        {!mine && m.content.trim().length > 0 && <SpeakButton text={cleanAugurText(m.content)} />}
      </div>
    </div>
  );
}
