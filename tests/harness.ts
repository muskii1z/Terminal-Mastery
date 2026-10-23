import { Shell, toText } from '../src/lib/shell/shell';
import { isSatisfied } from '../src/lib/shell/checks';
import type { Lesson } from '../src/lessons/types';

/** One thing a learner does: type a line, Tab-complete, press Ctrl+C, save in nano, or tick a manual task. */
export type Step =
  | string
  | { tab: string }
  | { interrupt: string }
  | { save: string; content: string }
  | { manual: string };

export function shellFor(lesson: Lesson) {
  return new Shell({ seed: lesson.fs, meta: lesson.fsMeta, procs: lesson.procs });
}

/** Play steps through a lesson the way the workbench does, collecting completed tasks as it goes. */
export function play(lesson: Lesson, steps: Step[]) {
  const shell = shellFor(lesson);
  const tasks = lesson.sections.flatMap((s) => s.tasks);
  const done = new Set<string>();
  const log: string[] = [];

  const evaluate = () => tasks.forEach((t) => isSatisfied(t.check, shell) && done.add(t.id));
  const doneAtStart = tasks.filter((t) => isSatisfied(t.check, shell)).map((t) => t.id);

  for (const step of steps) {
    if (typeof step === 'string') {
      const result = shell.run(step);
      log.push(`$ ${step}`, ...result.lines.map(toText));
    } else if ('tab' in step) {
      const { value } = shell.complete(step.tab);
      shell.run(value, { usedTab: true });
      log.push(`$ ${value}   (Tab)`);
    } else if ('interrupt' in step) {
      shell.interrupt(step.interrupt);
      log.push(`$ ${step.interrupt}^C`);
    } else if ('save' in step) {
      const opened = shell.run(`nano ${step.save}`);
      if (!opened.editor) throw new Error(`nano did not open ${step.save}: ${opened.lines.map(toText).join(' | ')}`);
      const error = shell.saveFromEditor(opened.editor.path, step.content);
      if (error) throw new Error(`saving ${step.save} failed: ${error}`);
      log.push(`(nano saved ${step.save})`);
    } else {
      done.add(step.manual);
    }
    evaluate();
  }

  return { shell, done, doneAtStart, missing: tasks.filter((t) => !done.has(t.id)).map((t) => t.id), log };
}
