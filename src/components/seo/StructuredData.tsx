'use client';

import React from 'react';
import { COURSE, COURSE_LENGTH } from '@/lessons/summary';

const StructuredData: React.FC = () => {
  const courseData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Terminal Mastery: learn the terminal by using it",
    "description": `A free, hands-on terminal course for complete beginners: ${COURSE_LENGTH}. Type every command into a practice terminal that checks your work.`,
    "provider": {
      "@type": "Organization",
      "name": "Terminal Mastery",
      "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "instructor": {
        "@type": "Person",
        "name": "Terminal Mastery Founder"
      }
    },
    "educationalLevel": "Beginner",
    "timeRequired": `PT${COURSE.hours}H`,
    "numberOfCredits": 0,
    "coursePrerequisites": "No experience required",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };

  const curriculumData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Terminal Mastery Curriculum",
    "description": "Complete curriculum for mastering the Linux terminal",
    "numberOfItems": 6,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Navigation",
        "description": "pwd, ls, cd commands"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Files",
        "description": "touch, cp, mv, rm commands"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Viewing",
        "description": "cat, head, tail, less commands"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Search",
        "description": "grep, find commands"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Processes",
        "description": "ps, top, kill commands"
      },
      {
        "@type": "ListItem",
        "position": 6,
        "name": "Pipes & Redirection",
        "description": "|, >, >> operators"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(curriculumData) }}
      />
    </>
  );
};

export default StructuredData;