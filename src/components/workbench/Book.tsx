'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Block, Lesson, Section, Task } from '@/lessons/types';
import Inline from './Inline';
import s from './workbench.module.css';

export type TaskState = 'done' | 'current' | 'pending';

export interface QuizState {
  answers: Record<string, number>;
  submitted: boolean;
}

interface BookProps {
  lesson: Lesson;
  /** Which step is open: 0..sections.length-1 are sections, sections.length is the quiz. */
  step: number;
  onStep: (step: number) => void;
  isTaskDone: (id: string) => boolean;
  /** Furthest step reached; steps with nothing to type count as done once passed. */
  furthestStep: number;
  onManualDone: (id: string) => void;
  tasksLeft: Task[];
  quiz: QuizState;
  onAnswer: (questionId: string, option: number) => void;
  onSubmitQuiz: () => void;
  onRetryQuiz: () => void;
  finished: boolean;
  onFinish: () => void;
}

const pad = (n: number) => String(n).padStart(2, '0');

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 6.2 5 8.6l4.6-5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'p':
      return <p className={s.p}><Inline text={block.text} /></p>;
    case 'list':
      return (
        <ul className={s.list}>
          {block.items.map((item, i) => <li key={i}><Inline text={item} /></li>)}
        </ul>
      );
    case 'example':
      return (
        <pre className={s.example} aria-label={`Example: ${block.command}`}>
          <span className={s.exampleDollar}>$ </span>
          {block.command}
          {block.output && <>{'\n'}<span className={s.exampleOut}>{block.output}</span></>}
        </pre>
      );
    case 'prompt':
      return (
        <pre className={s.example} aria-label="The terminal prompt">
          <span className={s['t-prompt']}>you@terminal-mastery</span>:
          <span className={s['t-path']}>{block.path ?? '~'}</span>
          <span className={s['t-prompt']}>$</span>
        </pre>
      );
    case 'note':
      return (
        <aside className={s.note}>
          <span className={s.noteLabel}>{block.tone === 'platform' ? 'Mac, Windows and Linux' : 'Tip'}</span>
          <p className={s.noteText}><Inline text={block.text} /></p>
        </aside>
      );
  }
}

function TaskRow({ task, state, onManualDone }: { task: Task; state: TaskState; onManualDone: (id: string) => void }) {
  const [showHint, setShowHint] = useState(false);
  const label = state === 'done' ? 'Done' : state === 'current' ? 'Do this now' : 'Not done yet';
  return (
    <li className={s.task} data-state={state}>
      <span className={s.mark} data-state={state} role="img" aria-label={label}>
        {state === 'done' && <CheckIcon />}
      </span>
      <span className={s.taskPrompt}>{task.prompt}</span>
      {state !== 'done' ? (
        <span className={s.taskActions}>
          <button type="button" className={s.hintButton} aria-expanded={showHint} onClick={() => setShowHint((v) => !v)}>
            {showHint ? 'Hide hint' : 'Hint'}
          </button>
          {task.check.kind === 'manual' && (
            <button type="button" className={s.didItButton} onClick={() => onManualDone(task.id)}>
              I did it
            </button>
          )}
        </span>
      ) : (
        <span />
      )}
      {showHint && state !== 'done' && <p className={s.hint}>{task.hint}</p>}
    </li>
  );
}

/** The whole lesson as a row of steps: what's done, where you are, what's left. */
function StepRail({ lesson, step, onStep, isSectionDone, quizDone }: {
  lesson: Lesson;
  step: number;
  onStep: (step: number) => void;
  isSectionDone: (section: Section, index: number) => boolean;
  quizDone: boolean;
}) {
  const items = [
    ...lesson.sections.map((section, i) => ({ label: section.label, title: section.title, done: isSectionDone(section, i) })),
    { label: 'quiz', title: 'Check your understanding', done: quizDone },
  ];
  return (
    <nav className={s.rail} aria-label="Lesson steps">
      <ol className={s.railList}>
        {items.map((item, i) => (
          <li key={i}>
            <button
              type="button"
              className={s.railItem}
              data-done={item.done || undefined}
              aria-current={i === step ? 'step' : undefined}
              title={item.title}
              onClick={() => onStep(i)}
            >
              <span className={s.railNum} aria-hidden="true">{item.done ? '✓' : i + 1}</span>
              <span>{item.label}</span>
              {item.done && <span className="sr-only"> (done)</span>}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function Book(props: BookProps) {
  const { lesson, step, onStep, isTaskDone, furthestStep, onManualDone, tasksLeft, quiz, finished } = props;
  const [quizError, setQuizError] = useState('');
  const [finishMessage, setFinishMessage] = useState('');

  const sectionCount = lesson.sections.length;
  const totalSteps = sectionCount + 1;
  const taskCount = lesson.sections.reduce((n, sec) => n + sec.tasks.length, 0);
  const isSectionDone = (section: Section, index: number) =>
    section.tasks.length ? section.tasks.every((t) => isTaskDone(t.id)) : furthestStep > index;
  const score = lesson.quiz.filter((q) => quiz.answers[q.id] === q.correctAnswer).length;

  const section = step < sectionCount ? lesson.sections[step] : null;
  const firstOpenHere = section?.tasks.find((t) => !isTaskDone(t.id));
  const stepDone = section ? section.tasks.every((t) => isTaskDone(t.id)) : quiz.submitted;
  const nextTitle = step + 1 < sectionCount ? lesson.sections[step + 1].title : 'Quiz';

  const submitQuiz = () => {
    const unanswered = lesson.quiz.filter((q) => quiz.answers[q.id] === undefined).length;
    if (unanswered) {
      setQuizError(`Answer ${unanswered === 1 ? 'the last question' : `the ${unanswered} remaining questions`} first.`);
      return;
    }
    setQuizError('');
    props.onSubmitQuiz();
  };

  const finish = () => {
    if (tasksLeft.length) {
      setFinishMessage(`${tasksLeft.length} ${tasksLeft.length === 1 ? 'task' : 'tasks'} left. Next: ${tasksLeft[0].prompt}.`);
      return;
    }
    if (!quiz.submitted) {
      setFinishMessage('Check your quiz answers first.');
      return;
    }
    setFinishMessage('');
    props.onFinish();
  };

  return (
    <>
      <StepRail lesson={lesson} step={step} onStep={onStep} isSectionDone={isSectionDone} quizDone={quiz.submitted} />

      <div className={s.bookInner} key={step}>
        {step === 0 && (
          <header className={s.lessonHead}>
            <p className={s.lessonEyebrow}>
              Lesson {pad(lesson.number)} · about {lesson.minutes} min · {taskCount} tasks
            </p>
            <h1 className={s.lessonTitle}>{lesson.title}</h1>
            <p className={s.lessonPromise}>{lesson.promise}</p>
          </header>
        )}

        {section ? (
          <article aria-labelledby={`sec-${section.id}`}>
            <p className={s.stepEyebrow}>
              <span className={s.sectionLabel}>{section.label}</span>
              <span className={s.stepCount}>step {step + 1} of {totalSteps}</span>
            </p>
            <h2 id={`sec-${section.id}`} className={s.sectionTitle}>{section.title}</h2>
            {section.blocks.map((block, i) => <BlockView key={i} block={block} />)}

            {section.tasks.length > 0 && (
              <div className={s.yourTurn}>
                <p className={s.yourTurnLabel}>
                  {stepDone
                    ? 'Done'
                    : section.tasks.every((t) => t.check.kind === 'manual')
                      ? 'Your turn, on your own computer'
                      : 'Your turn, in the terminal'}
                </p>
                <ul className={s.tasks} aria-label="Tasks">
                  {section.tasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onManualDone={onManualDone}
                      state={isTaskDone(task.id) ? 'done' : task.id === firstOpenHere?.id ? 'current' : 'pending'}
                    />
                  ))}
                </ul>
              </div>
            )}
          </article>
        ) : (
          <article aria-labelledby="sec-quiz">
            <p className={s.stepEyebrow}>
              <span className={s.sectionLabel}>quiz</span>
              <span className={s.stepCount}>step {step + 1} of {totalSteps}</span>
            </p>
            <h2 id="sec-quiz" className={s.sectionTitle}>Check your understanding</h2>

            {lesson.quiz.map((q, qi) => {
              const chosen = quiz.answers[q.id];
              return (
                <fieldset key={q.id} className={s.quizQuestion}>
                  <legend className={s.quizPrompt}>{qi + 1}. {q.question}</legend>
                  <div className={s.quizOptions} role="radiogroup">
                    {q.options.map((option, oi) => {
                      const result = quiz.submitted
                        ? oi === q.correctAnswer ? 'right' : oi === chosen ? 'wrong' : undefined
                        : undefined;
                      return (
                        <button
                          key={oi}
                          type="button"
                          role="radio"
                          aria-checked={chosen === oi}
                          className={s.option}
                          data-result={result}
                          disabled={quiz.submitted}
                          onClick={() => {
                            props.onAnswer(q.id, oi);
                            setQuizError('');
                          }}
                        >
                          <span className={s.optionKey}>{String.fromCharCode(97 + oi)}</span>
                          <span>{option}</span>
                          {result && (
                            <span className={s.optionVerdict}>
                              {result === 'right' ? (chosen === oi ? 'correct' : 'right answer') : 'your answer'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {quiz.submitted && <p className={s.explanation}>{q.explanation}</p>}
                </fieldset>
              );
            })}

            {quiz.submitted ? (
              <div>
                <p className={s.p}>You got {score} of {lesson.quiz.length} right.</p>
                {score < lesson.quiz.length && (
                  <button type="button" className={s.secondary} onClick={props.onRetryQuiz}>
                    Try the quiz again
                  </button>
                )}
              </div>
            ) : (
              <div>
                <button type="button" className={s.secondary} onClick={submitQuiz}>Check answers</button>
                {quizError && <p className={s.inlineMessage} role="alert">{quizError}</p>}
              </div>
            )}

            <div className={s.finish}>
              {finished ? (
                <>
                  <h2 className={s.finishTitle}>Lesson {pad(lesson.number)} complete</h2>
                  <p className={s.noteText}>
                    You used {lesson.commands.map((c, i) => (
                      <React.Fragment key={c.name}>
                        {i > 0 && (i === lesson.commands.length - 1 ? ' and ' : ', ')}
                        <code className={s.code}>{c.name}</code>
                      </React.Fragment>
                    ))}
                    . Every one of them works the same on your own computer.
                  </p>
                  <div className={s.finishActions}>
                    {lesson.next && (
                      <Link href={`/lessons/${lesson.next.id}`} className={s.primary}>Next: {lesson.next.title}</Link>
                    )}
                    <Link href="/lessons" className={s.secondary}>All lessons</Link>
                  </div>
                </>
              ) : (
                <>
                  <h2 className={s.finishTitle}>Finish the lesson</h2>
                  <p className={s.noteText}>Complete every task and check your quiz answers to finish.</p>
                  <div className={s.finishActions}>
                    <button type="button" className={s.primary} onClick={finish}>Finish lesson</button>
                  </div>
                  {finishMessage && <p className={s.inlineMessage} role="alert">{finishMessage}</p>}
                </>
              )}
            </div>
          </article>
        )}

        <nav className={s.stepNav} aria-label="Step navigation">
          {step > 0 ? (
            <button type="button" className={s.secondary} onClick={() => onStep(step - 1)}>← Back</button>
          ) : (
            <span />
          )}
          {step < totalSteps - 1 && (
            <button
              type="button"
              className={stepDone ? s.primary : s.secondary}
              onClick={() => onStep(step + 1)}
            >
              {stepDone ? `Next: ${nextTitle} →` : 'Skip ahead →'}
            </button>
          )}
        </nav>
      </div>
    </>
  );
}
