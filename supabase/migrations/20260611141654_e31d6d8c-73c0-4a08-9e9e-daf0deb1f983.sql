
-- Replace permissive waitlist INSERT policy with a validated one
DROP POLICY IF EXISTS "anyone can join waitlist" ON public.waitlist_signups;

CREATE POLICY "anyone can join waitlist with valid email"
ON public.waitlist_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND char_length(email) BETWEEN 5 AND 255
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND (industry IS NULL OR char_length(industry) <= 60)
);

-- Add SELECT policy for briefing_cache so authenticated users can read cached briefings
CREATE POLICY "Authenticated users can read briefings"
ON public.briefing_cache
FOR SELECT
TO authenticated
USING (true);

GRANT SELECT ON public.briefing_cache TO authenticated;
