import { Link } from "@tanstack/react-router";
import { Check, Crown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useIsNativeApp } from "@/lib/platform";

const freePoints = [
  "3 stories per day",
  "6-hour delayed access",
  "A.P.E. plain-English rewrites",
  "Source links to original reporting",
];

const proPoints = [
  "Unlimited real-time briefings",
  "Industry feeds: healthcare, finance, retail",
  "Weekly recap of what mattered",
  "Save stories & build your library",
  "Priority support",
];

export function PricingCards() {
  const [annual, setAnnual] = useState(false);
  const { user } = useAuth();
  const { data: sub } = useSubscription(!!user);
  const isPro = sub?.pro;
  const native = useIsNativeApp();

  return (
    <div>
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={() => setAnnual(false)}
          className={`text-sm px-3 py-1.5 rounded-md ${!annual ? "bg-card border border-border" : "text-muted-foreground"}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setAnnual(true)}
          className={`text-sm px-3 py-1.5 rounded-md ${annual ? "bg-card border border-border" : "text-muted-foreground"}`}
        >
          Annual <span className="ml-1 text-primary text-xs">save 20%</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Free</div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-muted-foreground">/forever</span>
          </div>
          <p className="text-sm text-muted-foreground mb-5">Get a taste of daily briefings.</p>
          <ul className="space-y-2.5 mb-6">
            {freePoints.map((p) => (
              <li key={p} className="text-sm flex gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {p}
              </li>
            ))}
          </ul>
          <Link to={user ? "/briefing" : "/auth"}>
            <Button variant="outline" className="w-full">
              {user ? "Open feed" : "Start free"}
            </Button>
          </Link>
        </div>

        <div className="relative rounded-xl border-2 border-primary/60 bg-card p-6 shadow-glow">
          <div className="absolute -top-3 right-4 px-2 py-0.5 rounded bg-gradient-accent text-primary-foreground text-xs font-mono uppercase tracking-wider">
            Most popular
          </div>
          <div className="text-xs font-mono uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
            <Crown className="h-3.5 w-3.5" /> Pro
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-4xl font-bold">${annual ? "7.17" : "9"}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            {annual ? "Billed $86/year — save 20%" : "Billed monthly · cancel anytime"}
          </p>
          <ul className="space-y-2.5 mb-6">
            {proPoints.map((p) => (
              <li key={p} className="text-sm flex gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {p}
              </li>
            ))}
          </ul>
          {isPro ? (
            <Button disabled className="w-full">Current plan</Button>
          ) : native ? (
            <div className="w-full text-center text-sm text-muted-foreground border border-border rounded-md py-2 px-3">
              Manage your subscription on the web.
            </div>
          ) : (
            <Button disabled className="w-full">Pro — coming soon</Button>
          )}
        </div>
      </div>
    </div>
  );
}
