-- Seed data for development
-- This file will be executed after migrations

-- Insert sample users
INSERT INTO "user" (email, password, fullname) VALUES
  ('john.doe@example.com', 'password123', 'John Doe'),
  ('jane.smith@example.com', 'password456', 'Jane Smith'),
  ('admin@example.com', 'admin123', 'Admin User')
ON CONFLICT (email) DO NOTHING;

-- Insert sample todos
INSERT INTO todolist (note, status, "order") VALUES
  ('Buy groceries', 'pending', 1),
  ('Call mom', 'completed', 2),
  ('Learn NestJS', 'in_progress', 3),
  ('Write documentation', 'pending', 4),
  ('Deploy application', 'pending', 5)
ON CONFLICT DO NOTHING;
