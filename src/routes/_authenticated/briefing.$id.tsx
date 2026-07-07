import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getBriefingById } from "@/lib/feed.functions";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, AlertTriangle, Clock, ExternalLink, Lock, ListChecks, ShieldAlert, Target, KeyRound, Footprints, Sparkles, Loader2,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/briefing/$id")({
  component: StoryDetail,
});

function Section({ icon: Icon, title, items, text }: { icon: any; title: string; items?: string[]; text?: string }) {
  if ((!items || items.length === 0) && !text) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" /> {title}
      </h3>
      {text && <p className="text-sm leading-relaxed">{text}</p>}
      {items && items.length > 0 && (
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li key={i} className="text-sm flex gap-2">
              <span className="text-primary mt-1">→</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StoryDetail() {
  const { id } = Route.useParams();
  const fn = useServerFn(getBriefingById);
  const { data, isLoading, error } = useQuery({
    queryKey: ["briefing", id],
    queryFn: () => fn({ data: { id, environment: "live" } }),
  });

  if (isLoading) return <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  if (error) return <div className="max-w-3xl mx-auto px-6 py-12 text-destructive text-sm">Could not load this briefing.</div>;
  if (!data) return null;
  const b = data.briefing;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/briefing" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to feed
      </Link>

      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
        <span className="px-2 py-0.5 rounded border border-primary/40 bg-primary/10 text-primary font-mono uppercase">
          <AlertTriangle className="inline h-3 w-3 mr-1" />{b.severity}
        </span>
        <span className="text-muted-foreground inline-flex items-center gap-1">
          <Clock className="h-3 w-3" /> {new Date(b.published_at).toLocaleString()}
        </span>
        <span className="ml-auto text-muted-foreground">{b.source_name}</span>
      </div>

      <h1 className="text-3xl font-bold leading-tight mb-3">{b.rewritten_title}</h1>
      <p className="text-base text-muted-foreground mb-6">{b.rewritten_summary}</p>

      {data.locked ? (
        <div className="rounded-xl border-2 border-primary/40 bg-card p-8 text-center">
          <Lock className="h-8 w-8 mx-auto text-primary mb-3" />
          <h2 className="text-xl font-semibold mb-2">Full briefing is Pro-only for the first 6 hours</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Upgrade to read the full A.P.E. breakdown in real time.
          </p>
          <Link to="/pricing">
            <Button className="bg-gradient-accent text-primary-foreground shadow-glow">Upgrade to Pro</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          <Section icon={Sparkles} title="Why it matters" text={b.what_it_means} />
          <Section icon={Target} title="What attackers got" items={b.what_attackers_got} />
          <Section icon={Footprints} title="How they got in" items={b.hackers_moved_through} />
          <Section icon={KeyRound} title="What they obtained" items={b.hackers_obtained} />
          <Section icon={ShieldAlert} title="Who was impacted" items={b.hackers_impacted} />
          <Section icon={AlertTriangle} title="Exploit path" items={b.exploit_path} />
          <Section icon={ListChecks} title="What to do next" items={b.action_items} />

          {b.if_one_thing && (
            <div className="rounded-xl border border-primary/40 bg-primary/5 p-5">
              <p className="text-xs font-mono uppercase tracking-wider text-primary mb-1">If you only remember one thing</p>
              <p className="text-sm">{b.if_one_thing}</p>
            </div>
          )}

          <a href={b.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-3.5 w-3.5 mr-1" /> Read the original report
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
