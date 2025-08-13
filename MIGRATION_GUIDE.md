# Supabase Migration Guide

This guide explains how to manage database migrations for your Supabase project.

## Overview

The migration system allows you to:
- Version control your database schema
- Apply changes consistently across environments
- Roll back changes if needed
- Collaborate with team members on schema changes

## Project Structure

```
supabase/
├── migrations/                    # Migration files
│   ├── 20240812000001_create_todolist_table.sql
│   └── 20240812000002_create_user_table.sql
├── config.toml                   # Supabase configuration
└── seed.sql                      # Seed data (optional)
```

## Getting Started

### 1. Link to Your Supabase Project

First, you need to link your local project to your Supabase project:

```bash
# Get your project reference from Supabase dashboard
npx supabase link --project-ref YOUR_PROJECT_REF
```

### 2. View Available Migrations

```bash
npm run migrate:list
# or
node scripts/migrate.js list
```

### 3. Run Migrations

```bash
npm run migrate:run
# or
node scripts/migrate.js run
```

## Available Commands

### Migration Commands

| Command | Description |
|---------|-------------|
| `npm run migrate:list` | List all available migrations |
| `npm run migrate:run` | Run all pending migrations |
| `npm run migrate:create <name>` | Create a new migration file |

### Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:push` | Push local changes to remote |
| `npm run db:reset` | Reset the database (⚠️ destructive) |
| `npm run db:diff` | Generate a diff of schema changes |

## Creating New Migrations

### 1. Create a Migration File

```bash
npm run migrate:create add_user_profile_table
```

This creates a new file: `supabase/migrations/20240812120000_add_user_profile_table.sql`

### 2. Edit the Migration

Open the generated file and add your SQL:

```sql
-- Migration: add_user_profile_table
-- Created: 2024-08-12T12:00:00.000Z

-- Add your SQL here
CREATE TABLE user_profile (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
  bio TEXT,
  avatar_url VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_user_profile_user_id ON user_profile(user_id);
```

### 3. Run the Migration

```bash
npm run migrate:run
```

## Migration Best Practices

### 1. Naming Conventions

- Use descriptive names: `add_user_profile_table`, `update_todo_status_enum`
- Use lowercase with underscores
- Be specific about what the migration does

### 2. Migration Structure

```sql
-- Migration: descriptive_name
-- Created: timestamp

-- Add your changes here
-- Always include comments explaining complex changes

-- Example:
-- Add new column with default value
ALTER TABLE todolist ADD COLUMN priority INTEGER DEFAULT 1;

-- Create index for performance
CREATE INDEX idx_todolist_priority ON todolist(priority);
```

### 3. Reversible Migrations

Whenever possible, make migrations reversible:

```sql
-- Up migration
ALTER TABLE todolist ADD COLUMN priority INTEGER DEFAULT 1;

-- Down migration (for rollback)
-- ALTER TABLE todolist DROP COLUMN priority;
```

### 4. Data Migrations

For data changes, use separate migrations:

```sql
-- Migration: update_existing_todos_status
-- Created: 2024-08-12T12:00:00.000Z

-- Update existing todos to have a default status
UPDATE todolist SET status = 'pending' WHERE status IS NULL;
```

## Common Migration Patterns

### Adding a New Table

```sql
-- Migration: create_categories_table
-- Created: 2024-08-12T12:00:00.000Z

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Enable read access for all users" ON categories
FOR SELECT USING (true);
```

### Adding a Column

```sql
-- Migration: add_priority_to_todolist
-- Created: 2024-08-12T12:00:00.000Z

ALTER TABLE todolist ADD COLUMN priority INTEGER DEFAULT 1;
CREATE INDEX idx_todolist_priority ON todolist(priority);
```

### Modifying a Column

```sql
-- Migration: update_todolist_note_length
-- Created: 2024-08-12T12:00:00.000Z

-- Change note column to allow longer text
ALTER TABLE todolist ALTER COLUMN note TYPE TEXT;
```

### Adding Foreign Key

```sql
-- Migration: add_user_id_to_todolist
-- Created: 2024-08-12T12:00:00.000Z

-- Add user_id column
ALTER TABLE todolist ADD COLUMN user_id INTEGER;

-- Add foreign key constraint
ALTER TABLE todolist 
ADD CONSTRAINT fk_todolist_user 
FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;

-- Create index
CREATE INDEX idx_todolist_user_id ON todolist(user_id);
```

## Troubleshooting

### Migration Fails

1. **Check the error message** in the console
2. **Verify your SQL syntax** using a SQL validator
3. **Check for conflicts** with existing schema
4. **Review RLS policies** if you're getting permission errors

### Rollback a Migration

Currently, Supabase doesn't support automatic rollbacks. You'll need to:

1. **Create a new migration** to undo the changes
2. **Manually revert** the changes in the database
3. **Use `db:reset`** (⚠️ destructive, only for development)

### Reset Database

```bash
npm run db:reset
```

⚠️ **Warning**: This will delete all data and reset to the initial state.

## Environment Setup

Make sure your `.env` file contains:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Production Considerations

1. **Test migrations** in development first
2. **Backup your database** before running migrations
3. **Review migrations** with your team
4. **Monitor migration execution** in production
5. **Have a rollback plan** ready

## Next Steps

1. **Link your project**: `npx supabase link --project-ref YOUR_PROJECT_REF`
2. **Run initial migrations**: `npm run migrate:run`
3. **Create new migrations** as needed: `npm run migrate:create <name>`
4. **Test your changes** locally before pushing to production
