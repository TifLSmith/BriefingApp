import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type Briefing = {
  id: string;
  source_name: string;
  source_url: string;
  rewritten_title: string;
  rewritten_summary: string;
  what_it_means: string;
  what_attackers_got: string[];
  action_items: string[];
  hackers_moved_through: string[];
  hackers_obtained: string[];
  hackers_impacted: string[];
  exploit_path: string[];
  severity: "low" | "medium" | "high" | "critical";
  published_at: string;
  locked?: boolean;
};

const FEEDS = [
  { name: "Krebs on Security", url: "https://krebsonsecurity.com/feed/" },
  { name: "BleepingComputer", url: "https://www.bleepingcomputer.com/feed/" },
  { name: "CISA Alerts", url: "https://www.cisa.gov/cybersecurity-advisories/all.xml" },
  { name: "NVD Recent CVEs", url: "https://nvd.nist.gov/feeds/xml/cve/misc/nvd-rss-analyzed.xml" },
  { name: "Threatpost", url: "https://threatpost.com/feed/" },
  { name: "Dark Reading", url: "https://www.darkreading.com/rss.xml" },
  { name: "SecurityWeek", url: "https://www.securityweek.com/feed/" },
  { name: "The Register", url: "https://www.theregister.com/security/headlines.rss" },
  { name: "Wired Security", url: "https://www.wired.com/category/security/feed/" },
  { name: "Ars Technica", url: "https://arstechnica.com/tag/risk-assessment/feed/" },
  { name: "TechCrunch Security", url: "https://techcrunch.com/category/security/feed/" },
  { name: "ZDNet Security", url: "https://www.zdnet.com/topic/security/rss.xml" },
];

type RawItem = {
  source_name: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

function decode(s: string): string {
  return s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRss(xml: string, sourceName: string): RawItem[] {
  const items: RawItem[] = [];
  // RSS uses <item>, Atom uses <entry>
  const itemRegex = /<(item|entry)[\s\S]*?<\/\1>/gi;
  const matches = xml.match(itemRegex) || [];
  for (const block of matches.slice(0, 8)) {
    const title = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
    const link = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] ?? "";
    const desc =
      block.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ??
      block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)?.[1] ??
      "";
    const pubDate =
      block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] ??
      block.match(/<updated[^>]*>([\s\S]*?)<\/updated>/i)?.[1] ??
      block.match(/<published[^>]*>([\s\S]*?)<\/published>/i)?.[1] ??
      new Date().toUTCString();
    if (title && link) {
      items.push({
        source_name: sourceName,
        title: decode(title),
        link: decode(link),
        description: decode(desc).slice(0, 800),
        pubDate: decode(pubDate),
      });
    }
  }
  return items;
}

async function fetchAll(): Promise<RawItem[]> {
  const results = await Promise.allSettled(
    FEEDS.map(async (f) => {
      const res = await fetch(f.url, {
        headers: { "User-Agent": "Mozilla/5.0 CyberThreatBriefing/1.0" },
      });
      if (!res.ok) return [];
      return parseRss(await res.text(), f.name);
    }),
  );
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}

async function rewriteWithAI(item: RawItem) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content:
            "You are A.P.E. — a cybersecurity translator. Rewrite threat/CVE/breach news for beginners and career-switchers. Clear, jargon-free, plain English. No buzzwords. Speak like a friend explaining the news.",
        },
        {
          role: "user",
          content: `Original title: ${item.title}\nOriginal summary: ${item.description}\nSource: ${item.source_name}\n\nRewrite this and return ONLY valid JSON with this shape (no markdown, no code fences):\n{"title":"plain-English headline (max 12 words)","summary":"2-3 sentence plain-English explanation of what happened","what_attackers_got":["short bullet"],"what_it_means":"1-2 sentences: here's what this means for you (the everyday reader or small business)","action_items":["short imperative action"],"hackers_moved_through":["short bullet"],"hackers_obtained":["short bullet"],"hackers_impacted":["short bullet"],"exploit_path":["short bullet"],"severity":"low|medium|high|critical"}\n\nRules:\n- what_attackers_got: 2-5 short bullets listing data/access stolen (or [] if not a breach).\n- action_items: 2-4 short imperative steps the reader should take.\n- hackers_moved_through: 1-3 bullets on HOW attackers got in / pivoted (initial access, lateral movement). Empty [] for non-breach stories.\n- hackers_obtained: 1-3 bullets on WHAT they took (data, creds, access). Empty [] for non-breach stories.\n- hackers_impacted: 1-3 bullets on WHO/WHAT was affected and the downstream damage. Empty [] for non-breach stories.\n- exploit_path: 1-3 bullets describing HOW the vulnerability could be exploited. Fill ONLY for CVE/advisory/vuln stories where no actual breach happened. Empty [] for actual breaches.\n- Keep each bullet under 14 words. Plain English, no jargon.`,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`AI gateway ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  let content: string = data.choices?.[0]?.message?.content ?? "";
  content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  const parsed = JSON.parse(content);
  const toStringArray = (v: unknown): string[] =>
    Array.isArray(v) ? v.map((x) => String(x).slice(0, 160)).filter(Boolean).slice(0, 6) : [];
  return {
    rewritten_title: String(parsed.title || item.title).slice(0, 200),
    rewritten_summary: String(parsed.summary || "").slice(0, 600),
    what_it_means: String(parsed.what_it_means || "").slice(0, 400),
    what_attackers_got: toStringArray(parsed.what_attackers_got),
    action_items: toStringArray(parsed.action_items),
    hackers_moved_through: toStringArray(parsed.hackers_moved_through),
    hackers_obtained: toStringArray(parsed.hackers_obtained),
    hackers_impacted: toStringArray(parsed.hackers_impacted),
    exploit_path: toStringArray(parsed.exploit_path),
    severity: ["low", "medium", "high", "critical"].includes(parsed.severity)
      ? parsed.severity
      : "medium",
  };
}

async function ensureFreshCache() {
  const { data: latest } = await supabaseAdmin
    .from("briefing_cache")
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const ageMin = latest
    ? (Date.now() - new Date(latest.created_at).getTime()) / 60000
    : Infinity;
  if (ageMin < 30) return; // refresh at most every 30 minutes

  const items = await fetchAll();
  // Dedupe + sort by date desc, take up to 10 freshest
  const seen = new Set<string>();
  const fresh = items
    .filter((i) => {
      if (seen.has(i.link)) return false;
      seen.add(i.link);
      return true;
    })
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 10);

  // Skip items we already have cached
  const links = fresh.map((i) => i.link);
  const { data: existing } = await supabaseAdmin
    .from("briefing_cache")
    .select("source_url")
    .in("source_url", links);
  const existingSet = new Set((existing ?? []).map((e) => e.source_url));
  const todo = fresh.filter((i) => !existingSet.has(i.link));

  for (const item of todo) {
    try {
      const ai = await rewriteWithAI(item);
      await supabaseAdmin.from("briefing_cache").insert({
        source_url: item.link,
        source_name: item.source_name,
        original_title: item.title,
        original_summary: item.description,
        rewritten_title: ai.rewritten_title,
        rewritten_summary: ai.rewritten_summary,
        what_it_means: ai.what_it_means,
        what_attackers_got: ai.what_attackers_got,
        action_items: ai.action_items,
        hackers_moved_through: ai.hackers_moved_through,
        hackers_obtained: ai.hackers_obtained,
        hackers_impacted: ai.hackers_impacted,
        exploit_path: ai.exploit_path,
        severity: ai.severity,
        published_at: new Date(item.pubDate).toISOString(),
      });
    } catch (e) {
      console.error("rewrite failed", item.link, e);
    }
  }
}

async function backfillMissingFields() {
  const { data: rows } = await supabaseAdmin
    .from("briefing_cache")
    .select("id, source_url, source_name, original_title, original_summary, action_items, hackers_moved_through, hackers_obtained, hackers_impacted, exploit_path")
    .limit(20);
  const stale = (rows ?? []).filter(
    (r: any) =>
      !Array.isArray(r.action_items) ||
      r.action_items.length === 0 ||
      ((!Array.isArray(r.hackers_moved_through) || r.hackers_moved_through.length === 0) &&
        (!Array.isArray(r.exploit_path) || r.exploit_path.length === 0)),
  );
  for (const r of stale) {
    try {
      const ai = await rewriteWithAI({
        source_name: r.source_name,
        title: r.original_title,
        link: r.source_url,
        description: r.original_summary ?? "",
        pubDate: new Date().toUTCString(),
      });
      await supabaseAdmin
        .from("briefing_cache")
        .update({
          rewritten_title: ai.rewritten_title,
          rewritten_summary: ai.rewritten_summary,
          what_it_means: ai.what_it_means,
          what_attackers_got: ai.what_attackers_got,
          action_items: ai.action_items,
          hackers_moved_through: ai.hackers_moved_through,
          hackers_obtained: ai.hackers_obtained,
          hackers_impacted: ai.hackers_impacted,
          exploit_path: ai.exploit_path,
          severity: ai.severity,
        })
        .eq("id", r.id);
    } catch (e) {
      console.error("backfill failed", r.id, e);
    }
  }
}

export const getBriefings = createServerFn({ method: "GET" }).handler(async () => {
  try {
    await ensureFreshCache();
    await backfillMissingFields();
  } catch (e) {
    console.error("cache refresh failed", e);
  }

  // Free tier: 3 stories, delayed 6 hours
  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
  const { data: free } = await supabaseAdmin
    .from("briefing_cache")
    .select("*")
    .lte("published_at", sixHoursAgo)
    .order("published_at", { ascending: false })
    .limit(3);

  // Pro tier preview: 6 freshest, returned as locked
  const { data: locked } = await supabaseAdmin
    .from("briefing_cache")
    .select("*")
    .gt("published_at", sixHoursAgo)
    .order("published_at", { ascending: false })
    .limit(6);

  return {
    free: (free ?? []) as Briefing[],
    locked: ((locked ?? []) as Briefing[]).map((b) => ({ ...b, locked: true })),
    generatedAt: new Date().toISOString(),
  };
});
