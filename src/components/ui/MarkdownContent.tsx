'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';
import CopyButton from './CopyButton';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold theme-text-primary mb-4 mt-6 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold theme-text-primary mb-3 mt-5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium theme-text-primary mb-2 mt-4">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="theme-text-primary leading-relaxed mb-4">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="theme-text-primary font-semibold">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="theme-text-primary italic">
              {children}
            </em>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const codeContent = String(children).replace(/\n$/, '');
            const { ref, key, style, ...validProps } = props;

            if (match) {
              return (
                <div className="relative group my-4">
                  <div className="absolute top-2 right-2 z-10">
                    <CopyButton text={codeContent} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <SyntaxHighlighter
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: '8px',
                      fontSize: '14px',
                      padding: '16px',
                      background: '#1e1e1e',
                      color: '#d4d4d4',
                    }}
                    {...validProps}
                  >
                    {codeContent}
                  </SyntaxHighlighter>
                </div>
              );
            }

            // Inline code
            return (
              <code
                className="theme-bg-tertiary theme-text-primary px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          ul: ({ children }) => (
            <ul className="list-none space-y-2 my-4 pl-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-2 my-4 pl-6 theme-text-primary">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="theme-text-primary leading-relaxed flex items-start gap-2">
              <span className="text-blue-400 font-bold mt-0.5 flex-shrink-0">•</span>
              <span>{children}</span>
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 my-4 theme-bg-tertiary rounded-r-lg py-3">
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr className="border-t theme-border-primary my-6" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;