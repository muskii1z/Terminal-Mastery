// Keeps the Supabase project awake.
//
// Supabase pauses free projects after a week without activity, which takes
// sign-in and saved progress offline. Once a day this makes one tiny database
// request (the same public read the site itself makes), which counts as activity.
//
// Runs on Netlify's scheduler; "Run now" in Netlify → Functions triggers it by hand.

export default async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error('keep-alive: Supabase settings are missing');
    return new Response('missing settings', { status: 500 });
  }

  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  const checks = {
    database: `${url}/rest/v1/lesson_progress?select=lesson_id&limit=1`,
    auth: `${url}/auth/v1/health`,
  };

  const results = {};
  for (const [name, endpoint] of Object.entries(checks)) {
    try {
      const response = await fetch(endpoint, { headers, signal: AbortSignal.timeout(10_000) });
      results[name] = response.status;
    } catch (error) {
      results[name] = `unreachable (${error.message})`;
    }
  }

  const healthy = results.database === 200 && results.auth === 200;
  console[healthy ? 'log' : 'error']('keep-alive:', JSON.stringify(results));
  return new Response(JSON.stringify(results), { status: healthy ? 200 : 502 });
};

// Every day at 09:00 UTC.
export const config = { schedule: '0 9 * * *' };
