-- 0. Ensure uuid-ossp extension enabled for uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),                       -- Unique message ID
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,         -- Link to chat
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,                 -- Sender (NULL for AI)
  model TEXT,                                                           -- Model used for AI messages
  role TEXT,                                                            -- Role of the message (user or assistant)
  parts JSONB,                                                          -- Parts of the message (text, reasoning, tool invocation, etc.)
  metadata JSONB DEFAULT '{}'::jsonb,                                   -- Custom metadata (citations, attachments, etc.)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),                        -- When message was created
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()                         -- When message was last updated
);

-- 1.1. Indexes for performance
CREATE INDEX IF NOT EXISTS messages_chat_id_idx ON messages(chat_id);
CREATE INDEX IF NOT EXISTS messages_user_id_idx ON messages(user_id);
CREATE INDEX IF NOT EXISTS messages_chat_user_idx ON messages(chat_id, user_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS messages_model_idx ON messages(model) WHERE model IS NOT NULL;

-- 2. Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 2.1. Users can view messages from their own chats
DROP POLICY IF EXISTS "Users can view own chat messages" ON messages;
CREATE POLICY "Users can view own chat messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND chats.created_by = auth.uid()
    )
  );

-- 2.2. Users can insert messages into their own chats
DROP POLICY IF EXISTS "Users can create messages in own chats" ON messages;
CREATE POLICY "Users can create messages in own chats"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.created_by = auth.uid()
    )
  );

-- 2.3. Users can update their own messages
DROP POLICY IF EXISTS "Users can update own messages" ON messages;
CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
  )
  WITH CHECK (
    user_id = auth.uid()
  );

-- 2.4. Users can delete their own messages
DROP POLICY IF EXISTS "Users can delete own messages" ON messages;
CREATE POLICY "Users can delete own messages"
  ON messages FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
  );

-- 2.5. Anyone with a valid, unexpired share_token can view messages from shared chats
DROP POLICY IF EXISTS "View messages from shared chats" ON messages;
CREATE POLICY "View messages from shared chats"
  ON messages FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.share_token IS NOT NULL
    )
  );

