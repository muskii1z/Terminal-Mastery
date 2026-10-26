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
  /** From Google or GitHub, or empty for email sign-ups. */
  name: string;
  created_at: string;
  email_confirmed_at?: string;
}
