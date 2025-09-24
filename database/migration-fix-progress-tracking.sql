-- Migration: Fix Progress Tracking for All 20 Lessons
-- This migration:
-- 1. Removes the legacy user_progress table
-- 2. Adds all 20 lessons to the database
-- 3. Ensures consistent progress tracking

-- WARNING: This will permanently remove the user_progress table and its data
-- Make sure this is what you want before running!

BEGIN;

-- Step 1: Drop the legacy user_progress table if it exists
-- This table is not used in the current codebase
DROP TABLE IF EXISTS user_progress CASCADE;

-- Step 2: Ensure we have the correct lessons table structure
-- (This should already exist, but ensuring it's correct)
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  duration_min INTEGER NOT NULL DEFAULT 3,
  sort_order INTEGER NOT NULL,
  content_md TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Ensure we have the correct lesson_completions table structure
-- (This should already exist, but ensuring it's correct)
CREATE TABLE IF NOT EXISTS lesson_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Step 4: Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_lessons_sort_order ON lessons(sort_order);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_user_id ON lesson_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_lesson_id ON lesson_completions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_completed_at ON lesson_completions(completed_at);

-- Step 5: Ensure Row Level Security is enabled
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;

-- Step 6: Recreate RLS policies to ensure they're correct
DROP POLICY IF EXISTS "Lessons are viewable by everyone" ON lessons;
CREATE POLICY "Lessons are viewable by everyone" ON lessons
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view own lesson completions" ON lesson_completions;
CREATE POLICY "Users can view own lesson completions" ON lesson_completions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own lesson completions" ON lesson_completions;
CREATE POLICY "Users can insert own lesson completions" ON lesson_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own lesson completions" ON lesson_completions;
CREATE POLICY "Users can update own lesson completions" ON lesson_completions
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own lesson completions" ON lesson_completions;
CREATE POLICY "Users can delete own lesson completions" ON lesson_completions
  FOR DELETE USING (auth.uid() = user_id);

-- Step 7: Ensure the updated_at trigger exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 8: Insert/update all 20 lessons
INSERT INTO lessons (id, title, slug, duration_min, sort_order, content_md) VALUES
  ('1', 'Getting Started with the Terminal', 'getting-started-with-the-terminal', 3, 1, '# Getting Started with the Terminal

Learn and practice getting started with the terminal.

*Full lesson content will be populated from the frontend data.*'),
  ('2', 'Navigation Basics (pwd, ls, cd)', 'navigation-basics-pwd-ls-cd', 3, 2, '# Navigation Basics (pwd, ls, cd)

Learn and practice navigation basics (pwd, ls, cd).

*Full lesson content will be populated from the frontend data.*'),
  ('3', 'Working with Files: touch, cat, less', 'working-with-files-touch-cat-less', 3, 3, '# Working with Files: touch, cat, less

Learn and practice working with files: touch, cat, less.

*Full lesson content will be populated from the frontend data.*'),
  ('4', 'File Operations: Copy, Move, Delete', 'file-operations-copy-move-delete', 3, 4, '# File Operations: Copy, Move, Delete

Learn and practice file operations: copy, move, delete.

*Full lesson content will be populated from the frontend data.*'),
  ('5', 'Understanding File Permissions', 'understanding-file-permissions', 3, 5, '# Understanding File Permissions

Learn and practice understanding file permissions.

*Full lesson content will be populated from the frontend data.*'),
  ('6', 'Text Viewing: head, tail, more', 'text-viewing-head-tail-more', 3, 6, '# Text Viewing: head, tail, more

Learn and practice text viewing: head, tail, more.

*Full lesson content will be populated from the frontend data.*'),
  ('7', 'Text Search: grep and find', 'text-search-grep-and-find', 3, 7, '# Text Search: grep and find

Learn and practice text search: grep and find.

*Full lesson content will be populated from the frontend data.*'),
  ('8', 'Text Editing: nano Basics', 'text-editing-nano-basics', 3, 8, '# Text Editing: nano Basics

Learn and practice text editing: nano basics.

*Full lesson content will be populated from the frontend data.*'),
  ('9', 'Text Processing: sort, uniq, wc', 'text-processing-sort-uniq-wc', 3, 9, '# Text Processing: sort, uniq, wc

Learn and practice text processing: sort, uniq, wc.

*Full lesson content will be populated from the frontend data.*'),
  ('10', 'Pattern Matching: Wildcards & Regex Basics', 'pattern-matching-wildcards-regex-basics', 3, 10, '# Pattern Matching: Wildcards & Regex Basics

Learn and practice pattern matching: wildcards & regex basics.

*Full lesson content will be populated from the frontend data.*'),
  ('11', 'Process Management: ps, top, kill', 'process-management-ps-top-kill', 3, 11, '# Process Management: ps, top, kill

Learn and practice process management: ps, top, kill.

*Full lesson content will be populated from the frontend data.*'),
  ('12', 'System Info: df, du, free, uname', 'system-info-df-du-free-uname', 3, 12, '# System Info: df, du, free, uname

Learn and practice system info: df, du, free, uname.

*Full lesson content will be populated from the frontend data.*'),
  ('13', 'Network Basics: ping, curl, wget', 'network-basics-ping-curl-wget', 3, 13, '# Network Basics: ping, curl, wget

Learn and practice network basics: ping, curl, wget.

*Full lesson content will be populated from the frontend data.*'),
  ('14', 'Environment Variables: env, export', 'environment-variables-env-export', 3, 14, '# Environment Variables: env, export

Learn and practice environment variables: env, export.

*Full lesson content will be populated from the frontend data.*'),
  ('15', 'Command History: history, !!, aliases', 'command-history-history-aliases', 3, 15, '# Command History: history, !!, aliases

Learn and practice command history: history, !!, aliases.

*Full lesson content will be populated from the frontend data.*'),
  ('16', 'Pipes and Redirection: |, >, >>, <', 'pipes-and-redirection', 3, 16, '# Pipes and Redirection: |, >, >>, <

Learn and practice pipes and redirection: |, >, >>, <.

*Full lesson content will be populated from the frontend data.*'),
  ('17', 'Archive Management: tar, zip, gzip', 'archive-management-tar-zip-gzip', 3, 17, '# Archive Management: tar, zip, gzip

Learn and practice archive management: tar, zip, gzip.

*Full lesson content will be populated from the frontend data.*'),
  ('18', 'Package Management: apt/brew Basics', 'package-management-apt-brew-basics', 3, 18, '# Package Management: apt/brew Basics

Learn and practice package management: apt/brew basics.

*Full lesson content will be populated from the frontend data.*'),
  ('19', 'Shell Scripting: Basic Bash Scripts', 'shell-scripting-basic-bash-scripts', 3, 19, '# Shell Scripting: Basic Bash Scripts

Learn and practice shell scripting: basic bash scripts.

*Full lesson content will be populated from the frontend data.*'),
  ('20', 'Advanced Tips: screen, tmux, shortcuts', 'advanced-tips-screen-tmux-shortcuts', 3, 20, '# Advanced Tips: screen, tmux, shortcuts

Learn and practice advanced tips: screen, tmux, shortcuts.

*Full lesson content will be populated from the frontend data.*')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  duration_min = EXCLUDED.duration_min,
  sort_order = EXCLUDED.sort_order,
  content_md = EXCLUDED.content_md,
  updated_at = NOW();

-- Verification queries (these will run but won't show output in migration)
-- You can run these manually to verify the migration worked

-- Check that we have 20 lessons
-- SELECT COUNT(*) as total_lessons FROM lessons;

-- Check that lesson IDs are 1-20
-- SELECT id, title FROM lessons ORDER BY sort_order;

-- Check that there are no references to the old user_progress table
-- This should error if there are any remaining references
-- SELECT table_name FROM information_schema.tables WHERE table_name = 'user_progress';

COMMIT;

-- Post-migration notes:
-- 1. All 20 lessons are now in the database
-- 2. Progress tracking uses lesson_completions table only
-- 3. Legacy user_progress table has been removed
-- 4. All RLS policies are correctly configured
-- 5. Your frontend progress functions should work with all 20 lessons