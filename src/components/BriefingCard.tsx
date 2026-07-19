import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Clock,
  ExternalLink,
  Lock,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleSaveBriefing, type FeedBriefing } from "@/lib/feed.functions";

const severityClass: Record<string, string> = {
  low: "bg-[color:var(--threat-low)]/15 text-[color:var(--threat-low)] border-[color:var(--threat-low)]/40",
  medium: "bg-[color:var(--threat-medium)]/15 text-[color:var(--threat-medium)] border-[color:var(--threat-medium)]/40",
  high: "bg-[color:var(--threat-high)]/15 text-[color:var(--threat-high)] border-[color:var(--threat-high)]/40",
  critical: "bg-[color:var(--threat-critical)]/15 text-[color:var(--threat-critical)] border-[color:var(--threat-critical)]/40",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function BriefingCard({
  b,
  locked = false,
  compact = false,
}: {
  b: FeedBriefing;
  locked?: boolean;
  compact?: boolean;
}) {
  const qc = useQueryClient();
  const fn = useServerFn(toggleSaveBriefing);
  const m = useMutation({
    mutationFn: (save: boolean) => fn({ data: { id: b.id, save } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feed"] });
      qc.invalidateQueries({ queryKey: ["saved"] });
    },
  });

  return (
    <article className="relative rounded-xl border border-border bg-card p-5 shadow-card hover:border-primary/40 transition-colors">
      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
        <span className={`px-2 py-0.5 rounded border font-mono uppercase tracking-wider ${severityClass[b.severity] ?? severityClass.medium}`}>
          <AlertTriangle className="inline h-3 w-3 mr-1" />
          {b.severity}
        </span>
        {b.category && b.category !== "general" && (
          <span className="px-2 py-0.5 rounded border border-border text-muted-foreground font-mono uppercase">{b.category}</span>
        )}
        {b.industry && b.industry !== "all" && (
          <span className="px-2 py-0.5 rounded border border-border text-muted-foreground font-mono uppercase">{b.industry}</span>
        )}
        <span className="text-muted-foreground inline-flex items-center gap-1">
          <Clock className="h-3 w-3" /> {timeAgo(b.published_at)}
        </span>
        <span className="ml-auto text-muted-foreground">{b.source_name}</span>
      </div>

      <h3 className="text-lg font-semibold leading-snug mb-2">
        <Link
          to="/briefing/$id"
          params={{ id: b.id }}
          className="hover:text-primary transition-colors"
        >
          {b.rewritten_title}
        </Link>
      </h3>

      {!compact && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{b.rewritten_summary}</p>
      )}

      <div className="flex items-center gap-2">
        <Link to="/briefing/$id" params={{ id: b.id }}>
          <Button size="sm" variant="outline">Read briefing</Button>
        </Link>
        <a href={b.source_url} target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="ghost">
            <ExternalLink className="h-3.5 w-3.5 mr-1" /> Source
          </Button>
        </a>
        <Button
          size="sm"
          variant="ghost"
          className="ml-auto"
          onClick={() => m.mutate(!b.saved)}
          disabled={m.isPending}
          aria-label={b.saved ? "Unsave" : "Save"}
        >
          {b.saved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
        </Button>
      </div>

      {locked && (
        <div className="absolute inset-0 rounded-xl bg-background/85 backdrop-blur-sm grid place-items-center text-center px-6">
          <div>
            <Lock className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium mb-1">Pro briefing — real-time access</p>
            <p className="text-xs text-muted-foreground mb-3">
              Free tier gets this story in {Math.max(0, Math.ceil((new Date(b.published_at).getTime() + 6*3600000 - Date.now())/3600000))}h
            </p>
            <Link to="/pricing">
              <Button size="sm" className="bg-gradient-accent text-primary-foreground shadow-glow">Upgrade to Pro</Button>
            </Link>
          </div>
        </div>
      )}
    </article>
  );
}
