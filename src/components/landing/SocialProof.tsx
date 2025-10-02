'use client';

import React from 'react';
import SpotlightCard from '@/components/ui/SpotlightCard';

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
          <SpotlightCard
            className="text-center p-8"
            spotlightColor="rgba(59, 130, 246, 0.15)"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-accent-blue to-accent-blue/80 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-white font-bold text-2xl">20</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">bite-sized lessons</h3>
            <p className="text-text-secondary">Perfect for busy schedules</p>
          </SpotlightCard>

          <SpotlightCard
            className="text-center p-8"
            spotlightColor="rgba(34, 197, 94, 0.15)"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-accent-green to-accent-green/80 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">2 hours total</h3>
            <p className="text-text-secondary">Master the terminal in one afternoon</p>
          </SpotlightCard>

          <SpotlightCard
            className="text-center p-8"
            spotlightColor="rgba(147, 51, 234, 0.15)"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-accent-purple to-accent-purple/80 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">guided stepper flow</h3>
            <p className="text-text-secondary">Never get lost or confused</p>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;