'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import TrustRow from '@/components/landing/TrustRow';
import SocialProof from '@/components/landing/SocialProof';
import BenefitsSection from '@/components/landing/BenefitsSection';
import CurriculumPreview from '@/components/landing/CurriculumPreview';
import HowItWorks from '@/components/landing/HowItWorks';
import FounderNote from '@/components/landing/FounderNote';
import FAQ from '@/components/landing/FAQ';
import CTABand from '@/components/landing/CTABand';
import StructuredData from '@/components/seo/StructuredData';
import TerminalMockup from '@/components/ui/TerminalMockup';

export default function Home() {
  return (
    <>
      <StructuredData />
      <Header />
      <div className="min-h-screen pt-24">
        {/* Hero Section */}
        <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/5 to-accent-purple/5"></div>

          <div className="relative max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary mb-6 leading-tight">
                  Master the Terminal in{' '}
                  <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                    under 2 Hours
                  </span>
                </h1>

                <p className="text-xl text-text-secondary mb-8 max-w-2xl lg:max-w-none leading-relaxed">
                  Learn 20 essential Linux commands in under 2 hours total.{' '}
                  <span className="text-accent-blue font-medium">Interactive practice, quick quizzes, and progress tracking.</span>
                </p>

                {/* Primary CTA */}
                <div className="mb-8">
                  <Link href="/signup" className="inline-block" scroll={false}>
                    <Button size="lg" className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      Sign Up Free
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Button>
                  </Link>
                </div>

                {/* Trust Row */}
                <TrustRow />

                {/* Secondary CTA */}
                <div className="mt-6">
                  <Link href="/lessons" className="inline-flex items-center text-accent-blue hover:text-accent-purple transition-colors" scroll={false}>
                    <span className="text-sm font-medium">Browse all 20 lessons</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Right Column - Terminal Mockup */}
              <div className="relative">
                <div className="relative z-10">
                  <TerminalMockup className="w-full max-w-lg mx-auto lg:max-w-none" />
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-blue/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent-purple/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof / Fast Facts */}
        <SocialProof />

        {/* Benefits Section */}
        <BenefitsSection />

        {/* Curriculum Preview */}
        <CurriculumPreview />

        {/* How it Works */}
        <HowItWorks />

        {/* Founder Note */}
        <FounderNote />

        {/* FAQ */}
        <FAQ />

        {/* Final CTA Band */}
        <CTABand />

        {/* Footer */}
        <footer className="border-t border-border-primary py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-text-muted text-sm mb-4">
              © 2025 Terminal Mastery. Built for developers who want to master the command line.
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link href="/privacy" className="text-text-secondary hover:text-text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-text-secondary hover:text-text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
