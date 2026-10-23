'use client';

import React, { useState } from 'react';
import { COURSE } from '@/lessons/summary';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "Do I need a specific operating system?",
      answer: "Not at all! Terminal Mastery works on macOS, Linux, and Windows (with WSL). We'll show you how to access your terminal regardless of which system you're using. The commands and concepts are universal."
    },
    {
      question: "How long does it take to complete?",
      answer: `About ${COURSE.hours} hours for all ${COURSE.lessons} lessons. Each one takes 10 to 20 minutes, and your progress is saved in your browser, so you can do one a day or the whole course in a weekend.`
    },
    {
      question: "Is Terminal Mastery really free?",
      answer: "Yes. Every lesson is free, and you don't need an account: open a lesson and start typing. Your progress is saved in your browser."
    },
    {
      question: "Will this actually help me become a better developer?",
      answer: "Yes. Git, package managers, servers and AI coding tools all run in the terminal. This course teaches the foundation they sit on: moving around, working with files, searching, pipes, permissions, editing with nano and managing processes. With that, the rest stops looking like magic."
    },
    {
      question: "I've never touched a terminal before. Is this really for me?",
      answer: "Perfect! Terminal Mastery is specifically designed for complete beginners. We start with the absolute basics — like opening your terminal — and build up your confidence step by step. No prior experience needed."
    },
    {
      question: "What makes this different from other terminal tutorials?",
      answer: "You don't watch or read about commands, you type them. Every lesson has a practice terminal beside it that behaves like the real thing, error messages included, and checks each task as you do it. Nothing you type can touch your real computer."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-text-secondary text-lg">
            Quick answers to common questions
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="clean-card overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-inset"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg font-semibold text-text-primary">
                  {item.question}
                </h3>
                <div className={`transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <p className="text-text-secondary">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;