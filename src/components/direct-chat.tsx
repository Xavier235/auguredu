import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Send, X } from "lucide-react";

type Msg = { id: string; sender_id: string; recipient_id: string; body: string; created_at: string };

/** One to one chat between two matched students. */
export function DirectChat({
  userId,
  peerId,
  peerLabel,
  senderName,
  onClose,
}: {
  userId: string;
  peerId: string;
  peerLabel: string;
  senderName: string;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("direct_messages")
      .select("id, sender_id, recipient_id, body, created_at")
      .or(
        `and(sender_id.eq.${userId},recipient_id.eq.${peerId}),and(sender_id.eq.${peerId},recipient_id.eq.${userId})`,
      )
      .order("created_at", { ascending: true })
      .limit(200);
    if (error) toast.error(error.message);
    setMessages((data ?? []) as Msg[]);
    setLoading(false);
  }, [userId, peerId]);

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`dm-${[userId, peerId].sort().join("-")}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "direct_messages", filter: `recipient_id=eq.${userId}` },
        (p) => {
          const m = p.new as Msg;
          if (m.sender_id === peerId) setMessages((prev) => [...prev, m]);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [load, userId, peerId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  async function send() {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    const { data, error } = await supabase
      .from("direct_messages")
      .insert({ sender_id: userId, recipient_id: peerId, body: body.slice(0, 2000), sender_name: senderName })
      .select("id, sender_id, recipient_id, body, created_at")
      .single();
    setSending(false);
    if (error) return toast.error(error.message);
    setText("");
    setMessages((prev) => [...prev, data as Msg]);
  }

  return (
    <div className="mt-3 rounded-2xl border border-border bg-card/80 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold">Chat with {peerLabel}</span>
        <button onClick={onClose} aria-label="Close chat" className="rounded-full p-1 hover:bg-muted">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : messages.length === 0 ? (
          <p className="text-xs text-muted-foreground">Say hello and plan a reading session.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={m.sender_id === userId ? "flex justify-end" : ""}>
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-xs ${
                  m.sender_id === userId ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                {m.body}
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message"
          className="flex-1 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs outline-none focus:border-primary"
        />
        <button
          onClick={send}
          disabled={sending || !text.trim()}
          aria-label="Send"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
