# Security Memory

## App overview
Cybersecurity news briefing app. Public landing page with waitlist signup. Authenticated users can sign in and save briefings. AI rewrites RSS items into plain-English briefings cached in `briefing_cache`.

## Must never happen
- Waitlist emails must never be readable by anon or authenticated roles. Only service_role may read `waitlist_signups`.
- User profiles and saved_briefings must remain user-scoped via `auth.uid() = user_id`.
- Service role key must never be referenced in client code.
- `briefing_cache` must never have a fully-open SELECT policy (`USING (true)`) for authenticated users. It must always gate on `has_active_subscription()` OR the 6-hour publish delay, matching the rule enforced in `src/lib/feed.functions.ts`. These are two independent layers protecting the same paywall — the RLS policy protects against direct REST/RPC access bypassing the server functions entirely; do not remove either layer when refactoring.
- `briefing_runs` is internal ingestion/ops data (run status, error notes) and must stay restricted to `service_role`. Do not add an authenticated SELECT policy back to it.
- `/api/public/hooks/ingest-briefings` and `/api/public/hooks/weekly-recap` must always require a matching `x-ingest-secret` header against `INGEST_HOOK_SECRET` before doing any work. Do not remove this check — these endpoints trigger paid AI Gateway calls and were previously abusable by anyone who found the URL.

## Scanner guidance
- `waitlist_signups` intentionally has no SELECT policy — do not flag this as missing read access. It is an insert-only public collection table; reads happen only via service_role for admin export.
- `briefing_cache` has a conditional SELECT policy gating on subscription status + publish delay — this is intentional paywall enforcement, not a bug. Do not loosen it to `USING (true)`.
- `briefing_runs` has no authenticated SELECT policy — this is intentional; it's internal ops data with no end-user purpose.
- Static contact info, social links, and Supabase publishable (anon) keys in `VITE_*` env vars are acceptable and should not be flagged.
