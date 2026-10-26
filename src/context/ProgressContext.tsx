'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { getSupabase } from '@/lib/supabase/lazy';
import { saveProgress, syncProgress } from '@/lib/supabase/lessonProgress';
import { clearLocal, type SavedLesson } from '@/lessons/saved';
import { useAuth } from './AuthContext';

/**
 * Keeps lesson progress in this browser and in the learner's account in step.
 *
 * - Signing in merges the two, so work done before signing up isn't lost.
 * - While signed in, every change is saved to the account a moment later.
 * - Signing out clears this browser's copy, so the next person starts fresh.
 *
 * The browser copy is always written first, so nothing is lost if the
 * network drops: the next sync uploads it.
 */
interface ProgressContextValue {
  /** Goes up whenever this browser's copy was changed from outside (a sync, a sign-out). */
  syncVersion: number;
  /** True while the first sync after signing in is running. */
  syncing: boolean;
  /** Save one lesson's progress to the account, if signed in. */
  push: (lessonId: string, saved: SavedLesson) => void;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export const useProgress = (): ProgressContextValue => {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within a ProgressProvider');
  return context;
};

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, initialized } = useAuth();
  const [syncVersion, setSyncVersion] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const previousUser = useRef<string | null | undefined>(undefined);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!initialized) return;
    const before = previousUser.current;
    previousUser.current = userId;

    if (userId && userId !== before) {
      setSyncing(true);
      getSupabase()
        .then((supabase) => syncProgress(supabase, userId))
        .catch((error) => console.warn('[progress] could not sync with your account:', error))
        .finally(() => {
          setSyncing(false);
          setSyncVersion((v) => v + 1);
        });
    } else if (!userId && before) {
      clearLocal();
      setSyncVersion((v) => v + 1);
    }
  }, [initialized, userId]);

  const push = useCallback(
    (lessonId: string, saved: SavedLesson) => {
      if (!userId) return;
      clearTimeout(timers.current[lessonId]);
      timers.current[lessonId] = setTimeout(() => {
        getSupabase()
          .then((supabase) => saveProgress(supabase, userId, lessonId, saved))
          .catch((error) => console.warn('[progress] could not save to your account; it will retry next time:', error));
      }, 800);
    },
    [userId]
  );

  return <ProgressContext.Provider value={{ syncVersion, syncing, push }}>{children}</ProgressContext.Provider>;
}
