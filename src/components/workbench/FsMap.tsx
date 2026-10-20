'use client';

import React, { useEffect, useRef } from 'react';
import type { Shell } from '@/lib/shell/shell';
import { childPath, getNode, parentOf, sortNames } from '@/lib/shell/fs';
import s from './workbench.module.css';

interface Row {
  path: string;
  branch: string;
  name: string;
  kind: 'dir' | 'file';
  current: boolean;
  /** This folder has contents the learner hasn't looked at yet. */
  unexplored: boolean;
}

/**
 * The file system as the learner has discovered it, drawn the way `tree` does.
 *
 * It starts nearly empty: you only see the path to where you're standing.
 * `ls` reveals a folder's contents, `ls -a` its hidden files, and `cd` adds
 * wherever you go. The map is the lesson's mental model made visible.
 */
function buildRows(shell: Shell): Row[] {
  const known = new Set<string>();
  const remember = (abs: string) => {
    for (let p = abs; ; p = parentOf(p)) {
      known.add(p);
      if (p === '/') break;
    }
  };
  remember(shell.cwd);
  shell.visited.forEach(remember);
  shell.explored.forEach(remember);

  const rows: Row[] = [];

  const walk = (abs: string, indent: string) => {
    const node = getNode(shell.root, abs);
    if (!node || node.kind !== 'dir') return;

    const explored = shell.explored.has(abs);
    const showHidden = shell.hiddenRevealed.has(abs);
    const names = sortNames([...node.children.keys()]).filter((name) => {
      if (name.startsWith('.') && !showHidden) return false;
      if (explored) return true;
      const child = node.children.get(name)!;
      return child.kind === 'dir' && known.has(childPath(abs, name));
    });

    names.forEach((name, i) => {
      const last = i === names.length - 1;
      const path = childPath(abs, name);
      const child = node.children.get(name)!;
      const isDir = child.kind === 'dir';
      rows.push({
        path,
        branch: indent + (last ? '└── ' : '├── '),
        name,
        kind: isDir ? 'dir' : 'file',
        current: path === shell.cwd,
        unexplored: isDir && !shell.explored.has(path) && child.children.size > 0,
      });
      if (isDir) walk(path, indent + (last ? '    ' : '│   '));
    });
  };

  const rootNode = getNode(shell.root, '/');
  rows.push({
    path: '/',
    branch: '',
    name: '/',
    kind: 'dir',
    current: shell.cwd === '/',
    unexplored: !shell.explored.has('/') && rootNode?.kind === 'dir' && rootNode.children.size > 0,
  });
  walk('/', '');
  return rows;
}

export default function FsMap({ shell, version }: { shell: Shell; version: number }) {
  const rows = buildRows(shell);
  const seen = useRef<Set<string> | null>(null);
  const currentRef = useRef<HTMLDivElement>(null);

  // Rows that weren't on the map before this command animate in.
  const isFresh = (path: string) => seen.current !== null && !seen.current.has(path);

  useEffect(() => {
    seen.current = new Set(rows.map((r) => r.path));
    currentRef.current?.scrollIntoView({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  return (
    <div className={s.mapBody} aria-label="Map of the files you've found so far">
      {rows.map((row) => (
        <div
          key={row.path}
          ref={row.current ? currentRef : undefined}
          className={s.mapRow}
          data-current={row.current || undefined}
          data-fresh={isFresh(row.path) || undefined}
        >
          <span className={s.mapBranch} aria-hidden="true">{row.branch}</span>
          <span className={row.kind === 'dir' ? s.mapDir : s.mapFile}>
            {row.name === '/' ? '/' : row.kind === 'dir' ? `${row.name}/` : row.name}
          </span>
          {row.unexplored && !row.current && <span className={s.mapMore}> …</span>}
          {row.current && <span className={s.youAreHere}>◂ you are here</span>}
        </div>
      ))}
    </div>
  );
}
