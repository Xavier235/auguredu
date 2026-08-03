import { useEffect, useRef, useState } from "react";
import { Bell, Check, Loader2, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

type Notif = {
  id: string;
  kind: string;
  title: string;
  body: string | null;
  href: string | null;
  read_at: string | null;
  created_at: string;
};

const KIND_STYLE: Record<string, string> = {
  payment: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  xp: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  info: "border-primary/40 bg-primary/10 text-primary",
};

export function NotificationCenter() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const unread = items.filter((n) => !n.read_at).length;

  async function load() {
    if (!user) return;
    setLoading(true);
    const { data } = await (supabase as any)
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);
    setItems((data as Notif[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    load();
    const channel = supabase
      .channel(`notif-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function markAllRead() {
    if (!user || unread === 0) return;
    setItems((prev) => prev.map((n) => (n.read_at ? n : { ...n, read_at: new Date().toISOString() })));
    await (supabase as any)
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .is("read_at", null);
  }

  async function dismiss(id: string) {
    setItems((prev) => prev.filter((n) => n.id !== id));
    await (supabase as any).from("notifications").delete().eq("id", id);
  }

  if (!user) return null;

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={unread ? `${unread} unread notifications` : "Notifications"}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/50 transition-colors hover:bg-accent/20"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card/95 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="text-sm font-semibold">Notifications</div>
            <button
              onClick={markAllRead}
              disabled={unread === 0}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              <Check className="h-3 w-3" /> Mark all read
            </button>
          </div>

          <div className="max-h-[22rem] overflow-y-auto">
            {loading && items.length === 0 ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : items.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                Nothing yet. Payment updates and study rewards will land here.
              </div>
            ) : (
              items.map((n) => {
                const inner = (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${
                          KIND_STYLE[n.kind] ?? KIND_STYLE.info
                        }`}
                      >
                        {n.kind}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(n.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-1.5 text-sm font-medium leading-snug">{n.title}</div>
                    {n.body && <div className="mt-1 text-xs text-muted-foreground">{n.body}</div>}
                  </>
                );
                return (
                  <div
                    key={n.id}
                    className={`group relative border-b border-border/60 px-4 py-3 last:border-0 ${
                      n.read_at ? "opacity-70" : "bg-primary/5"
                    }`}
                  >
                    {n.href ? (
                      <Link to={n.href} onClick={() => setOpen(false)} className="block">
                        {inner}
                      </Link>
                    ) : (
                      inner
                    )}
                    <button
                      onClick={() => dismiss(n.id)}
                      aria-label="Dismiss notification"
                      className="absolute right-2 top-8 hidden rounded-full p-1 text-muted-foreground hover:text-foreground group-hover:block"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
