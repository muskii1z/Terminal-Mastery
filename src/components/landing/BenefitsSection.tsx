'use client';

import React from 'react';
import SpotlightCard from '@/components/ui/SpotlightCard';

const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      title: "Learn by doing",
      description: "Try real commands with instant feedback.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Remember faster",
      description: "Quick quizzes lock in the basics.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "Stay motivated",
      description: "Progress tracking and resume anywhere.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Master the terminal in 2 hours
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Perfect for beginners — we&apos;ve designed every lesson to help you learn faster and remember longer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <SpotlightCard
              key={benefit.title}
              className="text-center h-full"
              spotlightColor={index === 1 ? 'rgba(147, 51, 234, 0.12)' : 'rgba(59, 130, 246, 0.15)'}
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-accent-blue to-accent-purple rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {benefit.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                {benefit.title}
              </h3>
              <p className="text-lg text-text-secondary leading-relaxed">
                {benefit.description}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;