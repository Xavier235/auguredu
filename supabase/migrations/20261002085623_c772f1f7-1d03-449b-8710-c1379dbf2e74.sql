REVOKE EXECUTE ON FUNCTION public.my_study_school() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.study_group_counts() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_study_school() TO authenticated;
GRANT EXECUTE ON FUNCTION public.study_group_counts() TO authenticated;