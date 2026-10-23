'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { UserProgress } from '@/types';
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from '@/utils';
import { useAuth } from './AuthContext';
import { getProgressForUser, markLessonComplete as markLessonCompleteAPI, resetProgressForUser, LessonProgress } from '@/lib/supabase/progress';
import { LESSONS, type Lesson } from '@/lessons';

interface AppState {
  userProgress: UserProgress;
  lessons: Lesson[];
  currentLesson: Lesson | null;
  isLoading: boolean;
}

type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_PROGRESS'; payload: UserProgress }
  | { type: 'COMPLETE_LESSON'; payload: string }
  | { type: 'SET_CURRENT_LESSON'; payload: string | null }
  | { type: 'UPDATE_QUIZ_SCORE'; payload: { lessonId: string; score: number } }
  | { type: 'RESET_PROGRESS' };

const initialState: AppState = {
  userProgress: {
    userId: undefined,
    lessonsCompleted: [],
    currentLesson: null,
    quizScores: {},
    totalProgress: 0,
  },
  lessons: LESSONS,
  currentLesson: null,
  isLoading: true,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'LOAD_PROGRESS':
      return {
        ...state,
        userProgress: action.payload,
        currentLesson: state.lessons.find(lesson => lesson.id === action.payload.currentLesson) || null,
      };

    case 'COMPLETE_LESSON':
      const updatedLessonsCompleted = [...state.userProgress.lessonsCompleted];
      if (!updatedLessonsCompleted.includes(action.payload)) {
        updatedLessonsCompleted.push(action.payload);
      }
      
      const newProgress = {
        ...state.userProgress,
        lessonsCompleted: updatedLessonsCompleted,
        totalProgress: state.lessons.length
          ? Math.round((updatedLessonsCompleted.length / state.lessons.length) * 100)
          : 0,
      };

      // Save to user-specific key if authenticated
      const completionStorageKey = state.userProgress.userId
        ? `${STORAGE_KEYS.USER_PROGRESS}_${state.userProgress.userId}`
        : STORAGE_KEYS.USER_PROGRESS;
      saveToLocalStorage(completionStorageKey, newProgress);
      
      return {
        ...state,
        userProgress: newProgress,
      };

    case 'SET_CURRENT_LESSON':
      const updatedProgress = {
        ...state.userProgress,
        currentLesson: action.payload,
      };
      
      // Save to user-specific key if authenticated
      const lessonStorageKey = state.userProgress.userId
        ? `${STORAGE_KEYS.USER_PROGRESS}_${state.userProgress.userId}`
        : STORAGE_KEYS.USER_PROGRESS;
      saveToLocalStorage(lessonStorageKey, updatedProgress);
      
      return {
        ...state,
        userProgress: updatedProgress,
        currentLesson: state.lessons.find(lesson => lesson.id === action.payload) || null,
      };

    case 'UPDATE_QUIZ_SCORE':
      const progressWithScore = {
        ...state.userProgress,
        quizScores: {
          ...state.userProgress.quizScores,
          [action.payload.lessonId]: action.payload.score,
        },
      };
      
      // Save to user-specific key if authenticated
      const quizStorageKey = state.userProgress.userId
        ? `${STORAGE_KEYS.USER_PROGRESS}_${state.userProgress.userId}`
        : STORAGE_KEYS.USER_PROGRESS;
      saveToLocalStorage(quizStorageKey, progressWithScore);
      
      return {
        ...state,
        userProgress: progressWithScore,
      };


    case 'RESET_PROGRESS':
      const resetProgress = initialState.userProgress;
      // Save to user-specific key if authenticated
      const resetStorageKey = state.userProgress.userId
        ? `${STORAGE_KEYS.USER_PROGRESS}_${state.userProgress.userId}`
        : STORAGE_KEYS.USER_PROGRESS;
      saveToLocalStorage(resetStorageKey, resetProgress);
      
      return {
        ...state,
        userProgress: resetProgress,
        currentLesson: null,
      };

    default:
      return state;
  }
};

interface AppContextValue extends AppState {
  dispatch: React.Dispatch<AppAction>;
  completeLesson: (lessonId: string) => Promise<void>;
  setCurrentLesson: (lessonId: string | null) => void;
  updateQuizScore: (lessonId: string, score: number) => void;
  resetProgress: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const useAppContext = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user, initialized } = useAuth();

  // Load progress when auth is initialized
  useEffect(() => {
    if (!initialized) return;

    const loadProgress = async () => {
      if (user) {
        try {
          // Load user progress from Supabase
          const progress = await getProgressForUser(user.id);
          // Convert LessonProgress to UserProgress format
          const userProgress: UserProgress = {
            userId: progress.userId,
            lessonsCompleted: progress.lessonsCompleted,
            currentLesson: progress.currentLesson,
            quizScores: {},
            totalProgress: progress.totalProgress,
            totalLessons: progress.totalLessons,
            completedCount: progress.completedCount,
          };
          dispatch({ type: 'LOAD_PROGRESS', payload: userProgress });
        } catch (error) {
          console.error('Error loading user progress:', error);
          // Fallback to localStorage for this session
          const userSpecificKey = `${STORAGE_KEYS.USER_PROGRESS}_${user.id}`;
          const savedProgress = loadFromLocalStorage(userSpecificKey, {
            ...initialState.userProgress,
            userId: user.id,
          });
          dispatch({ type: 'LOAD_PROGRESS', payload: savedProgress });
        }
      } else {
        // Load anonymous progress from localStorage
        const savedProgress = loadFromLocalStorage(STORAGE_KEYS.USER_PROGRESS, initialState.userProgress);
        dispatch({ type: 'LOAD_PROGRESS', payload: savedProgress });
      }

      dispatch({ type: 'SET_LOADING', payload: false });
    };

    loadProgress();
  }, [user, initialized]);

  // Action creators
  const completeLesson = async (lessonId: string) => {
    if (user) {
      try {
        // Mark lesson complete in Supabase
        const success = await markLessonCompleteAPI(user.id, lessonId);
        if (success) {
          // Reload progress to get updated data
          const progress = await getProgressForUser(user.id);
          const userProgress: UserProgress = {
            userId: progress.userId,
            lessonsCompleted: progress.lessonsCompleted,
            currentLesson: progress.currentLesson,
            quizScores: {},
            totalProgress: progress.totalProgress,
            totalLessons: progress.totalLessons,
            completedCount: progress.completedCount,
          };
          dispatch({ type: 'LOAD_PROGRESS', payload: userProgress });
        } else {
          console.error('Failed to mark lesson complete in database');
          // Fallback to local state update
          dispatch({ type: 'COMPLETE_LESSON', payload: lessonId });
        }
      } catch (error) {
        console.error('Error completing lesson:', error);
        // Fallback to local state update
        dispatch({ type: 'COMPLETE_LESSON', payload: lessonId });
      }
    } else {
      // For anonymous users, use local storage
      dispatch({ type: 'COMPLETE_LESSON', payload: lessonId });
    }
  };

  const setCurrentLesson = (lessonId: string | null) => {
    dispatch({ type: 'SET_CURRENT_LESSON', payload: lessonId });
  };

  const updateQuizScore = (lessonId: string, score: number) => {
    dispatch({ type: 'UPDATE_QUIZ_SCORE', payload: { lessonId, score } });
  };


  const resetProgress = async () => {
    if (user) {
      try {
        // Reset progress in Supabase
        const success = await resetProgressForUser(user.id);
        if (success) {
          // Reload progress to get updated data
          const progress = await getProgressForUser(user.id);
          const userProgress: UserProgress = {
            userId: progress.userId,
            lessonsCompleted: progress.lessonsCompleted,
            currentLesson: progress.currentLesson,
            quizScores: {},
            totalProgress: progress.totalProgress,
            totalLessons: progress.totalLessons,
            completedCount: progress.completedCount,
          };
          dispatch({ type: 'LOAD_PROGRESS', payload: userProgress });
        } else {
          console.error('Failed to reset progress in database');
          dispatch({ type: 'RESET_PROGRESS' });
        }
      } catch (error) {
        console.error('Error resetting progress:', error);
        dispatch({ type: 'RESET_PROGRESS' });
      }
    } else {
      // For anonymous users, use local storage
      dispatch({ type: 'RESET_PROGRESS' });
    }
  };

  const contextValue: AppContextValue = {
    ...state,
    dispatch,
    completeLesson,
    setCurrentLesson,
    updateQuizScore,
    resetProgress,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};