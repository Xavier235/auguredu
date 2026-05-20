export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-muted-foreground">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Augur.edu — Predictions for learners.</p>
          <p className="text-xs">
            Estimates are statistical guidance, not guarantees. Built with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
