import { createFileRoute, Link } from "@tanstack/react-router";
import { Header, Footer } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import {
  Shield, Crown, Calendar, AlertTriangle, Clock, ExternalLink, Lock,
  Bookmark, BookmarkCheck, Filter, ListChecks, ShieldAlert, Target,
  KeyRound, Footprints, Sparkles, ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/preview")({
  head: () => ({ meta: [{ title: "UI Preview — Cyber Threat Daily" }] }),
  component: PreviewPage,
});

const SECTIONS = [
  { id: "onboarding", label: "Onboarding" },
  { id: "free-feed", label: "Free feed" },
  { id: "pro-feed", label: "Pro feed" },
  { id: "story", label: "Story detail" },
  { id: "recap", label: "Weekly recap" },
  { id: "badge", label: "Pro badge" },
];

function SectionHeader({ id, title, subtitle }: { id: string; title: string; subtitle: string }) {
  return (
    <div id={id} className="border-l-2 border-primary pl-4 mb-6 scroll-mt-20">
      <p className="text-xs font-mono uppercase tracking-wider text-primary mb-1">Preview</p>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4 sm:p-6 shadow-card overflow-hidden">
      {children}
    </div>
  );
}

const SEV = {
  critical: "bg-[color:var(--threat-critical)]/15 text-[color:var(--threat-critical)] border-[color:var(--threat-critical)]/40",
  high: "bg-[color:var(--threat-high)]/15 text-[color:var(--threat-high)] border-[color:var(--threat-high)]/40",
  medium: "bg-[color:var(--threat-medium)]/15 text-[color:var(--threat-medium)] border-[color:var(--threat-medium)]/40",
  low: "bg-[color:var(--threat-low)]/15 text-[color:var(--threat-low)] border-[color:var(--threat-low)]/40",
} as const;

function MockCard({
  severity, category, industry, age, source, title, summary, locked,
}: {
  severity: keyof typeof SEV; category: string; industry: string;
  age: string; source: string; title: string; summary: string; locked?: boolean;
}) {
  return (
    <article className="relative rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
        <span className={`px-2 py-0.5 rounded border font-mono uppercase tracking-wider ${SEV[severity]}`}>
          <AlertTriangle className="inline h-3 w-3 mr-1" />{severity}
        </span>
        <span className="px-2 py-0.5 rounded border border-border text-muted-foreground font-mono uppercase">{category}</span>
        <span className="px-2 py-0.5 rounded border border-border text-muted-foreground font-mono uppercase">{industry}</span>
        <span className="text-muted-foreground inline-flex items-center gap-1">
          <Clock className="h-3 w-3" /> {age}
        </span>
        <span className="ml-auto text-muted-foreground">{source}</span>
      </div>
      <h3 className="text-lg font-semibold leading-snug mb-2 hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{summary}</p>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline">Read briefing</Button>
        <Button size="sm" variant="ghost"><ExternalLink className="h-3.5 w-3.5 mr-1" /> Source</Button>
        <Button size="sm" variant="ghost" className="ml-auto" aria-label="save">
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>
      {locked && (
        <div className="absolute inset-0 rounded-xl bg-background/85 backdrop-blur-sm grid place-items-center text-center px-6">
          <div>
            <Lock className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium mb-1">Pro briefing — real-time access</p>
            <p className="text-xs text-muted-foreground mb-3">Free tier gets this story in 4h</p>
            <Button size="sm" className="bg-gradient-accent text-primary-foreground shadow-glow">Upgrade to Pro</Button>
          </div>
        </div>
      )}
    </article>
  );
}

function PreviewPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-hero">
      <Header />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="mb-10">
            <p className="text-xs font-mono uppercase tracking-wider text-primary mb-2">Internal preview</p>
            <h1 className="text-4xl font-bold mb-3">Inside the app</h1>
            <p className="text-muted-foreground max-w-2xl">
              A static walkthrough of the signed-in experience: onboarding, the free vs. Pro briefing feed, a story breakdown, weekly recaps, and the Pro badge.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-md border border-border hover:border-primary/60 text-muted-foreground hover:text-foreground">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* ONBOARDING */}
          <SectionHeader id="onboarding" title="Onboarding" subtitle="Required after signup — tailors the feed in 30 seconds." />
          <Frame>
            <div className="max-w-2xl mx-auto py-2">
              <div className="text-center mb-6">
                <div className="h-12 w-12 mx-auto rounded-xl bg-gradient-accent grid place-items-center shadow-glow mb-3">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold">Welcome to Cyber Threat Daily Briefing</h3>
                <p className="text-muted-foreground mt-1 text-sm">A few quick questions so we can tailor your feed.</p>
              </div>
              <div className="space-y-5 rounded-xl border border-border bg-card p-5">
                <div>
                  <p className="text-sm font-medium mb-2">What best describes you?</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {["Beginner / learning","Career-switcher","IT / engineer","Business owner","Executive / leadership","Other"].map((r,i)=>(
                      <div key={r} className={`text-sm px-3 py-2 rounded-md border ${i===2?"border-primary bg-primary/10":"border-border"}`}>{r}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Experience level</p>
                  <div className="flex flex-wrap gap-2">
                    {["New to cybersecurity","Some familiarity","Working in the field"].map((l,i)=>(
                      <div key={l} className={`text-sm px-3 py-1.5 rounded-md border ${i===1?"border-primary bg-primary/10":"border-border"}`}>{l}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Topics you care about</p>
                  <div className="flex flex-wrap gap-2">
                    {["Ransomware","Data breaches","Phishing","Cloud security","Vulnerabilities (CVEs)","Identity / passwords","Mobile threats","AI threats"].map((t,i)=>(
                      <div key={t} className={`text-sm px-3 py-1.5 rounded-md border ${[0,1,3].includes(i)?"border-primary bg-primary/10":"border-border text-muted-foreground"}`}>{t}</div>
                    ))}
                  </div>
                </div>
                <Button className="w-full bg-gradient-accent text-primary-foreground shadow-glow">Continue to my briefings</Button>
              </div>
            </div>
          </Frame>

          {/* FREE FEED */}
          <div className="mt-14" />
          <SectionHeader id="free-feed" title="Free briefing feed" subtitle="3 stories per day, delayed 6 hours. Upgrade CTA visible at top." />
          <Frame>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
              <div>
                <h3 className="text-2xl font-bold">Today's briefing</h3>
                <p className="text-muted-foreground mt-1 text-sm">Free tier · 3 stories per day, 6-hour delayed.</p>
              </div>
              <Button size="sm" className="bg-gradient-accent text-primary-foreground shadow-glow">
                <Crown className="h-4 w-4 mr-1" /> Upgrade for real-time
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-5 text-sm">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="h-8 rounded-md border border-border bg-input px-2 text-sm flex items-center">All industries</div>
              <div className="h-8 rounded-md border border-border bg-input px-2 text-sm flex items-center">All categories</div>
              <span className="text-xs text-muted-foreground">Filtering is limited on free tier · upgrade for full feed</span>
            </div>
            <div className="grid gap-4">
              <MockCard severity="high" category="ransomware" industry="healthcare" age="7h ago" source="CISA Advisory"
                title="Hospital chain hit by ransomware — patient records exposed"
                summary="A regional hospital network confirmed attackers encrypted internal systems and exfiltrated patient data. Outpatient scheduling is down across 14 sites." />
              <MockCard severity="medium" category="vulnerability" industry="tech" age="9h ago" source="NVD"
                title="Critical flaw in popular VPN client lets attackers run code"
                summary="A new CVE in a widely used corporate VPN allows unauthenticated code execution. A patch is available; rollout should be prioritized this week." />
              <MockCard severity="low" category="phishing" industry="finance" age="11h ago" source="Krebs on Security"
                title="Fake bank texts target customers of three major US banks"
                summary="A coordinated SMS phishing campaign is impersonating fraud alerts to capture login codes. Customers should ignore links and call the number on the back of their card." />
            </div>
          </Frame>

          {/* PRO FEED */}
          <div className="mt-14" />
          <SectionHeader id="pro-feed" title="Pro briefing feed" subtitle="Real-time, unlimited stories, industry & category filters. Locked-card state shown for reference." />
          <Frame>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-2xl font-bold">Today's briefing</h3>
                  <p className="text-muted-foreground mt-1 text-sm">Real-time, unlimited stories.</p>
                </div>
                <span className="text-xs font-mono uppercase tracking-wider bg-gradient-accent text-primary-foreground px-2 py-1 rounded shadow-glow">Pro</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-5 text-sm">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="h-8 rounded-md border border-primary/50 bg-input px-2 text-sm flex items-center">Healthcare</div>
              <div className="h-8 rounded-md border border-primary/50 bg-input px-2 text-sm flex items-center">Ransomware</div>
            </div>
            <div className="grid gap-4">
              <MockCard severity="critical" category="breach" industry="healthcare" age="12m ago" source="BleepingComputer"
                title="Zero-day exploited in EHR vendor — multiple hospitals affected"
                summary="Attackers chained an authentication bypass and a privilege-escalation bug to access electronic health record systems at multiple US hospitals." />
              <MockCard severity="high" category="ransomware" industry="healthcare" age="1h ago" source="The Record"
                title="Ransomware group claims attack on regional pharmacy chain"
                summary="A double-extortion crew posted 240GB of allegedly stolen prescription and payroll data on its leak site." />
              <MockCard severity="medium" category="vulnerability" industry="healthcare" age="3h ago" source="NVD"
                title="Medical imaging server CVE patched after 9 months in the wild"
                summary="A widely deployed PACS server quietly shipped a fix this week for a remote code execution flaw active since last quarter." locked />
            </div>
          </Frame>

          {/* STORY DETAIL */}
          <div className="mt-14" />
          <SectionHeader id="story" title="Story detail (A.P.E. breakdown)" subtitle="Action, Plain-English, Explanation — built so a non-expert can grasp it in 60 seconds." />
          <Frame>
            <div className="max-w-3xl mx-auto">
              <div className="text-sm text-muted-foreground inline-flex items-center gap-1 mb-4">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to feed
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                <span className={`px-2 py-0.5 rounded border font-mono uppercase ${SEV.critical}`}>
                  <AlertTriangle className="inline h-3 w-3 mr-1" />critical
                </span>
                <span className="text-muted-foreground inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Today, 9:42 AM
                </span>
                <span className="ml-auto text-muted-foreground">BleepingComputer</span>
              </div>
              <h1 className="text-3xl font-bold leading-tight mb-3">Zero-day exploited in EHR vendor — multiple hospitals affected</h1>
              <p className="text-base text-muted-foreground mb-6">
                Attackers chained two bugs in a widely used electronic health record platform to read and modify patient records at several US hospitals. A patch is available now.
              </p>
              <div className="grid gap-4">
                {[
                  { icon: Sparkles, title: "Why it matters", text: "If you're a patient at one of the affected hospitals, your records may have been seen or altered. Staff should expect identity-verification calls for anything that looks unusual." },
                  { icon: Target, title: "What attackers got", items: ["Patient demographic data", "Visit history and physician notes", "Limited insurance information"] },
                  { icon: Footprints, title: "How they got in", items: ["Bypassed login via a forged session token", "Elevated to admin using a known config flaw", "Pivoted through an internal API gateway"] },
                  { icon: ShieldAlert, title: "Who was impacted", items: ["6 hospital systems across 3 states", "Estimated 480,000 patient records touched"] },
                  { icon: ListChecks, title: "What to do next", items: ["Patch EHR platform to v8.2.4 today", "Force re-auth for all admin accounts", "Review API gateway logs for the last 14 days"] },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-5">
                    <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                      <s.icon className="h-4 w-4 text-primary" /> {s.title}
                    </h3>
                    {s.text && <p className="text-sm leading-relaxed">{s.text}</p>}
                    {s.items && (
                      <ul className="space-y-2">
                        {s.items.map((it, j) => (
                          <li key={j} className="text-sm flex gap-2"><span className="text-primary mt-1">→</span><span>{it}</span></li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                <div className="rounded-xl border border-primary/40 bg-primary/5 p-5">
                  <p className="text-xs font-mono uppercase tracking-wider text-primary mb-1">If you only remember one thing</p>
                  <p className="text-sm">Patch your EHR to v8.2.4 today and force a password reset on all admin accounts.</p>
                </div>
              </div>
            </div>
          </Frame>

          {/* WEEKLY RECAP */}
          <div className="mt-14" />
          <SectionHeader id="recap" title="Weekly recap (Pro)" subtitle="A curated 'what you should know' summary, every Sunday." />
          <Frame>
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-1">Weekly Recap</h3>
              <p className="text-muted-foreground mb-6 text-sm">The week's biggest threats, distilled.</p>
              <article className="rounded-xl border border-border bg-card p-6 shadow-card mb-4">
                <div className="text-xs font-mono uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Week of Jun 9 – Jun 15
                </div>
                <h2 className="text-xl font-bold mb-2">Healthcare in the crosshairs, again</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Three major hospital incidents, a critical VPN flaw, and a phishing surge against finance customers — here's what mattered.
                </p>
                <div className="text-sm leading-relaxed space-y-3">
                  <p><strong className="text-foreground">1. Hospitals hit hard.</strong> Two ransomware events and one zero-day exploitation hit US hospital systems. Patient scheduling and EHR access were disrupted at 20+ sites.</p>
                  <p><strong className="text-foreground">2. VPN flaw worth patching now.</strong> A widely used corporate VPN shipped a fix for an unauthenticated RCE. Exploit code circulated within 48 hours of disclosure.</p>
                  <p><strong className="text-foreground">3. Phishing wave.</strong> SMS impersonation of three major US banks captured login codes from thousands of customers.</p>
                </div>
                <Button variant="outline" size="sm" className="mt-4">Listen to podcast</Button>
              </article>

              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Free user state</p>
              <div className="rounded-xl border-2 border-primary/40 bg-card p-8 text-center">
                <Crown className="h-8 w-8 mx-auto text-primary mb-3" />
                <h2 className="text-xl font-semibold mb-2">Weekly recaps are a Pro perk</h2>
                <p className="text-sm text-muted-foreground mb-5">A curated "what you should know" summary, every Sunday.</p>
                <Button className="bg-gradient-accent text-primary-foreground shadow-glow">Upgrade to Pro</Button>
              </div>
            </div>
          </Frame>

          {/* PRO BADGE */}
          <div className="mt-14" />
          <SectionHeader id="badge" title="Pro badge" subtitle="Shown in the header next to Settings while a subscription is active." />
          <Frame>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider bg-gradient-accent text-primary-foreground px-2 py-1 rounded shadow-glow">Pro</span>
                <span className="text-sm text-muted-foreground">Header badge</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2">
                <Crown className="h-4 w-4 text-primary" />
                <span className="text-sm">You're on Pro</span>
                <span className="text-xs font-mono uppercase tracking-wider bg-gradient-accent text-primary-foreground px-2 py-0.5 rounded shadow-glow">Active</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2">
                <BookmarkCheck className="h-4 w-4 text-primary" />
                <span className="text-sm">Real-time access · Industry filters · Weekly recap</span>
              </div>
            </div>
          </Frame>

          <div className="mt-12 text-center">
            <Link to="/"><Button variant="outline">Back to landing</Button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
