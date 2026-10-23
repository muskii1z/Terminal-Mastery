import type { Lesson, Part } from './types';
import lesson01 from './lesson-01';
import lesson02 from './lesson-02';
import lesson03 from './lesson-03';
import lesson04 from './lesson-04';
import lesson05 from './lesson-05';
import lesson06 from './lesson-06';
import lesson07 from './lesson-07';
import lesson08 from './lesson-08';
import lesson09 from './lesson-09';
import lesson10 from './lesson-10';
import lesson11 from './lesson-11';
import lesson12 from './lesson-12';
import lesson13 from './lesson-13';

/** The whole course, in order. */
export const LESSONS: Lesson[] = [
  lesson01,
  lesson02,
  lesson03,
  lesson04,
  lesson05,
  lesson06,
  lesson07,
  lesson08,
  lesson09,
  lesson10,
  lesson11,
  lesson12,
  lesson13,
];

export const PARTS: Part[] = ['Getting started', 'Working with files', 'Power tools', 'Your system', 'Final project'];

export const TOTAL_MINUTES = LESSONS.reduce((sum, l) => sum + l.minutes, 0);

export function getWorkbenchLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export type { Lesson, Part } from './types';
