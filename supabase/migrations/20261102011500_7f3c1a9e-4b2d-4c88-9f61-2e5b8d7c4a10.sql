-- Locks the remaining over-exposed database surface:
-- 1. usage_counters becomes read-only for clients (quota consumption happens server-side).
-- 2. profiles: clients can only edit their own display fields, never
--    subscription_tier / subscription_expires_at / is_verified_student / verified_domain.
-- 3. consume_quota becomes server-only; a new consume_server_quota is for
--    trusted server code (service role) and validates the feature and limit.
-- 4. my_usage_today runs as the caller now (usage_counters reads are RLS-scoped to own rows).

REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.usage_counters FROM anon, authenticated;

REVOKE UPDATE ON public.profiles FROM anon, authenticated;
GRANT UPDATE (display_name, avatar_url, school, level, bio, updated_at) ON public.profiles TO authenticated;

REVOKE EXECUTE ON FUNCTION public.consume_quota(text, integer) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.consume_server_quota(
  _user_id uuid,
  _feature text,
  _limit integer
)
RETURNS TABLE(allowed boolean, new_count integer, day_limit integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  expected int;
  today date := (now() AT TIME ZONE 'utc')::date;
  cur int;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'A user id is required';
  END IF;

  expected := CASE _feature
    WHEN 'chat' THEN 30
    WHEN 'flashcards' THEN 5
    WHEN 'lecturer' THEN 5
    WHEN 'explain' THEN 3
    ELSE NULL
  END;

  IF expected IS NULL OR _limit IS DISTINCT FROM expected THEN
    RAISE EXCEPTION 'Unknown quota feature or wrong limit';
  END IF;

  INSERT INTO public.usage_counters (user_id, feature, day, count)
  VALUES (_user_id, _feature, today, 0)
  ON CONFLICT (user_id, feature, day) DO NOTHING;

  SELECT count INTO cur
    FROM public.usage_counters
   WHERE user_id = _user_id AND feature = _feature AND day = today
   FOR UPDATE;

  IF cur >= _limit THEN
    RETURN QUERY SELECT false, cur, _limit;
    RETURN;
  END IF;

  UPDATE public.usage_counters
     SET count = count + 1, updated_at = now()
   WHERE user_id = _user_id AND feature = _feature AND day = today
  RETURNING count INTO cur;

  RETURN QUERY SELECT true, cur, _limit;
END;
$function$;

REVOKE ALL ON FUNCTION public.consume_server_quota(uuid, text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_server_quota(uuid, text, integer) TO service_role;

ALTER FUNCTION public.my_usage_today() SECURITY INVOKER;
REVOKE EXECUTE ON FUNCTION public.my_usage_today() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_usage_today() TO authenticated;
