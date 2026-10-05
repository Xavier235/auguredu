CREATE SCHEMA IF NOT EXISTS app_private;
REVOKE ALL ON SCHEMA app_private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA app_private TO service_role;

-- Trigger routines need not be callable through the Data API.
REVOKE EXECUTE ON FUNCTION public.apply_payment_approval() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.apply_student_verification() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_payment_review() FROM PUBLIC, anon, authenticated;

-- Existing RLS policy dependencies follow the function OID when it changes schema.
ALTER FUNCTION public.has_role(uuid, public.app_role) SET SCHEMA app_private;
ALTER FUNCTION public.is_group_member(uuid, uuid) SET SCHEMA app_private;
ALTER FUNCTION public.my_study_school() SET SCHEMA app_private;
ALTER FUNCTION public.study_group_counts() SET SCHEMA app_private;
REVOKE EXECUTE ON FUNCTION app_private.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION app_private.is_group_member(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION app_private.my_study_school() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION app_private.study_group_counts() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION app_private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.is_group_member(uuid, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.my_study_school() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.study_group_counts() TO service_role;

