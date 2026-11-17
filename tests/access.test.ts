import { test } from 'node:test';
import assert from 'node:assert/strict';
import { needsAccount } from '../src/lessons/access';

/** Lesson 1 is free; later lessons ask for an account, unless accounts can't be reached. */

const base = { lessonNumber: 2, initialized: true, signedIn: false, accountsAvailable: true };

test('lessons 2 onwards ask a signed-out learner to create an account', () => {
  assert.equal(needsAccount(base), true);
  assert.equal(needsAccount({ ...base, lessonNumber: 13 }), true);
});

test('lesson 1 never asks for an account', () => {
  assert.equal(needsAccount({ ...base, lessonNumber: 1 }), false);
  assert.equal(needsAccount({ ...base, lessonNumber: 1, accountsAvailable: false }), false);
});

test('signed-in learners are never asked', () => {
  assert.equal(needsAccount({ ...base, signedIn: true }), false);
});

test('when accounts are unreachable, every lesson opens instead of locking people out', () => {
  assert.equal(needsAccount({ ...base, accountsAvailable: false }), false);
  assert.equal(needsAccount({ ...base, lessonNumber: 13, accountsAvailable: false }), false);
});

test('nothing is locked before we know who is here, so the wall never flashes', () => {
  assert.equal(needsAccount({ ...base, initialized: false }), false);
});
