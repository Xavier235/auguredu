import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useServerFn } from "@tanstack/react-start";
import { amIAdmin, listAllPaymentRequests, decidePaymentRequest } from "@/lib/payments.functions";
import { PLANS, PlanId, formatNaira } from "@/lib/payments-config";
import { toast } from "sonner";
import { Check, X as XIcon, ExternalLink, Loader2, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({
    meta: [
      { title: "Admin · Payments — Augur.edu" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPayments,
});

function AdminPayments() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const check = useServerFn(amIAdmin);
  const list = useServerFn(listAllPaymentRequests);
  const decide = useServerFn(decidePaymentRequest);

  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [rows, setRows] = useState<any[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/auth" }); return; }
    (async () => {
      try {
        const r = await check();
        setAllowed(r.admin);
      } catch { setAllowed(false); }
    })();
  }, [user?.id, loading]);

  useEffect(() => {
    if (allowed) refresh();
  }, [allowed, status]);

  async function refresh() {
    try {
      const r = await list({ data: { status } });
      setRows(r as any[]);
    } catch (e: any) { toast.error(e?.message ?? "Failed to load"); }
  }

  async function act(id: string, decision: "approved" | "rejected") {
    setBusyId(id);
    try {
      await decide({ data: { id, decision, adminNotes: notes[id] || undefined } });
      toast.success(decision === "approved" ? "Approved — user upgraded" : "Rejected");
      await refresh();
    } catch (e: any) { toast.error(e?.message ?? "Action failed"); }
    finally { setBusyId(null); }
  }

  if (loading) return null;
  if (allowed === null) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-md px-4 py-20 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <SiteFooter />
      </div>
    );
  }
  if (!allowed) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-md px-4 py-20 text-center">
          <ShieldAlert className="mx-auto mb-3 h-10 w-10 text-amber-400" />
          <h1 className="mb-2 font-display text-2xl font-bold">Admin access required</h1>
          <p className="text-sm text-muted-foreground">
            You need the <code className="rounded bg-muted px-1.5 py-0.5">admin</code> role to view payment approvals.
          </p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Payment approvals</h1>
            <p className="text-sm text-muted-foreground">Review receipts and grant premium access.</p>
          </div>
          <div className="flex gap-1 rounded-full border border-border bg-background/60 p-1">
            {(["pending", "approved", "rejected", "all"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
                  status === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
            No {status === "all" ? "" : status} submissions.
          </div>
        ) : (
          <div className="space-y-4">
            {rows.map((r) => (
              <div key={r.id} className="glass rounded-2xl p-5">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">
                      {r.profile?.display_name ?? "Student"} · {PLANS[r.plan as PlanId]?.name ?? r.plan}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {r.profile?.school ?? "—"} · Submitted {new Date(r.created_at).toLocaleString()}
                    </div>
                    {r.sender_name && (
                      <div className="mt-1 text-xs">Transfer name: <b>{r.sender_name}</b></div>
                    )}
                    {r.note && (
                      <div className="mt-1 text-xs italic text-muted-foreground">"{r.note}"</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{formatNaira(r.amount_naira)}</div>
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${
                      r.status === "approved" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" :
                      r.status === "rejected" ? "border-rose-500/40 bg-rose-500/10 text-rose-300" :
                      "border-amber-500/40 bg-amber-500/10 text-amber-300"
                    }`}>{r.status}</span>
                  </div>
                </div>

                {r.receipt_url && (
                  <a
                    href={r.receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs hover:bg-accent/20"
                  >
                    <ExternalLink className="h-3 w-3" /> View receipt
                  </a>
                )}

                {r.status === "pending" && (
                  <div className="mt-3 space-y-2 border-t border-border pt-3">
                    <input
                      value={notes[r.id] ?? ""}
                      onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))}
                      placeholder="Optional note to user"
                      className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => act(r.id, "approved")}
                        disabled={busyId === r.id}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                      >
                        <Check className="h-3 w-3" /> Approve & upgrade
                      </button>
                      <button
                        onClick={() => act(r.id, "rejected")}
                        disabled={busyId === r.id}
                        className="inline-flex items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 disabled:opacity-50"
                      >
                        <XIcon className="h-3 w-3" /> Reject
                      </button>
                    </div>
                  </div>
                )}

                {r.admin_notes && r.status !== "pending" && (
                  <div className="mt-2 rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-muted-foreground">
                    <b className="text-foreground">Note sent to user:</b> {r.admin_notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
