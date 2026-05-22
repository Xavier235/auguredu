import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Sparkles, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function SiteHeader() {
  const { location } = useRouterState();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const links = [
    { to: "/", label: "Home" },
    { to: "/predictor", label: "JAMB Predictor" },
    { to: "/cgpa", label: "CGPA" },
    { to: "/study-plan", label: "Study Plan" },
    ...(user ? [{ to: "/profile", label: "My profile" }] : []),
    { to: "/how-it-works", label: "How it works" },
  ];


  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent glow-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">
            Augur<span className="text-gradient">.edu</span>
          </span>
        </Link>

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

        {user ? (
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">
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
    </header>
  );
}
