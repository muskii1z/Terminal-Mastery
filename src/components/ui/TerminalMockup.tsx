'use client';

import React, { useState, useEffect } from 'react';

interface TerminalMockupProps {
  className?: string;
}

const TerminalMockup: React.FC<TerminalMockupProps> = ({ className = '' }) => {
  const [currentCommand, setCurrentCommand] = useState(0);

  const commands = [
    { command: 'pwd', output: '/Users/student/projects' },
    { command: 'ls -la', output: 'drwxr-xr-x  5 student  staff   160 Nov 17 10:30 .\ndrwxr-xr-x  4 student  staff   128 Nov 17 09:15 ..\n-rw-r--r--  1 student  staff    42 Nov 17 10:30 README.md\ndrwxr-xr-x  3 student  staff    96 Nov 17 10:15 src/' },
    { command: 'cd src && ls', output: 'components/\nutils/\nindex.js' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCommand((prev) => (prev + 1) % commands.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [commands.length]);

  return (
    <div className={`bg-gray-900 rounded-lg border border-gray-700 overflow-hidden shadow-2xl ${className}`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-sm text-gray-400 font-mono">Terminal</div>
        <div className="w-16"></div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 font-mono text-sm leading-relaxed">
        <div className="text-green-400 mb-2">
          student@terminal-mastery:~$
        </div>

        {/* Current Command */}
        <div className="mb-4">
          <div className="text-white">
            <span className="text-green-400">$ </span>
            <span className="text-blue-300">{commands[currentCommand].command}</span>
            <span className="animate-pulse ml-1 text-white">|</span>
          </div>
          <div className="text-gray-300 mt-2 whitespace-pre-line">
            {commands[currentCommand].output}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <div className="text-yellow-400">✓</div>
          <span>Lesson 2/20: Navigation Commands</span>
        </div>
      </div>
    </div>
  );
};

export default TerminalMockup;