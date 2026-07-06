
CREATE POLICY "chat uploads read own" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'chat-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "chat uploads insert own" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'chat-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "chat uploads delete own" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'chat-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
