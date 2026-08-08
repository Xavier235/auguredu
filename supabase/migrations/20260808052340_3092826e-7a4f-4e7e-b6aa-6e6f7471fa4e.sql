CREATE TABLE public.study_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school TEXT NOT NULL DEFAULT '',
  department TEXT NOT NULL DEFAULT '',
  level TEXT NOT NULL DEFAULT '100',
  campus_area TEXT NOT NULL DEFAULT '',
  hostel TEXT NOT NULL DEFAULT '',
  study_style TEXT NOT NULL DEFAULT 'mixed',
  availability TEXT NOT NULL DEFAULT '',
  about TEXT NOT NULL DEFAULT '',
  contact_handle TEXT NOT NULL DEFAULT '',
  discoverable BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_profiles TO authenticated;
GRANT ALL ON public.study_profiles TO service_role;
ALTER TABLE public.study_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "study_profiles_select" ON public.study_profiles FOR SELECT TO authenticated USING (discoverable OR user_id = auth.uid());
CREATE POLICY "study_profiles_insert" ON public.study_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "study_profiles_update" ON public.study_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "study_profiles_delete" ON public.study_profiles FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE TRIGGER study_profiles_touch BEFORE UPDATE ON public.study_profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.study_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  school TEXT NOT NULL DEFAULT '',
  department TEXT NOT NULL DEFAULT '',
  level TEXT NOT NULL DEFAULT '100',
  topic TEXT NOT NULL DEFAULT '',
  meeting_place TEXT NOT NULL DEFAULT '',
  meeting_time TEXT NOT NULL DEFAULT '',
  capacity INT NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_groups TO authenticated;
GRANT ALL ON public.study_groups TO service_role;
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "study_groups_select" ON public.study_groups FOR SELECT TO authenticated USING (true);
CREATE POLICY "study_groups_insert" ON public.study_groups FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "study_groups_update" ON public.study_groups FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
CREATE POLICY "study_groups_delete" ON public.study_groups FOR DELETE TO authenticated USING (created_by = auth.uid());
CREATE TRIGGER study_groups_touch BEFORE UPDATE ON public.study_groups FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.study_group_members (
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.study_group_members TO authenticated;
GRANT ALL ON public.study_group_members TO service_role;
ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "study_group_members_select" ON public.study_group_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "study_group_members_insert" ON public.study_group_members FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "study_group_members_delete" ON public.study_group_members FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE INDEX study_groups_school_idx ON public.study_groups (school, department, level);
CREATE INDEX study_profiles_match_idx ON public.study_profiles (school, department, level);