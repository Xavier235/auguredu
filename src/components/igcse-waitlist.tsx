import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

export function IgcseWaitlist() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function join(e: React.FormEvent) {
    e.preventDefault();
    const v = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return toast.error("Enter a valid email.");
    setBusy(true);
    const { error } = await supabase.from("igcse_waitlist").insert({ email: v, source: "home" });
    setBusy(false);
    if (error && !/duplicate/i.test(error.message)) return toast.error("Could not join right now, try again.");
    setDone(true);
  }

  return (
    <section className="mx-auto max-w-4xl px-6 pb-16">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
        className="glass cursor-pointer rounded-3xl border border-primary/40 p-8 text-center transition-transform hover:scale-[1.01]"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3 w-3" /> Coming soon
        </span>
        <h2 className="mt-4 font-display text-2xl font-semibold md:text-3xl">The first AI powered IGCSE tutor</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Cambridge IGCSE practice, worked answers and a personal tutor that knows the syllabus. Tap to join the waitlist.
        </p>
        {open && (
          <div className="mt-6" onClick={(e) => e.stopPropagation()}>
            {done ? (
              <p className="text-sm font-medium text-primary">You are on the list. We will email you at launch.</p>
            ) : (
              <form onSubmit={join} className="mx-auto flex max-w-md gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  autoFocus
                  className="flex-1 rounded-full border border-border bg-background/60 px-4 py-2 text-sm outline-none focus:border-primary"
                />
                <button
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Join
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
