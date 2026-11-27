import React from 'react';

interface MathExprProps {
  expr: string;
  className?: string;
}

/**
 * Safely converts algebraic notation like `A^2 + 2AB + B^2` into JSX with `<sup>` elements.
 */
export const MathExpr: React.FC<MathExprProps> = ({ expr, className = '' }) => {
  const parts = expr.split(/(\^[0-9]+)/g);

  return (
    <span className={`math-expr ${className}`}>
      {parts.map((part, idx) => {
        if (part.startsWith('^')) {
          return <sup key={idx}>{part.slice(1)}</sup>;
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </span>
  );
};

interface PromptTextProps {
  text: string;
  className?: string;
}

/**
 * Parses prompt strings containing `[[math]]` delimiters into inline prose + MathExpr nodes.
 */
export const PromptText: React.FC<PromptTextProps> = ({ text, className = '' }) => {
  const segments = text.split(/(\[\[.*?\]\])/g);

  return (
    <span className={className}>
      {segments.map((seg, idx) => {
        if (seg.startsWith('[[') && seg.endsWith(']]')) {
          return <MathExpr key={idx} expr={seg.slice(2, -2)} className="font-semibold text-emerald-950" />;
        }
        return <React.Fragment key={idx}>{seg}</React.Fragment>;
      })}
    </span>
  );
};
