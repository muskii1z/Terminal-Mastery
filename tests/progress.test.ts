import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { loadLocal, mergeSaved, saveLocal, clearLocal, type SavedLesson } from '../src/lessons/progress';
import { syncProgress } from '../src/lib/supabase/lessonProgress';

/**
 * Progress lives in the browser and in the account. These check that moving
 * between the two only ever adds progress: nothing a learner did is lost.
 */

// A minimal localStorage for Node. Like the real one, stored keys are the
// object's own enumerable properties (clearLocal relies on Object.keys).
const storage = {} as Record<string, string> & Storage;
Object.defineProperties(storage, {
  getItem: { value: (k: string) => (Object.prototype.hasOwnProperty.call(storage, k) ? storage[k] : null) },
  setItem: { value: (k: string, v: string) => void (storage[k] = String(v)) },
  removeItem: { value: (k: string) => void delete storage[k] },
});
(globalThis as Record<string, unknown>).localStorage = storage;

beforeEach(() => {
  for (const key of Object.keys(storage)) delete storage[key];
});

const lesson = (over: Partial<SavedLesson> = {}): SavedLesson => ({
  done: [],
  quiz: { answers: {}, submitted: false },
  finished: false,
  step: 0,
  furthest: 0,
  ...over,
});

/** A stand-in for the Supabase client: one person's rows, as row-level security would show them. */
function fakeSupabase(rows: Array<Record<string, unknown>> = []) {
  const uploads: Array<Record<string, unknown>> = [];
  const client = {
    from: () => ({
      select: async () => ({ data: rows, error: null }),
      upsert: async (payload: Record<string, unknown> | Array<Record<string, unknown>>) => {
        uploads.push(...(Array.isArray(payload) ? payload : [payload]));
        return { error: null };
      },
    }),
  };
  return { client: client as never, uploads };
}

test('merging keeps everything either copy has', () => {
  const browser = lesson({ done: ['pwd', 'ls'], step: 3, furthest: 3 });
  const account = lesson({ done: ['ls', 'cd'], finished: true, furthest: 5, quiz: { answers: { q1: 2 }, submitted: true } });
  const merged = mergeSaved(browser, account)!;
  assert.deepEqual([...merged.done].sort(), ['cd', 'ls', 'pwd']);
  assert.equal(merged.finished, true);
  assert.equal(merged.furthest, 5);
  assert.deepEqual(merged.quiz, { answers: { q1: 2 }, submitted: true });
  assert.equal(mergeSaved(null, browser), browser);
  assert.equal(mergeSaved(browser, null), browser);
  assert.equal(mergeSaved(null, null), null);
});

test('a submitted quiz beats an unsubmitted one; otherwise the fuller one wins', () => {
  const submitted = lesson({ quiz: { answers: { q1: 0 }, submitted: true } });
  const fuller = lesson({ quiz: { answers: { q1: 1, q2: 1, q3: 1 }, submitted: false } });
  assert.equal(mergeSaved(fuller, submitted)!.quiz.submitted, true);
  assert.deepEqual(mergeSaved(lesson({ quiz: { answers: { q1: 1 }, submitted: false } }), fuller)!.quiz, fuller.quiz);
});

test('signing up moves lesson 1 from this browser into the new account', async () => {
  saveLocal('1', lesson({ done: ['whoami', 'date'], finished: true }));
  const { client, uploads } = fakeSupabase([]);

  const changedHere = await syncProgress(client, 'user-1');

  assert.deepEqual(changedHere, []);
  assert.equal(uploads.length, 1);
  assert.equal(uploads[0].user_id, 'user-1');
  assert.equal(uploads[0].lesson_id, '1');
  assert.equal(uploads[0].finished, true);
  assert.deepEqual(uploads[0].done, ['whoami', 'date']);
});

test('signing in on a new device brings the account’s progress here', async () => {
  const { client, uploads } = fakeSupabase([
    { lesson_id: '1', done: ['whoami'], quiz: { answers: {}, submitted: true }, step: 6, furthest: 6, finished: true },
    { lesson_id: '2', done: ['pwd'], quiz: { answers: {}, submitted: false }, step: 1, furthest: 1, finished: false },
  ]);

  const changedHere = await syncProgress(client, 'user-1');

  assert.deepEqual(changedHere.sort(), ['1', '2']);
  assert.equal(loadLocal('1')!.finished, true);
  assert.deepEqual(loadLocal('2')!.done, ['pwd']);
  assert.equal(uploads.length, 0, 'nothing new to upload');
});

test('when both have progress, both end up with all of it', async () => {
  saveLocal('3', lesson({ done: ['mkdir-notes'] }));
  const { client, uploads } = fakeSupabase([
    { lesson_id: '3', done: ['touch'], quiz: { answers: {}, submitted: false }, step: 2, furthest: 2, finished: false },
  ]);

  await syncProgress(client, 'user-1');

  assert.deepEqual([...loadLocal('3')!.done].sort(), ['mkdir-notes', 'touch']);
  assert.equal(uploads.length, 1);
  assert.deepEqual([...(uploads[0].done as string[])].sort(), ['mkdir-notes', 'touch']);
});

test('signing out clears this browser for the next person', () => {
  saveLocal('1', lesson({ done: ['whoami'] }));
  saveLocal('2', lesson({ done: ['pwd'] }));
  storage.setItem('theme', 'dark');
  clearLocal();
  assert.equal(loadLocal('1'), null);
  assert.equal(loadLocal('2'), null);
  assert.equal(storage.getItem('theme'), 'dark', 'other settings stay');
});
