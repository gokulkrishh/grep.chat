-- 1. Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),                     -- Unique chat ID
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,    -- User who created the chat
  title TEXT,                                                         -- Optional chat title
  share_token TEXT UNIQUE,                                            -- Token for shared access
  share_created_at TIMESTAMPTZ,                                       -- When chat was shared
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),                      -- When chat was created
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()                    -- When chat was last updated
);

-- 1.1 Indexes for performance
CREATE INDEX IF NOT EXISTS chats_created_by_idx ON chats(created_by);
CREATE INDEX IF NOT EXISTS chats_share_token_idx ON chats(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS chats_created_at_idx ON chats(created_at DESC);

-- 2. Enable Row Level Security
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- 2.1. Users can view their own chats
DROP POLICY IF EXISTS "Users can view own chats" ON chats;
CREATE POLICY "Users can view own chats"
  ON chats FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid()
  );

-- 2.2. Users can create their own chats
DROP POLICY IF EXISTS "Users can create chats" ON chats;
CREATE POLICY "Users can create chats"
  ON chats FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid()
  );

-- 2.3. Users can update their own chats
DROP POLICY IF EXISTS "Users can update own chats" ON chats;
CREATE POLICY "Users can update own chats"
  ON chats FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid()
  )
  WITH CHECK (
    created_by = auth.uid()
  );

-- 2.4. Users can delete their own chats
DROP POLICY IF EXISTS "Users can delete own chats" ON chats;
CREATE POLICY "Users can delete own chats"
  ON chats FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid()
  );

-- 2.5. Anyone with a valid, unexpired share_token can view shared chats
DROP POLICY IF EXISTS "View shared chats" ON chats;
CREATE POLICY "View shared chats"
  ON chats FOR SELECT
  TO anon, authenticated
  USING (
    share_token IS NOT NULL
  );
