import { createFileRoute } from "@tanstack/react-router";
import { getBriefings } from "@/lib/briefings.functions";

export const Route = createFileRoute("/api/public/hooks/ingest-briefings")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.INGEST_HOOK_SECRET;
        if (!secret) return new Response("not configured", { status: 503 });
        if (request.headers.get("x-ingest-secret") !== secret) {
          return new Response("unauthorized", { status: 401 });
        }
        try {
          await getBriefings();
          return Response.json({ ok: true });
        } catch (e) {
          console.error("ingest hook error", e);
          return new Response("error", { status: 500 });
        }
      },
    },
  },
});
