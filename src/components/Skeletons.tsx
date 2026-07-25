import React from 'react';

interface SkeletonProps {
  theme: 'dark' | 'light';
}

export const SkeletonCategory: React.FC<SkeletonProps> = ({ theme }) => {
  const shimmerClass = theme === 'dark' ? 'shimmer-bg-dark' : 'shimmer-bg-light';
  const borderClass = theme === 'dark' ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50/50';

  return (
    <div className={`p-6 rounded-2xl border flex flex-col justify-between text-left h-48 space-y-4 ${borderClass}`}>
      <div>
        {/* Icon box placeholder */}
        <div className={`w-12 h-12 rounded-xl mb-4 ${shimmerClass}`} />
        {/* Title */}
        <div className={`h-5 w-1/2 rounded-md mb-2.5 ${shimmerClass}`} />
        {/* Description */}
        <div className={`h-3 w-5/6 rounded-md ${shimmerClass}`} />
      </div>
      {/* Footer info */}
      <div className="flex items-center justify-between pt-2">
        <div className={`h-3 w-20 rounded-md ${shimmerClass}`} />
        <div className={`h-4 w-12 rounded-md ${shimmerClass}`} />
      </div>
    </div>
  );
};

export const SkeletonReviews: React.FC<SkeletonProps> = ({ theme }) => {
  const shimmerClass = theme === 'dark' ? 'shimmer-bg-dark' : 'shimmer-bg-light';
  const borderClass = theme === 'dark' ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white';

  return (
    <div className={`p-6 md:p-8 rounded-2xl border text-left flex flex-col justify-between h-64 space-y-4 ${borderClass}`}>
      {/* Header (Stars & Verified Badge) */}
      <div className="flex items-center justify-between">
        <div className={`h-4.5 w-24 rounded-md ${shimmerClass}`} />
        <div className={`h-6 w-28 rounded-full ${shimmerClass}`} />
      </div>
      {/* Content */}
      <div className="space-y-2 flex-1 pt-4">
        <div className={`h-3.5 w-full rounded-md ${shimmerClass}`} />
        <div className={`h-3.5 w-11/12 rounded-md ${shimmerClass}`} />
        <div className={`h-3.5 w-4/5 rounded-md ${shimmerClass}`} />
      </div>
      {/* Reviewer details */}
      <div className="flex items-center space-x-4 pt-4 border-t border-slate-800/10">
        <div className={`w-11 h-11 rounded-full flex-shrink-0 ${shimmerClass}`} />
        <div className="space-y-1.5 flex-1">
          <div className={`h-4 w-1/3 rounded-md ${shimmerClass}`} />
          <div className={`h-3 w-1/2 rounded-md ${shimmerClass}`} />
        </div>
      </div>
    </div>
  );
};

export const SkeletonNewsletter: React.FC<SkeletonProps> = ({ theme }) => {
  const shimmerClass = theme === 'dark' ? 'shimmer-bg-dark' : 'shimmer-bg-light';
  const borderClass = theme === 'dark' ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50';

  return (
    <div className={`p-8 md:p-14 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-8 text-center md:text-left ${borderClass}`}>
      {/* Left description */}
      <div className="space-y-3.5 flex-1 max-w-md">
        <div className={`h-3 w-20 rounded-md ${shimmerClass}`} />
        <div className={`h-7 w-3/4 rounded-md ${shimmerClass}`} />
        <div className="space-y-1.5 pt-1">
          <div className={`h-3.5 w-full rounded-md ${shimmerClass}`} />
          <div className={`h-3.5 w-5/6 rounded-md ${shimmerClass}`} />
        </div>
      </div>
      {/* Right input form */}
      <div className="w-full md:w-1/2 max-w-md">
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className={`h-12 flex-1 rounded-xl ${shimmerClass}`} />
          <div className={`h-12 w-full sm:w-28 rounded-xl ${shimmerClass}`} />
        </div>
      </div>
    </div>
  );
};
