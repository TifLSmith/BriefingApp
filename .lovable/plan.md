## Cyber Threat Daily Briefing — Full Revamp Plan

Keeping the existing dark/cyan color theme, A.P.E. voice, briefing_cache table, Stripe sandbox setup, and webhook handler. Layering the full SaaS structure on top.

### 1. Database changes (one migration)

New / extended tables:
- `profiles` — add `role`, `experience_level`, `topics text[]`, `onboarding_complete bool`, `email_digest_enabled bool`
- `briefing_cache` — add `category text`, `industry text`, `access_level text` ('free' | 'pro'), `slug text unique`, `if_one_thing text`
- `weekly_recaps` — week_start, week_end, title, summary, body, podcast_url
- `briefing_runs` — run_date, status, source_count, story_count, notes
- `story_sources` — briefing_id FK, source_name, source_url, raw_title, raw_excerpt, fetched_at

All with GRANTs + RLS. `weekly_recaps` readable by authenticated only (pro check done in app/query). `saved_briefings` stays as-is.

### 2. Routes (file-based, all under `src/routes/`)

```text
index.tsx                       → / (landing, redesigned)
auth.tsx                        → /auth (existing, split visually into signup/signin tabs)
pricing.tsx                     → /pricing
_authenticated/route.tsx        → gate (already exists pattern)
_authenticated/onboarding.tsx   → /onboarding (required if !onboarding_complete)
_authenticated/briefing.tsx     → /briefing (feed, filters, save)
_authenticated/briefing.$id.tsx → /briefing/:id (story detail)
_authenticated/saved.tsx        → /saved
_authenticated/weekly-recap.tsx → /weekly-recap (pro-gated)
_authenticated/settings.tsx     → /settings (profile, prefs, billing, logout)
```

Root layout adds shared `<Header />` with nav + auth state, and `<Footer />`.

### 3. Onboarding gate

`_authenticated/route.tsx` checks `profiles.onboarding_complete`. If false and current path ≠ `/onboarding`, redirect to `/onboarding`. Onboarding collects role, industry, experience level, topics → writes to profile.

### 4. Pricing & Stripe

Update prices via `payments--batch_create_product`:
- `pro_monthly` — $9/mo
- `pro_yearly` — $86/yr

Pricing page renders both with toggle. Subscribe button opens embedded checkout. Settings → Billing opens customer portal. Pro feature gating uses `useSubscription` hook keyed on `price_id`.

Access logic:
- Free: 3 newest stories per day, only those published > 6 hours ago
- Pro: all stories, real-time, plus weekly recap + industry filters

### 5. Ingestion pipeline

Existing edge function or server route generates AI briefings. Add:
- `/api/public/hooks/ingest-briefings` — fetches CVE feed (NVD JSON) + a news RSS, rewrites via Lovable AI Gateway into A.P.E. format (what happened, why it matters, who is affected, what to do next, if-one-thing), inserts into `briefing_cache` with category/severity/industry/access_level, logs run into `briefing_runs`, stores raw items in `story_sources`.
- pg_cron job: every 30 min calling the hook with anon key
- `/api/public/hooks/weekly-recap` — Sundays 00:00, summarizes the week's top stories via AI into `weekly_recaps`

(Note: pure CVE/RSS scrape may produce uneven results; the AI rewrite + categorization is the value-add. Will keep prompts strict to the A.P.E. format.)

### 6. Components (`src/components/`)

`Header`, `Footer`, `Hero`, `FeatureGrid`, `PricingCards`, `FAQ`, `BriefingCard`, `LockedBriefingCard`, `SaveButton`, `IndustryFilter`, `SubscriptionBadge`, `OnboardingForm`, `WeeklyRecapCard`, plus keep existing `PaymentTestModeBanner` and `StripeEmbeddedCheckout`.

### 7. Server functions (`src/lib/*.functions.ts`)

`getBriefingFeed` (respects free/pro + 6hr delay), `getBriefingById`, `saveBriefing`, `unsaveBriefing`, `getSavedBriefings`, `getWeeklyRecaps`, `updateProfile`, `completeOnboarding`, plus existing `createCheckoutSession`/`createPortalSession`.

### 8. Theme

Preserve current dark theme + cyan accent tokens already in `src/styles.css`. Do not touch color tokens.

### Out of scope for this pass

- Admin/content management page (skipping per typical MVP; stories managed via DB)
- Podcast hosting (we'll add a placeholder podcast URL field on weekly_recaps)
- Email digest sending (column exists; cron not wired)
- Custom domain on emails

### Order of execution

1. Run migration (waits for your approval)
2. Create Stripe yearly price
3. Write server functions, hooks, route files, components
4. Schedule cron jobs
5. Verify build + take screenshots

Approve to proceed?