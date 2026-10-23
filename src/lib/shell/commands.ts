import {
  FsNode,
  baseName,
  childPath,
  cloneNode,
  globToRegExp,
  modeString,
  parentOf,
  sizeOf,
  sortNames,
} from './fs';
import type { ExecResult, Line, Out, Shell, ShellEvent, Tone } from './shell';

/**
 * The commands the practice terminal runs. Output and error messages follow
 * GNU coreutils and bash on Linux, so what learners see here is what they'll
 * see on a real server.
 */

interface Ctx {
  sh: Shell;
  args: string[];
  stdin: string | null;
  /** Output is going to the screen, not into a pipe or file. Affects ls and grep. */
  tty: boolean;
  event: ShellEvent;
}

type Command = (ctx: Ctx) => ExecResult;

// ── output helpers ────────────────────────────────────────────────────

const line = (text: string, tone?: Tone): Out => ({ line: [{ text, tone }] });
const err = (text: string): Out => ({ line: [{ text, tone: 'error' }], err: true });
/** Explanations from the practice terminal itself — shown, never piped. */
const note = (text: string): Out => ({ line: [{ text, tone: 'muted' }], err: true });
const done = (out: Out[] = [], code = 0): ExecResult => ({ out, code });

const textLines = (text: string) => (text === '' ? [] : text.replace(/\n$/, '').split('\n'));

interface Parsed {
  flags: Set<string>;
  values: Record<string, string>;
  rest: string[];
  invalid?: string;
}

/**
 * Parse short options like `-la` or `-n 5`. `valued` lists options that take
 * a value. A bare number like `-5` is read as `-n 5` when `numeric` is set.
 */
function parseOpts(args: string[], allowed: string, valued = '', numeric = false): Parsed {
  const parsed: Parsed = { flags: new Set(), values: {}, rest: [] };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--') {
      parsed.rest.push(...args.slice(i + 1));
      break;
    }
    if (!arg.startsWith('-') || arg === '-') {
      parsed.rest.push(arg);
      continue;
    }
    if (numeric && /^-\d+$/.test(arg)) {
      parsed.values.n = arg.slice(1);
      continue;
    }
    const letters = arg.slice(1);
    for (let j = 0; j < letters.length; j++) {
      const ch = letters[j];
      if (valued.includes(ch)) {
        parsed.values[ch] = letters.slice(j + 1) || args[++i] || '';
        break;
      }
      if (!allowed.includes(ch)) {
        parsed.invalid ??= ch;
        continue;
      }
      parsed.flags.add(ch);
    }
  }
  return parsed;
}

const invalidOption = (cmd: string, ch: string): ExecResult =>
  done([err(`${cmd}: invalid option -- '${ch}'`), err(`Try '${cmd} --help' for more information.`)], 2);

function toneFor(name: string, node: FsNode): Tone | undefined {
  if (node.kind === 'dir') return 'dir';
  if (node.mode & 0o111) return 'exec';
  return undefined;
}

/** Sizes like `du -h` and `ls -lh` print them: rounded up, one decimal below 10. */
function human(bytes: number): string {
  if (bytes < 1024) return String(bytes);
  const units = ['K', 'M', 'G', 'T'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return value < 10 ? `${(Math.ceil(value * 10) / 10).toFixed(1)}${units[unit]}` : `${Math.ceil(value)}${units[unit]}`;
}

/** A stable, recent-looking timestamp for `ls -l`, so output never looks stale. */
function stamp(name: string): string {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const date = new Date(Date.now() - (hash % 12) * 86_400_000);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const time = `${String(9 + (hash % 9)).padStart(2, '0')}:${String(hash % 60).padStart(2, '0')}`;
  return `${month} ${String(date.getDate()).padStart(2)} ${time}`;
}

/** `date` in the default GNU format, e.g. "Tue Oct 20 14:03:22 UTC 2026". Always the real now. */
function formatDate(d: Date): string {
  const weekday = d.toLocaleString('en-US', { weekday: 'short' });
  const month = d.toLocaleString('en-US', { month: 'short' });
  const day = String(d.getDate()).padStart(2, ' ');
  const time = [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':');
  let zone = 'UTC';
  try {
    zone =
      new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
        .formatToParts(d)
        .find((part) => part.type === 'timeZoneName')?.value ?? 'UTC';
  } catch {
    // Older browsers without timeZoneName support fall back to UTC.
  }
  return `${weekday} ${month} ${day} ${time} ${zone} ${d.getFullYear()}`;
}

/** Read a file for cat/head/tail/wc/sort/grep, with the right error for each failure. */
function readFile(ctx: Ctx, cmd: string, arg: string): { content?: string; error?: Out } {
  const abs = ctx.sh.resolve(arg);
  const node = ctx.sh.node(abs);
  if (!node) return { error: err(`${cmd}: ${arg}: No such file or directory`) };
  if (node.kind === 'dir') return { error: err(`${cmd}: ${arg}: Is a directory`) };
  if (!ctx.sh.canRead(node)) return { error: err(`${cmd}: ${arg}: Permission denied`) };
  ctx.event.read.push(abs);
  return { content: node.content };
}

/** Inputs for filters: named files, or the pipe when there are none. */
function inputs(ctx: Ctx, cmd: string, files: string[]): { sources: Array<{ name: string; text: string }>; errors: Out[] } {
  if (!files.length) {
    if (ctx.stdin === null) return { sources: [], errors: [note(`${cmd} needs a file name, or input from a pipe — for example: ${cmd} notes.txt`)] };
    return { sources: [{ name: '', text: ctx.stdin }], errors: [] };
  }
  const sources: Array<{ name: string; text: string }> = [];
  const errors: Out[] = [];
  for (const file of files) {
    const { content, error } = readFile(ctx, cmd, file);
    if (error) errors.push(error);
    else sources.push({ name: file, text: content! });
  }
  return { sources, errors };
}

// ── navigation ────────────────────────────────────────────────────────

const pwd: Command = ({ sh }) => done([line(sh.cwd)]);

const cd: Command = ({ sh, args }) => {
  if (args.length > 1) return done([err('bash: cd: too many arguments')], 1);
  const arg = args[0];
  const goingBack = arg === '-';
  const target = arg === undefined ? sh.home : goingBack ? sh.prev : sh.resolve(arg);
  const node = sh.node(target);
  if (!node) return done([err(`bash: cd: ${arg}: No such file or directory`)], 1);
  if (node.kind !== 'dir') return done([err(`bash: cd: ${arg}: Not a directory`)], 1);
  sh.setCwd(target);
  return done(goingBack ? [line(target)] : []); // only `cd -` prints anything
};

const ls: Command = (ctx) => {
  const { sh, args, tty, event } = ctx;
  const opts = parseOpts(args.map((a) => (a === '--all' ? '-a' : a)), 'alAh1d');
  if (opts.invalid) return invalidOption('ls', opts.invalid);
  const showAll = opts.flags.has('a');
  const showHidden = showAll || opts.flags.has('A');
  const long = opts.flags.has('l');
  const humanSizes = opts.flags.has('h');
  const targets = opts.rest.length ? opts.rest : ['.'];
  const out: Out[] = [];
  let code = 0;

  const entryLine = (name: string, node: FsNode): Line => {
    const tone = tty ? toneFor(name, node) : undefined;
    if (!long) return [{ text: name, tone }];
    const links = node.kind === 'dir' ? 2 + [...node.children.values()].filter((c) => c.kind === 'dir').length : 1;
    const size = node.kind === 'dir' ? 4096 : sizeOf(node);
    return [
      {
        text: `${modeString(node)} ${String(links).padStart(2)} ${node.owner.padEnd(4)} ${node.owner.padEnd(4)} ${(humanSizes ? human(size) : String(size)).padStart(5)} ${stamp(name)} `,
      },
      { text: name, tone },
    ];
  };

  const files = targets.filter((t) => sh.node(sh.resolve(t))?.kind === 'file');
  const dirs = targets.filter((t) => sh.node(sh.resolve(t))?.kind === 'dir');
  for (const target of targets.filter((t) => !sh.node(sh.resolve(t)))) {
    out.push(err(`ls: cannot access '${target}': No such file or directory`));
    code = 2;
  }

  const emit = (entries: Line[]) => {
    if (!entries.length) return;
    if (long || !tty) entries.forEach((l) => out.push({ line: l }));
    else {
      const row: Line = [];
      entries.forEach((l, i) => {
        if (i > 0) row.push({ text: '  ' });
        row.push(...l);
      });
      out.push({ line: row });
    }
  };

  emit(files.map((f) => entryLine(f, sh.node(sh.resolve(f))!)));

  dirs.forEach((target, index) => {
    const abs = sh.resolve(target);
    const node = sh.node(abs);
    if (node?.kind !== 'dir') return;
    if (targets.length > 1) {
      if (index > 0 || files.length) out.push(line(''));
      out.push(line(`${target}:`));
    }
    sh.explored.add(abs);
    event.listed.push(abs);
    if (showHidden) {
      sh.hiddenRevealed.add(abs);
      event.listedHidden = true;
    }
    let names = sortNames([...node.children.keys()]);
    if (!showHidden) names = names.filter((n) => !n.startsWith('.'));
    const entries: Array<[string, FsNode]> = names.map((n) => [n, node.children.get(n)!]);
    if (showAll) entries.unshift(['.', node], ['..', sh.node(parentOf(abs))!]);
    if (long) out.push(line(`total ${entries.length * 4}`));
    emit(entries.map(([n, child]) => entryLine(n, child)));
  });

  return done(out, code);
};

// ── creating and changing files ──────────────────────────────────────

const mkdir: Command = ({ sh, args }) => {
  const opts = parseOpts(args, 'pv');
  if (opts.invalid) return invalidOption('mkdir', opts.invalid);
  if (!opts.rest.length) return done([err('mkdir: missing operand'), err("Try 'mkdir --help' for more information.")], 1);
  const out: Out[] = [];
  let code = 0;
  for (const arg of opts.rest) {
    const abs = sh.resolve(arg);
    if (opts.flags.has('p')) {
      let path = '/';
      for (const part of abs.split('/').filter(Boolean)) {
        path = childPath(path, part);
        const existing = sh.node(path);
        if (existing?.kind === 'file') {
          out.push(err(`mkdir: cannot create directory '${arg}': Not a directory`));
          code = 1;
          break;
        }
        if (!existing) {
          if (!sh.dirWritable(parentOf(path))) {
            out.push(err(`mkdir: cannot create directory '${arg}': Permission denied`));
            code = 1;
            break;
          }
          sh.insert(path, { kind: 'dir', children: new Map(), mode: 0o755, owner: sh.user });
        }
      }
      continue;
    }
    if (sh.node(abs)) {
      out.push(err(`mkdir: cannot create directory '${arg}': File exists`));
      code = 1;
    } else if (sh.node(parentOf(abs))?.kind !== 'dir') {
      out.push(err(`mkdir: cannot create directory '${arg}': No such file or directory`));
      code = 1;
    } else if (!sh.dirWritable(parentOf(abs))) {
      out.push(err(`mkdir: cannot create directory '${arg}': Permission denied`));
      code = 1;
    } else {
      sh.insert(abs, { kind: 'dir', children: new Map(), mode: 0o755, owner: sh.user });
    }
  }
  return done(out, code);
};

const touch: Command = ({ sh, args }) => {
  const files = args.filter((a) => !a.startsWith('-'));
  if (!files.length) return done([err('touch: missing file operand'), err("Try 'touch --help' for more information.")], 1);
  const out: Out[] = [];
  let code = 0;
  for (const arg of files) {
    const abs = sh.resolve(arg);
    if (sh.node(abs)) continue; // only updates the timestamp
    if (sh.node(parentOf(abs))?.kind !== 'dir') {
      out.push(err(`touch: cannot touch '${arg}': No such file or directory`));
      code = 1;
    } else if (!sh.dirWritable(parentOf(abs))) {
      out.push(err(`touch: cannot touch '${arg}': Permission denied`));
      code = 1;
    } else {
      sh.insert(abs, { kind: 'file', content: '', mode: 0o644, owner: sh.user });
    }
  }
  return done(out, code);
};

/** Move the learner out of a folder that no longer exists. */
function rescueCwd(sh: Shell, out: Out[]) {
  if (sh.node(sh.cwd)) return;
  let path = sh.cwd;
  while (!sh.node(path)) path = parentOf(path);
  sh.setCwd(path);
  out.push(note(`The folder you were in was deleted, so you're now in ${sh.displayPath(path)}.`));
}

const rm: Command = ({ sh, args }) => {
  const opts = parseOpts(args, 'rRfiv');
  if (opts.invalid) return invalidOption('rm', opts.invalid);
  const recursive = opts.flags.has('r') || opts.flags.has('R');
  const force = opts.flags.has('f');
  if (!opts.rest.length) {
    return force ? done() : done([err('rm: missing operand'), err("Try 'rm --help' for more information.")], 1);
  }
  const out: Out[] = [];
  if (opts.flags.has('i')) out.push(note('rm -i asks before each file. The practice terminal can’t ask, so it deleted without asking.'));
  let code = 0;
  for (const arg of opts.rest) {
    const abs = sh.resolve(arg);
    const node = sh.node(abs);
    if (abs === '/' && recursive) {
      out.push(err("rm: it is dangerous to operate recursively on '/'"), err('rm: use --no-preserve-root to override this failsafe'));
      code = 1;
      continue;
    }
    if (!node) {
      if (!force) {
        out.push(err(`rm: cannot remove '${arg}': No such file or directory`));
        code = 1;
      }
      continue;
    }
    if (node.kind === 'dir' && !recursive) {
      out.push(err(`rm: cannot remove '${arg}': Is a directory`));
      code = 1;
      continue;
    }
    if (!sh.dirWritable(parentOf(abs))) {
      out.push(err(`rm: cannot remove '${arg}': Permission denied`));
      code = 1;
      continue;
    }
    sh.remove(abs);
  }
  rescueCwd(sh, out);
  return done(out, code);
};

const rmdir: Command = ({ sh, args }) => {
  const dirs = args.filter((a) => !a.startsWith('-'));
  if (!dirs.length) return done([err('rmdir: missing operand')], 1);
  const out: Out[] = [];
  let code = 0;
  for (const arg of dirs) {
    const abs = sh.resolve(arg);
    const node = sh.node(abs);
    if (!node) out.push(err(`rmdir: failed to remove '${arg}': No such file or directory`));
    else if (node.kind !== 'dir') out.push(err(`rmdir: failed to remove '${arg}': Not a directory`));
    else if (node.children.size) out.push(err(`rmdir: failed to remove '${arg}': Directory not empty`));
    else if (!sh.dirWritable(parentOf(abs))) out.push(err(`rmdir: failed to remove '${arg}': Permission denied`));
    else {
      sh.remove(abs);
      continue;
    }
    code = 1;
  }
  rescueCwd(sh, out);
  return done(out, code);
};

/** Shared by cp and mv: where each source ends up. */
function destinations(sh: Shell, cmd: 'cp' | 'mv', sources: string[], dest: string) {
  const destAbs = sh.resolve(dest);
  const destNode = sh.node(destAbs);
  if (sources.length > 1 && destNode?.kind !== 'dir') {
    return { error: err(`${cmd}: target '${dest}' is not a directory`) };
  }
  return {
    targets: sources.map((src) => {
      const srcAbs = sh.resolve(src);
      return { src, srcAbs, to: destNode?.kind === 'dir' ? childPath(destAbs, baseName(srcAbs)) : destAbs };
    }),
  };
}

const cp: Command = ({ sh, args }) => {
  const opts = parseOpts(args, 'rRfiva');
  if (opts.invalid) return invalidOption('cp', opts.invalid);
  if (opts.rest.length < 2) {
    return done([err(opts.rest.length ? `cp: missing destination file operand after '${opts.rest[0]}'` : 'cp: missing file operand'), err("Try 'cp --help' for more information.")], 1);
  }
  const recursive = opts.flags.has('r') || opts.flags.has('R') || opts.flags.has('a');
  const sources = opts.rest.slice(0, -1);
  const plan = destinations(sh, 'cp', sources, opts.rest[opts.rest.length - 1]);
  if (plan.error) return done([plan.error], 1);
  const out: Out[] = [];
  let code = 0;
  for (const { src, srcAbs, to } of plan.targets!) {
    const node = sh.node(srcAbs);
    if (!node) {
      out.push(err(`cp: cannot stat '${src}': No such file or directory`));
      code = 1;
    } else if (node.kind === 'dir' && !recursive) {
      out.push(err(`cp: -r not specified; omitting directory '${src}'`));
      code = 1;
    } else if (to === srcAbs || to.startsWith(srcAbs + '/')) {
      out.push(err(`cp: cannot copy a directory, '${src}', into itself, '${sh.displayPath(to)}'`));
      code = 1;
    } else if (sh.node(parentOf(to))?.kind !== 'dir') {
      out.push(err(`cp: cannot create regular file '${to}': No such file or directory`));
      code = 1;
    } else if (!sh.dirWritable(parentOf(to))) {
      out.push(err(`cp: cannot create regular file '${to}': Permission denied`));
      code = 1;
    } else {
      sh.insert(to, cloneNode(node, sh.user));
    }
  }
  return done(out, code);
};

const mv: Command = ({ sh, args }) => {
  const opts = parseOpts(args, 'fivn');
  if (opts.invalid) return invalidOption('mv', opts.invalid);
  if (opts.rest.length < 2) {
    return done([err(opts.rest.length ? `mv: missing destination file operand after '${opts.rest[0]}'` : 'mv: missing file operand'), err("Try 'mv --help' for more information.")], 1);
  }
  const sources = opts.rest.slice(0, -1);
  const plan = destinations(sh, 'mv', sources, opts.rest[opts.rest.length - 1]);
  if (plan.error) return done([plan.error], 1);
  const out: Out[] = [];
  let code = 0;
  for (const { src, srcAbs, to } of plan.targets!) {
    const node = sh.node(srcAbs);
    if (!node) {
      out.push(err(`mv: cannot stat '${src}': No such file or directory`));
      code = 1;
    } else if (to === srcAbs) {
      continue;
    } else if (to.startsWith(srcAbs + '/')) {
      out.push(err(`mv: cannot move '${src}' to a subdirectory of itself, '${sh.displayPath(to)}'`));
      code = 1;
    } else if (sh.node(parentOf(to))?.kind !== 'dir') {
      out.push(err(`mv: cannot move '${src}' to '${sh.displayPath(to)}': No such file or directory`));
      code = 1;
    } else if (!sh.dirWritable(parentOf(srcAbs)) || !sh.dirWritable(parentOf(to))) {
      out.push(err(`mv: cannot move '${src}' to '${sh.displayPath(to)}': Permission denied`));
      code = 1;
    } else {
      sh.remove(srcAbs);
      sh.insert(to, node);
    }
  }
  rescueCwd(sh, out);
  return done(out, code);
};

// ── reading files ─────────────────────────────────────────────────────

const cat: Command = (ctx) => {
  const files = ctx.args.filter((a) => a !== '-');
  if (!files.length) {
    if (ctx.stdin !== null) return done(textLines(ctx.stdin).map((l) => line(l)));
    return done([note('cat needs a file name — for example: cat notes.txt')]);
  }
  const out: Out[] = [];
  let code = 0;
  for (const file of files) {
    const { content, error } = readFile(ctx, 'cat', file);
    if (error) {
      out.push(error);
      code = 1;
    } else textLines(content!).forEach((l) => out.push(line(l)));
  }
  return done(out, code);
};

function headTail(which: 'head' | 'tail'): Command {
  return (ctx) => {
    const opts = parseOpts(ctx.args, 'qvf', 'nc', true);
    if (opts.flags.has('f')) {
      return done([note('tail -f keeps watching a file and prints new lines as they arrive, until you press Ctrl+C. The practice terminal can’t follow files live — try it on your own computer.')], 1);
    }
    if (opts.invalid) return invalidOption(which, opts.invalid);
    const n = opts.values.n === undefined ? 10 : Number(opts.values.n);
    if (!Number.isInteger(n) || n < 0) return done([err(`${which}: invalid number of lines: '${opts.values.n}'`)], 1);
    const { sources, errors } = inputs(ctx, which, opts.rest);
    const out: Out[] = [...errors];
    sources.forEach((source, i) => {
      if (sources.length > 1) {
        if (i > 0) out.push(line(''));
        out.push(line(`==> ${source.name} <==`));
      }
      const lines = textLines(source.text);
      const picked = which === 'head' ? lines.slice(0, n) : n === 0 ? [] : lines.slice(-n);
      picked.forEach((l) => out.push(line(l)));
    });
    return done(out, errors.length ? 1 : 0);
  };
}

const wc: Command = (ctx) => {
  const opts = parseOpts(ctx.args, 'lwcm');
  if (opts.invalid) return invalidOption('wc', opts.invalid);
  const which = opts.flags.size ? (['l', 'w', 'c'] as const).filter((f) => opts.flags.has(f) || (f === 'c' && opts.flags.has('m'))) : (['l', 'w', 'c'] as const);
  const { sources, errors } = inputs(ctx, 'wc', opts.rest);
  if (!sources.length && errors.length && !opts.rest.length) return done(errors);
  const rows = sources.map((s) => ({
    name: s.name,
    l: (s.text.match(/\n/g) ?? []).length,
    w: s.text.split(/\s+/).filter(Boolean).length,
    c: new TextEncoder().encode(s.text).length,
  }));
  if (rows.length > 1) {
    rows.push({ name: 'total', l: rows.reduce((a, r) => a + r.l, 0), w: rows.reduce((a, r) => a + r.w, 0), c: rows.reduce((a, r) => a + r.c, 0) });
  }
  const single = which.length === 1 && rows.length === 1;
  const width = single ? 0 : Math.max(...rows.flatMap((r) => which.map((f) => String(r[f]).length)), 1);
  const out: Out[] = [...errors];
  rows.forEach((r) => {
    const counts = which.map((f) => String(r[f]).padStart(width)).join(' ');
    out.push(line(r.name ? `${counts} ${r.name}` : counts));
  });
  return done(out, errors.length ? 1 : 0);
};

const sort: Command = (ctx) => {
  const opts = parseOpts(ctx.args, 'rnuf');
  if (opts.invalid) return invalidOption('sort', opts.invalid);
  const { sources, errors } = inputs(ctx, 'sort', opts.rest);
  let lines = sources.flatMap((s) => textLines(s.text));
  const key = (l: string) => (opts.flags.has('f') ? l.toLowerCase() : l);
  const num = (l: string) => parseFloat(l.trim()) || 0;
  lines.sort((a, b) => {
    if (opts.flags.has('n')) {
      const diff = num(a) - num(b);
      if (diff !== 0) return diff;
    }
    return key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0;
  });
  if (opts.flags.has('r')) lines.reverse();
  if (opts.flags.has('u')) lines = lines.filter((l, i) => i === 0 || key(l) !== key(lines[i - 1]));
  return done([...errors, ...lines.map((l) => line(l))], errors.length ? 2 : 0);
};

const uniq: Command = (ctx) => {
  const opts = parseOpts(ctx.args, 'cdu');
  if (opts.invalid) return invalidOption('uniq', opts.invalid);
  const { sources, errors } = inputs(ctx, 'uniq', opts.rest.slice(0, 1));
  const lines = sources.flatMap((s) => textLines(s.text));
  const groups: Array<{ text: string; count: number }> = [];
  for (const l of lines) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.text === l) lastGroup.count++;
    else groups.push({ text: l, count: 1 });
  }
  const kept = groups.filter((g) => (opts.flags.has('d') ? g.count > 1 : opts.flags.has('u') ? g.count === 1 : true));
  return done([
    ...errors,
    ...kept.map((g) => line(opts.flags.has('c') ? `${String(g.count).padStart(7)} ${g.text}` : g.text)),
  ], errors.length ? 1 : 0);
};

// ── searching ─────────────────────────────────────────────────────────

const grep: Command = (ctx) => {
  const { sh, tty } = ctx;
  const opts = parseOpts(ctx.args, 'inrRvclwE', 'e');
  if (opts.invalid) return done([err(`grep: invalid option -- '${opts.invalid}'`), err("Usage: grep [OPTION]... PATTERNS [FILE]...")], 2);
  const pattern = opts.values.e ?? opts.rest.shift();
  if (pattern === undefined) return done([err('Usage: grep [OPTION]... PATTERNS [FILE]...'), err("Try 'grep --help' for more information.")], 2);

  const recursive = opts.flags.has('r') || opts.flags.has('R');
  const ignoreCase = opts.flags.has('i');
  let re: RegExp;
  try {
    const source = opts.flags.has('w') ? `\\b(?:${pattern})\\b` : pattern;
    re = new RegExp(source, ignoreCase ? 'gi' : 'g');
  } catch {
    re = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), ignoreCase ? 'gi' : 'g');
  }

  // Collect (display name, text) pairs to search.
  const targets: Array<{ name: string; text: string }> = [];
  const errors: Out[] = [];
  const walk = (abs: string, shown: string) => {
    const node = sh.node(abs);
    if (!node) return;
    if (node.kind === 'file') {
      // Searched, not read: grep doesn't count as having looked inside the file.
      if (!sh.canRead(node)) errors.push(err(`grep: ${shown}: Permission denied`));
      else targets.push({ name: shown, text: node.content });
      return;
    }
    for (const name of sortNames([...node.children.keys()])) {
      walk(childPath(abs, name), shown === '' ? name : shown.endsWith('/') ? shown + name : `${shown}/${name}`);
    }
  };

  if (!opts.rest.length && !recursive) {
    if (ctx.stdin === null) return done([note('grep needs a file to search, or input from a pipe — for example: grep hello notes.txt')], 2);
    targets.push({ name: '', text: ctx.stdin });
  } else {
    for (const arg of opts.rest.length ? opts.rest : ['']) {
      const abs = sh.resolve(arg || '.');
      const node = sh.node(abs);
      if (!node) errors.push(err(`grep: ${arg}: No such file or directory`));
      else if (node.kind === 'dir' && !recursive) errors.push(err(`grep: ${arg}: Is a directory`));
      else walk(abs, arg);
    }
  }

  const showNames = recursive || opts.rest.length > 1;
  const out: Out[] = [...errors];
  let matched = false;
  for (const target of targets) {
    const lines = textLines(target.text);
    const hits = lines
      .map((text, index) => ({ text, index }))
      .filter(({ text }) => {
        re.lastIndex = 0;
        return re.test(text) !== opts.flags.has('v');
      });
    if (hits.length) matched = true;

    if (opts.flags.has('l')) {
      if (hits.length) out.push(line(target.name || '(standard input)', tty ? 'path' : undefined));
      continue;
    }
    if (opts.flags.has('c')) {
      out.push(line(showNames ? `${target.name}:${hits.length}` : `${hits.length}`));
      continue;
    }
    for (const hit of hits) {
      const segments: Line = [];
      if (showNames) segments.push({ text: target.name, tone: tty ? 'path' : undefined }, { text: ':' });
      if (opts.flags.has('n')) segments.push({ text: String(hit.index + 1), tone: tty ? 'num' : undefined }, { text: ':' });
      if (tty && !opts.flags.has('v')) {
        // Highlight matches, as grep --color=auto does on most Linux systems.
        let last = 0;
        re.lastIndex = 0;
        for (const m of hit.text.matchAll(re)) {
          if (!m[0]) break;
          segments.push({ text: hit.text.slice(last, m.index) }, { text: m[0], tone: 'match' });
          last = m.index! + m[0].length;
        }
        segments.push({ text: hit.text.slice(last) });
      } else {
        segments.push({ text: hit.text });
      }
      out.push({ line: segments });
    }
  }
  return done(out, errors.length && !matched ? 2 : matched ? 0 : 1);
};

const find: Command = ({ sh, args }) => {
  const starts: string[] = [];
  let i = 0;
  while (i < args.length && !args[i].startsWith('-')) starts.push(args[i++]);
  const tests: Array<(name: string, node: FsNode) => boolean> = [];
  while (i < args.length) {
    const flag = args[i++];
    const value = args[i++];
    if (flag === '-name' || flag === '-iname') {
      if (value === undefined) return done([err(`find: missing argument to \`${flag}'`)], 1);
      // find's -name matches dotfiles with * too, unlike the shell.
      const re = globToRegExp(value);
      const loose = new RegExp(re.source.replace('^(?!\\.)', '^'), flag === '-iname' ? 'i' : '');
      tests.push((name) => loose.test(name));
    } else if (flag === '-type') {
      if (value !== 'f' && value !== 'd') return done([err(`find: Unknown argument to -type: ${value ?? ''}`)], 1);
      tests.push((_, node) => (value === 'd' ? node.kind === 'dir' : node.kind === 'file'));
    } else {
      return done([err(`find: unknown predicate \`${flag}'`)], 1);
    }
  }

  const out: Out[] = [];
  let code = 0;
  for (const start of starts.length ? starts : ['.']) {
    const abs = sh.resolve(start);
    if (!sh.node(abs)) {
      out.push(err(`find: '${start}': No such file or directory`));
      code = 1;
      continue;
    }
    const walk = (path: string, shown: string) => {
      const node = sh.node(path)!;
      if (tests.every((t) => t(baseName(shown), node))) out.push(line(shown));
      if (node.kind === 'dir') {
        for (const child of sortNames([...node.children.keys()])) {
          walk(childPath(path, child), shown.endsWith('/') ? shown + child : `${shown}/${child}`);
        }
      }
    };
    walk(abs, start);
  }
  return done(out, code);
};

// ── permissions ───────────────────────────────────────────────────────

const chmod: Command = ({ sh, args }) => {
  const [spec, ...files] = args;
  if (!spec) return done([err('chmod: missing operand'), err("Try 'chmod --help' for more information.")], 1);
  if (!files.length) return done([err(`chmod: missing operand after '${spec}'`), err("Try 'chmod --help' for more information.")], 1);

  const apply = (mode: number): number | null => {
    if (/^[0-7]{3,4}$/.test(spec)) return parseInt(spec, 8) & 0o777;
    let next = mode;
    for (const clause of spec.split(',')) {
      const m = /^([ugoa]*)([+\-=])([rwx]*)$/.exec(clause);
      if (!m) return null;
      const who = m[1] || 'a';
      const perm = (m[3].includes('r') ? 4 : 0) | (m[3].includes('w') ? 2 : 0) | (m[3].includes('x') ? 1 : 0);
      for (const w of who === 'a' ? 'ugo' : who) {
        const shift = w === 'u' ? 6 : w === 'g' ? 3 : 0;
        const bits = perm << shift;
        if (m[2] === '+') next |= bits;
        else if (m[2] === '-') next &= ~bits;
        else next = (next & ~(7 << shift)) | bits;
      }
    }
    return next;
  };

  const out: Out[] = [];
  let code = 0;
  for (const file of files) {
    const node = sh.node(sh.resolve(file));
    if (!node) {
      out.push(err(`chmod: cannot access '${file}': No such file or directory`));
      code = 1;
      continue;
    }
    if (node.owner !== sh.user) {
      out.push(err(`chmod: changing permissions of '${file}': Operation not permitted`));
      code = 1;
      continue;
    }
    const next = apply(node.mode);
    if (next === null) return done([err(`chmod: invalid mode: '${spec}'`), err("Try 'chmod --help' for more information.")], 1);
    node.mode = next;
  }
  return done(out, code);
};

// ── processes and the system ─────────────────────────────────────────

const ps: Command = ({ sh, args }) => {
  const all = args.some((a) => /^-?a?u?x$|^-e|^aux$|^-ef$|^ax$/.test(a));
  const self = { pid: sh.spawnPid(), user: sh.user, command: all ? `ps ${args.join(' ')}` : 'ps', cpu: 0, mem: 0, tty: 'pts/0', stat: 'R+' };
  const rows = [...sh.procs, self];
  if (!all) {
    return done([
      line('    PID TTY          TIME CMD'),
      ...rows.filter((p) => p.tty === 'pts/0').map((p) => line(`${String(p.pid).padStart(7)} pts/0    00:00:00 ${p.command.replace(/^-/, '').split(' ')[0].split('/').pop()}`)),
    ]);
  }
  return done([
    line('USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND'),
    ...rows.map((p) => {
      const vsz = 10000 + ((p.pid * 7919) % 900000);
      const rss = Math.round(vsz / 12);
      const time = p.cpu > 50 ? '42:17' : '0:00';
      return line(
        `${p.user.padEnd(8)} ${String(p.pid).padStart(7)} ${p.cpu.toFixed(1).padStart(4)} ${p.mem.toFixed(1).padStart(4)} ${String(vsz).padStart(6)} ${String(rss).padStart(5)} ${p.tty.padEnd(8)} ${p.stat.padEnd(4)} 09:12 ${time.padStart(6)} ${p.command}`
      );
    }),
  ]);
};

const kill: Command = ({ sh, args }) => {
  let force = false;
  const pids: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (/^-(9|KILL|SIGKILL)$/.test(a)) force = true;
    else if (/^-(15|TERM|SIGTERM)$/.test(a)) force = false;
    else if (a === '-s' || a === '-n') force = /^(9|KILL|SIGKILL)$/.test(args[++i] ?? '');
    else pids.push(a);
  }
  if (!pids.length) return done([err('kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ... or kill -l [sigspec]')], 2);
  const out: Out[] = [];
  let code = 0;
  for (const raw of pids) {
    if (!/^\d+$/.test(raw)) {
      out.push(err(`bash: kill: ${raw}: arguments must be process or job IDs`));
      code = 1;
      continue;
    }
    const pid = Number(raw);
    const proc = sh.procs.find((p) => p.pid === pid);
    if (!proc) {
      out.push(err(`bash: kill: (${pid}) - No such process`));
      code = 1;
    } else if (proc.user !== sh.user) {
      out.push(err(`bash: kill: (${pid}) - Operation not permitted`));
      code = 1;
    } else if (pid === 1201) {
      out.push(note('That’s the shell you’re typing in. Killing it would close this terminal, so the practice terminal won’t.'));
      code = 1;
    } else if (proc.ignoresTerm && !force) {
      // A polite kill was ignored. Like the real thing, kill prints nothing.
    } else {
      sh.procs = sh.procs.filter((p) => p.pid !== pid);
    }
  }
  return done(out, code);
};

const DISK_SIZE = 50 * 1024 ** 3;
const DISK_BASE_USED = 31 * 1024 ** 3;

const df: Command = ({ sh, args }) => {
  const h = args.some((a) => a.startsWith('-') && a.includes('h'));
  const used = DISK_BASE_USED + sizeOf(sh.node(sh.home)!);
  const avail = Math.max(0, DISK_SIZE - used);
  const pct = `${Math.min(100, Math.ceil((used / DISK_SIZE) * 100))}%`;
  if (h) {
    return done([
      line('Filesystem      Size  Used Avail Use% Mounted on'),
      line(`/dev/sda1       ${human(DISK_SIZE).padStart(4)}  ${human(used).padStart(4)}  ${human(avail).padStart(4)} ${pct.padStart(4)} /`),
    ]);
  }
  const k = (n: number) => String(Math.round(n / 1024));
  return done([
    line('Filesystem     1K-blocks     Used Available Use% Mounted on'),
    line(`/dev/sda1      ${k(DISK_SIZE).padStart(9)} ${k(used).padStart(8)} ${k(avail).padStart(9)} ${pct.padStart(4)} /`),
  ]);
};

const du: Command = ({ sh, args }) => {
  const opts = parseOpts(args, 'shac');
  if (opts.invalid) return invalidOption('du', opts.invalid);
  const fmt = (bytes: number) => (opts.flags.has('h') ? human(bytes) : String(Math.ceil(bytes / 1024)));
  const blocks = (node: FsNode): number => {
    if (node.kind === 'file') return Math.max(4096, Math.ceil(sizeOf(node) / 4096) * 4096);
    let total = 4096;
    node.children.forEach((c) => (total += blocks(c)));
    return total;
  };
  const out: Out[] = [];
  let code = 0;
  for (const target of opts.rest.length ? opts.rest : ['.']) {
    const node = sh.node(sh.resolve(target));
    if (!node) {
      out.push(err(`du: cannot access '${target}': No such file or directory`));
      code = 1;
      continue;
    }
    if (!opts.flags.has('s') && node.kind === 'dir') {
      // Like real du: every folder underneath, deepest first, then the total.
      const walk = (n: FsNode, shown: string) => {
        if (n.kind !== 'dir') return;
        for (const name of sortNames([...n.children.keys()])) walk(n.children.get(name)!, `${shown}/${name}`);
        out.push(line(`${fmt(blocks(n))}\t${shown}`));
      };
      walk(node, target);
    } else {
      out.push(line(`${fmt(blocks(node))}\t${target}`));
    }
  }
  return done(out, code);
};

const uname: Command = ({ sh, args }) => {
  const parts = {
    s: 'Linux',
    n: sh.host,
    r: '6.8.0-45-generic',
    v: '#45-Ubuntu SMP PREEMPT_DYNAMIC',
    m: 'x86_64',
    o: 'GNU/Linux',
  };
  if (args.includes('-a')) return done([line(`${parts.s} ${parts.n} ${parts.r} ${parts.v} ${parts.m} ${parts.m} ${parts.m} ${parts.o}`)]);
  const wanted = args.join('').replace(/-/g, '').split('').filter((c) => c in parts) as Array<keyof typeof parts>;
  return done([line((wanted.length ? wanted : ['s' as const]).map((k) => parts[k]).join(' '))]);
};

// ── the shell itself ──────────────────────────────────────────────────

const history: Command = ({ sh }) =>
  done(sh.history.map((cmd, i) => line(`${String(i + 1).padStart(5)}  ${cmd}`)));

const alias: Command = ({ sh, args }) => {
  if (!args.length) return done(Object.entries(sh.aliases).sort().map(([k, v]) => line(`alias ${k}='${v}'`)));
  const out: Out[] = [];
  let code = 0;
  for (const arg of args) {
    const eq = arg.indexOf('=');
    if (eq > 0) sh.aliases[arg.slice(0, eq)] = arg.slice(eq + 1);
    else if (sh.aliases[arg] !== undefined) out.push(line(`alias ${arg}='${sh.aliases[arg]}'`));
    else {
      out.push(err(`bash: alias: ${arg}: not found`));
      code = 1;
    }
  }
  return done(out, code);
};

const unalias: Command = ({ sh, args }) => {
  const out: Out[] = [];
  for (const name of args) {
    if (sh.aliases[name] === undefined) out.push(err(`bash: unalias: ${name}: not found`));
    else delete sh.aliases[name];
  }
  return done(out, out.length ? 1 : 0);
};

const exportCmd: Command = ({ sh, args }) => {
  if (!args.length) {
    return done(Object.keys(sh.env).sort().map((k) => line(`declare -x ${k}="${sh.env[k]}"`)));
  }
  for (const arg of args) {
    const eq = arg.indexOf('=');
    if (eq > 0) {
      const name = arg.slice(0, eq);
      sh.env[name] = arg.slice(eq + 1);
      delete sh.vars[name];
    } else if (sh.vars[arg] !== undefined) {
      sh.env[arg] = sh.vars[arg];
      delete sh.vars[arg];
    }
  }
  return done();
};

const env: Command = ({ sh }) => done(Object.entries(sh.env).map(([k, v]) => line(`${k}=${v}`)));

const printenv: Command = ({ sh, args }) => {
  if (!args.length) return done(Object.entries(sh.env).map(([k, v]) => line(`${k}=${v}`)));
  const values = args.filter((a) => sh.env[a] !== undefined).map((a) => line(sh.env[a]));
  return done(values, values.length === args.length ? 0 : 1);
};

const BUILTINS = new Set(['cd', 'alias', 'unalias', 'export', 'history']);

const which: Command = ({ args }) => {
  const out: Out[] = [];
  let code = 0;
  for (const name of args.filter((a) => !a.startsWith('-'))) {
    if ((COMMANDS.includes(name) && !BUILTINS.has(name)) || REAL_BUT_UNSUPPORTED.has(name)) out.push(line(`/usr/bin/${name}`));
    else code = 1;
  }
  return done(out, code);
};

const help: Command = () =>
  done(
    [
      'This practice terminal understands:',
      '  moving around    pwd  ls  cd',
      '  files            mkdir  touch  cp  mv  rm  rmdir  cat  nano',
      '  reading          head  tail  wc  sort  uniq',
      '  searching        grep  find',
      '  permissions      chmod  ./script.sh  bash script.sh',
      '  your system      ps  kill  df  du  uname  whoami  date',
      '  your shell       echo  history  alias  export  env  which  clear',
      'Pipes (|), redirection (> >> <), && and ; work too.',
      'Tab completes names. Up and down arrows recall commands.',
    ].map((t) => line(t, 'muted'))
  );

// ── things that need a real terminal ─────────────────────────────────

const ELSEWHERE: Record<string, string> = {
  less: 'less opens a scrollable, full-screen view of a file. Try it on your own computer: less notes.txt, then press q to quit. Here, use cat or head.',
  more: 'more pages through a file one screen at a time. Try it on your own computer. Here, use cat or head.',
  top: 'top is a live, full-screen view of running programs. Try it on your own computer (press q to quit). Here, use ps aux.',
  htop: 'htop is a friendlier version of top. It may need installing on your computer. Here, use ps aux.',
  vim: 'vim is a powerful full-screen editor. If you open it by accident on your own computer, type :q! and press Enter to get out. Here, use nano.',
  vi: 'vi is a full-screen editor. If you open it by accident on your own computer, type :q! and press Enter to get out. Here, use nano.',
  man: 'man opens the manual for a command, e.g. man ls (press q to quit). Manuals aren’t available here — try it on your own computer.',
  sudo: 'sudo runs a command as the administrator (root). On a real machine it asks for your password first. The practice terminal doesn’t have admin access, so sudo isn’t available here.',
  exit: 'On your own computer, exit closes the terminal. There’s nowhere to exit to here.',
};

/**
 * Real commands this practice terminal doesn't run. Saying "command not found"
 * for these would teach something false — that they don't exist.
 */
export const REAL_BUT_UNSUPPORTED = new Set([
  'apt', 'brew', 'code', 'curl', 'emacs', 'file', 'git', 'gzip', 'ln', 'node', 'open', 'ping', 'python', 'python3',
  'screen', 'ssh', 'tar', 'tmux', 'tree', 'unzip', 'wget', 'zip', 'free',
]);

const COMMAND_TABLE: Record<string, Command> = {
  pwd, cd, ls, mkdir, touch, rm, rmdir, cp, mv, cat, wc, sort, uniq, grep, find, chmod, ps, kill, df, du, uname,
  history, alias, unalias, export: exportCmd, env, printenv, which, help,
  head: headTail('head'),
  tail: headTail('tail'),
  echo: ({ args }) => done([line(args.filter((a, i) => !(i === 0 && a === '-n')).join(' '))]),
  whoami: ({ sh }) => done([line(sh.user)]),
  date: () => done([line(formatDate(new Date()))]),
  clear: () => ({ out: [], code: 0, clear: true }),
  nano: ({ sh, args, event }) => {
    const file = args.find((a) => !a.startsWith('-'));
    if (!file) return done([note('Give nano a file name — for example: nano notes.txt')], 1);
    const abs = sh.resolve(file);
    const node = sh.node(abs);
    if (node?.kind === 'dir') return done([err(`nano: ${file} is a directory`)], 1);
    if (!node && sh.node(parentOf(abs))?.kind !== 'dir') return done([err(`nano: ${file}: No such file or directory`)], 1);
    if (node && !sh.canRead(node)) return done([err(`nano: ${file}: Permission denied`)], 1);
    event.editor = abs;
    return { out: [], code: 0, editor: { path: abs, content: node?.kind === 'file' ? node.content : '', isNew: !node } };
  },
};

export const COMMANDS = [...Object.keys(COMMAND_TABLE), 'bash', 'sh'].sort();

export function runCommand(sh: Shell, name: string, args: string[], stdin: string | null, tty: boolean, event: ShellEvent): ExecResult {
  const command = COMMAND_TABLE[name];
  if (command) return command({ sh, args, stdin, tty, event });
  if (name === 'bash' || name === 'sh') return done([note('You’re already in bash. To run a script with it: bash script.sh')]);
  if (ELSEWHERE[name]) return done([note(ELSEWHERE[name])], 1);
  if (REAL_BUT_UNSUPPORTED.has(name)) {
    return done([note(`${name} is a real command, but this practice terminal doesn’t run it.`), note('Type help to see what works here.')], 127);
  }
  return done([err(`bash: ${name}: command not found`), ...mistakeHint(name)], 127);
}

/** Explain the classic beginner slips instead of leaving "command not found" bare. */
function mistakeHint(command: string): Out[] {
  if (/^cd\.+/.test(command)) return [note('Put a space between cd and .. — try: cd ..')];
  if (/^(ls|rm|cp|mv|grep)-/.test(command)) {
    const base = command.split('-')[0];
    return [note(`Put a space before the option — try: ${base} ${command.slice(base.length)}`)];
  }
  if (COMMANDS.includes(command.toLowerCase())) return [note(`Commands are lowercase — try: ${command.toLowerCase()}`)];
  const close = command.length > 2 ? COMMANDS.find((c) => editDistance(c, command) === 1 || isSwap(c, command)) : undefined;
  if (close) return [note(`Did you mean ${close}?`)];
  return [note('Type help to see the commands this terminal understands.')];
}

/** Two adjacent letters swapped, the most common typo: whomai → whoami. */
function isSwap(a: string, b: string): boolean {
  if (a.length !== b.length || a === b) return false;
  const diff = [...a].flatMap((ch, i) => (ch === b[i] ? [] : [i]));
  return diff.length === 2 && diff[1] === diff[0] + 1 && a[diff[0]] === b[diff[1]] && a[diff[1]] === b[diff[0]];
}

/** How many single-letter edits turn one word into the other: lss → ls is 1. */
function editDistance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const next = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = row[j];
      row[j] = next;
    }
  }
  return row[b.length];
}
