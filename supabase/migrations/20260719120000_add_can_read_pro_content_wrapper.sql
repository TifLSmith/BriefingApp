-- Wrapper around has_active_subscription() so briefing_cache's RLS policy can
-- run under the `authenticated` role without granting that role EXECUTE on
-- has_active_subscription itself. has_active_subscription(uuid, text) accepts
-- an arbitrary user_uuid, so granting it directly to authenticated would let
-- any signed-in user probe another user's subscription status. This wrapper
-- hardcodes auth.uid() — a caller can only ever ask about themselves.
CREATE OR REPLACE FUNCTION public.can_read_pro_content()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_active_subscription(auth.uid(), 'sandbox')
      OR public.has_active_subscription(auth.uid(), 'live');
$$;

REVOKE ALL ON FUNCTION public.can_read_pro_content() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.can_read_pro_content() TO authenticated;

DROP POLICY IF EXISTS "Pro or delayed briefings readable" ON public.briefing_cache;

CREATE POLICY "Pro or delayed briefings readable"
ON public.briefing_cache
FOR SELECT
TO authenticated
USING (
  public.can_read_pro_content()
  OR (published_at IS NOT NULL AND published_at < now() - interval '6 hours')
);
