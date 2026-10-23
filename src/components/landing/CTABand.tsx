'use client';

import React from 'react';
import { COURSE } from '@/lessons/summary';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const CTABand: React.FC = () => {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/20 via-accent-purple/20 to-accent-blue/20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-bg-secondary/50 to-bg-tertiary/50"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-accent-blue/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent-purple/10 rounded-full blur-2xl"></div>

      <div className="relative max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
          Learn the terminal in{' '}
          <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
            {COURSE.lessons} lessons
          </span>
          <br />
          <span className="text-2xl md:text-3xl font-normal text-text-secondary">
            perfect for beginners
          </span>
        </h2>

        <p className="text-xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
          Short, hands-on lessons that take you from avoiding the terminal to using it with confidence
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
          <Link href="/lessons/1" className="inline-block" scroll={false}>
            <Button size="lg" className="text-lg px-10 py-4 shadow-2xl hover:shadow-accent-blue/25 transition-all duration-300 transform hover:scale-105">
              Start Lesson 1
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
          <Link href="/lessons" className="inline-block" scroll={false}>
            <Button variant="secondary" size="lg" className="text-lg px-10 py-4 border-2 hover:border-accent-blue transition-all duration-300">
              Browse Lessons
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Free forever</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Start learning immediately</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>No credit card required</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABand;