import {
  FsMeta,
  FsNode,
  FsSeed,
  baseName,
  buildFs,
  childPath,
  getNode,
  globToRegExp,
  hasGlob,
  parentOf,
  resolvePath,
  sortNames,
  unescapePattern,
} from './fs';
import { expandWord as expandParts, lex, parse, ParseError, type SimpleCommand, type WordToken } from './parse';
import { COMMANDS, runCommand } from './commands';

/**
 * A small, safe shell that runs entirely in the browser.
 *
 * It imitates bash on Linux closely enough to learn from: same commands, same
 * output and error messages, same quirks (silence on success, case-sensitive
 * names, scripts running in a subshell). It is deliberately not a full shell —
 * only what the lessons teach is implemented, and real commands it doesn't run
 * say so honestly rather than pretending not to exist.
 */

export type Tone = 'prompt' | 'path' | 'dir' | 'exec' | 'error' | 'muted' | 'match' | 'num';
export type Segment = { text: string; tone?: Tone };
export type Line = Segment[];

/** A line of command output, and whether it went to stderr (stderr is never piped). */
export interface Out {
  line: Line;
  err?: boolean;
}

export interface CommandRecord {
  name: string;
  args: string[];
  flags: string;
}

export interface ShellEvent {
  raw: string;
  /** The line actually run, after `!!` and alias expansion. */
  expanded: string;
  /** The first command on the line. */
  command: string;
  args: string[];
  flags: string;
  /** Every command on the line, in order — including each stage of a pipeline. */
  commands: CommandRecord[];
  /** Command names grouped by pipeline, e.g. [['sort', 'uniq']]. */
  pipelines: string[][];
  cwdBefore: string;
  cwdAfter: string;
  ok: boolean;
  exitCode: number;
  /** Folders whose contents were listed with `ls`. */
  listed: string[];
  listedHidden: boolean;
  /** Files whose contents were read (cat, head, tail, grep, ...). */
  read: string[];
  /** The text shown in the terminal. */
  output: string;
  /** A script that was run, and whether it was allowed to run. */
  exec?: { path: string; ok: boolean };
  /** File opened in nano. */
  editor?: string;
  /** File saved from nano. */
  saved?: string;
  usedTab: boolean;
  historyExpanded: boolean;
  aliasUsed?: string;
}

export interface Proc {
  pid: number;
  user: string;
  command: string;
  cpu: number;
  mem: number;
  tty: string;
  stat: string;
  /** Some programs ignore a polite `kill` and need `kill -9`. */
  ignoresTerm?: boolean;
}

export interface EditorRequest {
  path: string;
  content: string;
  isNew: boolean;
}

export interface RunResult {
  lines: Line[];
  clear: boolean;
  event: ShellEvent | null;
  editor?: EditorRequest;
}

export interface ShellOptions {
  seed: FsSeed;
  meta?: FsMeta;
  procs?: Proc[];
  user?: string;
  host?: string;
  startDir?: string;
}

export interface ExecResult {
  out: Out[];
  code: number;
  clear?: boolean;
  editor?: EditorRequest;
}

export const DEFAULT_PROCS: Proc[] = [
  { pid: 1, user: 'root', command: '/sbin/init', cpu: 0, mem: 0.1, tty: '?', stat: 'Ss' },
  { pid: 412, user: 'root', command: '/usr/sbin/sshd -D', cpu: 0, mem: 0.2, tty: '?', stat: 'Ss' },
  { pid: 1201, user: 'you', command: '-bash', cpu: 0, mem: 0.1, tty: 'pts/0', stat: 'Ss' },
];

export const toText = (line: Line) => line.map((s) => s.text).join('');

export class Shell {
  readonly user: string;
  readonly host: string;
  readonly home: string;
  private readonly seed: FsSeed;
  private readonly meta: FsMeta;
  private readonly procSeed: Proc[];
  private readonly startDir: string;

  root!: FsNode;
  /** The untouched starting files, for "has this file changed?" checks. */
  seedRoot!: FsNode;
  cwd!: string;
  prev!: string;
  env!: Record<string, string>;
  vars!: Record<string, string>;
  aliases!: Record<string, string>;
  history!: string[];
  procs!: Proc[];
  events!: ShellEvent[];
  lastExit = 0;
  private nextPid = 2301;
  private scriptDepth = 0;

  /** What the learner has discovered — drives the map. */
  explored!: Set<string>;
  hiddenRevealed!: Set<string>;
  visited!: Set<string>;
  created!: Set<string>;

  constructor(options: ShellOptions) {
    this.seed = options.seed;
    this.meta = options.meta ?? {};
    this.user = options.user ?? 'you';
    this.host = options.host ?? 'terminal-mastery';
    this.home = `/home/${this.user}`;
    this.startDir = options.startDir ?? this.home;
    this.procSeed = options.procs ?? DEFAULT_PROCS;
    this.reset();
  }

  reset() {
    this.root = buildFs(this.seed, this.user, this.meta);
    this.seedRoot = buildFs(this.seed, this.user, this.meta);
    this.cwd = this.startDir;
    this.prev = this.startDir;
    this.env = {
      HOME: this.home,
      USER: this.user,
      LOGNAME: this.user,
      SHELL: '/bin/bash',
      PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
      PWD: this.startDir,
      LANG: 'C.UTF-8',
      TERM: 'xterm-256color',
    };
    this.vars = {};
    this.aliases = {};
    this.history = [];
    this.procs = this.procSeed.map((p) => ({ ...p }));
    this.events = [];
    this.lastExit = 0;
    this.explored = new Set();
    this.hiddenRevealed = new Set();
    this.visited = new Set([this.startDir]);
    this.created = new Set();
  }

  // ── helpers used by commands ─────────────────────────────────────────

  resolve(input: string): string {
    return resolvePath(this.cwd, input, this.home);
  }

  node(abs: string): FsNode | undefined {
    return getNode(this.root, abs);
  }

  /** The file or folder as it was when the lesson started. */
  seedNode(abs: string): FsNode | undefined {
    return getNode(this.seedRoot, abs);
  }

  displayPath(abs: string): string {
    if (abs === this.home) return '~';
    if (abs.startsWith(this.home + '/')) return '~' + abs.slice(this.home.length);
    return abs;
  }

  private owns(node: FsNode) {
    return node.owner === this.user;
  }

  canRead(node: FsNode) {
    return Boolean(node.mode & (this.owns(node) ? 0o400 : 0o004));
  }

  canWrite(node: FsNode) {
    return Boolean(node.mode & (this.owns(node) ? 0o200 : 0o002));
  }

  canExec(node: FsNode) {
    return Boolean(node.mode & (this.owns(node) ? 0o100 : 0o001));
  }

  /** May the learner add or remove entries in this folder? /tmp is shared, like a real one. */
  dirWritable(abs: string) {
    const dir = this.node(abs);
    return Boolean(dir && dir.kind === 'dir' && (abs === '/tmp' || this.canWrite(dir)));
  }

  /** Put a node at a path whose parent exists. */
  insert(abs: string, node: FsNode) {
    const parent = this.node(parentOf(abs));
    if (parent?.kind !== 'dir') return;
    parent.children.set(baseName(abs), node);
    this.created.add(abs);
  }

  remove(abs: string) {
    const parent = this.node(parentOf(abs));
    if (parent?.kind === 'dir') parent.children.delete(baseName(abs));
    this.created.delete(abs);
  }

  /** Write a file the way `>` does. Returns a bash-style error, or null. */
  writeFile(abs: string, content: string, append = false, label = abs): string | null {
    const existing = this.node(abs);
    if (existing?.kind === 'dir') return `${label}: Is a directory`;
    if (existing) {
      if (!this.canWrite(existing)) return `${label}: Permission denied`;
      if (existing.kind === 'file') {
        existing.content = append ? existing.content + content : content;
        existing.size = undefined;
      }
      return null;
    }
    const parent = this.node(parentOf(abs));
    if (!parent || parent.kind !== 'dir') return `${label}: No such file or directory`;
    if (!this.dirWritable(parentOf(abs))) return `${label}: Permission denied`;
    this.insert(abs, { kind: 'file', content, mode: 0o644, owner: this.user });
    return null;
  }

  setCwd(abs: string) {
    this.prev = this.cwd;
    this.cwd = abs;
    this.env.OLDPWD = this.prev;
    this.env.PWD = abs;
    this.visited.add(abs);
  }

  spawnPid() {
    return this.nextPid++;
  }

  lookupVar = (name: string): string => {
    if (name === '?') return String(this.lastExit);
    if (name === '$') return '1201';
    return this.vars[name] ?? this.env[name] ?? '';
  };

  prompt(): Line {
    return [
      { text: `${this.user}@${this.host}`, tone: 'prompt' },
      { text: ':' },
      { text: this.displayPath(this.cwd), tone: 'path' },
      { text: '$', tone: 'prompt' },
    ];
  }

  // ── running a line ───────────────────────────────────────────────────

  run(raw: string, options: { usedTab?: boolean } = {}): RunResult {
    const trimmed = raw.trim();
    if (!trimmed) return { lines: [], clear: false, event: null };

    const event = this.newEvent(trimmed, Boolean(options.usedTab));
    const shown: Line[] = [];

    // History expansion: `!!` is the last command, `!n` is command number n.
    let line = trimmed;
    if (/!(!|\d+)/.test(line)) {
      let missing: string | null = null;
      line = line.replace(/!(!|\d+)/g, (match, ref: string) => {
        const entry = ref === '!' ? this.history[this.history.length - 1] : this.history[Number(ref) - 1];
        if (entry === undefined) missing ??= match;
        return entry ?? match;
      });
      if (missing) {
        return this.finish(event, [[{ text: `bash: ${missing}: event not found`, tone: 'error' }]], 1);
      }
      event.historyExpanded = true;
      shown.push([{ text: line }]); // bash prints the expanded command before running it
    }
    this.history.push(line);

    const { line: aliased, used } = expandAliases(line, this.aliases);
    event.expanded = aliased;
    event.aliasUsed = used;

    const result = this.execLine(aliased, event);
    if (result.clear) shown.length = 0;
    shown.push(...result.out.map((o) => o.line));
    return { ...this.finish(event, shown, result.code), clear: Boolean(result.clear), editor: result.editor };
  }

  /** Ctrl+C: abandons the line being typed. Recorded so lessons can check it. */
  interrupt(partial: string): ShellEvent {
    const event = this.newEvent(partial, false);
    event.command = '^C';
    event.expanded = '';
    this.events.push(event);
    return event;
  }

  /** Called when the learner saves in nano. */
  saveFromEditor(abs: string, content: string): string | null {
    const error = this.writeFile(abs, content, false, baseName(abs));
    const event = this.newEvent(`(saved ${baseName(abs)} in nano)`, false);
    event.command = 'nano';
    event.saved = error ? undefined : abs;
    event.ok = !error;
    this.events.push(event);
    return error;
  }

  private newEvent(raw: string, usedTab: boolean): ShellEvent {
    return {
      raw,
      expanded: raw,
      command: '',
      args: [],
      flags: '',
      commands: [],
      pipelines: [],
      cwdBefore: this.cwd,
      cwdAfter: this.cwd,
      ok: true,
      exitCode: 0,
      listed: [],
      listedHidden: false,
      read: [],
      output: '',
      usedTab,
      historyExpanded: false,
    };
  }

  private finish(event: ShellEvent, lines: Line[], code: number): RunResult {
    this.lastExit = code;
    event.exitCode = code;
    event.ok = code === 0;
    event.cwdAfter = this.cwd;
    event.output = lines.map(toText).join('\n');
    const first = event.commands[0];
    if (first) {
      event.command = first.name;
      event.args = first.args;
      event.flags = first.flags;
    }
    this.events.push(event);
    return { lines, clear: false, event };
  }

  /** Run a full line: lists of pipelines joined by `&&` and `;`. */
  private execLine(line: string, event: ShellEvent): ExecResult {
    let items;
    try {
      items = parse(lex(line));
    } catch (error) {
      if (error instanceof ParseError) {
        return { out: [{ line: [{ text: error.message, tone: 'error' }], err: true }], code: 2 };
      }
      throw error;
    }

    const out: Out[] = [];
    let code = 0;
    let clear = false;
    for (let i = 0; i < items.length; i++) {
      if (i > 0 && items[i - 1].then === '&&' && code !== 0) break;
      const result = this.runPipeline(items[i].pipeline, event);
      if (result.clear) {
        out.length = 0;
        clear = true;
      }
      out.push(...result.out);
      code = result.code;
      this.lastExit = code;
      if (result.editor) return { out, code, clear, editor: result.editor };
    }
    return { out, code, clear };
  }

  private runPipeline(pipeline: SimpleCommand[], event: ShellEvent): ExecResult {
    const names: string[] = [];
    let stdin: string | null = null;
    const shown: Out[] = [];
    let code = 0;
    let clear = false;
    let editor: EditorRequest | undefined;

    pipeline.forEach((cmd, index) => {
      const last = index === pipeline.length - 1;
      const result = this.runSimple(cmd, stdin, last, event, names);
      // Errors from every stage reach the screen; only the last stage's output does.
      shown.push(...result.out.filter((o) => o.err));
      if (last && !result.redirected) shown.push(...result.out.filter((o) => !o.err));
      stdin = result.redirected ? '' : linesToText(result.out.filter((o) => !o.err));
      code = result.code;
      if (result.clear) clear = true;
      if (result.editor) editor = result.editor;
    });

    if (names.length) event.pipelines.push(names);
    return { out: shown, code, clear, editor };
  }

  private runSimple(
    cmd: SimpleCommand,
    stdin: string | null,
    isLast: boolean,
    event: ShellEvent,
    names: string[]
  ): ExecResult & { redirected: boolean } {
    const words = cmd.words.flatMap((w) => this.expandWord(w));

    // NAME=value on its own sets a shell variable.
    while (words.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(words[0])) {
      const [name, ...rest] = words.shift()!.split('=');
      this.vars[name] = rest.join('=');
    }
    if (!words.length) return { out: [], code: 0, redirected: false };

    const [name, ...args] = words;
    names.push(name);
    event.commands.push({
      name,
      args,
      flags: args.filter((a) => /^-[A-Za-z]/.test(a)).map((a) => a.slice(1)).join(''),
    });

    // Input redirection.
    for (const r of cmd.redirects.filter((r) => r.op === '<')) {
      const target = this.expandWord(r.target)[0];
      const abs = this.resolve(target);
      const node = this.node(abs);
      if (!node) return redirectError(`bash: ${target}: No such file or directory`);
      if (node.kind === 'dir') return redirectError(`bash: ${target}: Is a directory`);
      if (!this.canRead(node)) return redirectError(`bash: ${target}: Permission denied`);
      stdin = node.content;
      event.read.push(abs);
    }

    const outputRedirects = cmd.redirects.filter((r) => r.op !== '<');
    const tty = isLast && outputRedirects.length === 0;
    const result = this.dispatch(name, args, stdin, tty, event);

    if (!outputRedirects.length) return { ...result, redirected: false };

    // Output redirection: bash creates the file even when there's no output.
    const text = linesToText(result.out.filter((o) => !o.err));
    const errors = result.out.filter((o) => o.err);
    for (const r of outputRedirects) {
      const target = this.expandWord(r.target)[0];
      const error = this.writeFile(this.resolve(target), text, r.op === '>>', target);
      if (error) {
        errors.push({ line: [{ text: `bash: ${error}`, tone: 'error' }], err: true });
        return { out: errors, code: 1, redirected: true };
      }
    }
    return { out: errors, code: result.code, redirected: true, clear: result.clear };
  }

  /** Variables, ~ and wildcards, expanded as the command runs — as bash does. */
  private expandWord(word: WordToken): string[] {
    const expanded = expandParts(word, this.lookupVar);
    const { glob } = expanded;
    let { text, pattern } = expanded;
    if (word.tilde) {
      text = this.home + text.slice(1);
      pattern = this.home.replace(/[*?[\]\\]/g, '\\$&') + pattern.slice(1);
    }
    if (!glob || !hasGlob(pattern)) return [text];
    const matches = this.glob(pattern);
    return matches.length ? matches : [unescapePattern(pattern)];
  }

  /** Expand a pattern like `*.txt` or `docs/*.md` against the file system. */
  private glob(pattern: string): string[] {
    const absolute = pattern.startsWith('/');
    const segments = pattern.split('/').filter(Boolean);
    let candidates: Array<{ abs: string; shown: string }> = [
      { abs: absolute ? '/' : this.cwd, shown: absolute ? '/' : '' },
    ];

    for (const segment of segments) {
      const next: typeof candidates = [];
      for (const { abs, shown } of candidates) {
        const join = (name: string) => (shown === '' ? name : shown.endsWith('/') ? shown + name : `${shown}/${name}`);
        if (!hasGlob(segment)) {
          const name = unescapePattern(segment);
          const target = name === '..' ? parentOf(abs) : name === '.' ? abs : childPath(abs, name);
          if (this.node(target)) next.push({ abs: target, shown: join(name) });
          continue;
        }
        const dir = this.node(abs);
        if (dir?.kind !== 'dir') continue;
        const re = globToRegExp(segment);
        for (const name of sortNames([...dir.children.keys()])) {
          if (re.test(name)) next.push({ abs: childPath(abs, name), shown: join(name) });
        }
      }
      candidates = next;
    }
    return candidates.map((c) => c.shown);
  }

  private dispatch(name: string, args: string[], stdin: string | null, tty: boolean, event: ShellEvent): ExecResult {
    if (name.includes('/')) return this.runScript(name, true, event);
    if ((name === 'bash' || name === 'sh') && args.length) return this.runScript(args[0], false, event);
    return runCommand(this, name, args, stdin, tty, event);
  }

  /**
   * Run a script: `./script.sh` needs execute permission, `bash script.sh`
   * doesn't. Like bash, it runs in a subshell — a `cd` or variable inside the
   * script doesn't change the learner's own terminal.
   */
  private runScript(pathArg: string, needExec: boolean, event: ShellEvent): ExecResult {
    const abs = this.resolve(pathArg);
    const node = this.node(abs);
    const fail = (message: string, code: number): ExecResult => {
      event.exec = { path: abs, ok: false };
      return { out: [{ line: [{ text: message, tone: 'error' }], err: true }], code };
    };
    if (!node) return fail(`bash: ${pathArg}: No such file or directory`, 127);
    if (node.kind === 'dir') return fail(`bash: ${pathArg}: Is a directory`, 126);
    if ((needExec && !this.canExec(node)) || !this.canRead(node)) return fail(`bash: ${pathArg}: Permission denied`, 126);
    if (this.scriptDepth > 3) return fail(`bash: ${pathArg}: too many scripts calling scripts`, 1);

    const saved = { cwd: this.cwd, prev: this.prev, vars: { ...this.vars }, env: { ...this.env } };
    this.scriptDepth++;
    const out: Out[] = [];
    let code = 0;
    try {
      for (const raw of node.content.split('\n')) {
        const line = raw.trim();
        if (!line || line.startsWith('#')) continue;
        const scratch = this.newEvent(line, false);
        const result = this.execLine(line, scratch);
        event.commands.push(...scratch.commands);
        event.read.push(...scratch.read);
        out.push(...result.out);
        code = result.code;
      }
    } finally {
      this.scriptDepth--;
      this.cwd = saved.cwd;
      this.prev = saved.prev;
      this.vars = saved.vars;
      this.env = saved.env;
    }
    event.exec = { path: abs, ok: true };
    return { out, code };
  }

  // ── Tab completion ───────────────────────────────────────────────────

  /**
   * Completes a command name, or a file/folder name relative to the current
   * folder — the same behaviour as pressing Tab twice in bash when several
   * names match.
   */
  complete(input: string): { value: string; options: string[] } {
    const endsWithSpace = /\s$/.test(input);
    const current = endsWithSpace ? '' : (/\S*$/.exec(input)?.[0] ?? '');
    const head = input.slice(0, input.length - current.length);

    // Command position: the first word, or the first word after | && ;
    const before = head.trimEnd();
    if (before === '' || /(\||&&|;)$/.test(before)) {
      const names = [...new Set([...COMMANDS, ...Object.keys(this.aliases)])].sort();
      return finish(head, current, '', names.filter((c) => c.startsWith(current)), (m) => m + ' ');
    }

    const segment = before.split(/\||&&|;/).pop()!.trim();
    const command = segment.split(/\s+/)[0];
    const slash = current.lastIndexOf('/');
    const dirPart = slash >= 0 ? current.slice(0, slash + 1) : '';
    const prefix = current.slice(dirPart.length);
    const dir = this.node(this.resolve(dirPart || '.'));
    if (!dir || dir.kind !== 'dir') return { value: input, options: [] };

    const matches = sortNames([...dir.children.keys()])
      .filter((name) => name.startsWith(prefix))
      .filter((name) => prefix.startsWith('.') || !name.startsWith('.'))
      .filter((name) => command !== 'cd' || dir.children.get(name)!.kind === 'dir');

    return finish(head, prefix, dirPart, matches, (name) =>
      dir.children.get(name)!.kind === 'dir' ? `${name}/` : `${name} `
    );
  }
}

export function linesToText(out: Out[]): string {
  return out.length ? out.map((o) => toText(o.line)).join('\n') + '\n' : '';
}

function redirectError(message: string): ExecResult & { redirected: boolean } {
  return { out: [{ line: [{ text: message, tone: 'error' }], err: true }], code: 1, redirected: false };
}

/**
 * Replace an alias at the start of each command (the first word, and the
 * first word after |, && or ;) with its value. Quoted words are left alone,
 * and an alias isn't expanded inside its own value, as in bash.
 */
export function expandAliases(line: string, aliases: Record<string, string>): { line: string; used?: string } {
  if (!Object.keys(aliases).length) return { line };
  let out = '';
  let used: string | undefined;
  let i = 0;
  let atCommand = true;
  let quote: string | null = null;

  while (i < line.length) {
    const ch = line[i];
    if (quote) {
      out += ch;
      if (ch === quote) quote = null;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      atCommand = false;
      out += ch;
      i++;
      continue;
    }
    if (atCommand && /[A-Za-z0-9_.\-]/.test(ch)) {
      const match = /^[A-Za-z0-9_.\-]+/.exec(line.slice(i))![0];
      const boundary = line[i + match.length];
      if (aliases[match] !== undefined && (boundary === undefined || /[\s|;&]/.test(boundary))) {
        out += aliases[match];
        used ??= match;
      } else {
        out += match;
      }
      i += match.length;
      atCommand = false;
      continue;
    }
    if (ch === '|' || ch === ';' || (ch === '&' && line[i + 1] === '&')) {
      const op = ch === '&' ? '&&' : ch;
      out += op;
      i += op.length;
      atCommand = true;
      continue;
    }
    if (!/\s/.test(ch)) atCommand = false;
    out += ch;
    i++;
  }
  return { line: out, used };
}

function finish(
  head: string,
  prefix: string,
  dirPart: string,
  matches: string[],
  complete: (match: string) => string
): { value: string; options: string[] } {
  if (matches.length === 0) return { value: head + dirPart + prefix, options: [] };
  if (matches.length === 1) return { value: head + dirPart + complete(matches[0]), options: [] };
  let common = matches[0];
  for (const word of matches.slice(1)) while (!word.startsWith(common)) common = common.slice(0, -1);
  return { value: head + dirPart + (common.length > prefix.length ? common : prefix), options: matches };
}
