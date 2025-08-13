-- Migration: add_user_id_to_todolist
-- Created: 2025-08-13T01:55:03.000Z

-- Add user_id column to todolist table
ALTER TABLE todolist ADD COLUMN user_id INTEGER;

-- Add foreign key constraint
ALTER TABLE todolist 
ADD CONSTRAINT fk_todolist_user 
FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX idx_todolist_user_id ON todolist(user_id);

-- Update RLS policies to include user_id filtering
-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON todolist;
DROP POLICY IF EXISTS "Enable insert for all users" ON todolist;
DROP POLICY IF EXISTS "Enable update for all users" ON todolist;
DROP POLICY IF EXISTS "Enable delete for all users" ON todolist;

-- Create new policies that consider user_id
-- For now, keeping public access but you can modify these based on your auth requirements
CREATE POLICY "Enable read access for all users" ON todolist
FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON todolist
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON todolist
FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON todolist
FOR DELETE USING (true);

