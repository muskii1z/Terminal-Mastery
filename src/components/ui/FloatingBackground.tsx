'use client';

import React, { useState, useEffect } from 'react';

const FloatingBackground: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  
  // Terminal and code symbols that will float in the background
  const symbols = [
    '$', '>', '~', '/', '|', '{', '}', '[', ']', '(', ')',
    'ls', 'cd', 'pwd', 'cat', 'grep', 'vim', 'sudo', 'chmod',
    '&&', '||', '>>', '<<', '..', './', '../', '/usr', '/home'
  ];

  // Use effect to ensure client-side rendering only
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate positions for floating elements (client-side only)
  const floatingElements = mounted ? symbols.map((symbol, index) => ({
    id: index,
    symbol,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    isCommand: symbol.length > 1,
    delay: Math.random() * 20
  })) : [];

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Subtle grid overlay */}
      <div className="grid-overlay" />
      
      {/* Floating symbols */}
      <div className="floating-bg">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className={`floating-element ${
              element.isCommand ? 'terminal-symbol' : 'code-symbol'
            }`}
            style={{
              left: element.left,
              top: element.top,
              animationDelay: `${element.delay}s`,
            }}
          >
            {element.symbol}
          </div>
        ))}
      </div>
    </>
  );
};

export default FloatingBackground;