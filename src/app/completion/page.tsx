'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Certificate from '@/components/ui/Certificate';
import CourseTopbar from '@/components/course/CourseTopbar';
import { LESSONS, TOTAL_MINUTES } from '@/lessons';
import { readStatuses } from '@/lessons/progress';
import { track } from '@/lib/analytics/posthog';
import s from '@/components/course/course.module.css';

const CERTIFICATE_NAME_KEY = 'terminal-mastery-certificate-name';

// Module-scoped so the event fires once per page load, not on every render.
let courseCompletionTracked = false;

export default function CompletionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [finishedAll, setFinishedAll] = useState<boolean | null>(null);
  // No account required, so the name on the certificate is typed here.
  const [name, setName] = useState('');

  useEffect(() => {
    const statuses = readStatuses();
    const all = LESSONS.every((l) => statuses[l.id]?.kind === 'done');
    setFinishedAll(all);
    if (!all) {
      router.replace('/lessons');
      return;
    }
    if (!courseCompletionTracked) {
      courseCompletionTracked = true;
      track('course_completed', { lessons: LESSONS.length });
    }
    try {
      const saved = localStorage.getItem(CERTIFICATE_NAME_KEY);
      setName(saved || user?.email?.split('@')[0] || '');
    } catch {
      // localStorage unavailable; the field just starts empty
    }
  }, [router, user]);

  if (!finishedAll) return null;

  const certificateName = name.trim();

  const changeName = (value: string) => {
    setName(value);
    try {
      localStorage.setItem(CERTIFICATE_NAME_KEY, value);
    } catch {
      // Non-fatal: the name just won't persist across reloads
    }
  };

  // The PDF library is large, so it only loads when someone downloads.
  const downloadCheatSheet = async () => {
    track('cheatsheet_downloaded');
    const { generateCommandCheatSheet } = await import('@/utils/pdfGenerator');
    generateCommandCheatSheet().save('terminal-mastery-cheat-sheet.pdf');
  };

  const downloadCertificate = async () => {
    if (!certificateName) return;
    track('certificate_downloaded');
    const { generateCertificate } = await import('@/utils/pdfGenerator');
    generateCertificate(certificateName).save('terminal-mastery-certificate.pdf');
  };

  return (
    <div className={s.root}>
      <CourseTopbar>
        <Link href="/lessons" className={s.topbarLink}>
          All lessons
        </Link>
      </CourseTopbar>

      <main className={s.page}>
        <section className={s.hero}>
          <p className={s.meta}>
            {LESSONS.length} lessons · about {Math.round(TOTAL_MINUTES / 60)} hours
          </p>
          <h1 className={s.title}>You finished the course.</h1>
          <p className={s.lede}>
            You typed every one of those commands yourself, and the terminal checked each one. Next, open the terminal
            on your own computer for something you’d normally do by clicking: moving files, finding one, checking
            what’s running. That’s how it sticks.
          </p>
          <div className={s.overall}>
            <div className={s.blocks} aria-hidden="true">
              {LESSONS.map((l) => (
                <span key={l.id} className={s.block} data-state="done" />
              ))}
            </div>
            <span>
              {LESSONS.length} of {LESSONS.length} lessons done
            </span>
          </div>
        </section>

        <section className={s.section} aria-labelledby="certificate-title">
          <h2 id="certificate-title" className={s.sectionTitle}>
            Your certificate
          </h2>
          <p className={s.sectionLede}>Add the name you want on it, then download it as a PDF.</p>
          <div className={s.field}>
            <label htmlFor="certificate-name">Name on your certificate</label>
            <input
              id="certificate-name"
              type="text"
              value={name}
              onChange={(e) => changeName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </div>
          <div className={s.certificate}>
            <Certificate studentName={certificateName} studentEmail="" completionDate={new Date()} />
          </div>
          <div className={s.actions}>
            <button type="button" className={s.primary} onClick={downloadCertificate} disabled={!certificateName}>
              {certificateName ? 'Download certificate (PDF)' : 'Add your name to download'}
            </button>
          </div>
        </section>

        <section className={s.section} aria-labelledby="sheet-title">
          <h2 id="sheet-title" className={s.sectionTitle}>
            Your cheat sheet
          </h2>
          <p className={s.sectionLede}>Every command from the course on one page, to keep next to your keyboard.</p>
          <div className={s.sheet}>
            {LESSONS.map((lesson) => (
              <div key={lesson.id} className={s.sheetLesson}>
                <h3>
                  {String(lesson.number).padStart(2, '0')} {lesson.title}
                </h3>
                <ul>
                  {lesson.commands.map((c) => (
                    <li key={c.name}>
                      <code title={c.does}>{c.name}</code>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className={s.actions}>
            <button type="button" className={s.primary} onClick={downloadCheatSheet}>
              Download cheat sheet (PDF)
            </button>
            <Link href="/lessons" className={s.secondary}>
              Review a lesson
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
