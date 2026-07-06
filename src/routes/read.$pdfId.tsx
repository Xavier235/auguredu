import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getPdfSignedUrl, awardReadingXp, getMyXp } from "@/lib/chat.functions";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, ArrowRight, Zap, BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/read/$pdfId")({
  params: {
    parse: (raw) => z.object({ pdfId: z.string().uuid() }).parse(raw),
    stringify: (p) => ({ pdfId: p.pdfId }),
  },
  head: () => ({
    meta: [
      { title: "Read & Earn — Augur" },
      {
        name: "description",
        content: "Read PDFs in Augur and earn XP for every page. Level up your profile and climb the leaderboard.",
      },
    ],
  }),
  component: ReaderPage,
});

function ReaderPage() {
  const { pdfId } = Route.useParams();
  const { user, loading: authLoading } = useAuth();
  const getUrl = useServerFn(getPdfSignedUrl);
  const award = useServerFn(awardReadingXp);
  const myXp = useServerFn(getMyXp);

  const [doc, setDoc] = useState<{ url: string | null; title: string; mimeType: string; pageCount: number } | null>(null);
  const [page, setPage] = useState(1);
  const [xp, setXp] = useState<{ xp: number; level: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [dwell, setDwell] = useState(0);
  const dwellStart = useRef<number>(Date.now());

  useEffect(() => {
    if (!user) return;
    getUrl({ data: { pdfId } })
      .then((d) => {
        setDoc(d);
        setLoading(false);
      })
      .catch((e) => {
        toast.error(e.message);
        setLoading(false);
      });
    myXp().then(setXp).catch(() => {});
  }, [user, pdfId]);

  // Reset dwell timer on page change
  useEffect(() => {
    dwellStart.current = Date.now();
    setDwell(0);
    const iv = setInterval(() => {
      setDwell(Math.floor((Date.now() - dwellStart.current) / 1000));
    }, 500);
    return () => clearInterval(iv);
  }, [page]);

  async function markRead() {
    const dwellMs = Date.now() - dwellStart.current;
    try {
      const res = await award({ data: { pdfId, page, dwellMs } });
      if (res.awarded > 0) {
        toast.success(`+${res.awarded} XP for page ${page}!`);
        setXp({ xp: (res as any).total ?? (xp?.xp ?? 0) + res.awarded, level: (res as any).level ?? xp?.level ?? 1 });
      } else {
        toast.info((res as any).reason ?? "No XP awarded");
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  if (authLoading) return null;
  if (!user) {
    return (
      <div className="bg-grid min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold">Sign in to read & earn XP</h1>
          <Link to="/auth" className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm text-primary-foreground">
            Sign in
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const canClaim = dwell >= 15;

  return (
    <div className="bg-grid min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link to="/chat" search={{}} className="mb-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3 w-3" /> Back to chat
            </Link>
            <h1 className="font-display text-xl font-semibold sm:text-2xl">
              <BookOpen className="mr-2 inline h-5 w-5 text-primary" />
              {doc?.title ?? "Reading…"}
            </h1>
          </div>
          {xp && (
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium">Lv {xp.level}</span>
              <span className="text-muted-foreground">• {xp.xp} XP</span>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/30 p-3">
          {loading || !doc ? (
            <div className="flex h-[70vh] items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : doc.mimeType.startsWith("image/") ? (
            <img
              src={doc.url ?? undefined}
              alt={doc.title}
              className="mx-auto max-h-[70vh] w-auto rounded-lg"
            />
          ) : (
            <iframe
              src={doc.url ?? undefined}
              title={doc.title}
              className="h-[70vh] w-full rounded-lg bg-white"
            />
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/40 p-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs disabled:opacity-40"
            >
              <ArrowLeft className="h-3 w-3" /> Prev
            </button>
            <div className="text-sm font-medium">Page {page}</div>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs"
            >
              Next <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground">
              Reading time: <span className="font-medium text-foreground">{dwell}s</span>
              {!canClaim && <span> · claim at 15s</span>}
            </div>
            <button
              onClick={markRead}
              disabled={!canClaim}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            >
              <Zap className="h-3.5 w-3.5" /> Claim +1 XP for this page
            </button>
          </div>
        </div>

        <p className="mt-3 px-1 text-center text-xs text-muted-foreground">
          Anti-farming: pages must be read for at least 15 seconds, and each page can only be rewarded once. Daily cap: 200 XP.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
