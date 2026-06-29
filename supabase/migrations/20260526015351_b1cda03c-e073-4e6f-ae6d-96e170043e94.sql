ALTER TABLE public.briefing_cache
  ADD COLUMN IF NOT EXISTS what_attackers_got text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS action_items text[] NOT NULL DEFAULT '{}';