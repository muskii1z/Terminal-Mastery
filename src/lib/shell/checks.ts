import type { CommandRecord, Shell, ShellEvent } from './shell';

/**
 * How a lesson task decides it's been done.
 *
 * Wherever possible, checks look at what the learner achieved — a file that
 * now exists, a folder they're standing in, a process that's gone — rather
 * than the exact text they typed. `cd projects`, `cd ./projects` and
 * `cd ~/projects` all pass "go into projects".
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
      /** Every one of these option letters was used, e.g. 'la'. */
      flags?: string;
      /** These commands all ran in one pipeline, e.g. ['sort', 'uniq']. */
      pipeline?: string[];
      /** The terminal showed exactly this many lines. */
      outputLines?: number;
      /** The line was produced by `!!` or `!n`. */
      historyExpanded?: boolean;
      /** The line started with an alias (optionally a specific one). */
      viaAlias?: string | true;
      /** Where the learner ended up afterwards. */
      cwdAfter?: string;
      /** Whether the command succeeded. Defaults to true. */
      ok?: boolean;
    }
  /** The learner completed a name with Tab and the command worked. */
  | { kind: 'usedTab' }
  /** Something done outside the practice terminal; the learner marks it done. */
  | { kind: 'manual' }
  /** A file or folder exists (or, with `not`, is gone). `empty` requires an empty folder. */
  | { kind: 'exists'; path: string; type?: 'file' | 'dir'; not?: boolean; empty?: boolean }
  /** A file's contents. */
  | {
      kind: 'file';
      path: string;
      /** Must contain every one of these. */
      includes?: string | string[];
      /** Must not contain any of these. */
      excludes?: string | string[];
      minLines?: number;
      nonEmpty?: boolean;
      /** A regular expression the whole content must match. */
      matches?: string;
      /** Differs from how the lesson started. */
      changed?: boolean;
    }
  /** A file's permissions. */
  | { kind: 'mode'; path: string; executable?: boolean; octal?: number }
  /** Some command's output showed all of `includes` and none of `excludes`. */
  | { kind: 'output'; includes?: string[]; excludes?: string[]; command?: string }
  /** The learner looked inside this file (cat, head, tail, grep, ...). */
  | { kind: 'read'; path: string }
  /** A script was run (and, with `ok`, allowed to run or not). */
  | { kind: 'exec'; path: string; ok?: boolean }
  /** No running process's command contains this text. */
  | { kind: 'procGone'; match: string }
  /** An alias with this name exists. */
  | { kind: 'alias'; name: string }
  /** A variable is set (optionally exported, optionally to a value). */
  | { kind: 'var'; name: string; exported?: boolean; value?: string }
  /** The file was opened in nano. */
  | { kind: 'opened'; path: string }
  /** The file was saved from nano. */
  | { kind: 'saved'; path: string }
  /** Every one of these checks passes. */
  | { kind: 'all'; checks: Check[] };

const list = (value: string | string[] | undefined) => (value === undefined ? [] : Array.isArray(value) ? value : [value]);

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
        (e) => e.listed.includes(expand(check.path)) && (!check.hidden || e.listedHidden)
      );

    case 'usedTab':
      return shell.events.some((e) => e.usedTab && e.ok);

    case 'manual':
      return false;

    case 'ran':
      return shell.events.some((e) => matchesRan(check, e, expand));

    case 'exists': {
      const node = shell.node(expand(check.path));
      if (check.not) return !node;
      if (!node || (check.type && node.kind !== check.type)) return false;
      return !check.empty || (node.kind === 'dir' && node.children.size === 0);
    }

    case 'file': {
      const abs = expand(check.path);
      const node = shell.node(abs);
      if (node?.kind !== 'file') return false;
      const text = node.content;
      if (!list(check.includes).every((s) => text.includes(s))) return false;
      if (list(check.excludes).some((s) => text.includes(s))) return false;
      if (check.nonEmpty && !text.trim()) return false;
      if (check.matches && !new RegExp(check.matches).test(text)) return false;
      if (check.minLines !== undefined && text.replace(/\n$/, '').split('\n').filter(Boolean).length < check.minLines) return false;
      if (check.changed) {
        const original = shell.seedNode(abs);
        if (original?.kind === 'file' && original.content === text) return false;
      }
      return true;
    }

    case 'mode': {
      const node = shell.node(expand(check.path));
      if (!node) return false;
      if (check.executable !== undefined && Boolean(node.mode & 0o100) !== check.executable) return false;
      if (check.octal !== undefined && (node.mode & 0o777) !== check.octal) return false;
      return true;
    }

    case 'output':
      return shell.events.some(
        (e) =>
          (!check.command || records(e).some((r) => r.name === check.command)) &&
          list(check.includes).every((s) => e.output.includes(s)) &&
          !list(check.excludes).some((s) => e.output.includes(s))
      );

    case 'read':
      return shell.events.some((e) => e.read.includes(expand(check.path)));

    case 'exec':
      return shell.events.some(
        (e) => e.exec?.path === expand(check.path) && (check.ok === undefined || e.exec.ok === check.ok)
      );

    case 'procGone':
      return !shell.procs.some((p) => p.command.includes(check.match));

    case 'alias':
      return shell.aliases[check.name] !== undefined;

    case 'var': {
      const value = check.exported ? shell.env[check.name] : shell.vars[check.name] ?? shell.env[check.name];
      return value !== undefined && (check.value === undefined || value === check.value);
    }

    case 'opened':
      return shell.events.some((e) => e.editor === expand(check.path));

    case 'saved':
      return shell.events.some((e) => e.saved === expand(check.path));

    case 'all':
      return check.checks.every((c) => isSatisfied(c, shell));
  }
}

/** Every command on the event's line. Ctrl+C and nano saves have no parsed commands. */
function records(event: ShellEvent): CommandRecord[] {
  if (event.commands.length) return event.commands;
  return [{ name: event.command, args: event.args, flags: event.flags }];
}

function matchesRan(
  check: Extract<Check, { kind: 'ran' }>,
  event: ShellEvent,
  expand: (path: string) => string
): boolean {
  if (event.ok !== (check.ok ?? true)) return false;
  if (check.cwdAfter && event.cwdAfter !== expand(check.cwdAfter)) return false;
  if (check.historyExpanded && !event.historyExpanded) return false;
  if (check.viaAlias && !(check.viaAlias === true ? event.aliasUsed : event.aliasUsed === check.viaAlias)) return false;
  if (check.outputLines !== undefined && event.output.split('\n').filter((l) => l !== '').length !== check.outputLines) return false;
  if (check.pipeline && !event.pipelines.some((p) => check.pipeline!.every((name) => p.includes(name)))) return false;

  return records(event).some((r) => {
    if (check.command !== undefined && r.name !== check.command) return false;
    if (check.noArgs && r.args.length > 0) return false;
    if (check.hasArgs && r.args.length === 0) return false;
    if (check.args && r.args.join('\u0000') !== check.args.join('\u0000')) return false;
    if (check.argIn && !(r.args.length === 1 && check.argIn.includes(r.args[0]))) return false;
    if (check.argStartsWith && !(r.args[0] ?? '').startsWith(check.argStartsWith)) return false;
    if (check.flags && ![...check.flags].every((f) => r.flags.includes(f))) return false;
    return true;
  });
}
