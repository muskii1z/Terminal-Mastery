'use client';

import React, { useState } from 'react';

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
      answer: "You can master the terminal basics in just 2 hours. Our bite-sized lessons are designed for busy schedules — learn at your own pace, whether that's 15 minutes a day or completing everything in one weekend session."
    },
    {
      question: "Is Terminal Mastery really free?",
      answer: "Absolutely! All core lessons are completely free forever. Create a free account to track your progress, save your place, and access interactive exercises. No credit card required, no hidden fees."
    },
    {
      question: "Will this actually help me become a better developer?",
      answer: "Yes! The terminal is essential for modern development. You'll learn to navigate files faster than any GUI, use Git effectively, run development servers, manage dependencies, and deploy code. These skills are used daily by professional developers."
    },
    {
      question: "I've never touched a terminal before. Is this really for me?",
      answer: "Perfect! Terminal Mastery is specifically designed for complete beginners. We start with the absolute basics — like opening your terminal — and build up your confidence step by step. No prior experience needed."
    },
    {
      question: "What makes this different from other terminal tutorials?",
      answer: "We focus on practical skills you'll actually use as a developer, not academic theory. Our interactive exercises let you practice real commands safely, with instant feedback. Plus, everything is designed to be completed in just 2 hours."
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