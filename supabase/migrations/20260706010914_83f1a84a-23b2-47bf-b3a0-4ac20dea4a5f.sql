
CREATE TABLE public.chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New chat',
  room text NOT NULL DEFAULT 'study-buddy',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_threads TO authenticated;
GRANT ALL ON public.chat_threads TO service_role;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own threads" ON public.chat_threads FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX chat_threads_user_updated_idx ON public.chat_threads(user_id, updated_at DESC);

CREATE TABLE public.chat_messages_v2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant','system')),
  content text NOT NULL,
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.chat_messages_v2 TO authenticated;
GRANT ALL ON public.chat_messages_v2 TO service_role;
ALTER TABLE public.chat_messages_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own messages" ON public.chat_messages_v2 FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX chat_messages_v2_thread_idx ON public.chat_messages_v2(thread_id, created_at);

CREATE TABLE public.pdf_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  title text NOT NULL,
  mime_type text NOT NULL DEFAULT 'application/pdf',
  page_count integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pdf_documents TO authenticated;
GRANT ALL ON public.pdf_documents TO service_role;
ALTER TABLE public.pdf_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own pdfs" ON public.pdf_documents FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_pdf_id uuid REFERENCES public.pdf_documents(id) ON DELETE SET NULL,
  deck_name text NOT NULL DEFAULT 'Untitled deck',
  question text NOT NULL,
  answer text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.flashcards TO authenticated;
GRANT ALL ON public.flashcards TO service_role;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own flashcards" ON public.flashcards FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX flashcards_user_deck_idx ON public.flashcards(user_id, deck_name);

CREATE TABLE public.user_xp (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  show_on_leaderboard boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.user_xp TO authenticated;
GRANT ALL ON public.user_xp TO service_role;
ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read leaderboard" ON public.user_xp FOR SELECT TO authenticated USING (show_on_leaderboard = true OR auth.uid() = user_id);
CREATE POLICY "update own xp" ON public.user_xp FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "insert own xp" ON public.user_xp FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.xp_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  points integer NOT NULL,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.xp_events TO authenticated;
GRANT ALL ON public.xp_events TO service_role;
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own xp events" ON public.xp_events FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own xp events" ON public.xp_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE UNIQUE INDEX xp_events_read_dedupe ON public.xp_events(user_id, ((meta->>'pdf_id')), ((meta->>'page'))) WHERE kind = 'pdf_page_read';

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER chat_threads_touch BEFORE UPDATE ON public.chat_threads FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER user_xp_touch BEFORE UPDATE ON public.user_xp FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
