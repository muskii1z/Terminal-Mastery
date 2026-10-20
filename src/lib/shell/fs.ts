/**
 * The pretend file system behind the practice terminal.
 *
 * A lesson describes its starting files as a plain nested object: a string is
 * a file (its contents), an object is a folder. That keeps lesson data easy to
 * read and write without knowing anything about the shell.
 */

export type FsSeed = { [name: string]: FsSeed | string };

export type FsNode =
  | { kind: 'dir'; children: Map<string, FsNode> }
  | { kind: 'file'; content: string };

export function buildFs(seed: FsSeed): FsNode {
  const children = new Map<string, FsNode>();
  for (const [name, value] of Object.entries(seed)) {
    children.set(
      name,
      typeof value === 'string' ? { kind: 'file', content: value } : buildFs(value)
    );
  }
  return { kind: 'dir', children };
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

/**
 * Byte order, as `ls` sorts on macOS and on Linux servers (the C locale):
 * hidden dotfiles first, then the rest. Desktop Linux in some locales mixes
 * dotfiles in alphabetically instead — byte order is the more common case
 * learners will meet, and it keeps hidden files visibly grouped.
 */
export function sortNames(names: string[]): string[] {
  return [...names].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}
