import { Link, useRouter } from "@tanstack/react-router";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";

const NAV: { to: string; label: string; authOnly?: boolean }[] = [
  { to: "/", label: "Home" },
  { to: "/briefing", label: "Briefing", authOnly: true },
  { to: "/pricing", label: "Pricing" },
  { to: "/saved", label: "Saved", authOnly: true },
  { to: "/weekly-recap", label: "Weekly Recap", authOnly: true },
];

export function Header() {
  const { user } = useAuth();
  const { data: sub } = useSubscription(!!user);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await supabase.auth.signOut();
    router.navigate({ to: "/" });
  }

  const isPro = sub?.pro;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded bg-gradient-accent grid place-items-center shadow-glow">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-mono text-sm tracking-wider">
            CYBER<span className="text-primary">.</span>BRIEF
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.filter((n) => !n.authOnly || user).map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/10"
              activeProps={{ className: "px-3 py-1.5 text-sm text-foreground font-medium rounded-md bg-accent/10" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              {isPro && (
                <span className="text-xs font-mono uppercase tracking-wider bg-gradient-accent text-primary-foreground px-2 py-1 rounded">
                  Pro
                </span>
              )}
              <Link to="/settings">
                <Button variant="ghost" size="sm">Settings</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="bg-gradient-accent text-primary-foreground shadow-glow">
                  Start free
                </Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="px-4 py-3 flex flex-col gap-1">
            {NAV.filter((n) => !n.authOnly || user).map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm rounded-md hover:bg-accent/10"
              >
                {n.label}
              </Link>
            ))}
            <div className="border-t border-border/40 my-2" />
            {user ? (
              <>
                <Link to="/settings" onClick={() => setOpen(false)} className="px-3 py-2 text-sm rounded-md hover:bg-accent/10">
                  Settings
                </Link>
                <button onClick={signOut} className="px-3 py-2 text-sm text-left rounded-md hover:bg-accent/10">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setOpen(false)} className="px-3 py-2 text-sm rounded-md hover:bg-accent/10">
                  Sign in
                </Link>
                <Link to="/auth" onClick={() => setOpen(false)} className="px-3 py-2 text-sm rounded-md bg-gradient-accent text-primary-foreground">
                  Start free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="font-mono">CYBER.BRIEF</span>
          <span>· Today's cyber threats, in plain English.</span>
        </div>
        <div className="flex gap-4">
          <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/auth" className="hover:text-foreground">Sign in</Link>
        </div>
      </div>
    </footer>
  );
}
