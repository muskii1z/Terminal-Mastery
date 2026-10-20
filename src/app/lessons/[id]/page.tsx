'use client';

import { useParams } from 'next/navigation';
import { getWorkbenchLesson } from '@/lessons';
import Workbench from '@/components/workbench/Workbench';
import LegacyLesson from './LegacyLesson';

/**
 * Lessons rebuilt for the workbench render there; the rest still use the
 * legacy page until they're migrated, so nothing breaks mid-rebuild.
 */
export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const lesson = getWorkbenchLesson(id);
  return lesson ? <Workbench key={lesson.id} lesson={lesson} /> : <LegacyLesson />;
}
