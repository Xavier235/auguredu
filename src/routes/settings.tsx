import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { KeyRound, LogOut, Mail, ShieldCheck, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Account settings — Augur.edu" },
      { name: "description", content: "Update your password, manage your account and sign out." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (pw !== pw2) {
      toast.error("Passwords do not match");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated");
      setPw("");
      setPw2("");
    }
  };

  const doSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="bg-grid min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 pt-12 pb-20">
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to profile
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold md:text-4xl">
          Account <span className="text-gradient">settings</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your login, password and session.
        </p>

        <div className="mt-8 grid gap-6">
          <section className="glass rounded-3xl p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <Mail className="h-4 w-4 text-primary" /> Account
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{user?.email}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <dt className="text-muted-foreground">User ID</dt>
                <dd className="font-mono text-xs">{user?.id.slice(0, 12)}…</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="inline-flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" /> Active
                </dd>
              </div>
            </dl>
          </section>

          <section className="glass rounded-3xl p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <KeyRound className="h-4 w-4 text-primary" /> Change password
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use at least 6 characters. You'll stay signed in on this device.
            </p>
            <form onSubmit={updatePassword} className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="pw">New password</Label>
                <Input
                  id="pw"
                  type="password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pw2">Confirm password</Label>
                <Input
                  id="pw2"
                  type="password"
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" disabled={busy}>
                  {busy ? "Updating…" : "Update password"}
                </Button>
              </div>
            </form>
          </section>

          <section className="glass rounded-3xl p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <LogOut className="h-4 w-4 text-accent" /> Session
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign out on this device. You'll need to sign in again to access your profile.
            </p>
            <Button variant="outline" className="mt-4" onClick={doSignOut}>
              <LogOut className="mr-2 h-3.5 w-3.5" /> Sign out
            </Button>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
