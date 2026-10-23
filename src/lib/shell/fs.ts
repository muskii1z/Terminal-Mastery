/**
 * The pretend file system behind the practice terminal.
 *
 * A lesson describes its starting files as a plain nested object: a string is
 * a file (its contents), an object is a folder. That keeps lesson data easy to
 * read and write without knowing anything about the shell. Permissions, owners
 * and sizes default sensibly and can be overridden per path.
 */

export type FsSeed = { [name: string]: FsSeed | string };

export interface FsMeta {
  /** Octal modes by path relative to /, e.g. { 'home/you/run.sh': 0o755 }. */
  modes?: Record<string, number>;
  /** Owner by path. Anything outside the learner's home defaults to root. */
  owners?: Record<string, string>;
  /** Pretend sizes in bytes, for files too big to spell out (videos, logs). */
  sizes?: Record<string, number>;
}

export type FsNode =
  | { kind: 'dir'; children: Map<string, FsNode>; mode: number; owner: string }
  | { kind: 'file'; content: string; mode: number; owner: string; size?: number };

export function buildFs(seed: FsSeed, user: string, meta: FsMeta = {}): FsNode {
  const home = `/home/${user}`;
  const build = (value: FsSeed | string, path: string): FsNode => {
    const rel = path.slice(1);
    const owner =
      meta.owners?.[rel] ?? (path === home || path.startsWith(home + '/') ? user : 'root');
    if (typeof value === 'string') {
      return { kind: 'file', content: value, mode: meta.modes?.[rel] ?? 0o644, owner, size: meta.sizes?.[rel] };
    }
    const children = new Map<string, FsNode>();
    for (const [name, child] of Object.entries(value)) {
      children.set(name, build(child, childPath(path, name)));
    }
    return { kind: 'dir', children, mode: meta.modes?.[rel] ?? 0o755, owner };
  };
  return build(seed, '/');
}

export function cloneNode(node: FsNode, owner: string): FsNode {
  if (node.kind === 'file') return { ...node, owner };
  const children = new Map<string, FsNode>();
  node.children.forEach((child, name) => children.set(name, cloneNode(child, owner)));
  return { kind: 'dir', children, mode: node.mode, owner };
}

export function splitPath(abs: string): string[] {
  return abs.split('/').filter(Boolean);
}

export function joinPath(parts: string[]): string {
  return '/' + parts.join('/');
}

export function childPath(dir: string, name: string): string {
  return dir === '/' ? `/${name}` : `${dir}/${name}`;
}

export function parentOf(abs: string): string {
  const parts = splitPath(abs);
  parts.pop();
  return joinPath(parts);
}

export function baseName(abs: string): string {
  const parts = splitPath(abs);
  return parts[parts.length - 1] ?? '/';
}

/** Turn whatever the learner typed into an absolute path, the way a shell does. */
export function resolvePath(cwd: string, input: string, home: string): string {
  let path = input;
  if (path === '~') path = home;
  else if (path.startsWith('~/')) path = home + path.slice(1);

  const parts = path.startsWith('/') ? [] : splitPath(cwd);
  for (const segment of path.split('/')) {
    if (!segment || segment === '.') continue;
    if (segment === '..') parts.pop();
    else parts.push(segment);
  }
  return joinPath(parts);
}

export function getNode(root: FsNode, abs: string): FsNode | undefined {
  let node: FsNode | undefined = root;
  for (const part of splitPath(abs)) {
    if (!node || node.kind !== 'dir') return undefined;
    node = node.children.get(part);
  }
  return node;
}

/** Size on disk: a file's declared or actual size; a folder's total plus 4K for itself. */
export function sizeOf(node: FsNode): number {
  if (node.kind === 'file') return node.size ?? new TextEncoder().encode(node.content).length;
  let total = 4096;
  node.children.forEach((child) => (total += sizeOf(child)));
  return total;
}

/**
 * Byte order, as `ls` sorts on macOS and on Linux servers (the C locale):
 * hidden dotfiles first, capitals before lowercase. Desktop Linux in some
 * locales mixes dotfiles in alphabetically instead — byte order is the more
 * common case learners will meet, and it keeps hidden files visibly grouped.
 */
export function sortNames(names: string[]): string[] {
  return [...names].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

/** `-rw-r--r--` style permission string. */
export function modeString(node: FsNode): string {
  const bits = ['r', 'w', 'x'];
  let out = node.kind === 'dir' ? 'd' : '-';
  for (let i = 8; i >= 0; i--) out += node.mode & (1 << i) ? bits[(8 - i) % 3] : '-';
  return out;
}

/**
 * Glob matching as bash does it: `*` any run of characters, `?` one character,
 * `[abc]` / `[!abc]` a set. Neither matches a leading dot, so hidden files stay
 * hidden unless the pattern itself starts with one. A backslash escapes the
 * next character (used for parts of the word that were quoted).
 */
export function globToRegExp(pattern: string): RegExp {
  let source = '';
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === '\\' && i + 1 < pattern.length) {
      source += escapeRegExp(pattern[++i]);
    } else if (ch === '*') {
      source += '[^/]*';
    } else if (ch === '?') {
      source += '[^/]';
    } else if (ch === '[') {
      const close = pattern.indexOf(']', i + 2);
      if (close === -1) {
        source += '\\[';
        continue;
      }
      let set = pattern.slice(i + 1, close);
      const negate = set.startsWith('!') || set.startsWith('^');
      if (negate) set = set.slice(1);
      source += `[${negate ? '^' : ''}${set.replace(/\\/g, '\\\\')}]`;
      i = close;
    } else {
      source += escapeRegExp(ch);
    }
  }
  const leadingDotAllowed = pattern.startsWith('.') || pattern.startsWith('\\.');
  return new RegExp(`^${leadingDotAllowed ? '' : '(?!\\.)'}${source}$`);
}

export function hasGlob(pattern: string): boolean {
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === '\\') {
      i++;
      continue;
    }
    if ('*?['.includes(pattern[i])) return true;
  }
  return false;
}

function escapeRegExp(ch: string): string {
  return /[.*+?^${}()|[\]\\/]/.test(ch) ? `\\${ch}` : ch;
}

/** Remove the escaping added for quoted characters. */
export function unescapePattern(pattern: string): string {
  return pattern.replace(/\\(.)/g, '$1');
}
