import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { listMyPaymentRequests, submitPaymentRequest } from "@/lib/payments.functions";
import { BANK_DETAILS, PLANS, PlanId, formatNaira } from "@/lib/payments-config";
import { toast } from "sonner";
import { Copy, Upload, Check, Clock, X as XIcon, Crown, ShieldCheck, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/upgrade")({
  head: () => ({
    meta: pageMeta({
      title: "Upgrade to Augur Premium — Pay in Naira",
      description:
        "Unlock Augur Pro and Professor Access. Pay by Opay bank transfer in naira and upload your receipt for fast approval.",
      path: "/upgrade",
    }),
    links: canonical("/upgrade"),
  }),

  component: UpgradePage,
});

const STATUS_META: Record<string, { icon: any; color: string; label: string }> = {
  pending: { icon: Clock, color: "text-amber-300 border-amber-500/40 bg-amber-500/10", label: "Under review" },
  approved: { icon: Check, color: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10", label: "Approved" },
  rejected: { icon: XIcon, color: "text-rose-300 border-rose-500/40 bg-rose-500/10", label: "Rejected" },
};

function UpgradePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const listMine = useServerFn(listMyPaymentRequests);
  const submit = useServerFn(submitPaymentRequest);

  const [plan, setPlan] = useState<PlanId>("pro_monthly");
  const [senderName, setSenderName] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [tier, setTier] = useState<string>("free");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    (async () => {
      const mine = await listMine();
      setHistory(mine as any[]);
      const { data } = await supabase
        .from("profiles")
        .select("subscription_tier, subscription_expires_at")
        .eq("id", user.id)
        .maybeSingle();
      setTier((data as any)?.subscription_tier ?? "free");
      setExpiresAt((data as any)?.subscription_expires_at ?? null);
    })();
  }, [user?.id, loading]);

  const selected = PLANS[plan];

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Copy failed");
    }
  }

  const ALLOWED_MIME = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/heic",
    "image/heif",
    "application/pdf",
  ];
  const ALLOWED_EXT = /\.(png|jpe?g|webp|heic|heif|pdf)$/i;
  const MAX_BYTES = 10 * 1024 * 1024;
  const MIN_BYTES = 2 * 1024;

  function validateFile(f: File | null): string | null {
    if (!f) return "Please attach your payment receipt (screenshot or PDF).";
    if (!ALLOWED_EXT.test(f.name)) return "Unsupported file type. Use PNG, JPG, WEBP, HEIC or PDF.";
    if (f.type && !ALLOWED_MIME.includes(f.type)) {
      return "Unsupported file type. Use PNG, JPG, WEBP, HEIC or PDF.";
    }
    if (f.size > MAX_BYTES) return "Receipt is too large — must be under 10 MB.";
    if (f.size < MIN_BYTES) return "Receipt looks empty or too small (min 2 KB).";
    return null;
  }

  function onPickFile(f: File | null) {
    if (!f) { setFile(null); return; }
    const err = validateFile(f);
    if (err) { toast.error(err); if (fileRef.current) fileRef.current.value = ""; return; }
    setFile(f);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    const trimmedSender = senderName.trim();
    if (!trimmedSender || trimmedSender.length < 2) {
      toast.error("Enter the name on the transfer (min 2 characters) so we can match it.");
      return;
    }
    if (trimmedSender.length > 120) {
      toast.error("Sender name is too long (max 120 characters).");
      return;
    }
    if (!/^[\p{L}\p{M}'\-.\s]+$/u.test(trimmedSender)) {
      toast.error("Sender name has invalid characters — letters, spaces, ' and - only.");
      return;
    }
    if (note.length > 500) {
      toast.error("Note is too long (max 500 characters).");
      return;
    }
    const fileErr = validateFile(file);
    if (fileErr) { toast.error(fileErr); return; }

    setUploading(true);
    try {
      const ext = (file!.name.split(".").pop() || "png").toLowerCase();
      const path = `${user.id}/${Date.now()}-${plan}.${ext}`;
      const { error: upErr } = await supabase.storage.from("receipts").upload(path, file!, {
        contentType: file!.type || "image/png",
        upsert: false,
      });
      if (upErr) throw upErr;
      await submit({
        data: {
          plan,
          amountNaira: selected.priceNaira,
          receiptPath: path,
          senderName: trimmedSender,
          note: note.trim() || undefined,
        },
      });
      toast.success("Receipt submitted — you'll get access as soon as we verify (usually within a few hours).");
      setFile(null);
      setSenderName("");
      setNote("");
      if (fileRef.current) fileRef.current.value = "";
      const mine = await listMine();
      setHistory(mine as any[]);
    } catch (err: any) {
      toast.error(err?.message ?? "Submission failed");
    } finally {
      setUploading(false);
    }
  }

  if (loading || !user) return null;

  const isPremium = tier !== "free";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Upgrade to <span className="text-gradient">Premium</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pay by bank transfer to our verified account, upload your receipt, and we'll unlock premium access after a quick review.
          </p>
        </div>

        {isPremium && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-200">
            <ShieldCheck className="h-5 w-5" />
            <div className="flex-1">
              <div className="text-sm font-semibold">You're on {tier}.</div>
              {expiresAt && (
                <div className="text-xs opacity-80">Renews / expires {new Date(expiresAt).toLocaleDateString()}</div>
              )}
            </div>
          </div>
        )}

        {/* Plans */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {(Object.keys(PLANS) as PlanId[]).map((id) => {
            const p = PLANS[id];
            const active = plan === id;
            return (
              <button
                key={id}
                onClick={() => setPlan(id)}
                className={`glass rounded-2xl p-4 text-left transition ${
                  active ? "ring-2 ring-primary glow-primary" : "hover:ring-1 hover:ring-border"
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Crown className={`h-4 w-4 ${p.tier === "lecturer" ? "text-amber-300" : "text-primary"}`} />
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {p.tier} · {p.period}
                  </span>
                </div>
                <div className="mb-1 font-display text-xl font-bold">{formatNaira(p.priceNaira)}</div>
                <div className="mb-2 text-xs text-muted-foreground">per {p.period}</div>
                <div className="text-sm">{p.blurb}</div>
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  {p.perks.map((k) => (
                    <li key={k} className="flex gap-1.5">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                      {k}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Bank details */}
          <div className="glass rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Step 1 · Send {formatNaira(selected.priceNaira)}</h2>
              <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {selected.name}
              </span>
            </div>

            <div className="space-y-3">
              <BankRow label="Bank" value={BANK_DETAILS.bankName} onCopy={copy} />
              <BankRow label="Account name" value={BANK_DETAILS.accountName} onCopy={copy} />
              <BankRow label="Account number" value={BANK_DETAILS.accountNumber} onCopy={copy} large />
              <BankRow label="Amount" value={formatNaira(selected.priceNaira)} onCopy={copy} />
              {BANK_DETAILS.altValue && (
                <BankRow label={BANK_DETAILS.altLabel} value={BANK_DETAILS.altValue} onCopy={copy} />
              )}
            </div>

            <div className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-200">
              <b>Important:</b> Use your Augur email <span className="font-mono">{user.email}</span> as the narration/description
              on your transfer so we can match it faster.
            </div>
          </div>

          {/* Upload */}
          <form onSubmit={onSubmit} className="glass rounded-2xl p-6">
            <h2 className="mb-4 font-display text-xl font-bold">Step 2 · Upload receipt</h2>

            <label className="mb-3 block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">
                Name on the transfer <span className="text-rose-400">*</span>
              </span>
              <input
                required
                minLength={2}
                maxLength={120}
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Adaeze Okafor"
                className="w-full rounded-xl border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="mb-3 block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">
                Note to admin (optional) · {note.length}/500
              </span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 500))}
                placeholder="Anything we should know…"
                rows={2}
                maxLength={500}
                className="w-full rounded-xl border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="mb-4 block cursor-pointer rounded-xl border-2 border-dashed border-border bg-background/40 p-4 text-center transition hover:border-primary">
              <input
                ref={fileRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.heic,.heif,.pdf,image/png,image/jpeg,image/webp,image/heic,image/heif,application/pdf"
                onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
              <Upload className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
              <div className="text-sm font-medium">
                {file ? `${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB` : "Tap to attach receipt"}
              </div>
              <div className="text-xs text-muted-foreground">PNG · JPG · WEBP · HEIC · PDF — up to 10 MB</div>
            </label>

            <button
              type="submit"
              disabled={uploading || !file || !senderName.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
            >
              {uploading ? "Submitting…" : "Submit for review"}
              {!uploading && <ArrowRight className="h-4 w-4" />}
            </button>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              We typically review within a few hours. You'll see the status below.
            </p>
          </form>
        </div>

        {/* History */}
        <div className="mt-10">
          <h2 className="mb-4 font-display text-xl font-bold">Your submissions</h2>
          {history.length === 0 ? (
            <div className="glass rounded-2xl p-6 text-center text-sm text-muted-foreground">
              No payment submissions yet.
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((h) => {
                const meta = STATUS_META[h.status] ?? STATUS_META.pending;
                const Icon = meta.icon;
                return (
                  <div key={h.id} className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${meta.color}`}>
                      <Icon className="h-3 w-3" />
                      {meta.label}
                    </span>
                    <span className="text-sm font-semibold">{PLANS[h.plan as PlanId]?.name ?? h.plan}</span>
                    <span className="text-sm text-muted-foreground">{formatNaira(h.amount_naira)}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {new Date(h.created_at).toLocaleString()}
                    </span>
                    {h.admin_notes && (
                      <div className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-muted-foreground">
                        <b className="text-foreground">Admin note:</b> {h.admin_notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Prefer another route?{" "}
          <Link to="/chat" className="text-primary hover:underline">
            Back to chat
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

function BankRow({
  label,
  value,
  onCopy,
  large,
}: {
  label: string;
  value: string;
  onCopy: (v: string, l: string) => void;
  large?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5">
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className={`font-mono ${large ? "text-lg font-bold" : "text-sm"} truncate`}>{value}</div>
      </div>
      <button
        type="button"
        onClick={() => onCopy(value, label)}
        className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs hover:bg-accent/20"
      >
        <Copy className="h-3 w-3" /> Copy
      </button>
    </div>
  );
}
