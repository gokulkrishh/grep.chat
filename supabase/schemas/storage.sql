-- 1. Create a public storage bucket for chat attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow authenticated users to upload files to their own path: {user_id}/{chat_id}/*
DROP POLICY IF EXISTS "Authenticated users can upload chat attachments" ON storage.objects;
CREATE POLICY "Authenticated users can upload chat attachments"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'chat-attachments'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 3. Allow anyone to read files (needed for AI model access and shared chats)
DROP POLICY IF EXISTS "Anyone can read chat attachments" ON storage.objects;
CREATE POLICY "Anyone can read chat attachments"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id = 'chat-attachments'
  );

-- 4. Allow authenticated users to delete their own files
DROP POLICY IF EXISTS "Users can delete own chat attachments" ON storage.objects;
CREATE POLICY "Users can delete own chat attachments"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'chat-attachments'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
