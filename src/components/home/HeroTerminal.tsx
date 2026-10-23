'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Shell, type Line } from '@/lib/shell/shell';
import type { FsSeed } from '@/lib/shell/fs';
import { track } from '@/lib/analytics/posthog';
import Terminal from '@/components/workbench/Terminal';
import s from './home.module.css';

/** A tiny home folder: enough to look around in and read one file. */
const SEED: FsSeed = {
  home: {
    you: {
      'notes.txt':
        'You just read a file without opening an app.\nThat’s lesson 3. Lesson 1 is one click away.\n',
      projects: {
        website: { 'index.html': '<h1>Hello</h1>\n' },
      },
      photos: { 'beach.jpg': '(image data)\n', 'dog.jpg': '(image data)\n' },
    },
  },
  tmp: {},
};

const WELCOME: Line[] = [
  [{ text: 'This terminal is real. Type a command and press Enter, or tap one below.', tone: 'muted' }],
  [],
];

const SUGGESTIONS = ['pwd', 'ls', 'cat notes.txt'];

/** The landing page's proof: a working practice terminal, before any sign-up or click-through. */
export default function HeroTerminal() {
  const shellRef = useRef<Shell | null>(null);
  if (!shellRef.current) shellRef.current = new Shell({ seed: SEED });
  const shell = shellRef.current;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [worked, setWorked] = useState(0);

  const run = (raw: string, usedTab: boolean) => {
    const echo: Line = [...shell.prompt(), { text: raw ? ' ' + raw : '' }];
    const result = shell.run(raw, { usedTab });
    const extra: Line[] = result.editor
      ? [[{ text: 'nano opens a full-screen editor. You’ll use it in lesson 10.', tone: 'muted' }]]
      : [];
    setLines((prev) => (result.clear ? [] : [...prev, echo, ...result.lines, ...extra]));
    if (raw.trim() && result.event?.ok) {
      if (worked === 0) track('hero_terminal_used', { command: result.event.command });
      setWorked((n) => n + 1);
    }
  };

  const reset = () => {
    shell.reset();
    setLines(WELCOME);
    setWorked(0);
  };

  return (
    <div className={s.machine}>
      <div className={s.termWrap}>
        <Terminal
          shell={shell}
          lines={lines}
          inputRef={inputRef}
          onRun={run}
          onPrint={(more) => setLines((prev) => [...prev, ...more])}
          onInterrupt={(partial) => {
            shell.interrupt(partial);
            setLines((prev) => [...prev, [...shell.prompt(), { text: ' ' + partial + '^C' }]]);
          }}
          onReset={reset}
        />
      </div>

      {worked >= 2 ? (
        <p className={s.nudge} aria-live="polite">
          <span>That’s how every lesson works.</span>
          <Link href="/lessons/1" className={s.nudgeLink}>
            Start Lesson 1 →
          </Link>
        </p>
      ) : (
        <div className={s.suggestions} aria-label="Try a command">
          <span className={s.suggestLabel}>try</span>
          {SUGGESTIONS.map((command) => (
            <button
              key={command}
              type="button"
              className={s.suggestion}
              onClick={() => {
                run(command, false);
                inputRef.current?.focus({ preventScroll: true });
              }}
            >
              {command}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
