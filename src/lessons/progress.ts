import { LESSONS } from './index';
import type { Lesson } from './types';

/**
 * What the learner has done, read from what the workbench saves in this
 * browser (`tm:lesson:<id>`). Browser only: call it after mount.
 */
export type LessonStatus = { kind: 'new' } | { kind: 'started'; done: number; total: number } | { kind: 'done' };

export const taskCount = (lesson: Lesson) => lesson.sections.reduce((n, sec) => n + sec.tasks.length, 0);

export function readStatuses(): Record<string, LessonStatus> {
  const statuses: Record<string, LessonStatus> = {};
  for (const lesson of LESSONS) {
    let saved: { done?: string[]; finished?: boolean } | null = null;
    try {
      saved = JSON.parse(localStorage.getItem(`tm:lesson:${lesson.id}`) ?? 'null');
    } catch {
      saved = null;
    }
    if (saved?.finished) statuses[lesson.id] = { kind: 'done' };
    else if (saved?.done?.length) statuses[lesson.id] = { kind: 'started', done: saved.done.length, total: taskCount(lesson) };
    else statuses[lesson.id] = { kind: 'new' };
  }
  return statuses;
}
