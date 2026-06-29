DROP POLICY IF EXISTS "Authenticated users can read briefings" ON public.briefing_cache;

CREATE POLICY "Pro or delayed briefings readable"
ON public.briefing_cache
FOR SELECT
TO authenticated
USING (
  public.has_active_subscription(auth.uid(), 'sandbox')
  OR public.has_active_subscription(auth.uid(), 'live')
  OR (published_at IS NOT NULL AND published_at < now() - interval '6 hours')
);

DROP POLICY IF EXISTS "Authenticated can read runs" ON public.briefing_runs;
REVOKE SELECT ON public.briefing_runs FROM authenticated;