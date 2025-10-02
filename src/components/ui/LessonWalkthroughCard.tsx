'use client';

import React from 'react';

interface LessonWalkthroughCardProps {
  variant: 'inline' | 'floating';
  currentStep?: number;
}

const LessonWalkthroughCard: React.FC<LessonWalkthroughCardProps> = ({
  variant,
  currentStep = 1
}) => {
  const steps = [
    {
      icon: '📖',
      title: 'Read & Learn',
      description: 'Understand the command'
    },
    {
      icon: '💻',
      title: 'Try it Out',
      description: 'See examples in action'
    },
    {
      icon: '🧠',
      title: 'Practice',
      description: 'Do hands-on exercises'
    },
    {
      icon: '✅',
      title: 'Complete',
      description: 'Finish and track progress'
    }
  ];

  if (variant === 'floating') {
    return (
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="clean-card p-6 w-72 shadow-lg">
          <h3 className="text-base font-semibold theme-text-primary mb-4">
            How this lesson works:
          </h3>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-3 theme-text-primary"
              >
                <span className="text-xl">{step.icon}</span>
                <div>
                  <div className="font-medium text-sm">{step.title}</div>
                  <div className="text-xs theme-text-secondary">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="clean-card p-6 mb-6">
      <h3 className="text-lg font-semibold theme-text-primary mb-4 text-center">
        📚 How this lesson works
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((step, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl mb-2">{step.icon}</div>
            <div className="text-sm font-medium theme-text-primary mb-1">
              {step.title}
            </div>
            <div className="text-xs theme-text-secondary">
              {step.description}
            </div>
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 right-0 transform translate-x-1/2">
                <svg className="w-4 h-4 theme-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index + 1 <= currentStep ? 'bg-blue-500' : 'theme-bg-tertiary'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonWalkthroughCard;