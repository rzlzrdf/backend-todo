-- Create todolist table
CREATE TABLE IF NOT EXISTS "todolist" (
  id BIGSERIAL PRIMARY KEY,
  note TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  "order" INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on order for faster sorting
CREATE INDEX IF NOT EXISTS idx_todolist_order ON "todolist"("order");

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_todolist_status ON "todolist"(status);

-- Enable Row Level Security (RLS)
ALTER TABLE "todolist" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (for development)
-- Allow public insert
CREATE POLICY "Enable insert for all users" ON "todolist"
FOR INSERT WITH CHECK (true);

-- Allow public read
CREATE POLICY "Enable read access for all users" ON "todolist"
FOR SELECT USING (true);

-- Allow public update
CREATE POLICY "Enable update for all users" ON "todolist"
FOR UPDATE USING (true);

-- Allow public delete
CREATE POLICY "Enable delete for all users" ON "todolist"
FOR DELETE USING (true);
