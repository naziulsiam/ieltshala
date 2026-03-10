#!/usr/bin/env node
/**
 * Setup Verification Script
 * Run this to check if your Supabase connection is working
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 IELTShala Setup Verification\n');

// Check 1: Environment variables
console.log('1️⃣  Checking environment variables...');
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local not found!');
  console.log('   Run: cp .env.example .env.local');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1];
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1];

if (!supabaseUrl || supabaseUrl.includes('your_')) {
  console.error('❌ VITE_SUPABASE_URL not set in .env.local');
  console.log('   Get it from: Supabase Dashboard > Project Settings > API');
  process.exit(1);
}

if (!supabaseKey || supabaseKey.includes('your_')) {
  console.error('❌ VITE_SUPABASE_ANON_KEY not set in .env.local');
  console.log('   Get it from: Supabase Dashboard > Project Settings > API');
  process.exit(1);
}

console.log('✅ Environment variables found\n');

// Check 2: Supabase connection
console.log('2️⃣  Testing Supabase connection...');
const supabase = createClient(supabaseUrl, supabaseKey);

try {
  const { data, error } = await supabase.from('categories').select('count');
  if (error) throw error;
  console.log('✅ Connected to Supabase\n');
} catch (err) {
  console.error('❌ Failed to connect to Supabase');
  console.log('   Error:', err.message);
  console.log('   Check your URL and key are correct');
  process.exit(1);
}

// Check 3: Tables exist
console.log('3️⃣  Checking database tables...');
const requiredTables = [
  'profiles',
  'categories',
  'words',
  'user_progress',
  'user_stats',
  'speaking_sessions',
  'writing_submissions',
  'hala_conversations'
];

const missingTables = [];
for (const table of requiredTables) {
  const { error } = await supabase.from(table).select('count').limit(1);
  if (error && error.message.includes('does not exist')) {
    missingTables.push(table);
  }
}

if (missingTables.length > 0) {
  console.error(`❌ Missing tables: ${missingTables.join(', ')}`);
  console.log('   Run the SQL migration in Supabase SQL Editor');
  console.log('   File: supabase/migrations/001_initial_schema.sql');
  process.exit(1);
}

console.log(`✅ All ${requiredTables.length} tables found\n`);

// Check 4: Categories data
console.log('4️⃣  Checking categories data...');
const { data: categories, error: catError } = await supabase
  .from('categories')
  .select('name');

if (catError || !categories || categories.length === 0) {
  console.error('❌ No categories found');
  console.log('   The migration may not have run correctly');
  process.exit(1);
}

console.log(`✅ Found ${categories.length} categories`);
console.log('   Categories:', categories.map(c => c.name).join(', '));

// Summary
console.log('\n' + '='.repeat(50));
console.log('✅ ALL CHECKS PASSED!');
console.log('='.repeat(50));
console.log('\n🎉 Your Supabase connection is working!');
console.log('\nNext steps:');
console.log('1. Run: npm run dev');
console.log('2. Open: http://localhost:8080/login');
console.log('3. Test sign up and log in');
console.log('\nReady for Phase 2: AI Integration! 🤖');
