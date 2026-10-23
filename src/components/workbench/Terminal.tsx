'use client';

import React, { KeyboardEvent, RefObject, useEffect, useRef, useState } from 'react';
import type { Line, Shell } from '@/lib/shell/shell';
import s from './workbench.module.css';

interface TerminalProps {
  shell: Shell;
  lines: Line[];
  inputRef: RefObject<HTMLInputElement | null>;
  onRun: (raw: string, usedTab: boolean) => void;
  onPrint: (lines: Line[]) => void;
  onInterrupt: (partial: string) => void;
  onReset: () => void;
  /** An open editor (nano) takes over the panel, as it takes over a real terminal. */
  editor?: React.ReactNode;
}

export function renderLine(line: Line, key: React.Key) {
  return (
    <div key={key} className={s.termLine}>
      {line.map((segment, i) => (
        <span key={i} className={segment.tone ? s[`t-${segment.tone}`] : undefined}>
          {segment.text}
        </span>
      ))}
    </div>
  );
}

export default function Terminal({ shell, lines, inputRef, onRun, onPrint, onInterrupt, onReset, editor }: TerminalProps) {
  const [value, setValue] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const usedTab = useRef(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [lines, value]);

  const promptLine = shell.prompt();
  const echo = (text: string): Line => [...promptLine, { text: ' ' + text }];

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onRun(value, usedTab.current);
      setValue('');
      setHistoryIndex(null);
      usedTab.current = false;
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      const { value: completed, options } = shell.complete(value);
      if (completed !== value) {
        setValue(completed);
        usedTab.current = true;
      }
      if (options.length > 1) onPrint([echo(value), [{ text: options.join('  '), tone: 'muted' }]]);
      return;
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      const past = shell.events.filter((e) => e.command !== '^C' && !e.raw.startsWith('(saved ')).map((e) => e.raw);
      if (!past.length) return;
      event.preventDefault();
      const start = historyIndex ?? past.length;
      const next = event.key === 'ArrowUp' ? Math.max(0, start - 1) : start + 1;
      if (next >= past.length) {
        setHistoryIndex(null);
        setValue('');
      } else {
        setHistoryIndex(next);
        setValue(past[next]);
      }
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'c') {
      // With text selected, Ctrl+C copies (as in Windows Terminal) rather than cancelling.
      const input = event.currentTarget;
      if (input.selectionStart !== input.selectionEnd) return;
      event.preventDefault();
      onInterrupt(value);
      setValue('');
      setHistoryIndex(null);
      usedTab.current = false;
      return;
    }

    // Ctrl+L behaves exactly like typing `clear`.
    if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      event.preventDefault();
      onRun('clear', false);
    }
  };

  const focusInput = () => {
    if (!window.getSelection()?.toString()) inputRef.current?.focus();
  };

  return (
    <section className={`${s.panel} ${s.terminal}`} aria-label="Practice terminal">
      <div className={s.panelHead}>
        <span>{editor ? 'terminal · nano' : 'terminal'}</span>
        <button type="button" className={s.panelButton} onClick={onReset}>
          Reset files
        </button>
      </div>
      {editor ?? (
      <div className={s.termBody} ref={bodyRef} onClick={focusInput}>
        <div role="log" aria-live="polite">
          {lines.map((line, i) => renderLine(line, i))}
        </div>
        <div className={s.inputRow}>
          <span>
            {promptLine.map((segment, i) => (
              <span key={i} className={segment.tone ? s[`t-${segment.tone}`] : undefined}>
                {segment.text}
              </span>
            ))}
          </span>
          <input
            ref={inputRef}
            className={s.input}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setHistoryIndex(null);
            }}
            onKeyDown={onKeyDown}
            aria-label="Type a command"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      </div>
      )}
    </section>
  );
}
