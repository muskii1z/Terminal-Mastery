import type { SupabaseClient } from '@supabase/supabase-js';

let client: Promise<SupabaseClient> | null = null;

/**
 * The browser's Supabase client, loaded on first use rather than with the
 * page. The library is large and nothing on screen needs it to appear, so
 * pages render first and sign-in state arrives a moment later.
 */
export function getSupabase(): Promise<SupabaseClient> {
  client ??= import('./client').then(({ createClient }) => createClient());
  return client;
}
