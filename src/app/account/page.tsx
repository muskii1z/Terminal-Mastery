'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useProgress } from '@/context/ProgressContext';
import CourseTopbar from '@/components/course/CourseTopbar';
import { LESSONS } from '@/lessons';
import { readStatuses, type LessonStatus } from '@/lessons/progress';
import s from '@/components/course/course.module.css';

export default function AccountPage() {
  const { user, initialized, signOut, resetPassword } = useAuth();
  const { syncVersion, syncing } = useProgress();
  const router = useRouter();
  const [statuses, setStatuses] = useState<Record<string, LessonStatus>>({});
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (initialized && !user) router.replace('/login?next=/account');
  }, [initialized, user, router]);

  useEffect(() => setStatuses(readStatuses()), [syncVersion]);

  if (!initialized || !user) return null;

  const finished = LESSONS.filter((l) => statuses[l.id]?.kind === 'done').length;
  const next = LESSONS.find((l) => statuses[l.id]?.kind === 'started') ?? LESSONS.find((l) => statuses[l.id]?.kind !== 'done');

  return (
    <div className={s.root}>
      <CourseTopbar />
      <main className={s.page}>
        <section className={s.hero}>
          <p className={s.meta}>your account</p>
          <h1 className={s.title}>{user.name || user.email}</h1>
          {user.name && <p className={s.lede}>{user.email}</p>}

          <div className={s.overall} aria-label={`${finished} of ${LESSONS.length} lessons done`}>
            <div className={s.blocks} aria-hidden="true">
              {LESSONS.map((l) => (
                <span key={l.id} className={s.block} data-state={statuses[l.id]?.kind ?? 'new'} />
              ))}
            </div>
            <span>
              {syncing ? 'Syncing your progress…' : `${finished} of ${LESSONS.length} lessons done`}
            </span>
          </div>

          <div className={s.actions} style={{ marginTop: 28 }}>
            {next ? (
              <Link href={`/lessons/${next.id}`} className={s.primary}>
                {finished || statuses[next.id]?.kind === 'started' ? `Continue: ${next.title}` : 'Start Lesson 1'} →
              </Link>
            ) : (
              <Link href="/completion" className={s.primary}>
                Get your certificate →
              </Link>
            )}
          </div>
        </section>

        <section className={s.section}>
          <h2 className={s.sectionTitle}>Sign-in</h2>
          <p className={s.sectionLede}>
            Your progress is saved to this account, so you can pick up on any device by signing in.
          </p>
          <div className={s.actions}>
            <button
              type="button"
              className={s.secondary}
              disabled={resetSent}
              onClick={async () => {
                const { error } = await resetPassword(user.email);
                if (!error) setResetSent(true);
              }}
            >
              {resetSent ? `Reset link sent to ${user.email}` : 'Change password'}
            </button>
            <button
              type="button"
              className={s.secondary}
              onClick={async () => {
                await signOut();
                router.push('/');
              }}
            >
              Sign out
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
