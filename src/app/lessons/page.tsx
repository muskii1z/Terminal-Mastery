import type { Metadata } from 'next';
import CourseIndex from '@/components/course/CourseIndex';
import { LESSONS, TOTAL_MINUTES } from '@/lessons';

export const metadata: Metadata = {
  title: 'All lessons | Terminal Mastery',
  description: `${LESSONS.length} hands-on lessons, about ${Math.round(TOTAL_MINUTES / 60)} hours in total. Learn the terminal by typing real commands into a practice terminal that checks your work.`,
  alternates: { canonical: '/lessons' },
};

export default function LessonsPage() {
  return <CourseIndex />;
}
