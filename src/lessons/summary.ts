/**
 * The course in two numbers, for marketing copy, metadata and the OG image.
 * Kept apart from the lesson data so the landing page doesn't load every
 * lesson. tests/lessons.test.ts fails if these drift from the real course.
 */
export const COURSE = {
  lessons: 13,
  /** Total lesson time, rounded to the nearest hour. */
  hours: 3,
} as const;

export const COURSE_LENGTH = `${COURSE.lessons} lessons · about ${COURSE.hours} hours`;
