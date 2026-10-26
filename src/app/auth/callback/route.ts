import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Where Supabase sends people back to after clicking an email link
 * (confirm sign-up, reset password) or signing in with Google or GitHub.
 * Swaps the one-time code for a session cookie, then carries on to `next`.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const nextParam = searchParams.get('next') ?? '/lessons';
  // Only ever redirect within this site.
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/lessons';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  const reason = searchParams.get('error_description') ?? 'That link has expired or was already used.';
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(reason)}&next=${encodeURIComponent(next)}`);
}
