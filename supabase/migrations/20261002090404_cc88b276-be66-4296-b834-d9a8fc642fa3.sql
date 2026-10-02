DELETE FROM public.igcse_waitlist WHERE email !~* '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$' OR length(email) > 254;
ALTER TABLE public.igcse_waitlist ADD CONSTRAINT igcse_waitlist_email_valid CHECK (email ~* '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$' AND length(email) <= 254);
ALTER TABLE public.igcse_waitlist ADD CONSTRAINT igcse_waitlist_source_len CHECK (length(source) <= 40);
DROP POLICY IF EXISTS "Anyone can join the IGCSE waitlist" ON public.igcse_waitlist;
CREATE POLICY "Anyone can join the IGCSE waitlist" ON public.igcse_waitlist FOR INSERT TO anon, authenticated
  WITH CHECK (email ~* '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$' AND length(email) <= 254 AND length(source) <= 40);
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT p.oid::regprocedure AS sig FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
           WHERE n.nspname='public' AND p.prosecdef LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon', r.sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated, service_role', r.sig);
  END LOOP;
END $$;