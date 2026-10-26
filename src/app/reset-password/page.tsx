'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import CourseTopbar from '@/components/course/CourseTopbar';
import course from '@/components/course/course.module.css';
import a from '@/components/auth/auth.module.css';

/**
 * Reached from the reset email: /auth/callback has already signed the person
 * in from the link, so all that's left is choosing the new password.
 */
export default function ResetPasswordPage() {
  const { user, initialized, updatePassword } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) return setError('Use a password of at least 6 characters.');
    if (password !== confirm) return setError('The two passwords don’t match.');
    setBusy(true);
    const { error } = await updatePassword(password);
    setBusy(false);
    if (error) setError(error.message);
    else router.push('/lessons');
  };

  return (
    <div className={course.root}>
      <CourseTopbar />
      <main className={course.page}>
        <div className={course.authStage}>
          {initialized && !user && (
            <div className={a.panel}>
              <h1 className={a.title}>That link has expired</h1>
              <p className={a.lede}>Reset links work once, for a limited time. Ask for a new one and use it straight away.</p>
              <Link href="/login" className={course.primary}>
                Back to sign in
              </Link>
            </div>
          )}
          {initialized && user && (
            <form className={a.panel} onSubmit={submit}>
              <h1 className={a.title}>Choose a new password</h1>
              <p className={a.lede}>For {user.email}.</p>
              <div className={a.form}>
                <label className={a.field}>
                  <span>New password</span>
                  <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <label className={a.field}>
                  <span>Type it again</span>
                  <input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                </label>
                {error && (
                  <p className={a.error} role="alert">
                    {error}
                  </p>
                )}
                <button type="submit" className={a.primary} disabled={busy}>
                  {busy ? 'Saving…' : 'Save new password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
