import type { SupabaseClient } from '@supabase/supabase-js';

/** One learner's testimonial (`public.testimonials`). See database/2026-10-28-testimonials.sql. */
export interface Testimonial {
  quote: string;
  displayName: string;
  mayPublish: boolean;
}

export async function fetchMyTestimonial(supabase: SupabaseClient): Promise<Testimonial | null> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('quote, display_name, may_publish')
    .maybeSingle();
  if (error) throw error;
  return data ? { quote: data.quote, displayName: data.display_name ?? '', mayPublish: data.may_publish } : null;
}

export async function saveMyTestimonial(supabase: SupabaseClient, userId: string, t: Testimonial) {
  const { error } = await supabase.from('testimonials').upsert(
    {
      user_id: userId,
      quote: t.quote.trim().slice(0, 1000),
      display_name: t.displayName.trim().slice(0, 80) || null,
      may_publish: t.mayPublish,
    },
    { onConflict: 'user_id' }
  );
  if (error) throw error;
}
