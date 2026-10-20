'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Lesson } from '@/lessons/types';
import { Shell, type Line } from '@/lib/shell/shell';
import { isSatisfied } from '@/lib/shell/checks';
import { useAppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { track } from '@/lib/analytics/posthog';
import Book, { type QuizState, type TaskState } from './Book';
import Terminal from './Terminal';
import FsMap from './FsMap';
import s from './workbench.module.css';

const WELCOME: Line[] = [
  [{ text: 'Practice terminal. Nothing you do here touches your real computer.', tone: 'muted' }],
  [{ text: 'Type help to see what it understands.', tone: 'muted' }],
  [],
];

interface Saved {
  done: string[];
  quiz: QuizState;
  finished: boolean;
  step?: number;
}

const storageKey = (id: string) => `tm:lesson:${id}`;

function load(id: string): Saved | null {
  try {
    const raw = localStorage.getItem(storageKey(id));
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

function save(id: string, data: Saved) {
  try {
    localStorage.setItem(storageKey(id), JSON.stringify(data));
  } catch {
    // Storage can be unavailable (private mode). Progress just won't persist.
  }
}

export default function Workbench({ lesson }: { lesson: Lesson }) {
  const shellRef = useRef<Shell | null>(null);
  if (!shellRef.current) shellRef.current = new Shell({ seed: lesson.fs });
  const shell = shellRef.current;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bookRef = useRef<HTMLDivElement | null>(null);
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [version, setVersion] = useState(0);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [quiz, setQuiz] = useState<QuizState>({ answers: {}, submitted: false });
  const [finished, setFinished] = useState(false);
  const [step, setStep] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<'book' | 'machine'>('book');

  const { completeLesson } = useAppContext();
  const { theme, toggleTheme } = useTheme();

  const sectionCount = lesson.sections.length;
  const tasks = useMemo(() => lesson.sections.flatMap((section) => section.tasks), [lesson]);
  const doneRef = useRef(done);
  doneRef.current = done;

  // Restore progress after mount so server and client render the same markup.
  useEffect(() => {
    const saved = load(lesson.id);
    if (saved) {
      const restoredDone = new Set(saved.done);
      setDone(restoredDone);
      setQuiz(saved.quiz);
      setFinished(saved.finished);
      // Resume where they left off, or at the first step with work left.
      const firstOpen = lesson.sections.findIndex((sec) => sec.tasks.some((t) => !restoredDone.has(t.id)));
      setStep(saved.step ?? (firstOpen === -1 ? sectionCount : firstOpen));
    }
    setLoaded(true);
    track('lesson_started', { lesson_id: lesson.id, lesson_title: lesson.title, format: 'workbench' });
  }, [lesson, sectionCount]);

  useEffect(() => {
    if (loaded) save(lesson.id, { done: [...done], quiz, finished, step });
  }, [loaded, lesson.id, done, quiz, finished, step]);

  useEffect(() => {
    bookRef.current?.scrollTo({ top: 0 });
  }, [step]);

  const goToStep = (next: number) => {
    setStep(Math.max(0, Math.min(sectionCount, next)));
  };

  const evaluate = useCallback(() => {
    const newly = tasks.filter((t) => !doneRef.current.has(t.id) && isSatisfied(t.check, shell));
    if (!newly.length) return;
    setDone((prev) => new Set([...prev, ...newly.map((t) => t.id)]));
    newly.forEach((t) => track('task_completed', { lesson_id: lesson.id, task_id: t.id }));
  }, [tasks, shell, lesson.id]);

  const run = (raw: string, usedTab: boolean) => {
    const echo: Line = [...shell.prompt(), { text: raw ? ' ' + raw : '' }];
    const result = shell.run(raw, { usedTab });
    setLines((prev) => (result.clear ? [] : [...prev, echo, ...result.lines]));
    setVersion((v) => v + 1);
    evaluate();
  };

  const reset = () => {
    shell.reset();
    setLines([...WELCOME, [{ text: 'Files reset to how they started.', tone: 'muted' }], []]);
    setVersion((v) => v + 1);
    inputRef.current?.focus();
  };

  // What to do right now is scoped to the step you're looking at.
  const viewedSection = step < sectionCount ? lesson.sections[step] : null;
  const nowTask = viewedSection?.tasks.find((t) => !done.has(t.id));
  const stepDone = viewedSection ? !nowTask : false;
  const tasksLeft = tasks.filter((t) => !done.has(t.id));
  const nextTitle = step + 1 < sectionCount ? lesson.sections[step + 1].title : 'Quiz';

  const blockState = (id: string): TaskState => (done.has(id) ? 'done' : id === nowTask?.id ? 'current' : 'pending');

  const finish = () => {
    setFinished(true);
    completeLesson(lesson.id).catch(() => {});
    track('lesson_completed', { lesson_id: lesson.id, lesson_title: lesson.title, format: 'workbench' });
  };

  const submitQuiz = () => {
    const score = lesson.quiz.filter((q) => quiz.answers[q.id] === q.correctAnswer).length;
    setQuiz((q) => ({ ...q, submitted: true }));
    track('quiz_submitted', { lesson_id: lesson.id, score, total: lesson.quiz.length });
  };

  return (
    <div className={s.root}>
      <header className={s.topbar}>
        <Link href="/lessons" className={s.back}>
          <span aria-hidden="true">←</span> Lessons
        </Link>
        <div className={s.crumb}>
          <span className={s.crumbNumber}>{String(lesson.number).padStart(2, '0')}</span>
          <span className={s.crumbTitle}>{lesson.title}</span>
        </div>
        <div className={s.progress} aria-label={`${done.size} of ${tasks.length} tasks done`}>
          <div className={s.blocks} aria-hidden="true">
            {tasks.map((t) => (
              <div key={t.id} className={s.block} data-state={blockState(t.id)} title={t.prompt} />
            ))}
          </div>
          <span>{done.size} of {tasks.length} tasks</span>
          <button
            type="button"
            className={s.themeButton}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </header>

      <div className={s.tabs} role="tablist" aria-label="Lesson or terminal">
        <button type="button" role="tab" className={s.tab} aria-selected={view === 'book'} onClick={() => setView('book')}>
          Lesson
        </button>
        <button
          type="button"
          role="tab"
          className={s.tab}
          aria-selected={view === 'machine'}
          onClick={() => {
            setView('machine');
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
        >
          Terminal{tasksLeft.length ? ` · ${tasksLeft.length} left` : ''}
        </button>
      </div>

      <main className={s.main} data-view={view}>
        <div className={s.book} ref={bookRef}>
          <Book
            lesson={lesson}
            step={step}
            onStep={goToStep}
            isTaskDone={(id) => done.has(id)}
            tasksLeft={tasksLeft}
            quiz={quiz}
            onAnswer={(id, option) => setQuiz((q) => ({ ...q, answers: { ...q.answers, [id]: option } }))}
            onSubmitQuiz={submitQuiz}
            onRetryQuiz={() => setQuiz({ answers: {}, submitted: false })}
            finished={finished}
            onFinish={finish}
          />
        </div>

        <div className={s.machine}>
          <section className={`${s.panel} ${s.map}`} aria-label="File system map">
            <div className={s.panelHead}>
              <span>map</span>
              <span className={s.mapCaption}>folders appear as you explore</span>
            </div>
            <FsMap shell={shell} version={version} />
          </section>

          <div className={s.now} aria-live="polite">
            {nowTask ? (
              <>
                <span className={s.nowLabel}>now</span>
                <span className={s.nowText}>{nowTask.prompt}</span>
                <span />
              </>
            ) : stepDone ? (
              <>
                <span className={s.nowLabel}>done</span>
                <span className={s.nowText} data-done>Step done.</span>
                <button
                  type="button"
                  className={s.nowNext}
                  onClick={() => {
                    goToStep(step + 1);
                    setView('book');
                  }}
                >
                  Next: {nextTitle} →
                </button>
              </>
            ) : (
              <>
                <span className={s.nowLabel}>{finished ? 'done' : 'quiz'}</span>
                <span className={s.nowText} data-done={finished || undefined}>
                  {finished
                    ? 'Lesson complete.'
                    : tasksLeft.length
                      ? `Answer the quiz. ${tasksLeft.length} ${tasksLeft.length === 1 ? 'task is' : 'tasks are'} still open in earlier steps.`
                      : 'Every task done. Answer the quiz to finish.'}
                </span>
                <span />
              </>
            )}
          </div>

          <Terminal
            shell={shell}
            lines={lines}
            inputRef={inputRef}
            onRun={run}
            onPrint={(extra) => setLines((prev) => [...prev, ...extra])}
            onClear={() => setLines([])}
            onReset={reset}
          />
        </div>
      </main>
    </div>
  );
}
