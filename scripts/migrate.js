#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load environment variables
require('dotenv').config();

const MIGRATIONS_DIR = path.join(__dirname, '..', 'supabase', 'migrations');

function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    const output = execSync(command, { encoding: 'utf8', stdio: 'inherit' });
    return output;
  } catch (error) {
    console.error(`Error running command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

function listMigrations() {
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  console.log('Available migrations:');
  files.forEach(file => {
    console.log(`  - ${file}`);
  });
}

function runMigrations() {
  console.log('🚀 Running Supabase migrations...');
  
  // Check if Supabase is linked
  try {
    runCommand('npx supabase status');
  } catch (error) {
    console.log('⚠️  Supabase project not linked. Please run:');
    console.log('   npx supabase link --project-ref YOUR_PROJECT_REF');
    console.log('   or');
    console.log('   npx supabase db push');
    return;
  }
  
  // Push migrations to remote
  runCommand('npx supabase db push');
  
  console.log('✅ Migrations completed successfully!');
}

function createMigration(name) {
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
  const filename = `${timestamp}_${name}.sql`;
  const filepath = path.join(MIGRATIONS_DIR, filename);
  
  const template = `-- Migration: ${name}
-- Created: ${new Date().toISOString()}

-- Add your SQL here
-- Example:
-- CREATE TABLE example (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255) NOT NULL,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );

`;

  fs.writeFileSync(filepath, template);
  console.log(`✅ Created migration: ${filename}`);
  console.log(`📝 Edit the file at: ${filepath}`);
}

function showHelp() {
  console.log(`
Supabase Migration Tool

Usage:
  node scripts/migrate.js <command>

Commands:
  list                    List all available migrations
  run                     Run all pending migrations
  create <name>           Create a new migration file
  help                    Show this help message

Examples:
  node scripts/migrate.js list
  node scripts/migrate.js run
  node scripts/migrate.js create add_user_profile_table

Environment Variables:
  Make sure your .env file contains:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
`);
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'list':
    listMigrations();
    break;
  case 'run':
    runMigrations();
    break;
  case 'create':
    const name = process.argv[3];
    if (!name) {
      console.error('❌ Migration name is required');
      console.log('Usage: node scripts/migrate.js create <name>');
      process.exit(1);
    }
    createMigration(name);
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    console.error('❌ Unknown command:', command);
    showHelp();
    process.exit(1);
}
