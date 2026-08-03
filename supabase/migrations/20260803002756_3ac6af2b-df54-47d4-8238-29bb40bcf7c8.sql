ALTER TABLE public.payment_requests ADD COLUMN IF NOT EXISTS reference_code text;
CREATE UNIQUE INDEX IF NOT EXISTS payment_requests_reference_code_key ON public.payment_requests (reference_code) WHERE reference_code IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  body text,
  href text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own notifications read" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own notifications update" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own notifications insert" ON public.notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own notifications delete" ON public.notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS notifications_user_created_idx ON public.notifications (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.library_reads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id text NOT NULL,
  item_title text NOT NULL,
  department text,
  level text,
  seconds_read integer NOT NULL DEFAULT 0,
  quiz_score integer NOT NULL DEFAULT 0,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.library_reads TO authenticated;
GRANT ALL ON public.library_reads TO service_role;
ALTER TABLE public.library_reads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own library reads" ON public.library_reads FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER library_reads_touch BEFORE UPDATE ON public.library_reads FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.notify_payment_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status IN ('approved','rejected') THEN
    INSERT INTO public.notifications (user_id, kind, title, body, href)
    VALUES (
      NEW.user_id,
      CASE WHEN NEW.status = 'approved' THEN 'payment_approved' ELSE 'payment_rejected' END,
      CASE WHEN NEW.status = 'approved' THEN 'Payment approved — premium unlocked' ELSE 'Payment receipt rejected' END,
      COALESCE(NEW.admin_notes, CASE WHEN NEW.status = 'approved' THEN 'Your premium access is now active.' ELSE 'Please re-submit a clearer receipt.' END),
      '/upgrade'
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS payment_requests_notify ON public.payment_requests;
CREATE TRIGGER payment_requests_notify AFTER UPDATE ON public.payment_requests FOR EACH ROW EXECUTE FUNCTION public.notify_payment_review();

DROP TRIGGER IF EXISTS payment_requests_apply_approval ON public.payment_requests;
CREATE TRIGGER payment_requests_apply_approval BEFORE UPDATE ON public.payment_requests FOR EACH ROW EXECUTE FUNCTION public.apply_payment_approval();

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;