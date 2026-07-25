import React from 'react';

interface HighlightedTextProps {
  text: string;
  highlight: string;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({ text, highlight }) => {
  if (!highlight.trim()) {
    return <>{text}</>;
  }

  const escapeRegExp = (str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-blue-550/20 text-blue-600 dark:bg-blue-500/25 dark:text-blue-400 rounded-sm px-0.5 font-semibold"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};
