/**
 * Who has to sign in before a lesson opens.
 *
 * Lesson 1 is always open. Lessons 2 onwards ask for a free account, so
 * progress can be saved to it, but only when the account service can
 * actually be reached. If it can't (an outage, or the database paused),
 * every lesson opens and progress is kept in the browser until it's back.
 * A free course should never lock people out because of our infrastructure.
 */
export function needsAccount(options: {
  lessonNumber: number;
  /** We know by now whether someone is signed in and whether accounts are reachable. */
  initialized: boolean;
  signedIn: boolean;
  accountsAvailable: boolean;
}): boolean {
  const { lessonNumber, initialized, signedIn, accountsAvailable } = options;
  return lessonNumber > 1 && initialized && !signedIn && accountsAvailable;
}
