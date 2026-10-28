'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase/lazy';
import { forget, identify, track } from '@/lib/analytics/posthog';
import type { User } from '@/types';

/** Quick sign-in options, in the order their buttons appear. */
export type Provider = 'google' | 'github';
const ALL_PROVIDERS: Provider[] = ['google', 'github'];

let enabledProviders: Promise<Provider[]> | null = null;

/**
 * The quick sign-in options actually switched on in Supabase. Asking Supabase,
 * rather than trusting a setting here, means a button never leads to its
 * "provider is not enabled" error page.
 */
export function getEnabledProviders(): Promise<Provider[]> {
  enabledProviders ??= fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`, {
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '' },
  })
    .then((response) => (response.ok ? response.json() : { external: {} }))
    .then((settings: { external?: Record<string, boolean> }) => ALL_PROVIDERS.filter((p) => settings.external?.[p]))
    .catch(() => []);
  return enabledProviders;
}

interface AuthContextValue {
  user: User | null;
  /** False until we know whether someone is signed in. */
  initialized: boolean;
  /** `needsConfirmation` is true when Supabase sent a confirmation email instead of signing in. */
  signUp: (email: string, password: string, next?: string) => Promise<{ error: Error | null; needsConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWith: (provider: Provider, next?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  resendVerification: (email: string, next?: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

function mapUser(user: SupabaseUser): User {
  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? '',
    name: (meta.full_name || meta.name || meta.user_name || '') as string,
    created_at: user.created_at,
    email_confirmed_at: user.email_confirmed_at,
  };
}

/** Where Supabase sends people back to after an email link or a Google/GitHub sign-in. */
const callbackUrl = (next = '/lessons') =>
  `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Never leave the app waiting on a slow or unreachable auth server:
    // after 5 seconds, carry on signed out.
    const timeout = setTimeout(() => setInitialized(true), 5000);
    let unsubscribe = () => {};
    let cancelled = false;

    getSupabase()
      .then(async (supabase) => {
        if (cancelled) return;
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ? mapUser(session.user) : null);
          setInitialized(true);
        });
        unsubscribe = () => data.subscription.unsubscribe();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ? mapUser(session.user) : null);
      })
      .catch((error) => console.warn('[auth] could not restore session; continuing signed out:', error))
      .finally(() => {
        clearTimeout(timeout);
        setInitialized(true);
      });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    user,
    initialized,

    signUp: async (email, password, next) => {
      const supabase = await getSupabase();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: callbackUrl(next) },
      });
      if (!error) track('signed_up', { method: 'email' });
      return { error, needsConfirmation: !error && !data.session };
    },

    signIn: async (email, password) => {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) track('signed_in', { method: 'email' });
      return { error };
    },

    signInWith: async (provider, next) => {
      const supabase = await getSupabase();
      track('sign_in_started', { method: provider });
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: callbackUrl(next) },
      });
      return { error };
    },

    signOut: async () => {
      const supabase = await getSupabase();
      await supabase.auth.signOut();
      forget();
    },

    resetPassword: async (email) => {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: callbackUrl('/reset-password'),
      });
      return { error };
    },

    resendVerification: async (email, next) => {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: callbackUrl(next) },
      });
      return { error };
    },

    updatePassword: async (password) => {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    },
  };

  // Count a signed-in person once, whichever device they're on.
  useEffect(() => {
    if (user) identify(user.id);
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
