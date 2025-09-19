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
      question: "Do I need Linux?",
      answer: "macOS, Linux, or Windows (WSL) all work."
    },
    {
      question: "How long does it take?",
      answer: "~1 hour total."
    },
    {
      question: "Is it free?",
      answer: "Yes — create a free account to save progress."
    },
    {
      question: "Will this help me code?",
      answer: "Yes. The terminal is a core dev skill."
    },
    {
      question: "What if I'm a total beginner?",
      answer: "That's who it's for."
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