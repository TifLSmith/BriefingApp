import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/public/hooks/weekly-recap")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.INGEST_HOOK_SECRET;
        if (!secret) return new Response("not configured", { status: 503 });
        if (request.headers.get("x-ingest-secret") !== secret) {
          return new Response("unauthorized", { status: 401 });
        }
        try {
          const supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
          );

          const now = new Date();
          const day = now.getUTCDay(); // 0 = Sunday
          // Compute previous Monday → Sunday window
          const end = new Date(now);
          end.setUTCDate(now.getUTCDate() - day);
          end.setUTCHours(23, 59, 59, 0);
          const start = new Date(end);
          start.setUTCDate(end.getUTCDate() - 6);
          start.setUTCHours(0, 0, 0, 0);

          const weekStart = start.toISOString().slice(0, 10);
          const weekEnd = end.toISOString().slice(0, 10);

          // Skip if we already have this week's recap
          const { data: existing } = await supabase
            .from("weekly_recaps")
            .select("id")
            .eq("week_start", weekStart)
            .maybeSingle();
          if (existing) return Response.json({ ok: true, skipped: "already exists" });

          const { data: stories } = await supabase
            .from("briefing_cache")
            .select("rewritten_title, rewritten_summary, severity, what_it_means")
            .gte("published_at", start.toISOString())
            .lte("published_at", end.toISOString())
            .order("published_at", { ascending: false })
            .limit(40);

          if (!stories || stories.length === 0) {
            return Response.json({ ok: true, skipped: "no stories" });
          }

          const apiKey = process.env.LOVABLE_API_KEY!;
          const prompt = `You are A.P.E. — a cybersecurity translator. Summarize this week in cyber for non-experts.\n\nStories:\n${stories
            .map((s, i) => `${i + 1}. [${s.severity}] ${s.rewritten_title} — ${s.rewritten_summary}`)
            .join("\n")}\n\nReturn JSON ONLY (no code fences):\n{"title":"6-12 word week headline","summary":"1-2 sentence overview of the week","body":"5-8 bullet points of what mattered, plain English, each on a new line starting with '• '"}`;

          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              messages: [{ role: "user", content: prompt }],
            }),
          });
          if (!res.ok) throw new Error(`AI ${res.status}`);
          const data = await res.json();
          let content: string = data.choices?.[0]?.message?.content ?? "";
          content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
          const parsed = JSON.parse(content);

          await supabase.from("weekly_recaps").insert({
            week_start: weekStart,
            week_end: weekEnd,
            title: String(parsed.title || "This week in cyber").slice(0, 200),
            summary: String(parsed.summary || "").slice(0, 600),
            body: String(parsed.body || "").slice(0, 4000),
          });

          return Response.json({ ok: true });
        } catch (e) {
          console.error("recap hook error", e);
          return new Response("error", { status: 500 });
        }
      },
    },
  },
});
