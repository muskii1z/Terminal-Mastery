/*
 * Storing and merging lesson progress. Deliberately free of lesson content,
 * so the code that syncs progress on every page doesn't load all 13 lessons.
 */

/**
 * A learner's progress in one lesson, exactly as the lesson screen tracks it.
 *
 * It lives in two places: this browser (`tm:lesson:<id>` in localStorage, so a
 * lesson works offline and before signing in) and, once signed in, the
 * account (`lesson_progress` in Supabase, so it follows you between devices).
 * `mergeSaved` reconciles the two: progress is only ever added, never lost.
 */
export interface SavedLesson {
  done: string[];
  quiz: { answers: Record<string, number>; submitted: boolean };
  finished: boolean;
  /** The step they were looking at. */
  step?: number;
  /** The furthest step reached. */
  furthest?: number;
}

const KEY_PREFIX = 'tm:lesson:';
export const storageKey = (id: string) => `${KEY_PREFIX}${id}`;

/** Combine two records of the same lesson without losing anything either one has. */
export function mergeSaved(a: SavedLesson | null, b: SavedLesson | null): SavedLesson | null {
  if (!a) return b;
  if (!b) return a;
  const answered = (s: SavedLesson) => Object.keys(s.quiz?.answers ?? {}).length;
  const quiz =
    a.quiz?.submitted !== b.quiz?.submitted
      ? (a.quiz?.submitted ? a.quiz : b.quiz)
      : answered(a) >= answered(b)
        ? a.quiz
        : b.quiz;
  return {
    done: [...new Set([...(a.done ?? []), ...(b.done ?? [])])],
    quiz: quiz ?? { answers: {}, submitted: false },
    finished: Boolean(a.finished || b.finished),
    step: Math.max(a.step ?? 0, b.step ?? 0),
    furthest: Math.max(a.furthest ?? 0, b.furthest ?? 0, a.step ?? 0, b.step ?? 0),
  };
}

/** True when two records hold the same progress (ignoring which step is on screen). */
export function sameProgress(a: SavedLesson | null, b: SavedLesson | null): boolean {
  if (!a || !b) return a === b;
  const tasks = (s: SavedLesson) => [...(s.done ?? [])].sort().join('|');
  return (
    tasks(a) === tasks(b) &&
    a.finished === b.finished &&
    (a.furthest ?? 0) === (b.furthest ?? 0) &&
    JSON.stringify(a.quiz) === JSON.stringify(b.quiz)
  );
}

// ── This browser ─────────────────────────────────────────────────────
// Storage can be missing or blocked (private mode), so every call is guarded.

export function loadLocal(id: string): SavedLesson | null {
  try {
    const raw = localStorage.getItem(storageKey(id));
    return raw ? (JSON.parse(raw) as SavedLesson) : null;
  } catch {
    return null;
  }
}

export function saveLocal(id: string, data: SavedLesson) {
  try {
    localStorage.setItem(storageKey(id), JSON.stringify(data));
  } catch {
    // Progress just won't persist in this browser.
  }
}

/** Forget this browser's copy, e.g. on sign out, so the next person starts fresh. */
/** Lesson ids this browser has progress for. */
export function localLessonIds(): string[] {
  try {
    return Object.keys(localStorage)
      .filter((key) => key.startsWith(KEY_PREFIX))
      .map((key) => key.slice(KEY_PREFIX.length));
  } catch {
    return [];
  }
}

export function clearLocal() {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(KEY_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    // Nothing to clear.
  }
}
