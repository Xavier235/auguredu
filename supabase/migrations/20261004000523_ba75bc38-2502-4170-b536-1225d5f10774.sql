CREATE TABLE public.exam_live_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.exam_live_questions TO authenticated;
GRANT ALL ON public.exam_live_questions TO service_role;
ALTER TABLE public.exam_live_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own live exam questions" ON public.exam_live_questions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX ON public.exam_live_questions (user_id, created_at);