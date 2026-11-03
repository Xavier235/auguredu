ALTER TABLE public.chat_messages_v2 ADD COLUMN IF NOT EXISTS sources jsonb NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.chat_messages_v2.sources IS 'Live web results Augur used to answer an assistant message, as [{title, snippet, url}]';