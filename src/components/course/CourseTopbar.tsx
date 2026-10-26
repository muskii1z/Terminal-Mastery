'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import s from './course.module.css';

/** The top bar on course pages outside a lesson: the name, home link and theme switch. */
export default function CourseTopbar({ children }: { children?: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const { user, initialized } = useAuth();
  return (
    <header className={s.topbar}>
      <Link href="/" className={s.brand}>
        <span className={s.brandMark} aria-hidden="true">&gt;_</span>
        Terminal Mastery
      </Link>
      <div className={s.topbarEnd}>
        {children}
        {initialized && (
          <Link href={user ? '/account' : '/login'} className={s.topbarLink}>
            {user ? 'Account' : 'Sign in'}
          </Link>
        )}
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
  );
}
