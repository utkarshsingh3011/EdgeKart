import React from 'react';

interface SkeletonCardProps {
  theme: 'dark' | 'light';
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ theme }) => {
  const shimmerClass = theme === 'dark' ? 'shimmer-bg-dark' : 'shimmer-bg-light';
  const bgClass = theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200/85';

  return (
    <div className={`rounded-2xl border overflow-hidden flex flex-col p-5 space-y-4 h-full ${bgClass}`}>
      {/* Image Area placeholder */}
      <div className={`aspect-square w-full rounded-xl ${shimmerClass}`} />

      {/* Info Space */}
      <div className="space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5 text-left">
          {/* Rating placeholder */}
          <div className={`h-3.5 w-1/3 rounded-md ${shimmerClass}`} />
          {/* Title placeholder */}
          <div className={`h-5 w-3/4 rounded-md ${shimmerClass}`} />
          {/* Description lines */}
          <div className="space-y-1.5 pt-1">
            <div className={`h-3 w-full rounded-md ${shimmerClass}`} />
            <div className={`h-3 w-5/6 rounded-md ${shimmerClass}`} />
          </div>
          {/* Specs tags placeholders */}
          <div className="flex gap-1.5 pt-3">
            <div className={`h-5.5 w-16 rounded-md ${shimmerClass}`} />
            <div className={`h-5.5 w-20 rounded-md ${shimmerClass}`} />
            <div className={`h-5.5 w-14 rounded-md ${shimmerClass}`} />
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/10 mt-auto">
          <div className="space-y-1">
            <div className={`h-2.5 w-8 rounded-sm ${shimmerClass}`} />
            <div className={`h-6 w-16 rounded-md ${shimmerClass}`} />
          </div>
          <div className={`h-9 w-20 rounded-xl ${shimmerClass}`} />
        </div>
      </div>
    </div>
  );
};
