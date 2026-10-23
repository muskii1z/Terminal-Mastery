import React from 'react';
import { LESSONS } from '@/lessons';
import { COURSE, COURSE_LENGTH } from '@/lessons/summary';
import { AUTHOR } from '@/lib/author';
import { SITE_URL } from '@/lib/site';

/** Course and curriculum markup for search engines. Everything here is true and comes from the lessons. */
export default function StructuredData() {
  const course = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Terminal Mastery: learn the terminal by using it',
    description: `A free, hands-on terminal course: ${COURSE_LENGTH}. Type every command into a practice terminal that checks your work.`,
    url: SITE_URL,
    provider: { '@type': 'Person', name: AUTHOR.name },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `PT${COURSE.hours}H`,
      instructor: { '@type': 'Person', name: AUTHOR.name },
    },
    educationalLevel: 'Beginner',
    timeRequired: `PT${COURSE.hours}H`,
    coursePrerequisites: 'No experience required',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', category: 'Free' },
  };

  const curriculum = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Terminal Mastery lessons',
    numberOfItems: LESSONS.length,
    itemListElement: LESSONS.map((lesson) => ({
      '@type': 'ListItem',
      position: lesson.number,
      name: lesson.title,
      description: lesson.promise,
      url: `${SITE_URL}/lessons/${lesson.id}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(course) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(curriculum) }} />
    </>
  );
}
