'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import CourseTopbar from '@/components/course/CourseTopbar';
import AuthPanel from './AuthPanel';
import course from '@/components/course/course.module.css';

/** Only follow `next` within this site. */
const safeNext = (value: string | null) => (value && value.startsWith('/') && !value.startsWith('//') ? value : '/lessons');

function Content({ mode }: { mode: 'signup' | 'login' }) {
  const { user, initialized } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get('next'));

  useEffect(() => {
    if (initialized && user) router.replace(next);
  }, [initialized, user, next, router]);

  return (
    <div className={course.authStage}>
      {initialized && !user && (
        <AuthPanel
          initialMode={mode}
          next={next}
          initialError={params.get('error') ?? ''}
          lede={
            mode === 'signup' ? (
              <p>Save your progress as you go, and pick up on any device. Free, always.</p>
            ) : (
              <p>Welcome back. Your progress is waiting where you left it.</p>
            )
          }
        />
      )}
    </div>
  );
}

export default function AuthPage({ mode }: { mode: 'signup' | 'login' }) {
  return (
    <div className={course.root}>
      <CourseTopbar />
      <main className={course.page}>
        <Suspense>
          <Content mode={mode} />
        </Suspense>
      </main>
    </div>
  );
}
