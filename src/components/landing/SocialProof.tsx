'use client';

import React from 'react';

const SocialProof: React.FC = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Everything you need to master the terminal
          </h2>
          <p className="text-text-secondary">
            Structured learning that fits into your schedule
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-blue to-accent-blue/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-xl">20</span>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">bite-sized lessons</h3>
            <p className="text-sm text-text-secondary">Perfect for busy schedules</p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-green to-accent-green/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">~1 hour total</h3>
            <p className="text-sm text-text-secondary">Complete course in one sitting</p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-purple to-accent-purple/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">guided stepper flow</h3>
            <p className="text-sm text-text-secondary">Never get lost or confused</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;