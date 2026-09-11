import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { augurAssist } from "@/lib/assist.functions";
import { useAuth } from "@/hooks/use-auth";
import { MessageCircle, X, Send, Loader2, GraduationCap } from "lucide-react";

type Turn = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What should I do on this page?",
  "Give me a quick plan for today",
  "Explain a topic I keep failing",
];

export function AugurBubble() {
  const { location } = useRouterState();
  const { user } = useAuth();
  const assist = useServerFn(augurAssist);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [turns.length, busy]);

  // The full chat page already is Augur, so the bubble steps aside there.
  if (location.pathname.startsWith("/chat")) return null;

  async function send(message: string) {
    const q = message.trim();
    if (!q || busy) return;
    const history = turns.slice(-8);
    setTurns((t) => [...t, { role: "user", content: q }]);
    setText("");
    setBusy(true);
    try {
      const res = await assist({ data: { message: q, page: location.pathname, history } });
      setTurns((t) => [...t, { role: "assistant", content: (res as any).answer }]);
    } catch (e: any) {
      setTurns((t) => [
        ...t,
        { role: "assistant", content: e?.message ?? "Augur could not answer just now. Please try again." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex max-h-[70vh] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card/95 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <GraduationCap className="h-3.5 w-3.5 text-primary-foreground" />
              </span>
              <div>
                <div className="text-sm font-semibold leading-none">Ask Augur</div>
                <div className="mt-0.5 text-[10px] text-muted-foreground">Here on every page</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close Augur" className="rounded-full p-1 hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {!user ? (
              <p className="text-xs text-muted-foreground">
                <Link to="/auth" className="text-primary underline">
                  Sign in
                </Link>{" "}
                so Augur can help you with your own subjects and level.
              </p>
            ) : turns.length === 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Stuck on anything? Ask right here, no need to leave the page.
                </p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="block w-full rounded-xl border border-border bg-background/60 px-3 py-2 text-left text-xs hover:border-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              turns.map((t, i) => (
                <div key={i} className={t.role === "user" ? "flex justify-end" : ""}>
                  <div
                    className={
                      t.role === "user"
                        ? "max-w-[85%] rounded-2xl bg-primary px-3 py-2 text-xs text-primary-foreground"
                        : "whitespace-pre-wrap text-xs leading-relaxed text-foreground"
                    }
                  >
                    {t.content}
                  </div>
                </div>
              ))
            )}
            {busy && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Augur is thinking
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(text);
                  }
                }}
                disabled={!user}
                placeholder={user ? "Ask Augur anything" : "Sign in to ask"}
                className="flex-1 rounded-full border border-border bg-background/60 px-3 py-2 text-xs outline-none focus:border-primary"
              />
              <button
                onClick={() => send(text)}
                disabled={!user || busy || !text.trim()}
                aria-label="Send to Augur"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
            <Link to="/chat" className="mt-2 block text-center text-[10px] text-muted-foreground hover:text-primary">
              Open the full Augur chat
            </Link>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Hide Augur" : "Ask Augur"}
        className="fixed bottom-5 right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-xl transition-transform hover:scale-105"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}
