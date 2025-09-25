'use client';

import React from 'react';

const FounderNote: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
            Why I built this
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="clean-card p-8 text-center">
            <div className="w-16 h-16 bg-accent-blue rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            <blockquote className="text-lg text-text-secondary leading-relaxed mb-6">
              &ldquo;I could ship projects with AI, but I didn&apos;t understand the fundamentals. I built this to learn the terminal the right way — and share the path with other beginners.&rdquo;
            </blockquote>

            <div className="flex items-center justify-center gap-3 text-text-muted">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-purple rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">TM</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-text-primary">Terminal Mastery Founder</div>
                <div className="text-sm">Developer & Educator</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderNote;