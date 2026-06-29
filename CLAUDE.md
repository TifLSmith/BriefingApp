# CLAUDE.md — Cyber Threat Daily Briefing

This file is read at the start of every Claude Code session. Follow it exactly.

## How to work with me (most important — read first)

- **Always use Plan Mode for anything non-trivial.** Show me the plan and wait for my
  approval before writing or changing any file. Do not start editing because a task
  "seems clear."
- **Never change a file without showing me the diff first** and getting a yes.
- **Ask before acting** whenever a step is destructive, irreversible, or touches
  auth, the database, secrets, deployment, or billing.
- **One thing at a time.** Prefer small, reviewable steps over large multi-file sweeps.
- **When unsure, stop and ask.** Do not invent requirements or guess at intent. If a
  task is ambiguous, ask me a clarifying question instead of proceeding.
- I am not a professional developer and I get screen fatigue. Explain what you're
  doing in plain language. No jargon dumps.

## What this project is

- A web app: "Cyber Threat Daily Briefing" — an AI-powered daily security news digest
  that rewrites real breaches, CVEs, and threat intel into plain English (the "A.P.E."
  voice: Accessible, Practical, Empowering).
- **Stack:** TanStack Start + React + Tailwind. Server functions live in `*.functions.ts`
  files and run server-side. Built to deploy to Cloudflare (`wrangler.jsonc`,
  `@cloudflare/vite-plugin` are already present).
- Also wrapped as native iOS + Android apps via Capacitor. The native apps currently
  load the live web URL (`server.url` in `capacitor.config.ts`), so the web app is the
  source of truth for both.

## Backend — handle with extra care

The backend currently runs on **Lovable Cloud (a managed Supabase instance)**, NOT a
Supabase project I control directly. Key facts:

- Auth runs through the **Lovable auth broker** (email/password + Google OAuth). This
  is a middleman that will NOT exist after migration — repointing auth is the most
  delicate part of any migration and must never be changed without explicit approval.
- The AI rewriting uses a **Lovable AI Gateway** via `LOVABLE_API_KEY`. This also will
  not exist after migration and must be repointed to a direct provider (Anthropic or
  OpenAI) as a deliberate, approved step.
- Database tables: `profiles`, `briefing_cache`, `story_sources`, `briefing_runs`,
  `weekly_recaps`, `saved_briefings`, `waitlist_signups`, `subscriptions`.
- Auth gate: protected routes under `src/routes/_authenticated/`. Bearer-token
  middleware in `src/start.ts`. `requireSupabaseAuth` middleware identifies the signed-in
  user. `supabaseAdmin` (service role) is loaded dynamically for privileged ops only.

### Hard guardrails for the backend
- **Do NOT assume Lovable can be cancelled.** The backend depends on it. Never suggest
  or take steps that would break the live backend.
- **Do NOT rewire auth, the auth broker, or OAuth** without me explicitly asking and
  approving a plan first.
- **Do NOT touch the AI Gateway wiring** without explicit approval.

## Migration goals (the reason we're here)

Moving off Lovable, in this order. Do NOT skip ahead or combine phases without asking.

1. **Frontend → Cloudflare** (easy, low-risk, do first). Backend stays on Lovable Cloud
   during this. Goal: remove the "Edit with Lovable" badge and enable a custom domain.
2. **Backend → my own Supabase account** (separate, careful session). My own Supabase
   account exists and is connected to GitHub. Migrate schema (already in repo
   migrations), RLS, triggers, then user accounts. Do this while user count is low.
3. **Repoint auth** from the Lovable broker to my own Supabase; reconfigure Google OAuth
   (new client ID, secret, redirect URLs) against the new project.
4. **Repoint the AI Gateway** from `LOVABLE_API_KEY` to a direct Anthropic/OpenAI key.
5. **Verify everything end-to-end** on the new stack.
6. **Only then** cancel Lovable. Not before.

## Known cleanup items
- **Stripe was removed** from this app (switching to Apple/Google in-app billing later).
  Watch for and report leftover Stripe references — dead imports, unused env vars,
  orphaned webhook routes — that could break the build. Report before fixing.
- In-app billing (StoreKit + Google Play Billing) is NOT built yet. There is currently
  no working payment path. That's expected; don't try to "fix" it unprompted.

## Security conventions (learned the hard way — enforce these)

- **Never `select('*')` for paywalled or Pro-only content.** Select only the specific
  columns safe to return. Locked/teaser content must never include Pro fields
  (`what_it_means`, `action_items`, `hackers_*`, `exploit_path`, etc.).
- **Never pass a raw client input object to `.update()` or `.insert()`.** Always build
  an explicit allow-list of permitted columns. Prevents mass-assignment (e.g. a caller
  setting `onboarding_complete`, `plan`, or other columns they shouldn't).
- **Validate inputs at runtime, not just in TypeScript types.** TS types disappear at
  runtime and enforce nothing. Check values against allow-lists in the handler.
- `briefing_cache` RLS must always gate on subscription status OR the 6-hour publish
  delay. Never loosen it to `USING (true)`.
- `briefing_runs` is internal ops data — `service_role` only, no authenticated read.
- The ingestion/recap webhook endpoints must require the `x-ingest-secret` header
  matching `INGEST_HOOK_SECRET` before doing any work.
- Never commit `.env` / `.env.*`. They must stay gitignored. Never put service-role or
  secret keys in any `VITE_*` variable (those ship to the browser).
- Never paste real secrets into chat or commit them. Use placeholders.

## Before committing
- Confirm the app still builds (`npm run build`) before declaring a task done.
- Keep changes small and explain what changed in plain language.
