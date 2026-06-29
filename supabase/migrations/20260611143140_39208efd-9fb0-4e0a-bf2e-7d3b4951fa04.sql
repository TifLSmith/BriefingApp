ALTER TABLE public.briefing_cache
  ADD COLUMN IF NOT EXISTS hackers_moved_through text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS hackers_obtained text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS hackers_impacted text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS exploit_path text[] NOT NULL DEFAULT '{}'::text[];