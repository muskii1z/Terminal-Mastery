import type { Lesson } from './types';
import lesson02 from './lesson-02';

/**
 * Lessons rebuilt for the workbench. Lessons not listed here still render with
 * the legacy lesson page until they're migrated.
 */
const lessons: Record<string, Lesson> = {
  [lesson02.id]: lesson02,
};

export function getWorkbenchLesson(id: string): Lesson | undefined {
  return lessons[id];
}

export type { Lesson } from './types';
