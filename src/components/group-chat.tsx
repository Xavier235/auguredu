import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

type Msg = {
  id: string;
  group_id: string;
  user_id: string;
  sender_name: string;
  body: string;
  created_at: string;
};

export function GroupChat({
  groupId,
  userId,
  senderName,
}: {
  groupId: string;
  userId: string;
  senderName: string;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await (supabase as any)
      .from("study_group_messages")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true })
      .limit(200);
    if (error) toast.error(error.message);
    setMessages((data ?? []) as Msg[]);
    setLoading(false);
  }, [groupId]);

  useEffect(() => {
    load();
    const channel = supabase
      .channel(`group-chat-${groupId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "study_group_messages", filter: `group_id=eq.${groupId}` },
        (payload) => {
          setMessages((prev) =>
            prev.some((m) => m.id === (payload.new as Msg).id) ? prev : [...prev, payload.new as Msg],
          );
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId, load]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  async function send() {
    const body = text.trim();
    if (!body) return;
    setSending(true);
    const { error } = await (supabase as any)
      .from("study_group_messages")
      .insert({ group_id: groupId, user_id: userId, sender_name: senderName, body });
    setSending(false);
    if (error) return toast.error(error.message);
    setText("");
  }

  return (
    <div className="mt-3 rounded-2xl border border-border bg-background/60 p-3">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        Group chat
      </div>

      <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
        {loading ? (
          <div className="flex items-center gap-2 py-3 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" /> Loading messages
          </div>
        ) : messages.length === 0 ? (
          <p className="py-3 text-xs text-muted-foreground">
            No messages yet. Say hello and agree on what to read today.
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.user_id === userId;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs ${
                    mine ? "bg-primary text-primary-foreground" : "border border-border bg-surface/60"
                  }`}
                >
                  {!mine && (
                    <div className="mb-0.5 text-[10px] font-semibold opacity-70">{m.sender_name}</div>
                  )}
                  <div className="whitespace-pre-wrap break-words">{m.body}</div>
                  <div className="mt-0.5 text-[9px] opacity-60">
                    {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Message your group"
          className="flex-1 rounded-full border border-border bg-background/60 px-4 py-2 text-xs outline-none focus:border-primary"
        />
        <button
          onClick={send}
          disabled={sending || !text.trim()}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
          aria-label="Send message"
        >
          {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
