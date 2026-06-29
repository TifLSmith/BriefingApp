
-- Extend profiles with onboarding + preference fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text,
  ADD COLUMN IF NOT EXISTS experience_level text,
  ADD COLUMN IF NOT EXISTS topics text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS onboarding_complete boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_digest_enabled boolean NOT NULL DEFAULT true;

-- Extend briefing_cache with category/industry/access/slug/extra
ALTER TABLE public.briefing_cache
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS industry text NOT NULL DEFAULT 'all',
  ADD COLUMN IF NOT EXISTS access_level text NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS if_one_thing text;

CREATE UNIQUE INDEX IF NOT EXISTS briefing_cache_slug_uniq ON public.briefing_cache(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS briefing_cache_published_idx ON public.briefing_cache(published_at DESC);
CREATE INDEX IF NOT EXISTS briefing_cache_industry_idx ON public.briefing_cache(industry);

-- story_sources: raw fetched items
CREATE TABLE IF NOT EXISTS public.story_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  briefing_id uuid REFERENCES public.briefing_cache(id) ON DELETE CASCADE,
  source_name text NOT NULL,
  source_url text NOT NULL,
  raw_title text NOT NULL,
  raw_excerpt text,
  fetched_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.story_sources TO authenticated;
GRANT ALL ON public.story_sources TO service_role;
ALTER TABLE public.story_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read story sources" ON public.story_sources
  FOR SELECT TO authenticated USING (true);

-- briefing_runs: ingestion logs
CREATE TABLE IF NOT EXISTS public.briefing_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_date timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL,
  source_count int NOT NULL DEFAULT 0,
  story_count int NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.briefing_runs TO authenticated;
GRANT ALL ON public.briefing_runs TO service_role;
ALTER TABLE public.briefing_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read runs" ON public.briefing_runs
  FOR SELECT TO authenticated USING (true);

-- weekly_recaps
CREATE TABLE IF NOT EXISTS public.weekly_recaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start date NOT NULL,
  week_end date NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  body text NOT NULL,
  podcast_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS weekly_recaps_week_uniq ON public.weekly_recaps(week_start);
GRANT SELECT ON public.weekly_recaps TO authenticated;
GRANT ALL ON public.weekly_recaps TO service_role;
ALTER TABLE public.weekly_recaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read recaps" ON public.weekly_recaps
  FOR SELECT TO authenticated USING (true);
