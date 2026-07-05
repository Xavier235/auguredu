import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  MessageCircle,
  GraduationCap,
  Users,
  BookOpen,
  Layers,
  FileText,
  Gift,
  Lock,
  Sparkles,
  Bell,
  Crown,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Augur Chat — Talk to Professors & Peers (Coming Soon)" },
      {
        name: "description",
        content:
          "Chat with professors and fellow students, exchange flashcards & reading references, and earn rewards for reading PDFs. Premium feature — launching soon.",
      },
      { property: "og:title", content: "Augur Chat — Premium (Coming Soon)" },
      {
        property: "og:description",
        content:
          "Professor & peer chat, flashcards, PDF reading rewards. Premium feature.",
      },
    ],
  }),
  component: ChatPage,
});

const features = [
  {
    icon: GraduationCap,
    title: "Chat with Professors",
    desc: "Direct lines to lecturers and subject-matter mentors for guidance on tough topics.",
  },
  {
    icon: Users,
    title: "Peer Study Rooms",
    desc: "Group chats with students taking the same courses, JAMB subjects, or targeting the same schools.",
  },
  {
    icon: BookOpen,
    title: "Reading References",
    desc: "Get curated textbook chapters, papers, and past questions shared straight into the chat.",
  },
  {
    icon: Layers,
    title: "Smart Flashcards",
    desc: "Auto-generated flashcards from conversations and shared notes — revise on the go.",
  },
  {
    icon: FileText,
    title: "PDF Exchange",
    desc: "Send and receive PDFs securely. Built-in reader with progress tracking.",
  },
  {
    icon: Gift,
    title: "Read-to-Earn Rewards",
    desc: "Earn Augur points for every PDF you open and finish. Redeem for premium credits.",
  },
];

function ChatPage() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <div className="bg-grid min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-10 md:p-16">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Crown className="h-3 w-3" /> Premium
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Lock className="h-3 w-3" /> Coming Soon
            </span>
          </div>
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight md:text-6xl">
            Chat with <span className="text-gradient">professors</span> & study
            with your peers.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            A private, focused space to swap reading references, flashcards and
            PDFs — and get rewarded every time you actually read them.
          </p>

          {/* Waitlist */}
          <div className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="you@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={joined}
              className="flex-1 rounded-full border border-border bg-background/60 px-5 py-3 text-sm outline-none ring-primary/30 focus:ring-2"
            />
            <button
              onClick={() => {
                if (!email.includes("@")) {
                  toast.error("Enter a valid email");
                  return;
                }
                setJoined(true);
                toast.success("You're on the list! We'll email you at launch.");
              }}
              disabled={joined}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:glow-primary disabled:opacity-60"
            >
              <Bell className="h-4 w-4" />
              {joined ? "You're in" : "Join waitlist"}
            </button>
          </div>

          <Sparkles className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 text-primary/10" />
        </section>

        {/* Features */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">
            What's coming
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur transition-all hover:border-primary/40 hover:bg-card/60"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Preview mock */}
        <section className="mt-16 rounded-3xl border border-border/50 bg-card/30 p-6 md:p-10">
          <h2 className="mb-6 flex items-center gap-2 font-display text-2xl font-semibold">
            <MessageCircle className="h-6 w-6 text-primary" /> Sneak peek
          </h2>
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-border bg-background/60">
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground">
                PA
              </div>
              <div>
                <div className="text-sm font-semibold">Prof. Adeyemi</div>
                <div className="text-xs text-muted-foreground">
                  Physics · UNILAG
                </div>
              </div>
            </div>
            <div className="space-y-3 p-5">
              <Bubble who="them">
                Here's the chapter on Newtonian mechanics — worth reading before
                Friday.
              </Bubble>
              <Bubble who="them" file="Mechanics_Ch3.pdf" />
              <Bubble who="me">Got it! Starting now 📖</Bubble>
              <Bubble who="system">
                🎉 +25 Augur points earned for finishing this PDF
              </Bubble>
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
              <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium">
                <Lock className="h-4 w-4" /> Unlocks with Augur Premium
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              ← Back to home
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Bubble({
  who,
  children,
  file,
}: {
  who: "me" | "them" | "system";
  children?: React.ReactNode;
  file?: string;
}) {
  if (who === "system") {
    return (
      <div className="text-center text-xs text-primary">{children}</div>
    );
  }
  const mine = who === "me";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
          mine
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        }`}
      >
        {file ? (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="font-medium">{file}</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
