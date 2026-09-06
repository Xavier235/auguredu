CREATE TABLE IF NOT EXISTS public.user_memory (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  summary text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_memory TO authenticated;
GRANT ALL ON public.user_memory TO service_role;
ALTER TABLE public.user_memory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own memory" ON public.user_memory;
CREATE POLICY "own memory" ON public.user_memory FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.study_profiles ADD COLUMN IF NOT EXISTS courses text NOT NULL DEFAULT '';
ALTER TABLE public.study_profiles ADD COLUMN IF NOT EXISTS goal text NOT NULL DEFAULT '';
ALTER TABLE public.study_profiles ADD COLUMN IF NOT EXISTS days text NOT NULL DEFAULT '';