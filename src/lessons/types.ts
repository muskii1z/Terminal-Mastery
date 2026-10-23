import type { FsMeta, FsSeed } from '@/lib/shell/fs';
import type { Proc } from '@/lib/shell/shell';
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
  /**
   * A command and what it prints, shown as a small terminal snippet. Tests run
   * every example in a fresh practice terminal and check the output matches;
   * `context` marks one whose output depends on earlier steps or on the time it runs.
   */
  | { type: 'example'; command: string; output?: string; context?: true }
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

export type Part = 'Getting started' | 'Working with files' | 'Power tools' | 'Your system' | 'Final project';

export interface Lesson {
  id: string;
  number: number;
  title: string;
  /** One line under the title: what you'll be able to do afterwards. */
  promise: string;
  minutes: number;
  /** Which part of the course it belongs to, for the lesson list. */
  part: Part;
  /** The commands it teaches, for the lesson list and the cheat sheet. */
  commands: Array<{ name: string; does: string }>;
  fs: FsSeed;
  /** Permissions, owners and sizes for particular files. */
  fsMeta?: FsMeta;
  /** Processes running when the lesson starts, for lessons about processes. */
  procs?: Proc[];
  sections: Section[];
  quiz: QuizQuestion[];
  next?: { id: string; title: string };
}
