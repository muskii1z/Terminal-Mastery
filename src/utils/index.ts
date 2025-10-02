// Utility functions for Terminal Mastery

import { UserProgress, Lesson } from '@/types';

// Local storage utilities
export const STORAGE_KEYS = {
  USER_PROGRESS: 'terminal-mastery-progress',
  SETTINGS: 'terminal-mastery-settings',
} as const;

export const saveToLocalStorage = (key: string, data: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

// Progress calculation utilities
export const calculateProgress = (lessons: Lesson[]): number => {
  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  return lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;
};

export const getNextLesson = (lessons: Lesson[], currentLessonId?: string): Lesson | null => {
  if (!currentLessonId) {
    return lessons.find(lesson => !lesson.completed) || null;
  }
  
  const currentIndex = lessons.findIndex(lesson => lesson.id === currentLessonId);
  const nextLesson = lessons.find((lesson, index) => index > currentIndex && !lesson.completed);
  
  return nextLesson || null;
};

// Animation utilities
export const getStaggerDelay = (index: number, baseDelay: number = 0.1): number => {
  return baseDelay * index;
};

export const easeInOut = {
  type: "spring",
  damping: 25,
  stiffness: 120
} as const;

// Terminal command utilities
export const parseCommand = (input: string): { command: string; args: string[] } => {
  const parts = input.trim().split(/\s+/);
  const command = parts[0] || '';
  const args = parts.slice(1);
  
  return { command, args };
};

export const formatCommandOutput = (output: string): string => {
  return output.trim().replace(/\n/g, '\n');
};

// Validation utilities
export const isValidCommand = (command: string, validCommands: string[]): boolean => {
  const { command: cmd } = parseCommand(command);
  return validCommands.includes(cmd.toLowerCase());
};

// Text animation utilities
export const typewriterVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

export const charVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

// Color utilities for glow effects
export const getGlowColor = (type: 'success' | 'error' | 'info' | 'warning'): string => {
  const colors = {
    success: '#00ff41',
    error: '#ff4444', 
    info: '#00d4ff',
    warning: '#ffaa00'
  };
  
  return colors[type];
};

// Time formatting utilities
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

// Debounce utility for search and input handling
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};