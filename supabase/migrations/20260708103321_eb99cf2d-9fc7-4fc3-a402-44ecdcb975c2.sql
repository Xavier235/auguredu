
-- Profiles: verified student + tier
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_verified_student boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS verified_domain text,
  ADD COLUMN IF NOT EXISTS subscription_tier text NOT NULL DEFAULT 'free';

-- Function to classify + apply badge from an auth user row
CREATE OR REPLACE FUNCTION public.apply_student_verification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  d text;
  is_school boolean := false;
BEGIN
  IF NEW.email IS NULL OR NEW.email_confirmed_at IS NULL THEN
    RETURN NEW;
  END IF;
  d := lower(split_part(NEW.email, '@', 2));
  IF d ~ '\.edu(\.[a-z]{2,3})?$' OR d ~ '\.ac\.[a-z]{2,3}$' OR d ~ '\.sch\.[a-z]{2,3}$' THEN
    is_school := true;
  END IF;
  UPDATE public.profiles
     SET is_verified_student = is_school,
         verified_domain = CASE WHEN is_school THEN d ELSE verified_domain END
   WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_confirm_verify_student ON auth.users;
CREATE TRIGGER on_auth_user_confirm_verify_student
AFTER INSERT OR UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW
WHEN (NEW.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.apply_student_verification();

-- Usage counters (per user per feature per UTC day)
CREATE TABLE IF NOT EXISTS public.usage_counters (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature text NOT NULL,
  day date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, feature, day)
);

GRANT SELECT ON public.usage_counters TO authenticated;
GRANT ALL ON public.usage_counters TO service_role;

ALTER TABLE public.usage_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read own usage" ON public.usage_counters
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Atomic check + increment. Returns whether the caller may proceed and the new count.
CREATE OR REPLACE FUNCTION public.consume_quota(_feature text, _limit int)
RETURNS TABLE(allowed boolean, new_count int, day_limit int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  today date := (now() AT TIME ZONE 'utc')::date;
  cur int;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.usage_counters (user_id, feature, day, count)
  VALUES (auth.uid(), _feature, today, 0)
  ON CONFLICT (user_id, feature, day) DO NOTHING;

  SELECT count INTO cur
    FROM public.usage_counters
   WHERE user_id = auth.uid() AND feature = _feature AND day = today
   FOR UPDATE;

  IF cur >= _limit THEN
    RETURN QUERY SELECT false, cur, _limit;
    RETURN;
  END IF;

  UPDATE public.usage_counters
     SET count = count + 1, updated_at = now()
   WHERE user_id = auth.uid() AND feature = _feature AND day = today
  RETURNING count INTO cur;

  RETURN QUERY SELECT true, cur, _limit;
END;
$$;

GRANT EXECUTE ON FUNCTION public.consume_quota(text, int) TO authenticated;

-- Read-only "what's my usage today" helper
CREATE OR REPLACE FUNCTION public.my_usage_today()
RETURNS TABLE(feature text, count int)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT feature, count FROM public.usage_counters
   WHERE user_id = auth.uid()
     AND day = (now() AT TIME ZONE 'utc')::date;
$$;

GRANT EXECUTE ON FUNCTION public.my_usage_today() TO authenticated;
