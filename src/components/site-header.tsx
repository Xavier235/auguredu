import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function SiteHeader() {
  const { location } = useRouterState();
  const links = [
    { to: "/", label: "Home" },
    { to: "/predictor", label: "Predictor" },
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

        <Link
          to="/predictor"
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:glow-primary"
        >
          Try it free
        </Link>
      </div>
    </header>
  );
}
