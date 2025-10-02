// Core application types for Terminal Mastery

export interface Lesson {
  id: string;
  title: string;
  duration: number; // in minutes
  description: string;
  content: LessonContent;
  quiz?: Quiz;
  completed: boolean;
}

export interface LessonContent {
  introduction: string;
  commands: Command[];
  practice: PracticeExercise[];
  summary?: string;
  bridgeToNext?: string;
}

export interface Command {
  name: string;
  description: string;
  syntax: string;
  examples: CommandExample[];
}

export interface CommandExample {
  command: string;
  output: string;
  explanation: string;
}

export interface PracticeExercise {
  id: string;
  prompt: string;
  expectedCommand: string;
  hints?: string[];
  completed?: boolean;
  explanation?: string;
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
  bridgeToNext?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Authentication types
export interface User {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
}

export interface UserProgress {
  userId?: string; // Link progress to authenticated user
  lessonsCompleted: string[];
  currentLesson: string | null;
  quizScores: Record<string, number>;
  totalProgress: number; // percentage
  totalLessons?: number;
  completedCount?: number;
}

// Database types
export interface DatabaseLesson {
  id: string;
  title: string;
  slug: string;
  duration_min: number;
  sort_order: number;
  content_md: string;
  created_at?: string;
  updated_at?: string;
}

export interface LessonCompletion {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string;
}



export type AnimationVariant = 'fade' | 'slide' | 'scale' | 'glow';

export interface AnimationConfig {
  variant: AnimationVariant;
  duration?: number;
  delay?: number;
  repeat?: boolean;
}