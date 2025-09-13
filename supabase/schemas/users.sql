-- 1. Create table for users
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,      
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 1.1. Enable row level security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Function to insert a user on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger to call the function after user signup
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;
CREATE TRIGGER handle_new_user
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4.1. Only users can insert their own user
CREATE POLICY "Users can insert own user" ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 4.2. Only users can select/update their own user
DROP POLICY IF EXISTS "Users can select own user" ON public.users;
CREATE POLICY "Users can select own user" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- 4.3. Only users can update their own user
DROP POLICY IF EXISTS "Users can update own user" ON public.users;
CREATE POLICY "Users can update own user" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- 4.4. Only users can delete their own user
DROP POLICY IF EXISTS "Users can delete own user" ON public.users;
CREATE POLICY "Users can delete own user" ON public.users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);