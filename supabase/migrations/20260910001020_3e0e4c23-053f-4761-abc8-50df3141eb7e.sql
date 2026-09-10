ALTER TABLE public.study_profiles
  ADD COLUMN IF NOT EXISTS track text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS stream text NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS public.feature_usage (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature text NOT NULL,
  count integer NOT NULL DEFAULT 0,
  last_used_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, feature)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.feature_usage TO authenticated;
GRANT ALL ON public.feature_usage TO service_role;

ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own feature usage" ON public.feature_usage
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER feature_usage_touch
  BEFORE UPDATE ON public.feature_usage
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();