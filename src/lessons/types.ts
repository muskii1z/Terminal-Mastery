import type { FsSeed } from '@/lib/shell/fs';
import type { Check } from '@/lib/shell/checks';
import type { QuizQuestion } from '@/types';

/**
 * Lesson format for the workbench (instructions beside a live terminal).
 *
 * Inline text supports `code`, **bold** and [[Key]] for keyboard keys.
 */

export type Block =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  /** A command and what it prints, shown as a small terminal snippet. */
  | { type: 'example'; command: string; output?: string }
  /** The terminal prompt on its own, coloured as the practice terminal shows it. */
  | { type: 'prompt'; path?: string }
  /** A side note. `platform` is for real Mac/Linux differences. */
  | { type: 'note'; tone: 'tip' | 'platform'; text: string };

export interface Task {
  id: string;
  prompt: string;
  hint: string;
  check: Check;
}

export interface Section {
  id: string;
  /** Short label for the section, usually the command it teaches. */
  label: string;
  title: string;
  blocks: Block[];
  tasks: Task[];
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  /** One line under the title: what you'll be able to do afterwards. */
  promise: string;
  minutes: number;
  fs: FsSeed;
  sections: Section[];
  quiz: QuizQuestion[];
  next?: { id: string; title: string };
}
