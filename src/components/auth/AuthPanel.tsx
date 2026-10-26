'use client';

import React, { useEffect, useState } from 'react';
import { getEnabledProviders, useAuth, type Provider } from '@/context/AuthContext';
import s from './auth.module.css';

type Mode = 'signup' | 'login' | 'forgot';

interface AuthPanelProps {
  initialMode?: 'signup' | 'login';
  /** Where to land after an email link or a Google/GitHub sign-in. */
  next: string;
  title?: string;
  lede?: React.ReactNode;
  /** An error passed in from the URL, e.g. an expired email link. */
  initialError?: string;
}

const PROVIDER_NAMES: Record<Provider, string> = { google: 'Google', github: 'GitHub' };

/** Turn Supabase's messages into ones that say what to do next. */
function explain(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'That email and password don’t match. Check them, or reset your password.';
  if (m.includes('email not confirmed')) return 'Confirm your email first: click the link we sent you.';
  if (m.includes('already registered') || m.includes('already been registered'))
    return 'There’s already an account with that email. Sign in instead.';
  if (m.includes('rate limit') || m.includes('too many'))
    return 'Too many attempts in a short time. Wait a few minutes, then try again.';
  if (m.includes('password should be at least')) return 'Use a password of at least 6 characters.';
  if (m.includes('unable to validate email') || m.includes('invalid email')) return 'That doesn’t look like an email address.';
  if (m.includes('provider is not enabled') || m.includes('unsupported provider'))
    return 'That sign-in option isn’t switched on yet. Use your email for now.';
  if (m.includes('fetch')) return 'Couldn’t reach the server. Check your connection and try again.';
  return message;
}

export default function AuthPanel({ initialMode = 'signup', next, title, lede, initialError = '' }: AuthPanelProps) {
  const { signUp, signIn, signInWith, resetPassword, resendVerification } = useAuth();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError);
  const [busy, setBusy] = useState(false);
  /** After sign-up or a reset request: an email is on its way. */
  const [sent, setSent] = useState<'confirm' | 'reset' | null>(null);
  const [resent, setResent] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    getEnabledProviders().then(setProviders);
  }, []);

  const switchTo = (next: Mode) => {
    setMode(next);
    setError('');
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'signup') {
        const { error, needsConfirmation } = await signUp(email.trim(), password, next);
        if (error) setError(explain(error.message));
        else if (needsConfirmation) setSent('confirm');
      } else if (mode === 'login') {
        const { error } = await signIn(email.trim(), password);
        if (error) setError(explain(error.message));
      } else {
        const { error } = await resetPassword(email.trim());
        if (error) setError(explain(error.message));
        else setSent('reset');
      }
    } finally {
      setBusy(false);
    }
  };

  const withProvider = async (provider: Provider) => {
    setError('');
    const { error } = await signInWith(provider, next);
    if (error) setError(explain(error.message));
  };

  if (sent) {
    return (
      <div className={s.panel}>
        <h2 className={s.title}>Check your inbox</h2>
        <p className={s.lede}>
          We sent a link to <strong>{email}</strong>.{' '}
          {sent === 'confirm'
            ? 'Click it to confirm your account, and you’ll come straight back here with your progress saved.'
            : 'Click it to choose a new password.'}
        </p>
        <p className={s.small}>Nothing after a minute or two? Check your spam folder.</p>
        <div className={s.row}>
          {sent === 'confirm' && (
            <button
              type="button"
              className={s.secondary}
              disabled={resent}
              onClick={async () => {
                const { error } = await resendVerification(email.trim(), next);
                if (error) setError(explain(error.message));
                else setResent(true);
              }}
            >
              {resent ? 'Sent again' : 'Send it again'}
            </button>
          )}
          <button
            type="button"
            className={s.link}
            onClick={() => {
              setSent(null);
              setResent(false);
            }}
          >
            Use a different email
          </button>
        </div>
        {error && (
          <p className={s.error} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  const heading =
    title ?? (mode === 'signup' ? 'Create your free account' : mode === 'login' ? 'Sign in' : 'Reset your password');

  return (
    <div className={s.panel}>
      <h2 className={s.title}>{heading}</h2>
      {lede && mode !== 'forgot' && <div className={s.lede}>{lede}</div>}
      {mode === 'forgot' && <p className={s.lede}>Enter your email and we’ll send you a link to choose a new one.</p>}

      {mode !== 'forgot' && providers.length > 0 && (
        <>
          <div className={s.providers}>
            {providers.map((provider) => (
              <button key={provider} type="button" className={s.provider} onClick={() => withProvider(provider)}>
                Continue with {PROVIDER_NAMES[provider]}
              </button>
            ))}
          </div>
          <p className={s.or}>
            <span>or with email</span>
          </p>
        </>
      )}

      <form className={s.form} onSubmit={submit} noValidate>
        <label className={s.field}>
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        {mode !== 'forgot' && (
          <label className={s.field}>
            <span className={s.labelRow}>
              Password
              {mode === 'login' && (
                <button type="button" className={s.link} onClick={() => switchTo('forgot')}>
                  Forgot it?
                </button>
              )}
            </span>
            <input
              type="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {mode === 'signup' && <span className={s.small}>At least 6 characters.</span>}
          </label>
        )}

        {error && (
          <p className={s.error} role="alert">
            {error}
          </p>
        )}

        <button type="submit" className={s.primary} disabled={busy}>
          {busy
            ? 'One moment…'
            : mode === 'signup'
              ? 'Create free account'
              : mode === 'login'
                ? 'Sign in'
                : 'Send reset link'}
        </button>
      </form>

      <p className={s.switch}>
        {mode === 'signup' ? (
          <>
            Already have an account?{' '}
            <button type="button" className={s.link} onClick={() => switchTo('login')}>
              Sign in
            </button>
          </>
        ) : (
          <>
            {mode === 'forgot' ? 'Remembered it? ' : 'New here? '}
            <button type="button" className={s.link} onClick={() => switchTo(mode === 'forgot' ? 'login' : 'signup')}>
              {mode === 'forgot' ? 'Sign in' : 'Create a free account'}
            </button>
          </>
        )}
      </p>
    </div>
  );
}
