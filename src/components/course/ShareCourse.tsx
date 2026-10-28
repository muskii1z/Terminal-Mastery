'use client';

import React, { useState } from 'react';
import { LESSONS } from '@/lessons';
import { SITE_URL } from '@/lib/site';
import { track } from '@/lib/analytics/posthog';
import s from './course.module.css';

/**
 * Sharing, at the moment people are proudest. Two routes onto LinkedIn:
 * the certification form on their profile (permanent, and it links back
 * here), and a post. LinkedIn no longer lets sites pre-fill post text, so a
 * ready-made post sits here to copy.
 */
export default function ShareCourse() {
  const [copied, setCopied] = useState(false);
  const now = new Date();

  const certificationUrl =
    'https://www.linkedin.com/profile/add?' +
    new URLSearchParams({
      startTask: 'CERTIFICATION_NAME',
      name: 'Terminal Mastery: Command Line Fundamentals',
      organizationName: 'Terminal Mastery',
      issueYear: String(now.getFullYear()),
      issueMonth: String(now.getMonth() + 1),
      certUrl: SITE_URL,
    }).toString();

  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}`;

  const post = [
    `I just finished Terminal Mastery, a free course where you learn the terminal by typing every command into a practice terminal that checks your work.`,
    ``,
    `${LESSONS.length} lessons, from my first pwd to cleaning up a messy project with grep, pipes, permissions and nano.`,
    ``,
    `If you've been winging it in the terminal, it's worth an afternoon: ${SITE_URL}`,
  ].join('\n');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(post);
      setCopied(true);
      track('linkedin_post_copied');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked: the text is on screen to select by hand.
    }
  };

  return (
    <section className={s.section} aria-labelledby="share-title">
      <h2 id="share-title" className={s.sectionTitle}>
        Put it on LinkedIn
      </h2>
      <p className={s.sectionLede}>
        Add the certificate to your profile so it stays there, then tell people what you learned.
      </p>

      <div className={s.actions}>
        <a
          href={certificationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={s.primary}
          onClick={() => track('linkedin_certification_clicked')}
        >
          Add to your LinkedIn profile
        </a>
      </div>

      <div className={s.post}>
        <p className={s.postLabel}>A post you can use, or make your own</p>
        <pre className={s.postText}>{post}</pre>
        <div className={s.actions}>
          <button type="button" className={s.secondary} onClick={copy}>
            {copied ? 'Copied' : 'Copy the post'}
          </button>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={s.secondary}
            onClick={() => track('linkedin_share_clicked')}
          >
            Share on LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
