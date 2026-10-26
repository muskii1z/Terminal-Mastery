'use client';

import React from 'react';
import Link from 'next/link';
import type { Lesson } from '@/lessons/types';
import AuthPanel from '@/components/auth/AuthPanel';
import s from './workbench.module.css';

/**
 * Shown over lessons 2 onwards to anyone not signed in. Lesson 1 is free to
 * try; from there a free account keeps progress safe and in sync between
 * devices. Anything done in lesson 1 moves into the new account.
 */
export default function AccountWall({ lesson }: { lesson: Lesson }) {
  return (
    <div className={s.wall} role="dialog" aria-modal="true" aria-labelledby="wall-title">
      <div className={s.wallInner}>
        <div className={s.wallIntro}>
          <p className={s.wallEyebrow}>
            Lesson {String(lesson.number).padStart(2, '0')} · {lesson.title}
          </p>
          <h1 id="wall-title" className={s.wallTitle}>
            Keep going with a free account
          </h1>
          <ul className={s.wallList}>
            <li>Your progress saves as you go, task by task</li>
            <li>Pick up on any device, exactly where you left off</li>
            <li>Your name on the certificate when you finish</li>
          </ul>
          <p className={s.wallNote}>
            It’s free, and anything you did in lesson 1 comes with you.{' '}
            <Link href="/lessons/1">Back to lesson 1</Link>
          </p>
        </div>
        <AuthPanel next={`/lessons/${lesson.id}`} title="Create your free account" />
      </div>
    </div>
  );
}
