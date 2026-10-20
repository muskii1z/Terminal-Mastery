'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { lessons, getTotalLessons } from '@/data/lessons';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { getNextIncompleteLesson } from '@/lib/supabase/progress';

export default function LessonsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { userProgress } = useAppContext();
  const totalLessons = getTotalLessons();
  const completedLessons = userProgress.lessonsCompleted.length;
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'not-started' | 'in-progress' | 'completed'>('all');
  const [selectedSort, setSelectedSort] = useState<'lesson-order' | 'status' | 'duration'>('lesson-order');

  // Helper function to determine lesson status
  const getLessonStatus = (lessonId: string) => {
    const isCompleted = userProgress.lessonsCompleted.includes(lessonId);
    const isCurrent = userProgress.currentLesson === lessonId;

    if (isCompleted) return 'completed';
    if (isCurrent) return 'in-progress';
    return 'not-started';
  };

  // Resume functionality. Works signed out: falls back to local progress.
  const handleResume = async () => {
    if (user) {
      try {
        const nextLessonId = await getNextIncompleteLesson(user.id);
        router.push(`/lessons/${nextLessonId || '1'}`);
        return;
      } catch (error) {
        console.error('Error finding next lesson:', error);
      }
    }

    const nextLocal = lessons.find(
      lesson => !userProgress.lessonsCompleted.includes(lesson.id)
    );
    router.push(`/lessons/${nextLocal?.id || userProgress.currentLesson || '1'}`);
  };

  // Filtered and sorted lessons
  const filteredLessons = useMemo(() => {
    const filtered = lessons.filter(lesson => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const lessonStatus = getLessonStatus(lesson.id);
      const matchesFilter = selectedFilter === 'all' || lessonStatus === selectedFilter;

      return matchesSearch && matchesFilter;
    });

    // Sort lessons
    filtered.sort((a, b) => {
      switch (selectedSort) {
        case 'status':
          const statusA = getLessonStatus(a.id);
          const statusB = getLessonStatus(b.id);
          const statusOrder = { 'in-progress': 0, 'not-started': 1, 'completed': 2 };
          return statusOrder[statusA] - statusOrder[statusB];

        case 'duration':
          return a.duration - b.duration;

        case 'lesson-order':
        default:
          return parseInt(a.id) - parseInt(b.id);
      }
    });

    return filtered;
  }, [lessons, searchQuery, selectedFilter, selectedSort, userProgress]);

  // Stats for filtered lessons
  const filteredStats = useMemo(() => {
    const total = filteredLessons.length;
    const completed = filteredLessons.filter(lesson =>
      userProgress.lessonsCompleted.includes(lesson.id)
    ).length;
    const inProgress = filteredLessons.filter(lesson =>
      userProgress.currentLesson === lesson.id
    ).length;
    const notStarted = total - completed - inProgress;

    return { total, completed, inProgress, notStarted };
  }, [filteredLessons, userProgress]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // CMD/Ctrl + K to focus search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Escape to clear search
      if (event.key === 'Escape') {
        if (searchQuery) {
          setSearchQuery('');
        }
        // Remove focus from any active element
        (document.activeElement as HTMLElement)?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold theme-text-primary mb-4">
              Terminal Mastery Lessons
            </h1>
            <p className="theme-text-secondary text-lg mb-6 max-w-2xl mx-auto">
              Learn Linux commands step by step. Each lesson takes about 6 minutes and includes hands-on practice.
            </p>
            
            {/* Progress Overview */}
            <div className="max-w-md mx-auto mb-8">
              <div className="clean-card p-6">
                <h3 className="text-lg font-semibold theme-text-primary mb-3">
                  Your Progress
                </h3>
                <div className="progress-bar h-3 mb-2">
                  <div
                    className="progress-fill"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="theme-text-secondary text-sm mb-4">
                  {completedLessons} of {totalLessons} lessons completed ({progressPercentage}%)
                </p>

                {/* Resume Button */}
                {completedLessons > 0 && completedLessons < totalLessons && (
                  <Button
                    onClick={handleResume}
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    Resume Learning
                  </Button>
                )}

                {completedLessons === totalLessons && (
                  <div className="text-center">
                    <div className="text-accent-green font-semibold mb-2">🎉 All lessons completed!</div>
                    <div className="space-y-2">
                      <Button
                        onClick={() => router.push('/completion')}
                        variant="primary"
                        size="sm"
                        className="w-full"
                      >
                        View Your Achievement
                      </Button>
                      <Button
                        onClick={() => router.push('/lessons/1')}
                        variant="secondary"
                        size="sm"
                        className="w-full"
                      >
                        Review Lessons
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8">
            <div className="max-w-4xl mx-auto">
              {/* Search Bar */}
              <div className="mb-6">
                <label htmlFor="lesson-search" className="sr-only">
                  Search lessons
                </label>
                <div className="relative">
                  <input
                    id="lesson-search"
                    type="text"
                    placeholder="Search lessons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-20 py-3 theme-bg-tertiary border theme-border-primary rounded-lg theme-text-primary placeholder:theme-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    aria-label="Search lessons by title or description"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 theme-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="hidden sm:inline-flex text-xs theme-text-muted theme-bg-tertiary px-2 py-1 rounded border theme-border-primary">
                      ⌘K
                    </span>
                  </div>
                </div>
              </div>

              {/* Filter and Sort Controls */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Status Filters */}
                <div className="w-full lg:w-auto">
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                    {[
                      { key: 'all', label: 'All', count: filteredStats.total },
                      { key: 'not-started', label: 'Not Started', count: filteredStats.notStarted },
                      { key: 'in-progress', label: 'In Progress', count: filteredStats.inProgress },
                      { key: 'completed', label: 'Completed', count: filteredStats.completed },
                    ].map(({ key, label, count }) => (
                      <button
                        key={key}
                        onClick={() => setSelectedFilter(key as 'all' | 'not-started' | 'in-progress' | 'completed')}
                        aria-pressed={selectedFilter === key}
                        aria-label={`Filter by ${label} lessons (${count} lessons)`}
                        className={`
                          px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500
                          ${selectedFilter === key
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'theme-bg-tertiary theme-text-secondary hover:theme-bg-tertiary active:theme-bg-tertiary'
                          }
                        `}
                      >
                        <span className="hidden sm:inline">{label}</span>
                        <span className="sm:hidden">{label.split(' ')[0]}</span>
                        <span className="ml-1">({count})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Controls */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label htmlFor="sort-select" className="text-sm theme-text-muted whitespace-nowrap">
                    Sort by:
                  </label>
                  <select
                    id="sort-select"
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value as 'lesson-order' | 'status' | 'duration')}
                    aria-label="Sort lessons by"
                    className="flex-1 sm:flex-none theme-bg-tertiary border theme-border-primary rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                  >
                    <option value="lesson-order">Lesson Order</option>
                    <option value="status">Status</option>
                    <option value="duration">Duration</option>
                  </select>
                </div>
              </div>

              {/* Results Summary */}
              {(searchQuery || selectedFilter !== 'all') && (
                <div className="mt-4 p-3 theme-bg-tertiary rounded-lg">
                  <p className="text-sm theme-text-secondary">
                    Showing {filteredLessons.length} of {lessons.length} lessons
                    {searchQuery && (
                      <span className="ml-1">
                        matching &quot;<span className="text-blue-400">{searchQuery}</span>&quot;
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson, index) => {
                const lessonStatus = getLessonStatus(lesson.id);
                const isCompleted = lessonStatus === 'completed';
                const isInProgress = lessonStatus === 'in-progress';
                const isNotStarted = lessonStatus === 'not-started';
                const isLocked = false; // All lessons are now accessible

                return (
                  <Card key={lesson.id} className={`
                    relative transition-all duration-200
                    ${isInProgress ? 'ring-2 ring-blue-500' : ''}
                    ${isCompleted ? 'ring-1 ring-green-500' : ''}
                  `}>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono theme-text-muted">
                            Lesson {lesson.id}
                          </span>
                          {/* Enhanced Status Badge */}
                          <div className={`
                            px-2 py-1 rounded-full text-xs font-medium
                            ${isCompleted ? 'bg-green-500 text-white' : ''}
                            ${isInProgress ? 'bg-blue-500 text-white' : ''}
                            ${isNotStarted ? 'theme-bg-tertiary theme-text-secondary' : ''}
                          `}>
                            {isCompleted ? 'Done' : isInProgress ? 'Current' : 'New'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Status Icon */}
                          {isCompleted && (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                          {isInProgress && (
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                              </svg>
                            </div>
                          )}
                          <span className="text-sm theme-text-muted">
                            {lesson.duration}m
                          </span>
                        </div>
                      </div>
                      <CardTitle className={isLocked ? 'theme-text-muted' : ''}>
                        {lesson.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className={`text-sm mb-4 ${isLocked ? 'theme-text-muted' : 'theme-text-secondary'}`}>
                        {lesson.description}
                      </p>

                      <div className="flex items-center justify-between">
                        {isLocked ? (
                          <div className="text-sm theme-text-muted">
                            Complete previous lesson to unlock
                          </div>
                        ) : (
                          <Link href={`/lessons/${lesson.id}`} className="inline-block w-full" scroll={false}>
                            <Button
                              size="sm"
                              variant={isCompleted ? 'secondary' : 'primary'}
                              className="w-full"
                            >
                              {isCompleted ? 'Review' : isInProgress ? 'Continue' : 'Start Lesson'}
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              /* Empty State */
              <div className="col-span-full">
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 theme-bg-tertiary rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 theme-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold theme-text-secondary mb-2">No lessons found</h3>
                  <p className="theme-text-muted mb-6">
                    {searchQuery
                      ? `No lessons match "${searchQuery}". Try adjusting your search terms.`
                      : 'No lessons match the selected filters. Try changing your filter selection.'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {searchQuery && (
                      <Button
                        variant="secondary"
                        onClick={() => setSearchQuery('')}
                      >
                        Clear Search
                      </Button>
                    )}
                    {selectedFilter !== 'all' && (
                      <Button
                        variant="secondary"
                        onClick={() => setSelectedFilter('all')}
                      >
                        Show All Lessons
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="clean-card p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold theme-text-primary mb-4">
                Ready to Master the Terminal?
              </h2>
              <p className="theme-text-secondary mb-6">
                Start with the basics and work your way up to advanced commands. 
                Each lesson builds on the previous one.
              </p>
              {completedLessons === 0 ? (
                <Link href="/lessons/1" className="inline-block" scroll={false}>
                  <Button size="lg">
                    Start First Lesson
                  </Button>
                </Link>
              ) : completedLessons < totalLessons ? (
                <Button size="lg" onClick={handleResume}>
                  Continue Learning
                </Button>
              ) : (
                <Link href="/lessons/1" className="inline-block" scroll={false}>
                  <Button size="lg" variant="secondary">
                    Review Lessons
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}