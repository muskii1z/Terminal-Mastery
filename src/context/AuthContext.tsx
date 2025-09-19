'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { User, AuthState } from '@/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  signUp: (email: string, password: string) => Promise<{ error: unknown }>;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  signOut: () => Promise<void>;
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
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthState({
        user: session?.user ? mapSupabaseUser(session.user) : null,
        loading: false,
        initialized: true,
      });
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

  const value: AuthContextValue = {
    user: authState.user,
    loading: authState.loading,
    initialized: authState.initialized,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};