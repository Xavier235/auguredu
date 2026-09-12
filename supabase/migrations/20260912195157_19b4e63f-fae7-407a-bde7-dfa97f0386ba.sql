CREATE TABLE public.exam_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  board text NOT NULL DEFAULT 'jamb',
  subject text NOT NULL DEFAULT '',
  score integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  topics jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exam_attempts TO authenticated;
GRANT ALL ON public.exam_attempts TO service_role;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own exam attempts" ON public.exam_attempts FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX exam_attempts_user_created_idx ON public.exam_attempts (user_id, created_at DESC);

CREATE TABLE public.igcse_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  source text NOT NULL DEFAULT 'home',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.igcse_waitlist TO anon;
GRANT INSERT, SELECT ON public.igcse_waitlist TO authenticated;
GRANT ALL ON public.igcse_waitlist TO service_role;
ALTER TABLE public.igcse_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join the IGCSE waitlist" ON public.igcse_waitlist FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read the IGCSE waitlist" ON public.igcse_waitlist FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));