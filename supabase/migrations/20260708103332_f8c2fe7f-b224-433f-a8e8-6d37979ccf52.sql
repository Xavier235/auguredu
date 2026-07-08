
REVOKE EXECUTE ON FUNCTION public.consume_quota(text, int) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.my_usage_today() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.apply_student_verification() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_quota(text, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.my_usage_today() TO authenticated;
