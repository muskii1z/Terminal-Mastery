import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LESSONS, getWorkbenchLesson } from '@/lessons';
import Workbench from '@/components/workbench/Workbench';

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ id: lesson.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const lesson = getWorkbenchLesson((await params).id);
  if (!lesson) return {};
  return {
    title: `${lesson.number}. ${lesson.title} | Terminal Mastery`,
    description: `${lesson.promise} Covers ${lesson.commands.map((c) => c.name).join(', ')}.`,
    alternates: { canonical: `/lessons/${lesson.id}` },
  };
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const lesson = getWorkbenchLesson((await params).id);
  if (!lesson) notFound();
  return <Workbench key={lesson.id} lesson={lesson} />;
}
