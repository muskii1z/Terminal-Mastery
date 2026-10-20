/**
 * Single source of truth for the public URL.
 *
 * Set NEXT_PUBLIC_SITE_URL in the deploy environment. Swapping to a custom
 * domain later is a one-line env change, not a code change.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
