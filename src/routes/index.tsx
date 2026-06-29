import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shield, Brain, Filter, Radio, ListChecks, Sparkles, Check,
  AlertTriangle, Lock, ArrowRight, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header, Footer } from "@/components/SiteChrome";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { PricingCards } from "@/components/PricingCards";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cyber Threat Daily Briefing — Today's threats, in plain English" },
      { name: "description", content: "AI-powered daily cyber briefing. Real breaches, CVEs, and threat intel rewritten in clear, jargon-free language. Free 3-story digest, daily." },
      { property: "og:title", content: "Cyber Threat Daily Briefing" },
      { property: "og:description", content: "Stay informed, protect your work, keep up — without becoming an expert." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Brain, title: "A.P.E. plain-English rewrites", body: "Every story is rewritten by AI in clear, jargon-free language — built for beginners, career-switchers, and busy professionals." },
  { icon: Radio, title: "Real-time threat intel", body: "Pro members get breaches, CVEs, and advisories as soon as they're published — not 6 hours later." },
  { icon: Filter, title: "Industry-specific feeds", body: "Filter by healthcare, finance, retail, and more — see only what matters to your world." },
  { icon: ListChecks, title: "What to do next", body: "Every briefing ends with concrete actions you can take today to protect your work." },
  { icon: Sparkles, title: "Weekly recap", body: "A curated 'what you should know' summary every Sunday — Pro only." },
  { icon: Shield, title: "Trust & sources", body: "We always link the original report. Evidence-based, no fearmongering." },
];

const FAQS = [
  { q: "Who is this for?", a: "Beginners learning cybersecurity, career-switchers, small business owners, and busy professionals in healthcare, finance, or retail who want practical threat awareness without the jargon." },
  { q: "How is this different from a security newsletter?", a: "Newsletters dump links. We rewrite each story in plain English, tell you who is affected, why it matters to you, and what to do next." },
  { q: "Can I cancel anytime?", a: "Yes. Manage your subscription from Settings → Billing. No questions asked." },
  { q: "Is my email shared?", a: "Never. We use it only to sign you in and send the weekly recap (if enabled)." },
];

function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [priceId, setPriceId] = useState<"pro_monthly" | "pro_yearly">("pro_monthly");

  function onSubscribe(p: "pro_monthly" | "pro_yearly") {
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    setPriceId(p);
    setOpen(true);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-hero">
      <PaymentTestModeBanner />
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-mono uppercase tracking-wider mb-6">
              <Sparkles className="h-3 w-3" /> AI-powered daily cyber briefings
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-5 leading-tight">
              Today's cyber threats,{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">in plain English.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Cyber Threat Daily Briefing helps you understand today's cyber threats so you can stay informed, protect your work, and keep up — without becoming an expert.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to={user ? "/briefing" : "/auth"}>
                <Button size="lg" className="bg-gradient-accent text-primary-foreground shadow-glow">
                  Start free <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline">View pricing</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* PROBLEM / SOLUTION */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-xl border border-destructive/30 bg-card p-6 relative overflow-hidden">
              <span className="text-xs font-mono uppercase text-destructive">Most cyber news</span>
              <p className="mt-2 text-sm font-mono leading-relaxed text-muted-foreground">
                "CVE-2026-1337: RCE via deserialization in the SAML SP-initiated SSO flow allows pre-auth attackers to pivot laterally via Kerberos delegation..."
              </p>
              <Lock className="absolute top-4 right-4 h-5 w-5 text-destructive/60" />
            </div>
            <div className="rounded-xl border border-primary/40 bg-card p-6 shadow-glow">
              <span className="text-xs font-mono uppercase text-primary">Cyber Threat Daily</span>
              <p className="mt-2 text-base leading-relaxed">
                A new flaw lets attackers log in to your single sign-on without a password. If your team uses Okta, Azure, or Google SSO — patch this week. <span className="text-muted-foreground">(Here's how.)</span>
              </p>
            </div>
          </div>
          <p className="text-center text-muted-foreground mt-8 max-w-2xl mx-auto">
            We do the translation. You get the actionable version — fast.
          </p>
        </section>

        {/* FEATURES */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Everything you need to stay ahead</h2>
            <p className="text-muted-foreground">Built for non-experts who can't afford to be unaware.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-5">
                <div className="h-10 w-10 rounded-lg bg-primary/10 grid place-items-center mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1.5">{title}</h3>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TRUST */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
          <div className="rounded-2xl border border-border bg-card p-8">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Source coverage</p>
            <p className="text-sm">
              We aggregate from Krebs on Security, BleepingComputer, CISA Alerts, NVD, Threatpost, Dark Reading, SecurityWeek, The Register, Wired, Ars Technica, and more — then rewrite for clarity.
            </p>
          </div>
        </section>

        {/* PRICING */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Free to start. Pro when you need more.</h2>
            <p className="text-muted-foreground">No credit card to start.</p>
          </div>
          <PricingCards onSubscribe={onSubscribe} />
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Questions</h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="rounded-xl border border-border bg-card p-5 group">
                <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
                  {f.q}
                  <span className="text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="rounded-2xl border border-primary/40 bg-card p-10 shadow-glow">
            <h2 className="text-3xl font-bold mb-3">Get today's briefing in 60 seconds.</h2>
            <p className="text-muted-foreground mb-6">Free account. No credit card. Three stories, every day.</p>
            <Link to={user ? "/briefing" : "/auth"}>
              <Button size="lg" className="bg-gradient-accent text-primary-foreground shadow-glow">
                Start free <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Subscribe to Pro</DialogTitle></DialogHeader>
          {user && (
            <StripeEmbeddedCheckout
              priceId={priceId}
              customerEmail={user.email}
              userId={user.id}
              returnUrl={`${window.location.origin}/briefing?checkout=success`}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
