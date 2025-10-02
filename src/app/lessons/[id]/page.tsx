'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { getLessonById, getNextLesson, getPreviousLesson } from '@/data/lessons';
import { useAuth } from '@/context/AuthContext';
import { useAppContext } from '@/context/AppContext';
import { CommandExample, Lesson, PracticeExercise, QuizQuestion } from '@/types';
import MarkdownContent from '@/components/ui/MarkdownContent';
import TerminalBlock from '@/components/ui/TerminalBlock';
import LessonWalkthroughCard from '@/components/ui/LessonWalkthroughCard';

export default function LessonPage() {
  const { user, initialized } = useAuth();
  const { userProgress, completeLesson } = useAppContext();
  const router = useRouter();
  const params = useParams();
  const lessonId = params.id as string;

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Completion state
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const isLessonCompleted = userProgress.lessonsCompleted.includes(lessonId);

  // Stepper state for lesson 2
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [practiceCompleted, setPracticeCompleted] = useState<{[key: number]: boolean}>({});
  const [practiceRevealed, setPracticeRevealed] = useState<{[key: number]: boolean}>({});

  // Helper function to parse summary text with markdown formatting
  const parseSummaryText = (text: string) => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph: string, index: number) => {
      const trimmed = paragraph.trim();
      if (trimmed.startsWith('•')) {
        const bullets = trimmed.split('\n').filter((line: string) => line.trim().startsWith('•'));
        return (
          <ul key={index} className="m-0 mb-4 p-0 list-none">
            {bullets.map((bullet: string, bulletIndex: number) => {
              let content = bullet.replace('•', '').trim();
              // Handle bold text **text**
              content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              // Handle italic text *text*
              content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
              // Handle inline code `code`
              content = content.replace(/`(.*?)`/g, '<code class="theme-bg-tertiary theme-text-primary px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
              return (
                <li key={bulletIndex} className="theme-text-secondary mb-2 text-sm leading-relaxed flex items-start gap-2">
                  <span className="text-green-400 font-bold">✓</span>
                  <span dangerouslySetInnerHTML={{ __html: content }} />
                </li>
              );
            })}
          </ul>
        );
      } else if (trimmed) {
        let content = trimmed;
        // Handle bold text **text**
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Handle italic text *text*
        content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Handle inline code `code`
        content = content.replace(/`(.*?)`/g, '<code class="theme-bg-tertiary theme-text-primary px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
        return (
          <p key={index} className="theme-text-secondary leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: content }} />
        );
      }
      return null;
    });
  };

  // Handler for marking lesson complete
  const handleMarkComplete = async () => {
    if (isMarkingComplete || isLessonCompleted) return;

    setIsMarkingComplete(true);
    try {
      await completeLesson(lessonId);
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    } finally {
      setIsMarkingComplete(false);
    }
  };

  // Stepper navigation functions
  const goToNextStep = () => {
    const lesson = getLessonById(lessonId);
    if (!lesson) return;

    const maxSteps = getStepCount(lesson);
    if (currentStepIndex < maxSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setCompletedSteps(prev => new Set([...prev, currentStepIndex]));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (stepIndex: number) => {
    const lesson = getLessonById(lessonId);
    if (!lesson) return;

    const maxSteps = getStepCount(lesson);
    if (stepIndex >= 0 && stepIndex < maxSteps) {
      setCurrentStepIndex(stepIndex);
    }
  };

  // Get total step count for a lesson
  const getStepCount = (lesson: Lesson) => {
    return 1 + lesson.content.commands.length + 1 + 1 + 1; // intro + commands + practice + quiz + completion
  };

  // Get step title for display
  const getStepTitle = (lesson: Lesson, stepIndex: number) => {
    if (stepIndex === 0) return 'Introduction';
    if (stepIndex <= lesson.content.commands.length) {
      const commandIndex = stepIndex - 1;
      return lesson.content.commands[commandIndex].name;
    }
    if (stepIndex === lesson.content.commands.length + 1) return 'Practice';
    if (stepIndex === lesson.content.commands.length + 2) return 'Quiz';
    if (stepIndex === getStepCount(lesson) - 1) return 'Complete';
    return '';
  };

  // Keyboard navigation for stepper
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft' && currentStepIndex > 0) {
      event.preventDefault();
      goToPreviousStep();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToNextStep();
    }
  }, [currentStepIndex, goToNextStep, goToPreviousStep]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Stepper step renderer functions
  const renderStepperStep = (lesson: Lesson, stepIndex: number) => {
    const totalSteps = getStepCount(lesson);

    if (stepIndex === 0) {
      // Introduction step
      const parseIntroText = (text: string) => {
        return text.split('\n\n').map((paragraph: string, index: number) => {
          let content = paragraph.trim();

          // Handle bold text **text**
          content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

          // Handle italic text *text*
          content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');

          // Handle inline code `code`
          content = content.replace(/`(.*?)`/g, '<code class="theme-bg-tertiary theme-text-primary px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

          return (
            <p key={index} className="theme-text-secondary leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: content }} />
          );
        });
      };

      return (
        <div className="step-content">
          <div className="theme-bg-secondary border theme-border-primary rounded-lg p-6">
            {parseIntroText(lesson.content.introduction)}
          </div>
        </div>
      );
    } else if (stepIndex <= lesson.content.commands.length) {
      // Command steps
      const commandIndex = stepIndex - 1;
      const command = lesson.content.commands[commandIndex];
      return (
        <div className="step-content">
          <div className="theme-bg-secondary border theme-border-primary rounded-lg p-6 mb-6">
            <div className="mb-4 p-4 theme-bg-tertiary border theme-border-primary rounded-lg">
              <h2 className="text-lg font-bold theme-text-primary mb-2">📚 Command You&apos;re Learning:</h2>
              <div className="text-2xl font-mono text-green-400 mb-2">{command.name}</div>
              <p className="theme-text-secondary text-sm">Learn the <code className="theme-bg-secondary px-2 py-1 rounded font-mono theme-text-primary">{command.name}</code> command - {command.description}</p>
            </div>
            <h3 className="text-lg theme-text-primary mb-3 font-semibold">
              What does {command.name} do?
            </h3>
            <p className="theme-text-secondary mb-4 leading-relaxed">
              {command.description}
            </p>

            <TerminalBlock
              command={command.syntax}
              explanation="Command syntax"
              showPrompt={false}
            />

            <div>
              <div className="mb-4 p-3 theme-bg-tertiary border theme-border-primary rounded-lg">
                <h4 className="text-lg font-semibold theme-text-primary mb-2">👀 Let&apos;s see how it works:</h4>
                <p className="theme-text-secondary text-sm">Here are some real examples of the <code className="theme-bg-secondary px-1 rounded font-mono theme-text-primary">{command.name}</code> command in action:</p>
              </div>
              {command.examples.map((example: CommandExample, exampleIndex: number) => (
                <div key={exampleIndex} className="mb-3 last:mb-0">
                  <TerminalBlock
                    command={example.command}
                    output={example.output}
                    explanation={example.explanation}
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 theme-bg-tertiary border theme-border-primary rounded-lg">
              <h4 className="text-lg font-bold theme-text-primary mb-3">🎯 Your Turn! Time to Practice</h4>
              <p className="theme-text-secondary leading-relaxed mb-3">
                Now try the <code className="theme-bg-secondary px-1 rounded font-mono theme-text-primary">{command.name}</code> command yourself. Open your terminal and run these commands:
              </p>
              <div className="space-y-3">
                <TerminalBlock
                  command={command.examples[0].command}
                  explanation="👆 Try this first command"
                />
                {command.examples.length > 1 && (
                  <TerminalBlock
                    command={command.examples[1]?.command}
                    explanation="👆 Then try this one to see the difference"
                  />
                )}
              </div>
              <p className="theme-text-secondary text-sm mt-3">
                💪 Don&apos;t worry if it feels strange at first - that&apos;s normal! Practice makes it easier.
              </p>
            </div>
          </div>
        </div>
      );
    } else if (stepIndex === lesson.content.commands.length + 1) {
      // Practice step
      return (
        <div className="step-content">
          <div className="mb-6 p-4 theme-bg-tertiary border theme-border-primary rounded-lg">
            <h2 className="text-xl font-bold theme-text-primary mb-2">🔥 Hands-On Exercises</h2>
            <p className="theme-text-secondary leading-relaxed">
              Awesome! You&apos;ve learned the commands. Now let&apos;s test what you&apos;ve learned with some hands-on exercises.
              <strong className="theme-text-primary"> Go ahead and try them!</strong>
            </p>
          </div>
          {lesson.content.practice.map((exercise: PracticeExercise, index: number) => (
            <div key={exercise.id} className="theme-bg-secondary border theme-border-primary rounded-lg p-5 mb-5">
              <div className="mb-4">
                <h3 className="text-base theme-text-primary mb-2 flex items-center gap-2">
                  <span className="bg-blue-600 theme-text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  Exercise {index + 1}
                </h3>
              </div>

              <div className="mb-4">
                <MarkdownContent content={exercise.prompt} />
              </div>

              {exercise.hints && exercise.hints.length > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() => setPracticeRevealed(prev => ({...prev, [index]: !prev[index]}))}
                    className="text-sm theme-bg-tertiary border theme-border-primary theme-text-primary px-3 py-2 rounded theme-interactive"
                  >
                    {practiceRevealed[index] ? 'Hide Hints' : 'Show Hints'}
                  </button>

                  {practiceRevealed[index] && (
                    <div className="theme-bg-tertiary border theme-border-primary rounded-md p-4 mt-2">
                      <h4 className="text-sm theme-text-primary mb-3">💡 Hints:</h4>
                      <ul className="m-0 pl-5">
                        {exercise.hints.map((hint: string, hintIndex: number) => (
                          <li key={hintIndex} className="theme-text-secondary mb-1 text-sm">
                            {hint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {exercise.expectedCommand !== 'observation' && (
                <div className="mb-4">
                  <button
                    onClick={() => setPracticeCompleted(prev => ({...prev, [index]: !prev[index]}))}
                    className="text-sm bg-green-700 border border-green-600 theme-text-primary px-3 py-2 rounded hover:bg-green-600"
                  >
                    {practiceCompleted[index] ? 'Hide Solution' : 'Reveal Solution'}
                  </button>

                  {practiceCompleted[index] && (
                    <div className="mt-2">
                      <div className="text-xs theme-text-secondary mb-2">Expected command:</div>
                      <TerminalBlock
                        command={exercise.expectedCommand}
                        explanation="Solution"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    } else if (stepIndex === lesson.content.commands.length + 2) {
      // Quiz step
      return (
        <div className="step-content">
          {!quizCompleted ? (
            <div className="theme-bg-secondary border theme-border-primary rounded-lg p-6">
              {!showResults ? (
                <div>
                    <div className="mb-4">
                      <div className="text-sm theme-text-muted mb-2">
                        Question {currentQuestionIndex + 1} of {lesson.quiz?.questions.length}
                      </div>
                      <div className="theme-bg-tertiary h-1 rounded mb-3">
                        <div
                          className="bg-blue-600 h-full rounded transition-all duration-300"
                          style={{width: `${((currentQuestionIndex + 1) / (lesson.quiz?.questions.length || 1)) * 100}%`}}
                        />
                      </div>
                    </div>

                    <div className="mb-5">
                      <h3 className="text-lg theme-text-primary mb-4 leading-relaxed">
                        {lesson.quiz?.questions[currentQuestionIndex]?.question}
                      </h3>

                      <div className="flex flex-col gap-3">
                        {lesson.quiz?.questions[currentQuestionIndex]?.options.map((option: string, optionIndex: number) => (
                          <button
                            key={optionIndex}
                            onClick={() => {
                              setSelectedAnswers(prev => ({
                                ...prev,
                                [currentQuestionIndex]: optionIndex
                              }));
                            }}
                            className={`
                              ${selectedAnswers[currentQuestionIndex] === optionIndex
                                ? 'bg-blue-600 border-blue-600 theme-text-primary'
                                : 'theme-bg-tertiary theme-border-primary theme-text-primary theme-interactive'
                              }
                              border p-4 rounded-lg cursor-pointer text-left text-sm transition-all duration-200 flex items-center gap-3
                            `}
                          >
                            <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                              {String.fromCharCode(65 + optionIndex)}
                            </span>
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => {
                          if (currentQuestionIndex > 0) {
                            setCurrentQuestionIndex(currentQuestionIndex - 1);
                          }
                        }}
                        disabled={currentQuestionIndex === 0}
                        className={`
                          bg-transparent border theme-border-primary px-4 py-2 rounded-md text-sm
                          ${currentQuestionIndex === 0
                            ? 'theme-text-muted cursor-not-allowed'
                            : 'theme-text-primary cursor-pointer theme-interactive'
                          }
                        `}
                      >
                        {'<- Previous'}
                      </button>

                      <button
                        onClick={() => {
                          if (currentQuestionIndex < (lesson.quiz?.questions.length || 0) - 1) {
                            setCurrentQuestionIndex(currentQuestionIndex + 1);
                          } else {
                            setShowResults(true);
                          }
                        }}
                        disabled={selectedAnswers[currentQuestionIndex] === undefined}
                        className={`
                          border-0 px-4 py-2 rounded-md text-sm font-medium
                          ${selectedAnswers[currentQuestionIndex] !== undefined
                            ? 'bg-blue-600 theme-text-primary cursor-pointer hover:bg-blue-700'
                            : 'theme-bg-tertiary theme-text-primary cursor-not-allowed'
                          }
                        `}
                      >
                        {currentQuestionIndex < (lesson.quiz?.questions.length || 0) - 1 ? 'Next →' : 'Show Results'}
                      </button>
                    </div>
                  </div>
                ) : (
                <div>
                  <h3 className="text-lg theme-text-primary mb-5">Quiz Results</h3>

                  {lesson.quiz?.questions.map((question: QuizQuestion, qIndex: number) => {
                    const userAnswer = selectedAnswers[qIndex];
                    const isCorrect = userAnswer === question.correctAnswer;

                    return (
                      <div key={qIndex} className={`
                        theme-bg-tertiary rounded-lg p-4 mb-4
                        ${isCorrect ? 'border border-green-400' : 'border border-red-400'}
                      `}>
                        <div className="mb-3">
                          <div className="text-sm theme-text-muted mb-1">
                            Question {qIndex + 1}
                          </div>
                          <div className="theme-text-primary mb-2">
                            {question.question}
                          </div>
                          <div className={`text-sm font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                          </div>
                        </div>

                        <div className="text-sm">
                          <div className="theme-text-muted mb-1">
                            Your answer: <span className="theme-text-primary">
                              {question.options[userAnswer]}
                            </span>
                          </div>
                          {!isCorrect && (
                            <div className="theme-text-muted mb-1">
                              Correct answer: <span className="text-green-400">
                                {question.options[question.correctAnswer]}
                              </span>
                            </div>
                          )}
                          {question.explanation && (
                            <div className="theme-text-muted italic mt-2 p-2 theme-bg-secondary rounded">
                              💡 {question.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <div className="text-center mt-5 p-4 theme-bg-tertiary rounded-lg">
                    <div className="text-lg theme-text-primary mb-2">
                      Score: {Object.values(selectedAnswers).filter((answer, index) =>
                        answer === lesson.quiz?.questions[index]?.correctAnswer
                      ).length} / {lesson.quiz?.questions.length}
                    </div>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => {
                          // Reset quiz state
                          setSelectedAnswers({});
                          setCurrentQuestionIndex(0);
                          setShowResults(false);
                        }}
                        className="bg-gray-600 border-0 theme-text-primary px-4 py-3 rounded-md cursor-pointer text-sm font-semibold hover:bg-gray-700"
                      >
                        Retake Quiz
                      </button>
                      <button
                        onClick={() => setQuizCompleted(true)}
                        className="bg-green-500 border-0 theme-text-primary px-6 py-3 rounded-md cursor-pointer text-sm font-semibold hover:bg-green-600"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="theme-bg-secondary border border-green-400 rounded-lg p-6 text-center">
              <div className="text-lg text-green-400 mb-2">
                ✅ Quiz Completed!
              </div>
              <div className="theme-text-muted text-sm mb-4">
                Great job! You&apos;ve completed the knowledge check for this lesson.
              </div>
              <button
                onClick={() => {
                  // Reset all quiz state to retake
                  setQuizCompleted(false);
                  setSelectedAnswers({});
                  setCurrentQuestionIndex(0);
                  setShowResults(false);
                }}
                className="bg-blue-600 border-0 theme-text-primary px-4 py-2 rounded-md cursor-pointer text-sm font-medium hover:bg-blue-700"
              >
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      );
    } else if (stepIndex === totalSteps - 1) {
      // Completion step
      return (
        <div className="step-content text-center">
          <div className="mb-6">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-2xl font-bold mb-3 text-green-400">Lesson Complete!</h2>
            <p className="text-lg theme-text-secondary mb-4">
              Congratulations! You&apos;ve mastered the {lesson.title.toLowerCase()}.
            </p>
          </div>

          <div className="theme-bg-tertiary border theme-border-primary rounded-lg p-5 mb-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">What you learned:</h3>
            <div className="text-left">
              {parseSummaryText(lesson.content.summary)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {!isLessonCompleted ? (
              <button
                onClick={handleMarkComplete}
                disabled={isMarkingComplete}
                className={`
                  flex items-center gap-3 px-6 py-3 rounded-md font-semibold theme-text-primary transition-all duration-200
                  ${isMarkingComplete
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 cursor-pointer'
                  }
                `}
              >
                {isMarkingComplete ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Marking Complete...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Mark Complete</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-green-600 theme-text-primary px-6 py-3 rounded-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold">Completed!</span>
              </div>
            )}

            {nextLesson && (
              <Link href={`/lessons/${nextLesson.id}`} className="no-underline" scroll={false}>
                <button className="bg-blue-600 border-0 theme-text-primary px-6 py-3 rounded-md cursor-pointer font-medium hover:bg-blue-700">
                  Next Lesson: {nextLesson.title} {'→'}
                </button>
              </Link>
            )}

            <Link href="/lessons" className="no-underline" scroll={false}>
              <button className="bg-gray-700 border theme-border-primary theme-text-primary px-6 py-3 rounded-md cursor-pointer hover:bg-gray-600">
                Back to Lessons
              </button>
            </Link>
          </div>
        </div>
      );
    }

    return null;
  };

  // Client-side protection - redirect if not authenticated
  useEffect(() => {
    if (initialized && !user) {
      router.push('/login');
    }
  }, [user, initialized, router]);

  // Show loading while checking authentication
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  // Show loading while redirecting unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Redirecting to login...</div>
      </div>
    );
  }

  // Get lesson data
  const lesson = getLessonById(lessonId);
  const nextLesson = getNextLesson(lessonId);
  const previousLesson = getPreviousLesson(lessonId);
  
  // If lesson not found, show error
  if (!lesson) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-24 pb-12 px-4 theme-bg-secondary theme-text-primary flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              Lesson Not Found
            </h1>
            <Link href="/lessons" className="no-underline" scroll={false}>
              <button className="bg-blue-600 border-0 theme-text-primary px-5 py-3 rounded-md cursor-pointer hover:bg-blue-700">
                Back to Lessons
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  // All lessons now use stepper format
  if (lesson) {
    const totalSteps = getStepCount(lesson);

    return (
      <>
        <Header />
        <div className="min-h-screen theme-bg-secondary theme-text-primary flex flex-col pt-20">
          {/* Compact Header */}
          <div className="sticky top-20 z-10 theme-bg-tertiary backdrop-blur-sm border-b theme-border-primary mb-12">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary opacity-50"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/5 to-accent-purple/5"></div>

            <div className="relative px-4 py-8">
              <div className="max-w-4xl mx-auto">
                {/* Top row with Back button and metadata */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <Link href="/lessons" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-base">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </Link>

                  <div className="flex items-center gap-3 text-base theme-text-secondary font-medium">
                    <span>Lesson {lessonId} of 20</span>
                    <span>•</span>
                    <span>{currentStepIndex + 1} / {totalSteps}</span>
                  </div>
                </div>

                {/* Centered title */}
                <div className="text-center mb-4">
                  <h1 className="text-xl font-semibold theme-text-primary">
                    Lesson {lessonId}: {lesson.title}
                  </h1>
                </div>

                {/* Centered progress dots */}
                <div className="flex justify-center">
                  <div className="flex gap-2" role="progressbar" aria-label="Lesson steps">
                    {Array.from({ length: totalSteps }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => goToStep(index)}
                        className={`
                          w-4 h-4 rounded-full transition-all duration-200 focus:ring-1 focus:ring-blue-500 focus:outline-none flex-shrink-0
                          ${index === currentStepIndex
                            ? 'bg-blue-600'
                            : completedSteps.has(index)
                            ? 'bg-green-600 hover:bg-green-500'
                            : 'theme-bg-secondary border-2 theme-border-primary hover:theme-bg-tertiary'
                          }
                        `}
                        aria-label={`Go to step ${index + 1}`}
                        aria-current={index === currentStepIndex ? 'step' : undefined}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 px-4 py-8 pb-8">
            <div className="max-w-3xl mx-auto">
              {/* Show floating walkthrough card on lessons */}
              <LessonWalkthroughCard
                variant="floating"
              />

              <div className="text-lg leading-relaxed">
                {renderStepperStep(lesson, currentStepIndex)}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-auto theme-bg-tertiary backdrop-blur-sm border-t theme-border-primary px-4 py-6">
            <div className="max-w-3xl mx-auto flex justify-between items-center">
              <button
                onClick={goToPreviousStep}
                disabled={currentStepIndex === 0}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-md border transition-all duration-200 min-h-[44px]
                  ${currentStepIndex === 0
                    ? 'theme-border-primary theme-text-muted cursor-not-allowed'
                    : 'theme-border-primary theme-text-primary hover:theme-bg-tertiary focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  }
                `}
                aria-label="Go to previous step"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <button
                onClick={goToNextStep}
                disabled={currentStepIndex === totalSteps - 1}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-md transition-all duration-200 min-h-[44px]
                  ${currentStepIndex === totalSteps - 1
                    ? 'theme-bg-secondary theme-border-primary border theme-text-muted cursor-not-allowed'
                    : 'bg-blue-600 theme-text-primary hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  }
                `}
                aria-label="Go to next step"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // If no lesson found, this shouldn't happen since we check above
  return null;
}