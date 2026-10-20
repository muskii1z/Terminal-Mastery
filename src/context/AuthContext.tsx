'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { User, AuthState } from '@/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  resendVerification: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

function mapSupabaseUser(user: SupabaseUser): User {
  return {
    id: user.id,
    email: user.email!,
    created_at: user.created_at,
    email_confirmed_at: user.email_confirmed_at,
  };
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    initialized: false,
  });

  const supabase = createClient();

  useEffect(() => {
    // Get initial session.
    // Never let a failing/hanging auth backend leave the app stuck on
    // `initialized: false` -- every consumer renders a blocking "Loading..."
    // until this settles, so always resolve, even on error or timeout.
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await Promise.race([
          supabase.auth.getSession(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('auth getSession timed out')), 5000)
          ),
        ]);
        setAuthState({
          user: session?.user ? mapSupabaseUser(session.user) : null,
          loading: false,
          initialized: true,
        });
      } catch (error) {
        console.warn('[auth] could not restore session; continuing signed out:', error);
        setAuthState({ user: null, loading: false, initialized: true });
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState({
          user: session?.user ? mapSupabaseUser(session.user) : null,
          loading: false,
          initialized: true,
        });
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signUp = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setAuthState(prev => ({ ...prev, loading: false }));

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setAuthState(prev => ({ ...prev, loading: false }));

    return { error };
  };

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    await supabase.auth.signOut();
    setAuthState(prev => ({ ...prev, loading: false }));
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    return { error };
  };

  const resendVerification = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    });
    return { error };
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    return { error };
  };

  const value: AuthContextValue = {
    user: authState.user,
    loading: authState.loading,
    initialized: authState.initialized,
    signUp,
    signIn,
    signOut,
    resetPassword,
    resendVerification,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};