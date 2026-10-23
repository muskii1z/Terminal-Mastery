// Core application types for Terminal Mastery. Lesson types live in src/lessons/types.ts.

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
