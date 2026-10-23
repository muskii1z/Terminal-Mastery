'use client';

import React, { KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import s from './workbench.module.css';

/**
 * A small nano: enough of the real one that the keys learners practise here
 * are the keys that work on a server. Ctrl+O writes (asking for the file name),
 * Ctrl+X exits (asking to save changes), Ctrl+K / Ctrl+U cut and paste lines,
 * Ctrl+C shows where the cursor is or cancels a question.
 *
 * Every shortcut is also a button, for phones and anyone without a Ctrl key.
 */

interface NanoProps {
  /** The file name as nano shows it, e.g. config/settings.conf */
  name: string;
  content: string;
  isNew: boolean;
  /** Write the buffer to a file name (as typed). Returns an error message, or null. */
  onWrite: (name: string, content: string) => string | null;
  onExit: () => void;
}

type Mode = 'edit' | 'write' | 'confirm';

const countLines = (text: string) => (text === '' ? 0 : text.replace(/\n$/, '').split('\n').length);
const plural = (n: number) => `${n} line${n === 1 ? '' : 's'}`;

export default function Nano({ name, content, isNew, onWrite, onExit }: NanoProps) {
  const [text, setText] = useState(content);
  const [fileName, setFileName] = useState(name);
  const [writeName, setWriteName] = useState(name);
  const [dirty, setDirty] = useState(false);
  const [mode, setMode] = useState<Mode>('edit');
  const [exitAfterWrite, setExitAfterWrite] = useState(false);
  const [status, setStatus] = useState<string | null>(isNew ? 'New File' : `Read ${plural(countLines(content))}`);

  const areaRef = useRef<HTMLTextAreaElement>(null);
  const writeRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  const cutBuffer = useRef('');
  const lastWasCut = useRef(false);
  const pendingCaret = useRef<number | null>(0);

  useLayoutEffect(() => {
    const area = areaRef.current;
    if (area && pendingCaret.current !== null) {
      area.setSelectionRange(pendingCaret.current, pendingCaret.current);
      pendingCaret.current = null;
    }
  });

  useEffect(() => {
    if (mode === 'edit') areaRef.current?.focus();
    if (mode === 'write') writeRef.current?.select();
    if (mode === 'confirm') confirmRef.current?.focus();
  }, [mode]);

  const backToEditing = (message: string | null) => {
    setMode('edit');
    setExitAfterWrite(false);
    setStatus(message);
  };

  const startWrite = (thenExit: boolean) => {
    setWriteName(fileName);
    setExitAfterWrite(thenExit);
    setStatus(null);
    setMode('write');
  };

  const write = () => {
    const target = writeName.trim();
    if (!target) return backToEditing('Cancelled');
    // nano always ends a saved file with a newline.
    const body = text === '' || text.endsWith('\n') ? text : text + '\n';
    const error = onWrite(target, body);
    if (error) return backToEditing(`Error writing ${target}: ${error.replace(/^.*: /, '')}`);
    setFileName(target);
    setDirty(false);
    if (exitAfterWrite) return onExit();
    backToEditing(`Wrote ${plural(countLines(body))}`);
  };

  const exit = () => {
    if (!dirty) return onExit();
    setStatus(null);
    setMode('confirm');
  };

  const lineBounds = (caret: number) => {
    const start = text.lastIndexOf('\n', caret - 1) + 1;
    const newline = text.indexOf('\n', caret);
    return { start, end: newline === -1 ? text.length : newline + 1 };
  };

  const cut = () => {
    const caret = areaRef.current?.selectionStart ?? 0;
    const { start, end } = lineBounds(caret);
    let piece = text.slice(start, end);
    if (!piece.endsWith('\n')) piece += '\n';
    // Cutting several lines in a row collects them, so they paste back together.
    cutBuffer.current = lastWasCut.current ? cutBuffer.current + piece : piece;
    lastWasCut.current = true;
    setText(text.slice(0, start) + text.slice(end));
    setDirty(true);
    setStatus(null);
    pendingCaret.current = start;
  };

  const paste = () => {
    lastWasCut.current = false;
    if (!cutBuffer.current) return;
    const caret = areaRef.current?.selectionStart ?? 0;
    const { start } = lineBounds(caret);
    setText(text.slice(0, start) + cutBuffer.current + text.slice(start));
    setDirty(true);
    setStatus(null);
    pendingCaret.current = start + cutBuffer.current.length;
  };

  const showPosition = () => {
    const caret = areaRef.current?.selectionStart ?? 0;
    const lines = text.split('\n');
    const before = text.slice(0, caret).split('\n');
    const line = before.length;
    const col = before[before.length - 1].length + 1;
    const lineLength = (lines[line - 1] ?? '').length + 1;
    const pct = (a: number, b: number) => `${Math.round((a / Math.max(b, 1)) * 100)}%`;
    setStatus(
      `line ${line}/${lines.length} (${pct(line, lines.length)}), col ${col}/${lineLength} (${pct(col, lineLength)}), char ${caret}/${text.length} (${pct(caret, text.length)})`
    );
  };

  const isCtrl = (event: KeyboardEvent, key: string) =>
    event.ctrlKey && !event.metaKey && !event.altKey && event.key.toLowerCase() === key;

  const onEditKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const actions: Record<string, () => void> = {
      o: () => startWrite(false),
      s: () => startWrite(false),
      x: exit,
      k: cut,
      u: paste,
      c: showPosition,
    };
    const key = Object.keys(actions).find((k) => isCtrl(event, k));
    if (key) {
      event.preventDefault();
      actions[key]();
      if (key !== 'k') lastWasCut.current = false;
      return;
    }
    if (!event.ctrlKey && !event.metaKey) {
      lastWasCut.current = false;
      if (status) setStatus(null);
    }
  };

  const onWriteKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      write();
    } else if (event.key === 'Escape' || isCtrl(event, 'c')) {
      event.preventDefault();
      backToEditing('Cancelled');
    }
  };

  const onConfirmKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const key = event.key.toLowerCase();
    if (key === 'y') {
      event.preventDefault();
      startWrite(true);
    } else if (key === 'n') {
      event.preventDefault();
      onExit();
    } else if (event.key === 'Escape' || isCtrl(event, 'c')) {
      event.preventDefault();
      backToEditing('Cancelled');
    }
  };

  const shortcut = (keys: string, label: string, action: () => void) => (
    <button
      type="button"
      className={s.nanoKey}
      onMouseDown={(e) => e.preventDefault()}
      onClick={action}
    >
      <kbd>{keys}</kbd>
      <span>{label}</span>
    </button>
  );

  return (
    <div className={s.nano}>
      <div className={s.nanoTitle}>
        <span>GNU nano 7.2</span>
        <span className={s.nanoFile}>{fileName}</span>
        <span>{dirty ? 'Modified' : ''}</span>
      </div>

      <textarea
        ref={areaRef}
        className={s.nanoText}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setDirty(true);
        }}
        onKeyDown={onEditKey}
        readOnly={mode !== 'edit'}
        aria-label={`Editing ${fileName} in nano`}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />

      <div className={s.nanoStatus} aria-live="polite">
        {mode === 'write' ? (
          <label className={s.nanoAsk}>
            <span>File Name to Write:</span>
            <input
              ref={writeRef}
              value={writeName}
              onChange={(e) => setWriteName(e.target.value)}
              onKeyDown={onWriteKey}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </label>
        ) : mode === 'confirm' ? (
          <div ref={confirmRef} tabIndex={-1} className={s.nanoAsk} onKeyDown={onConfirmKey}>
            <span>Save modified buffer?</span>
          </div>
        ) : status ? (
          <span className={s.nanoMessage}>[ {status} ]</span>
        ) : null}
      </div>

      <div className={s.nanoKeys}>
        {mode === 'write' ? (
          <>
            {shortcut('Enter', 'Save', write)}
            {shortcut('^C', 'Cancel', () => backToEditing('Cancelled'))}
          </>
        ) : mode === 'confirm' ? (
          <>
            {shortcut('Y', 'Yes', () => startWrite(true))}
            {shortcut('N', 'No', onExit)}
            {shortcut('^C', 'Cancel', () => backToEditing('Cancelled'))}
          </>
        ) : (
          <>
            {shortcut('^O', 'Write Out', () => startWrite(false))}
            {shortcut('^X', 'Exit', exit)}
            {shortcut('^K', 'Cut', cut)}
            {shortcut('^U', 'Paste', paste)}
            {shortcut('^C', 'Location', showPosition)}
          </>
        )}
      </div>
    </div>
  );
}
