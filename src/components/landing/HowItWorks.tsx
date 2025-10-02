'use client';

import React from 'react';
import SpotlightCard from '@/components/ui/SpotlightCard';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "1",
      title: "Pick a lesson",
      description: "6 min",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      number: "2",
      title: "Try the commands",
      description: "Interactive practice",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      number: "3",
      title: "Quiz & mark complete",
      description: "Lock in your knowledge",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            How it works
          </h2>
          <p className="text-text-secondary text-lg">
            Simple 3-step learning process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {steps.map((step, index) => (
            <div key={step.number} className="text-center">
              {/* Step Number */}
              <div className="w-20 h-20 bg-gradient-to-br from-accent-blue to-accent-blue/80 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                {step.number}
              </div>

              <div>
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-lg">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Product Screenshots */}
        <div className="bg-gradient-to-r from-bg-secondary to-bg-tertiary rounded-2xl p-8">
          <p className="text-center text-text-secondary mb-8 text-lg">
            Your progress is saved to your free account.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Lesson Interface Screenshot */}
            <SpotlightCard className="p-4" spotlightColor="rgba(34, 197, 94, 0.12)">
              <div
                className="rounded-lg border overflow-hidden shadow-lg transition-all duration-300"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-primary)'
                }}
              >
                <div
                  className="flex items-center justify-between px-3 py-2 border-b"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-primary)'
                  }}
                >
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Lesson 2</div>
                </div>
                <div className="p-4 font-mono text-xs">
                  <div className="mb-2" style={{ color: 'var(--accent-green)' }}>$ pwd</div>
                  <div className="mb-3" style={{ color: 'var(--text-secondary)' }}>/Users/student</div>
                  <div className="text-xs" style={{ color: 'var(--accent-blue)' }}>✓ Correct! You used pwd to show current directory</div>
                </div>
              </div>
              <p className="text-center text-sm text-text-muted mt-3">Interactive Lessons</p>
            </SpotlightCard>

            {/* Quiz Interface Screenshot */}
            <SpotlightCard className="p-4" spotlightColor="rgba(59, 130, 246, 0.15)">
              <div className="bg-bg-primary rounded-lg border border-border-primary overflow-hidden shadow-lg transition-all duration-300">
                <div className="p-4">
                  <div className="text-sm text-text-primary mb-3 font-semibold">Quick Quiz</div>
                  <div className="text-xs text-text-secondary mb-3">Which command shows your current directory?</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border border-gray-600"></div>
                      <span className="text-xs text-text-secondary">ls</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-accent-blue border border-accent-blue"></div>
                      <span className="text-xs text-text-primary">pwd</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-text-muted mt-3">Knowledge Quizzes</p>
            </SpotlightCard>

            {/* Progress Tracking Screenshot */}
            <SpotlightCard className="p-4" spotlightColor="rgba(147, 51, 234, 0.12)">
              <div className="bg-bg-primary rounded-lg border border-border-primary overflow-hidden shadow-lg transition-all duration-300">
                <div className="p-4">
                  <div className="text-sm text-text-primary mb-3 font-semibold">Your Progress</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-accent-green rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-xs text-text-secondary">Lesson 1: Getting Started</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-accent-blue rounded-full"></div>
                      <span className="text-xs text-text-primary">Lesson 2: Navigation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-gray-600 rounded-full"></div>
                      <span className="text-xs text-text-muted">Lesson 3: Files</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-text-muted mt-3">Progress Tracking</p>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;