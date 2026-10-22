import type { Shell, ShellEvent } from './shell';

/**
 * How a lesson task decides it's been done.
 *
 * Checks look at what the learner actually achieved — where they are standing,
 * which folders they listed — rather than matching the exact text they typed.
 * `cd projects`, `cd ./projects` and `cd ~/projects` all pass "go into projects".
 *
 * Paths may use `~` for the learner's home folder.
 */
export type Check =
  /** The learner has stood in this folder (now or at any point since the lesson started). */
  | { kind: 'cwd'; path: string }
  /** The learner listed this folder's contents (optionally including hidden files). */
  | { kind: 'listed'; path: string; hidden?: boolean }
  /** The learner ran a command matching these conditions. */
  | {
      kind: 'ran';
      /** Omit to match any command, e.g. "any command that failed". */
      command?: string;
      /** Exact argument list, e.g. ['-']. */
      args?: string[];
      /** The single argument must be one of these, e.g. ['..', '../']. */
      argIn?: string[];
      /** The command was run with no arguments. */
      noArgs?: boolean;
      /** The command was run with at least one argument. */
      hasArgs?: boolean;
      /** The first argument starts with this, e.g. '/' for an absolute path. */
      argStartsWith?: string;
      /** Where the learner ended up afterwards. */
      cwdAfter?: string;
      /** Whether the command succeeded. Defaults to true. */
      ok?: boolean;
    }
  /** The learner completed a name with Tab and the command worked. */
  | { kind: 'usedTab' }
  /**
   * Something done outside the practice terminal, like opening the terminal on
   * their own computer. It can't be observed, so the learner marks it done.
   */
  | { kind: 'manual' };

export function isSatisfied(check: Check, shell: Shell): boolean {
  const expand = (path: string) =>
    path === '~' ? shell.home : path.startsWith('~/') ? shell.home + path.slice(1) : path;

  switch (check.kind) {
    case 'cwd': {
      // Once reached, it counts — moving on afterwards doesn't undo the task.
      const target = expand(check.path);
      return shell.cwd === target || shell.events.some((e) => e.cwdAfter === target);
    }

    case 'listed':
      return shell.events.some(
        (e) =>
          e.command === 'ls' &&
          e.listed.includes(expand(check.path)) &&
          (!check.hidden || e.listedHidden)
      );

    case 'usedTab':
      return shell.events.some((e) => e.usedTab && e.ok);

    case 'manual':
      return false;

    case 'ran':
      return shell.events.some((e) => matchesRan(check, e, expand));
  }
}

function matchesRan(
  check: Extract<Check, { kind: 'ran' }>,
  event: ShellEvent,
  expand: (path: string) => string
): boolean {
  if (check.command !== undefined && event.command !== check.command) return false;
  if (event.ok !== (check.ok ?? true)) return false;
  if (check.noArgs && event.args.length > 0) return false;
  if (check.hasArgs && event.args.length === 0) return false;
  if (check.args && event.args.join('\u0000') !== check.args.join('\u0000')) return false;
  if (check.argIn && !(event.args.length === 1 && check.argIn.includes(event.args[0]))) return false;
  if (check.argStartsWith && !(event.args[0] ?? '').startsWith(check.argStartsWith)) return false;
  if (check.cwdAfter && event.cwdAfter !== expand(check.cwdAfter)) return false;
  return true;
}
