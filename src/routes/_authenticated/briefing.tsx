import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getFeed } from "@/lib/feed.functions";
import { BriefingCard } from "@/components/BriefingCard";
import { Button } from "@/components/ui/button";
import { Crown, Filter, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/briefing")({
  head: () => ({ meta: [{ title: "Today's briefing — Cyber Threat Daily" }] }),
  component: BriefingFeed,
});

const INDUSTRIES = ["all", "healthcare", "finance", "retail", "tech"];
const CATEGORIES = ["all", "breach", "vulnerability", "ransomware", "phishing", "general"];

function BriefingFeed() {
  const fn = useServerFn(getFeed);
  const [industry, setIndustry] = useState("all");
  const [category, setCategory] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["feed", industry, category],
    queryFn: () => fn({ data: { environment: "live", industry, category } }),
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Today's briefing</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {data?.pro ? "Real-time, unlimited stories." : "Free tier · 3 stories per day, 6-hour delayed."}
          </p>
        </div>
        {!data?.pro && (
          <Link to="/pricing">
            <Button className="bg-gradient-accent text-primary-foreground shadow-glow">
              <Crown className="h-4 w-4 mr-1" /> Upgrade for real-time
            </Button>
          </Link>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="h-8 rounded-md border border-border bg-input px-2 text-sm">
          {INDUSTRIES.map((i) => <option key={i} value={i}>{i === "all" ? "All industries" : i}</option>)}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-8 rounded-md border border-border bg-input px-2 text-sm">
          {CATEGORIES.map((c) => <option key={c} value={c}>{c === "all" ? "All categories" : c}</option>)}
        </select>
        {!data?.pro && (industry !== "all" || category !== "all") && (
          <span className="text-xs text-muted-foreground">Filtering is limited on free tier · upgrade for full feed</span>
        )}
      </div>

      {isLoading && (
        <div className="grid place-items-center py-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      <div className="grid gap-4">
        {(data?.briefings ?? []).map((b) => (
          <BriefingCard key={b.id} b={b} />
        ))}
        {!isLoading && (data?.briefings?.length ?? 0) === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No briefings match those filters yet. Check back soon.
          </div>
        )}
      </div>
    </div>
  );
}
