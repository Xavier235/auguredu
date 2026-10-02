CREATE OR REPLACE FUNCTION public.my_study_school()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT lower(school) FROM public.study_profiles WHERE user_id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.study_group_counts()
RETURNS TABLE(group_id uuid, members integer) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT m.group_id, count(*)::int FROM public.study_group_members m
  JOIN public.study_groups g ON g.id = m.group_id
  WHERE auth.uid() IS NOT NULL
    AND (g.created_by = auth.uid() OR lower(g.school) = public.my_study_school()
         OR public.is_group_member(g.id, auth.uid()))
  GROUP BY m.group_id
$$;
REVOKE EXECUTE ON FUNCTION public.study_group_counts() FROM anon;
GRANT EXECUTE ON FUNCTION public.study_group_counts() TO authenticated;

DROP POLICY IF EXISTS "study_groups_select" ON public.study_groups;
CREATE POLICY "study_groups_select" ON public.study_groups FOR SELECT TO authenticated
USING (created_by = auth.uid() OR lower(school) = public.my_study_school() OR public.is_group_member(id, auth.uid()));

DROP POLICY IF EXISTS "study_group_members_select" ON public.study_group_members;
CREATE POLICY "study_group_members_select" ON public.study_group_members FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_group_member(group_id, auth.uid())
       OR EXISTS (SELECT 1 FROM public.study_groups g WHERE g.id = group_id AND g.created_by = auth.uid()));