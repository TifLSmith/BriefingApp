import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getSavedBriefings } from "@/lib/feed.functions";
import { BriefingCard } from "@/components/BriefingCard";
import { Bookmark, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/saved")({
  head: () => ({ meta: [{ title: "Saved stories" }] }),
  component: Saved,
});

function Saved() {
  const fn = useServerFn(getSavedBriefings);
  const { data, isLoading } = useQuery({ queryKey: ["saved"], queryFn: () => fn() });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold mb-2">Saved stories</h1>
      <p className="text-muted-foreground mb-6 text-sm">Your bookmarked briefings — synced across devices.</p>

      {isLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}

      {!isLoading && (data?.items?.length ?? 0) === 0 && (
        <div className="text-center py-16 rounded-xl border border-dashed border-border">
          <Bookmark className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium mb-1">No saved stories yet</p>
          <p className="text-sm text-muted-foreground mb-4">Tap the bookmark icon on any briefing to save it here.</p>
          <Link to="/briefing"><Button variant="outline">Open the feed</Button></Link>
        </div>
      )}

      <div className="grid gap-4">
        {data?.items?.map((s) => s.briefing && <BriefingCard key={s.savedId} b={{ ...s.briefing, saved: true }} />)}
      </div>
    </div>
  );
}
