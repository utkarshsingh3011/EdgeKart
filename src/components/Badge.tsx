import React from 'react';

interface BadgeProps {
  type: 'new' | 'bestseller' | 'limited' | 'sale' | 'outofstock';
  discountPercent?: number;
  theme: 'dark' | 'light';
}

export const Badge: React.FC<BadgeProps> = ({ type, discountPercent, theme }) => {
  const getBadgeStyle = () => {
    switch (type) {
      case 'outofstock':
        return {
          text: '🚫 Out of Stock',
          className: theme === 'dark'
            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 font-black'
            : 'bg-rose-100 text-rose-700 border-rose-300 font-black',
        };
      case 'new':
        return {
          text: '✨ New',
          className: theme === 'dark'
            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
            : 'bg-blue-50 text-blue-600 border-blue-200',
        };
      case 'bestseller':
        return {
          text: '🔥 Best Seller',
          className: theme === 'dark'
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            : 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'limited':
        return {
          text: '⚡ Limited Stock',
          className: theme === 'dark'
            ? 'bg-rose-500/10 text-rose-450 border-rose-500/30'
            : 'bg-rose-50 text-rose-605 border-rose-200',
        };
      case 'sale':
        return {
          text: discountPercent ? `💸 ${discountPercent}% OFF` : '💸 Sale',
          className: theme === 'dark'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : 'bg-emerald-50 text-emerald-600 border-emerald-250',
        };
      default:
        return { text: '', className: '' };
    }
  };

  const { text, className } = getBadgeStyle();

  if (!text) return null;

  return (
    <span
      className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm transition-all duration-300 select-none ${className}`}
    >
      {text}
    </span>
  );
};
