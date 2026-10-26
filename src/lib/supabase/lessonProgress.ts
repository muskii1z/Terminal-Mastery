import type { SupabaseClient } from '@supabase/supabase-js';
import { loadLocal, localLessonIds, mergeSaved, saveLocal, sameProgress, type SavedLesson } from '../../lessons/saved';

/**
 * Progress saved to the learner's account (`public.lesson_progress`).
 * Row-level security means these calls only ever see the signed-in
 * person's own rows. See database/2026-10-25-lesson-progress.sql.
 */

interface Row {
  lesson_id: string;
  done: string[];
  quiz: SavedLesson['quiz'];
  step: number;
  furthest: number;
  finished: boolean;
}

const fromRow = (row: Row): SavedLesson => ({
  done: row.done ?? [],
  quiz: row.quiz && 'answers' in row.quiz ? row.quiz : { answers: {}, submitted: false },
  finished: row.finished,
  step: row.step,
  furthest: row.furthest,
});

const toRow = (userId: string, lessonId: string, saved: SavedLesson) => ({
  user_id: userId,
  lesson_id: lessonId,
  done: saved.done,
  quiz: saved.quiz,
  step: saved.step ?? 0,
  furthest: saved.furthest ?? 0,
  finished: saved.finished,
});

export async function fetchProgress(supabase: SupabaseClient): Promise<Record<string, SavedLesson>> {
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('lesson_id, done, quiz, step, furthest, finished');
  if (error) throw error;
  return Object.fromEntries((data as Row[]).map((row) => [row.lesson_id, fromRow(row)]));
}

export async function saveProgress(supabase: SupabaseClient, userId: string, lessonId: string, saved: SavedLesson) {
  const { error } = await supabase
    .from('lesson_progress')
    .upsert(toRow(userId, lessonId, saved), { onConflict: 'user_id,lesson_id' });
  if (error) throw error;
}

/**
 * Bring this browser and the account into line: anything done here before
 * signing in moves into the account, and anything done on another device
 * appears here. Returns the lessons that changed in this browser.
 */
export async function syncProgress(supabase: SupabaseClient, userId: string): Promise<string[]> {
  const remote = await fetchProgress(supabase);
  const changedHere: string[] = [];
  const uploads: Array<ReturnType<typeof toRow>> = [];

  for (const id of new Set([...localLessonIds(), ...Object.keys(remote)])) {
    const local = loadLocal(id);
    const merged = mergeSaved(local, remote[id] ?? null);
    if (!merged) continue;
    if (!sameProgress(merged, local)) {
      saveLocal(id, merged);
      changedHere.push(id);
    }
    if (!sameProgress(merged, remote[id] ?? null)) uploads.push(toRow(userId, id, merged));
  }

  if (uploads.length) {
    const { error } = await supabase.from('lesson_progress').upsert(uploads, { onConflict: 'user_id,lesson_id' });
    if (error) throw error;
  }
  return changedHere;
}
