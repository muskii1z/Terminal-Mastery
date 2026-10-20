import React from 'react';
import s from './workbench.module.css';

const TOKEN = /(`[^`]+`|\*\*[^*]+\*\*|\[\[[^\]]+\]\])/g;

/**
 * Renders lesson text: `code`, **bold** and [[Key]] for keyboard keys.
 * Builds real elements — no HTML strings, no dangerouslySetInnerHTML.
 */
export default function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={i} className={s.code}>{part.slice(1, -1)}</code>;
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('[[') && part.endsWith(']]')) {
          return <kbd key={i} className={s.kbd}>{part.slice(2, -2)}</kbd>;
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}
