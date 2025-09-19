-- Terminal Mastery Database Schema
-- Run this in your Supabase SQL editor

-- Create lessons table
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

-- Create lesson_completions table
CREATE TABLE IF NOT EXISTS lesson_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lessons_sort_order ON lessons(sort_order);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_user_id ON lesson_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_lesson_id ON lesson_completions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_completed_at ON lesson_completions(completed_at);

-- Enable Row Level Security
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lessons table (public read access)
CREATE POLICY "Lessons are viewable by everyone" ON lessons
  FOR SELECT USING (true);

-- RLS Policies for lesson_completions table (users can only see/modify their own)
CREATE POLICY "Users can view own lesson completions" ON lesson_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson completions" ON lesson_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson completions" ON lesson_completions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lesson completions" ON lesson_completions
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger for lessons table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();