'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSupabase } from '@/lib/supabase/lazy';
import { fetchMyTestimonial, saveMyTestimonial } from '@/lib/supabase/testimonials';
import { track } from '@/lib/analytics/posthog';
import s from './course.module.css';

/** One line from someone who finished: real social proof, with their permission. */
export default function TestimonialForm({ defaultName }: { defaultName: string }) {
  const { user } = useAuth();
  const [quote, setQuote] = useState('');
  const [displayName, setDisplayName] = useState(defaultName);
  const [mayPublish, setMayPublish] = useState(true);
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [hadOne, setHadOne] = useState(false);

  useEffect(() => {
    if (!user) return;
    getSupabase()
      .then(fetchMyTestimonial)
      .then((existing) => {
        if (!existing) return;
        setQuote(existing.quote);
        setDisplayName(existing.displayName);
        setMayPublish(existing.mayPublish);
        setHadOne(true);
      })
      .catch(() => {
        // No saved testimonial to show; the empty form still works.
      });
  }, [user]);

  useEffect(() => {
    setDisplayName((current) => current || defaultName);
  }, [defaultName]);

  if (!user) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!quote.trim()) return;
    setState('saving');
    try {
      const supabase = await getSupabase();
      await saveMyTestimonial(supabase, user.id, { quote, displayName, mayPublish });
      track('testimonial_submitted', { may_publish: mayPublish, edited: hadOne });
      setHadOne(true);
      setState('saved');
    } catch {
      setState('error');
    }
  };

  return (
    <section className={s.section} aria-labelledby="testimonial-title">
      <h2 id="testimonial-title" className={s.sectionTitle}>
        What would you tell a friend?
      </h2>
      <p className={s.sectionLede}>
        A sentence or two about the course. It helps the next person decide to start, and it tells me what to make better.
      </p>

      {state === 'saved' ? (
        <div className={s.thanks} role="status">
          <p>
            <strong>Thank you.</strong> {mayPublish ? 'It may appear on the site with your name.' : 'It stays private.'}
          </p>
          <button type="button" className={s.secondary} onClick={() => setState('idle')}>
            Edit it
          </button>
        </div>
      ) : (
        <form className={s.testimonial} onSubmit={submit}>
          <div className={s.field}>
            <label htmlFor="testimonial-quote">Your words</label>
            <textarea
              id="testimonial-quote"
              rows={4}
              maxLength={1000}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="I finally understand what the commands I copy actually do."
              required
            />
          </div>
          <div className={s.field}>
            <label htmlFor="testimonial-name">Name to show with it</label>
            <input
              id="testimonial-name"
              type="text"
              maxLength={80}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Sam, product designer"
            />
          </div>
          <label className={s.check}>
            <input type="checkbox" checked={mayPublish} onChange={(e) => setMayPublish(e.target.checked)} />
            You can show this on the Terminal Mastery site with my name
          </label>
          {state === 'error' && (
            <p className={s.formError} role="alert">
              That didn’t save. Check your connection and try again.
            </p>
          )}
          <div className={s.actions}>
            <button type="submit" className={s.primary} disabled={state === 'saving' || !quote.trim()}>
              {state === 'saving' ? 'Sending…' : hadOne ? 'Update it' : 'Send it'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
