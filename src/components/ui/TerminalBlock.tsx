'use client';

import React from 'react';
import CopyButton from './CopyButton';

interface TerminalBlockProps {
  command: string;
  output?: string;
  explanation?: string;
  showPrompt?: boolean;
}

const TerminalBlock: React.FC<TerminalBlockProps> = ({
  command,
  output,
  explanation,
  showPrompt = true
}) => {
  return (
    <div className="theme-bg-tertiary rounded-lg overflow-hidden border theme-border-primary">
      {/* Command Section */}
      <div className="relative group">
        <div className="bg-gray-900 px-4 py-3 font-mono text-sm flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            {showPrompt && <span className="text-blue-400">$</span>}
            <span className="text-green-400">{command}</span>
          </div>
          <CopyButton
            text={command}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          />
        </div>
      </div>

      {/* Output Section */}
      {output && (
        <div className="px-4 py-3 font-mono text-sm theme-text-secondary whitespace-pre-line border-t theme-border-primary">
          {output}
        </div>
      )}

      {/* Explanation Section */}
      {explanation && (
        <div className="px-4 py-3 text-sm theme-text-primary border-t theme-border-primary">
          {explanation}
        </div>
      )}
    </div>
  );
};

export default TerminalBlock;