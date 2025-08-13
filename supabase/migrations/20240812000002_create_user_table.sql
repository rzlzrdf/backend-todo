-- Create user table
CREATE TABLE IF NOT EXISTS "user" (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  fullname VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_email ON "user"(email);

-- Enable Row Level Security (RLS)
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (for development)
-- Allow public insert
CREATE POLICY "Enable insert for all users" ON "user"
FOR INSERT WITH CHECK (true);

-- Allow public read
CREATE POLICY "Enable read access for all users" ON "user"
FOR SELECT USING (true);

-- Allow public update
CREATE POLICY "Enable update for all users" ON "user"
FOR UPDATE USING (true);

-- Allow public delete
CREATE POLICY "Enable delete for all users" ON "user"
FOR DELETE USING (true);
