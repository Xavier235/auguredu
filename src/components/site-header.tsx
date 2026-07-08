import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Sparkles, LogOut, Search, Menu, X, ShieldCheck, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function SiteHeader() {
  const { location } = useRouterState();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [verified, setVerified] = useState(false);
  const [tier, setTier] = useState<string>("free");

  useEffect(() => {
    if (!user) { setVerified(false); setTier("free"); return; }
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("is_verified_student, subscription_tier")
        .eq("id", user.id)
        .maybeSingle();
      setVerified(!!(data as any)?.is_verified_student);
      setTier((data as any)?.subscription_tier ?? "free");
    })();
  }, [user?.id]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/predictor", label: "JAMB Predictor" },
    { to: "/cgpa", label: "CGPA" },
    { to: "/study-plan", label: "Study Plan" },
    { to: "/chat", label: "Chat" },
    ...(user
      ? [
          { to: "/profile", label: "My profile" },
          { to: "/settings", label: "Settings" },
        ]
      : []),
    { to: "/how-it-works", label: "How it works" },
  ];

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    setOpen(false);
    navigate({ to: "/search", search: { q: query } });
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent glow-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">
            Augur<span className="text-gradient">.edu</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="glass hidden items-center gap-1 rounded-full px-2 py-1.5 md:flex">
          {links.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop search */}
        <form
          onSubmit={submitSearch}
          className="hidden items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1.5 lg:flex"
        >
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="w-40 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </form>

        {/* Desktop auth */}
        <div className="hidden md:block">
          {user ? (
            <div className="flex items-center gap-2">
              {verified && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                  <ShieldCheck className="h-3 w-3" /> Verified student
                </span>
              )}
              {tier !== "free" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-300">
                  <Crown className="h-3 w-3" /> {tier}
                </span>
              )}
              <span className="hidden text-sm text-muted-foreground xl:inline">
                {user.email}
              </span>
              <button
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/" });
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/50 px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/20"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:glow-primary"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/50 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden">
          <div className="mx-4 mb-4 rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur">
            <form
              onSubmit={submitSearch}
              className="mb-3 flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-2"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search Augur…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </form>

            <nav className="flex flex-col">
              {links.map((l) => {
                const active = location.pathname === l.to;
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-3 border-t border-border pt-3">
              {user ? (
                <div className="space-y-2">
                  <div className="px-2 text-xs text-muted-foreground truncate">
                    {user.email}
                  </div>
                  <button
                    onClick={async () => {
                      setOpen(false);
                      await signOut();
                      navigate({ to: "/" });
                    }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-full border border-border bg-background/50 px-4 py-2 text-sm font-medium hover:bg-accent/20"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="block rounded-full bg-primary px-5 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
