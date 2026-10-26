'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LESSONS, PARTS, TOTAL_MINUTES } from '@/lessons';
import { readStatuses, type LessonStatus } from '@/lessons/progress';
import CourseTopbar from './CourseTopbar';
import { useAuth } from '@/context/AuthContext';
import { useProgress } from '@/context/ProgressContext';
import s from './course.module.css';

const slug = (part: string) => part.toLowerCase().replace(/\s+/g, '-');
const hours = (minutes: number) => `about ${Math.round(minutes / 60)} hours`;

export default function CourseIndex() {
  const [statuses, setStatuses] = useState<Record<string, LessonStatus> | null>(null);

  const { user, initialized } = useAuth();
  const { syncVersion } = useProgress();
  const signedOut = initialized && !user;

  // Read after the first render (it lives in the browser), and again whenever the account syncs.
  useEffect(() => setStatuses(readStatuses()), [syncVersion]);

  const statusOf = (id: string): LessonStatus => statuses?.[id] ?? { kind: 'new' };
  const finished = LESSONS.filter((l) => statusOf(l.id).kind === 'done').length;
  const anyProgress = LESSONS.some((l) => statusOf(l.id).kind !== 'new');
  // Resume a lesson you've started; otherwise the first one you haven't finished.
  const nextLesson =
    LESSONS.find((l) => statusOf(l.id).kind === 'started') ?? LESSONS.find((l) => statusOf(l.id).kind !== 'done');

  return (
    <div className={s.root}>
      <CourseTopbar />

      <main className={s.page}>
        <section className={s.hero}>
          <p className={s.meta}>
            {LESSONS.length} lessons · {hours(TOTAL_MINUTES)} · free
          </p>
          <h1 className={s.title}>Learn the terminal by using it.</h1>
          <p className={s.lede}>
            Every lesson puts a practice terminal next to the instructions. You type every command yourself, and it
            checks your work as you go. Nothing you do can touch your real computer.
          </p>

          <div className={s.heroActions}>
            {nextLesson ? (
              <Link href={`/lessons/${nextLesson.id}`} className={s.primary}>
                {anyProgress ? (
                  <>
                    Continue: <span className={s.primaryNumber}>{String(nextLesson.number).padStart(2, '0')}</span>{' '}
                    {nextLesson.title}
                  </>
                ) : (
                  'Start with Lesson 1'
                )}
                <span aria-hidden="true"> →</span>
              </Link>
            ) : (
              <Link href="/completion" className={s.primary}>
                You finished the course. See your certificate <span aria-hidden="true">→</span>
              </Link>
            )}

            <div className={s.overall} aria-label={`${finished} of ${LESSONS.length} lessons done`}>
              <div className={s.blocks} aria-hidden="true">
                {LESSONS.map((l) => (
                  <span key={l.id} className={s.block} data-state={statusOf(l.id).kind} />
                ))}
              </div>
              <span>
                {finished} of {LESSONS.length} lessons done
              </span>
            </div>
          </div>
        </section>

        {PARTS.map((part) => {
          const inPart = LESSONS.filter((l) => l.part === part);
          const minutes = inPart.reduce((n, l) => n + l.minutes, 0);
          return (
            <section key={part} className={s.part} aria-labelledby={`part-${slug(part)}`}>
              <div className={s.partHead}>
                <h2 id={`part-${slug(part)}`} className={s.partTitle}>
                  {part}
                </h2>
                <span className={s.partMeta}>
                  {inPart.length} {inPart.length === 1 ? 'lesson' : 'lessons'} · {minutes} min
                </span>
              </div>

              <ol className={s.list}>
                {inPart.map((lesson) => {
                  const status = statusOf(lesson.id);
                  const isNext = lesson.id === nextLesson?.id;
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/lessons/${lesson.id}`}
                        className={s.lesson}
                        data-status={status.kind}
                        data-next={isNext || undefined}
                      >
                        <span className={s.number}>{String(lesson.number).padStart(2, '0')}</span>
                        <span className={s.body}>
                          <span className={s.lessonTitle}>{lesson.title}</span>
                          <span className={s.promise}>{lesson.promise}</span>
                          <span className={s.commands}>
                            {lesson.commands.map((c) => (
                              <code key={c.name} title={c.does}>
                                {c.name}
                              </code>
                            ))}
                          </span>
                        </span>
                        <span className={s.side}>
                          <span className={s.status}>
                            {status.kind === 'done'
                              ? '✓ Done'
                              : status.kind === 'started'
                                ? `${status.done} of ${status.total} tasks`
                                : signedOut && lesson.number > 1
                                  ? `${lesson.minutes} min · free account`
                                  : `${lesson.minutes} min`}
                          </span>
                          <span className={s.go} aria-hidden="true">
                            →
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </main>
    </div>
  );
}
