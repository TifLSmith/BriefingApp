import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getWeeklyRecaps } from "@/lib/feed.functions";
import { resolvePaymentsEnvironment } from "@/lib/stripe";
import { Crown, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/weekly-recap")({
  head: () => ({ meta: [{ title: "Weekly Recap" }] }),
  component: WeeklyRecap,
});

function WeeklyRecap() {
  const fn = useServerFn(getWeeklyRecaps);
  const { data, isLoading } = useQuery({
    queryKey: ["recaps"],
    queryFn: () => fn({ data: { environment: resolvePaymentsEnvironment() } }),
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold mb-2">Weekly Recap</h1>
      <p className="text-muted-foreground mb-6 text-sm">The week's biggest threats, distilled.</p>

      {isLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}

      {!isLoading && !data?.pro && (
        <div className="rounded-xl border-2 border-primary/40 bg-card p-8 text-center">
          <Crown className="h-8 w-8 mx-auto text-primary mb-3" />
          <h2 className="text-xl font-semibold mb-2">Weekly recaps are a Pro perk</h2>
          <p className="text-sm text-muted-foreground mb-5">A curated "what you should know" summary, every Sunday.</p>
          <Link to="/pricing"><Button className="bg-gradient-accent text-primary-foreground shadow-glow">Upgrade to Pro</Button></Link>
        </div>
      )}

      {!isLoading && data?.pro && (data.recaps?.length ?? 0) === 0 && (
        <div className="text-center py-16 text-muted-foreground text-sm">
          Your first recap will arrive this Sunday.
        </div>
      )}

      <div className="grid gap-4">
        {data?.recaps?.map((r: any) => (
          <article key={r.id} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="text-xs font-mono uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Week of {new Date(r.week_start).toLocaleDateString()} – {new Date(r.week_end).toLocaleDateString()}
            </div>
            <h2 className="text-xl font-bold mb-2">{r.title}</h2>
            <p className="text-sm text-muted-foreground mb-4">{r.summary}</p>
            <div className="text-sm whitespace-pre-line leading-relaxed">{r.body}</div>
            {r.podcast_url && (
              <a href={r.podcast_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
                <Button variant="outline" size="sm">Listen to podcast</Button>
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
