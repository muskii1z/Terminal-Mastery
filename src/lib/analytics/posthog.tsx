'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type { PostHog } from 'posthog-js';

/**
 * Analytics for the course funnel.
 *
 * The point of this is not pageviews -- it is answering "which lesson do people
 * quit on". Every event below is chosen to make that question answerable.
 *
 * No-ops entirely when NEXT_PUBLIC_POSTHOG_KEY is unset, so local development
 * and forks never send data.
 */

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

let client: PostHog | null = null;
let loading: Promise<void> | null = null;
const queue: Array<[string, Record<string, unknown> | undefined]> = [];

/**
 * Loaded on demand so posthog-js (~100 kB) stays out of the main bundle.
 * The lesson page is the heaviest route in the app and must not carry it.
 * Events fired before the library arrives are queued, not dropped.
 */
function start(): Promise<void> {
  if (!KEY || typeof window === 'undefined') return Promise.resolve();
  if (loading) return loading;

  loading = import('posthog-js').then(({ default: posthog }) => {
    posthog.init(KEY, {
      api_host: HOST,
      capture_pageview: false, // captured manually, so route changes are tracked
      capture_pageleave: true,
      persistence: 'localStorage',
    });
    client = posthog;
    queue.splice(0).forEach(([event, props]) => posthog.capture(event, props));
  }).catch(() => {
    // Analytics must never break the lesson.
  });

  return loading;
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (!KEY || typeof window === 'undefined') return;
  if (!client) {
    queue.push([event, properties]);
    void start();
    return;
  }
  try {
    client.capture(event, properties);
  } catch {
    // Analytics must never break the lesson.
  }
}

const AnalyticsContext = createContext<{ track: typeof track }>({ track });

export const useAnalytics = () => useContext(AnalyticsContext);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    void start();
  }, []);

  useEffect(() => {
    if (!KEY || !pathname) return;
    track('$pageview', { $current_url: window.location.href, pathname });
  }, [pathname]);

  return (
    <AnalyticsContext.Provider value={{ track }}>
      {children}
    </AnalyticsContext.Provider>
  );
}
