-- 1) Groups carry their own member count (replaces the app_private study_group_counts helper)
ALTER TABLE public.study_groups ADD COLUMN IF NOT EXISTS member_count integer NOT NULL DEFAULT 0;
UPDATE public.study_groups g SET member_count = (SELECT count(*) FROM public.study_group_members m WHERE m.group_id = g.id);

CREATE OR REPLACE FUNCTION public.sync_study_group_member_count() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.study_groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.study_groups SET member_count = GREATEST(member_count - 1, 0) WHERE id = OLD.group_id;
  ELSE
    IF OLD.group_id <> NEW.group_id THEN
      UPDATE public.study_groups SET member_count = GREATEST(member_count - 1, 0) WHERE id = OLD.group_id;
      UPDATE public.study_groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
    END IF;
  END IF;
  RETURN NULL;
END
$fn$;

DROP TRIGGER IF EXISTS trg_sync_group_member_count ON public.study_group_members;
CREATE TRIGGER trg_sync_group_member_count
AFTER INSERT OR DELETE OR UPDATE OF group_id ON public.study_group_members
FOR EACH ROW EXECUTE FUNCTION public.sync_study_group_member_count();

REVOKE ALL ON FUNCTION public.sync_study_group_member_count() FROM PUBLIC, anon, authenticated;
GRANT ALL ON FUNCTION public.sync_study_group_member_count() TO service_role;
COMMENT ON FUNCTION app_private.study_group_counts() IS 'DEPRECATED: replaced by public.study_groups.member_count';

-- 2) Chat messages: users may only write user/assistant rows for themselves, never system rows
DROP POLICY IF EXISTS "own messages" ON public.chat_messages_v2;
CREATE POLICY "select own messages" ON public.chat_messages_v2 FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own chat messages" ON public.chat_messages_v2 FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND role IN ('user', 'assistant'));
CREATE POLICY "update own chat messages" ON public.chat_messages_v2 FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND role IN ('user', 'assistant'));
CREATE POLICY "delete own chat messages" ON public.chat_messages_v2 FOR DELETE TO authenticated USING (auth.uid() = user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages_v2 TO authenticated;
GRANT ALL ON public.chat_messages_v2 TO service_role;

-- 3) Subscription tier cannot be self-written: restrict profile updates to safe columns
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (display_name, avatar_url, school, level, bio) ON public.profiles TO authenticated;

-- 4) XP can no longer be self-written; server code awards it through a validated definer function
DROP POLICY IF EXISTS "insert own xp" ON public.user_xp;
DROP POLICY IF EXISTS "update own xp" ON public.user_xp;
REVOKE INSERT, UPDATE ON public.user_xp FROM authenticated;

CREATE OR REPLACE FUNCTION public.add_user_xp(_points integer, _level_divisor integer DEFAULT 250)
RETURNS TABLE (xp integer, level integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  new_xp integer;
  new_level integer;
BEGIN
  IF _points < 1 OR _points > 500 THEN
    RAISE EXCEPTION 'XP award out of range';
  END IF;
  IF _level_divisor < 1 OR _level_divisor > 10000 THEN
    RAISE EXCEPTION 'Invalid level divisor';
  END IF;
  INSERT INTO public.user_xp (user_id, xp, level, show_on_leaderboard)
  VALUES (auth.uid(), _points, GREATEST(1, (_points / _level_divisor) + 1), true)
  ON CONFLICT (user_id) DO UPDATE
    SET xp = public.user_xp.xp + _points,
        level = GREATEST(1, ((public.user_xp.xp + _points) / _level_divisor) + 1),
        updated_at = now()
  RETURNING public.user_xp.xp, public.user_xp.level INTO new_xp, new_level;
  RETURN QUERY SELECT new_xp, new_level;
END
$fn$;

REVOKE ALL ON FUNCTION public.add_user_xp(integer, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.add_user_xp(integer, integer) TO authenticated, service_role;

-- 5) Keep live exam questions bounded like the waitlist
ALTER TABLE public.exam_live_questions
  ADD CONSTRAINT exam_live_questions_question_len CHECK (char_length(question) <= 2000);