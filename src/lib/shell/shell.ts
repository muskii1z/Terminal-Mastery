import {
  FsNode,
  FsSeed,
  buildFs,
  getNode,
  parentOf,
  resolvePath,
  sortNames,
} from './fs';

/**
 * A small, safe shell that runs entirely in the browser.
 *
 * It imitates bash on Linux closely enough to learn from: same commands, same
 * error messages, same quirks (silence on success, case-sensitive names). It is
 * deliberately not a full shell — only what the lessons teach is implemented,
 * and anything else gets an honest "command not found".
 */

export type Tone = 'prompt' | 'path' | 'dir' | 'exec' | 'error' | 'muted';
export type Segment = { text: string; tone?: Tone };
export type Line = Segment[];

export interface ShellEvent {
  raw: string;
  command: string;
  args: string[];
  flags: string;
  cwdBefore: string;
  cwdAfter: string;
  ok: boolean;
  /** Folders whose contents this command listed (for `ls`). */
  listed: string[];
  listedHidden: boolean;
  usedTab: boolean;
}

export interface RunResult {
  lines: Line[];
  clear: boolean;
  event: ShellEvent | null;
}

export interface ShellOptions {
  seed: FsSeed;
  user?: string;
  host?: string;
  home?: string;
  startDir?: string;
}

const COMMANDS = ['cat', 'cd', 'clear', 'echo', 'help', 'ls', 'pwd', 'whoami'];

/**
 * Real commands this practice terminal doesn't run. Saying "command not found"
 * for these would teach something false — that they don't exist.
 */
const REAL_BUT_UNSUPPORTED = new Set([
  'apt', 'brew', 'chmod', 'chown', 'code', 'cp', 'curl', 'df', 'du', 'env', 'export',
  'file', 'find', 'git', 'grep', 'gzip', 'head', 'history', 'kill', 'less', 'ln', 'man',
  'mkdir', 'more', 'mv', 'nano', 'node', 'open', 'ping', 'ps', 'python', 'python3', 'rm',
  'rmdir', 'screen', 'sort', 'ssh', 'sudo', 'tail', 'tar', 'tmux', 'top', 'touch', 'tree',
  'uniq', 'unzip', 'vi', 'vim', 'wc', 'wget', 'which', 'zip',
]);

const text = (value: string, tone?: Tone): Line => [{ text: value, tone }];

export class Shell {
  readonly user: string;
  readonly host: string;
  readonly home: string;
  private readonly seed: FsSeed;
  private readonly startDir: string;

  root!: FsNode;
  cwd!: string;
  prev!: string;
  events: ShellEvent[] = [];

  /** Folders the learner has seen inside, plus where they've stood — drives the map. */
  explored = new Set<string>();
  hiddenRevealed = new Set<string>();
  visited = new Set<string>();

  constructor(options: ShellOptions) {
    this.seed = options.seed;
    this.user = options.user ?? 'you';
    this.host = options.host ?? 'terminal-mastery';
    this.home = options.home ?? `/home/${this.user}`;
    this.startDir = options.startDir ?? this.home;
    this.reset();
  }

  reset() {
    this.root = buildFs(this.seed);
    this.cwd = this.startDir;
    this.prev = this.startDir;
    this.events = [];
    this.explored = new Set();
    this.hiddenRevealed = new Set();
    this.visited = new Set([this.startDir]);
  }

  /** `/home/you/projects` → `~/projects` */
  displayPath(abs: string): string {
    if (abs === this.home) return '~';
    if (abs.startsWith(this.home + '/')) return '~' + abs.slice(this.home.length);
    return abs;
  }

  prompt(): Line {
    return [
      { text: `${this.user}@${this.host}`, tone: 'prompt' },
      { text: ':' },
      { text: this.displayPath(this.cwd), tone: 'path' },
      { text: '$', tone: 'prompt' },
    ];
  }

  private resolve(input: string): string {
    return resolvePath(this.cwd, input, this.home);
  }

  run(raw: string, options: { usedTab?: boolean } = {}): RunResult {
    const trimmed = raw.trim();
    if (!trimmed) return { lines: [], clear: false, event: null };

    const tokens = tokenize(trimmed);
    const [command, ...rest] = tokens;
    const cwdBefore = this.cwd;

    const event: ShellEvent = {
      raw: trimmed,
      command,
      args: [],
      flags: '',
      cwdBefore,
      cwdAfter: cwdBefore,
      ok: true,
      listed: [],
      listedHidden: false,
      usedTab: Boolean(options.usedTab),
    };

    let lines: Line[] = [];
    let clear = false;

    switch (command) {
      case 'pwd':
        lines = [text(this.cwd)];
        break;

      case 'ls': {
        const parsed = parseFlags(rest, 'alA1h');
        event.flags = parsed.flags;
        event.args = parsed.args;
        if (parsed.invalid) {
          event.ok = false;
          lines = [
            text(`ls: invalid option -- '${parsed.invalid}'`, 'error'),
            text("Try 'ls --help' for more information.", 'error'),
          ];
          break;
        }
        lines = this.ls(parsed.args, parsed.flags, event);
        break;
      }

      case 'cd':
        event.args = rest;
        lines = this.cd(rest, event);
        break;

      case 'cat':
        event.args = rest;
        lines = this.cat(rest, event);
        break;

      case 'echo':
        event.args = rest;
        lines = [text(rest.join(' '))];
        break;

      case 'whoami':
        lines = [text(this.user)];
        break;

      case 'clear':
        clear = true;
        break;

      case 'help':
        lines = [
          text('This practice terminal understands:', 'muted'),
          text('  pwd            print where you are', 'muted'),
          text('  ls [-a] [-l]   list what is in a folder', 'muted'),
          text('  cd <folder>    move into a folder', 'muted'),
          text('  cat <file>     show what is inside a file', 'muted'),
          text('  clear          clear the screen  (or Ctrl+L)', 'muted'),
          text('Tab completes names. Up and down arrows recall commands.', 'muted'),
        ];
        break;

      default:
        event.ok = false;
        lines = REAL_BUT_UNSUPPORTED.has(command)
          ? [
              text(`${command} is a real command, but this practice terminal doesn’t run it yet.`, 'muted'),
              text('Type help to see what works here.', 'muted'),
            ]
          : [text(`bash: ${command}: command not found`, 'error'), ...mistakeHint(command)];
    }

    event.cwdAfter = this.cwd;
    this.events.push(event);
    return { lines, clear, event };
  }

  private ls(args: string[], flags: string, event: ShellEvent): Line[] {
    const showAll = flags.includes('a');
    const showHidden = showAll || flags.includes('A');
    const long = flags.includes('l');
    const targets = args.length ? args : ['.'];
    const lines: Line[] = [];

    targets.forEach((target, index) => {
      const abs = this.resolve(target);
      const node = getNode(this.root, abs);

      if (!node) {
        event.ok = false;
        lines.push(text(`ls: cannot access '${target}': No such file or directory`, 'error'));
        return;
      }

      if (node.kind === 'file') {
        lines.push(long ? this.longEntry(target, node) : text(target));
        return;
      }

      if (targets.length > 1) {
        if (index > 0) lines.push([]);
        lines.push(text(`${target}:`));
      }

      this.explored.add(abs);
      event.listed.push(abs);
      if (showHidden) {
        this.hiddenRevealed.add(abs);
        event.listedHidden = true;
      }

      let names = sortNames([...node.children.keys()]);
      if (!showHidden) names = names.filter((name) => !name.startsWith('.'));
      const entries: Array<[string, FsNode]> = names.map((name) => [name, node.children.get(name)!]);
      if (showAll) {
        entries.unshift(['..', getNode(this.root, parentOf(abs))!]);
        entries.unshift(['.', node]);
      }

      if (long) {
        lines.push(text(`total ${entries.length * 4}`));
        entries.forEach(([name, child]) => lines.push(this.longEntry(name, child)));
      } else if (entries.length) {
        const row: Line = [];
        entries.forEach(([name, child], i) => {
          if (i > 0) row.push({ text: '  ' });
          row.push({ text: name, tone: toneFor(name, child) });
        });
        lines.push(row);
      }
    });

    return lines;
  }

  private longEntry(name: string, node: FsNode): Line {
    const isDir = node.kind === 'dir';
    const executable = !isDir && name.endsWith('.sh');
    const mode = isDir ? 'drwxr-xr-x' : executable ? '-rwxr-xr-x' : '-rw-r--r--';
    const links = isDir ? 2 + [...node.children.values()].filter((c) => c.kind === 'dir').length : 1;
    const size = isDir ? 4096 : new TextEncoder().encode(node.content).length;
    return [
      {
        text: `${mode} ${String(links).padStart(2)} ${this.user} ${this.user} ${String(size).padStart(5)} ${stamp(name)} `,
      },
      { text: name, tone: toneFor(name, node) },
    ];
  }

  private cd(args: string[], event: ShellEvent): Line[] {
    if (args.length > 1) {
      event.ok = false;
      return [text('bash: cd: too many arguments', 'error')];
    }

    const arg = args[0];
    const goingBack = arg === '-';
    const target = arg === undefined ? this.home : goingBack ? this.prev : this.resolve(arg);
    const node = getNode(this.root, target);

    if (!node) {
      event.ok = false;
      return [text(`bash: cd: ${arg}: No such file or directory`, 'error')];
    }
    if (node.kind !== 'dir') {
      event.ok = false;
      return [text(`bash: cd: ${arg}: Not a directory`, 'error')];
    }

    this.prev = this.cwd;
    this.cwd = target;
    this.visited.add(target);
    // `cd -` prints where it took you; every other successful cd is silent.
    return goingBack ? [text(target)] : [];
  }

  private cat(args: string[], event: ShellEvent): Line[] {
    if (!args.length) {
      return [text('cat needs a file name — for example: cat notes.txt', 'muted')];
    }
    const lines: Line[] = [];
    for (const arg of args) {
      const node = getNode(this.root, this.resolve(arg));
      if (!node) {
        event.ok = false;
        lines.push(text(`cat: ${arg}: No such file or directory`, 'error'));
      } else if (node.kind === 'dir') {
        event.ok = false;
        lines.push(text(`cat: ${arg}: Is a directory`, 'error'));
      } else {
        node.content.replace(/\n$/, '').split('\n').forEach((l) => lines.push(text(l)));
      }
    }
    return lines;
  }

  /**
   * Tab completion: completes a command name, or a file/folder name relative to
   * the current folder. Returns the new input and, when several names match,
   * the candidates to show — the same behaviour as pressing Tab twice in bash.
   */
  complete(input: string): { value: string; options: string[] } {
    const endsWithSpace = /\s$/.test(input);
    const words = input.split(/\s+/).filter((w, i, all) => w || i === all.length - 1);
    const current = endsWithSpace ? '' : words[words.length - 1] ?? '';
    const head = endsWithSpace ? input : input.slice(0, input.length - current.length);

    if (!input.trim() || (words.length === 1 && !endsWithSpace)) {
      const matches = COMMANDS.filter((c) => c.startsWith(current));
      return finish(head, current, '', matches, (m) => m + ' ');
    }

    const command = words[0];
    const slash = current.lastIndexOf('/');
    const dirPart = slash >= 0 ? current.slice(0, slash + 1) : '';
    const prefix = current.slice(dirPart.length);
    const dirAbs = this.resolve(dirPart || '.');
    const dir = getNode(this.root, dirAbs);
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

function finish(
  head: string,
  prefix: string,
  dirPart: string,
  matches: string[],
  complete: (match: string) => string
): { value: string; options: string[] } {
  if (matches.length === 0) return { value: head + dirPart + prefix, options: [] };
  if (matches.length === 1) return { value: head + dirPart + complete(matches[0]), options: [] };
  const common = commonPrefix(matches);
  return { value: head + dirPart + (common.length > prefix.length ? common : prefix), options: matches };
}

function commonPrefix(words: string[]): string {
  let prefix = words[0];
  for (const word of words.slice(1)) {
    while (!word.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

/** Split a command line into words, honouring 'single' and "double" quotes. */
export function tokenize(line: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let quote: string | null = null;
  let hasToken = false;

  for (const ch of line) {
    if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      hasToken = true;
    } else if (/\s/.test(ch)) {
      if (hasToken || current) tokens.push(current);
      current = '';
      hasToken = false;
    } else {
      current += ch;
    }
  }
  if (hasToken || current) tokens.push(current);
  return tokens;
}

function parseFlags(tokens: string[], allowed: string) {
  let flags = '';
  let invalid: string | null = null;
  const args: string[] = [];
  for (const token of tokens) {
    if (token === '--all') flags += 'a';
    else if (token.startsWith('-') && token.length > 1) {
      for (const ch of token.slice(1)) {
        if (!allowed.includes(ch) && !invalid) invalid = ch;
        flags += ch;
      }
    } else args.push(token);
  }
  return { flags, args, invalid };
}

function toneFor(name: string, node: FsNode): Tone | undefined {
  if (node.kind === 'dir') return 'dir';
  if (name.endsWith('.sh')) return 'exec';
  return undefined;
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

/** Explain the classic beginner slips instead of leaving "command not found" bare. */
function mistakeHint(command: string): Line[] {
  if (/^cd\.+/.test(command)) return [text('Put a space between cd and .. — try: cd ..', 'muted')];
  if (/^ls-/.test(command)) return [text(`Put a space before the option — try: ls ${command.slice(2)}`, 'muted')];
  if (COMMANDS.includes(command.toLowerCase())) {
    return [text(`Commands are lowercase — try: ${command.toLowerCase()}`, 'muted')];
  }
  return [text('Type help to see the commands this terminal understands.', 'muted')];
}
