import { createClient } from './client';

export interface LessonProgress {
  userId: string;
  lessonsCompleted: string[];
  currentLesson: string | null;
  quizScores: Record<string, number>;
  totalProgress: number; // percentage
  totalLessons: number;
  completedCount: number;
}

export interface LessonCompletion {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string;
}

export interface DatabaseLesson {
  id: string;
  title: string;
  slug: string;
  duration_min: number;
  sort_order: number;
  content_md: string;
}

// Get all lessons from database
export async function getLessons() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .order('sort_order');

  if (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }

  return data as DatabaseLesson[];
}

// Get lesson by ID
export async function getLessonById(lessonId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  if (error) {
    console.error('Error fetching lesson:', error);
    return null;
  }

  return data as DatabaseLesson;
}

// Get user's progress
export async function getProgressForUser(userId: string): Promise<LessonProgress> {
  const supabase = createClient();

  // Get all lessons and completions in parallel
  const [lessonsResult, completionsResult] = await Promise.all([
    supabase.from('lessons').select('id, sort_order').order('sort_order'),
    supabase.from('lesson_completions').select('lesson_id').eq('user_id', userId)
  ]);

  if (lessonsResult.error) {
    console.error('Error fetching lessons:', lessonsResult.error);
    throw lessonsResult.error;
  }

  if (completionsResult.error) {
    console.error('Error fetching completions:', completionsResult.error);
    throw completionsResult.error;
  }

  const allLessons = lessonsResult.data;
  const completions = completionsResult.data;
  const completedLessonIds = completions.map(c => c.lesson_id);

  const totalLessons = allLessons.length;
  const completedCount = completedLessonIds.length;
  const totalProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Find current lesson (next incomplete lesson)
  const nextIncompleteLesson = allLessons.find(lesson =>
    !completedLessonIds.includes(lesson.id)
  );

  return {
    userId,
    lessonsCompleted: completedLessonIds,
    currentLesson: nextIncompleteLesson?.id || null,
    quizScores: {}, // Initialize empty quiz scores object
    totalProgress,
    totalLessons,
    completedCount
  };
}

// Mark a lesson as complete (idempotent)
export async function markLessonComplete(userId: string, lessonId: string): Promise<boolean> {
  const supabase = createClient();

  // Use INSERT with ON CONFLICT to make it idempotent
  const { error } = await supabase
    .from('lesson_completions')
    .upsert(
      { user_id: userId, lesson_id: lessonId },
      { onConflict: 'user_id,lesson_id' }
    );

  if (error) {
    console.error('Error marking lesson complete:', error);
    return false;
  }

  return true;
}

// Check if a specific lesson is completed by user
export async function isLessonCompleted(userId: string, lessonId: string): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('lesson_completions')
    .select('id')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .maybeSingle();

  if (error) {
    console.error('Error checking lesson completion:', error);
    return false;
  }

  return data !== null;
}

// Get next lesson ID based on sort order
export async function getNextLessonId(currentLessonId: string): Promise<string | null> {
  const supabase = createClient();

  // First get the current lesson's sort order
  const { data: currentLesson, error: currentError } = await supabase
    .from('lessons')
    .select('sort_order')
    .eq('id', currentLessonId)
    .single();

  if (currentError || !currentLesson) {
    console.error('Error fetching current lesson:', currentError);
    return null;
  }

  // Find the next lesson by sort order
  const { data: nextLesson, error: nextError } = await supabase
    .from('lessons')
    .select('id')
    .gt('sort_order', currentLesson.sort_order)
    .order('sort_order')
    .limit(1)
    .maybeSingle();

  if (nextError) {
    console.error('Error fetching next lesson:', nextError);
    return null;
  }

  return nextLesson?.id || null;
}

// Get the next incomplete lesson for a user (for Resume functionality)
export async function getNextIncompleteLesson(userId: string): Promise<string | null> {
  const progress = await getProgressForUser(userId);
  return progress.currentLesson;
}

// Reset all progress for a user (for testing or user preference)
export async function resetProgressForUser(userId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('lesson_completions')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error resetting progress:', error);
    return false;
  }

  return true;
}

// Get completion statistics for dashboard/analytics
export async function getCompletionStats(userId: string) {
  const supabase = createClient();

  // Get completions with timestamps
  const { data: completions, error } = await supabase
    .from('lesson_completions')
    .select('lesson_id, completed_at')
    .eq('user_id', userId)
    .order('completed_at');

  if (error) {
    console.error('Error fetching completion stats:', error);
    return null;
  }

  // Calculate streak (lessons completed in consecutive days)
  const today = new Date().toDateString();
  const completionDates = completions.map(c =>
    new Date(c.completed_at).toDateString()
  );

  const uniqueDates = [...new Set(completionDates)].sort();

  return {
    totalCompletions: completions.length,
    completionDates: uniqueDates,
    lastCompletionDate: uniqueDates[uniqueDates.length - 1] || null,
    completedToday: completionDates.includes(today)
  };
}