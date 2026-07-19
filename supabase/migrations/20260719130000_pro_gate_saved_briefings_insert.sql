-- Saving/bookmarking is a Pro-only feature. Free users may still view and
-- remove briefings they saved while they were Pro (SELECT/DELETE untouched);
-- only creating a new save requires an active subscription.
DROP POLICY IF EXISTS "Users save for self" ON public.saved_briefings;

CREATE POLICY "Users save for self"
ON public.saved_briefings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND public.can_read_pro_content());
