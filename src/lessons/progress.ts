import { LESSONS } from './index';
import type { Lesson } from './types';
import { loadLocal, type SavedLesson } from './saved';

export * from './saved';

export type LessonStatus = { kind: 'new' } | { kind: 'started'; done: number; total: number } | { kind: 'done' };

export const taskCount = (lesson: Lesson) => lesson.sections.reduce((n, sec) => n + sec.tasks.length, 0);

export function statusOf(lesson: Lesson, saved: SavedLesson | null): LessonStatus {
  if (saved?.finished) return { kind: 'done' };
  if (saved?.done?.length) return { kind: 'started', done: saved.done.length, total: taskCount(lesson) };
  return { kind: 'new' };
}

/** Status of every lesson from this browser's copy. Browser only: call it after mount. */
export function readStatuses(): Record<string, LessonStatus> {
  return Object.fromEntries(LESSONS.map((lesson) => [lesson.id, statusOf(lesson, loadLocal(lesson.id))]));
}
