ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS school text,
  ADD COLUMN IF NOT EXISTS level text,
  ADD COLUMN IF NOT EXISTS bio text;