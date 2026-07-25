import React from 'react';

interface SkeletonProductDetailProps {
  theme: 'dark' | 'light';
}

export const SkeletonProductDetail: React.FC<SkeletonProductDetailProps> = ({ theme }) => {
  const shimmerClass = theme === 'dark' ? 'shimmer-bg-dark' : 'shimmer-bg-light';
  const borderClass = theme === 'dark' ? 'border-slate-800' : 'border-slate-200';
  const bgBoxClass = theme === 'dark' ? 'bg-slate-900/30' : 'bg-white';

  return (
    <div className={`min-h-screen pt-24 pb-20 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb skeleton */}
        <div className={`h-4 w-1/4 rounded-md ${shimmerClass}`} />

        {/* Back Button skeleton */}
        <div className={`h-9 w-32 rounded-xl border ${shimmerClass} ${borderClass}`} />

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Image & Previews */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            <div className={`aspect-square w-full rounded-3xl border ${shimmerClass} ${borderClass}`} />
            <div className="grid grid-cols-3 gap-4">
              <div className={`h-20 rounded-xl border ${shimmerClass} ${borderClass}`} />
              <div className={`h-20 rounded-xl border ${shimmerClass} ${borderClass}`} />
              <div className={`h-20 rounded-xl border ${shimmerClass} ${borderClass}`} />
            </div>
          </div>

          {/* Right Column: Title & Config */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div className={`h-6 w-24 rounded-full ${shimmerClass}`} />
              <div className={`h-4 w-20 rounded-md ${shimmerClass}`} />
            </div>

            <div className="space-y-3">
              <div className={`h-10 w-3/4 rounded-md ${shimmerClass}`} />
              <div className={`h-3.5 w-24 rounded-md ${shimmerClass}`} />
            </div>

            <div className={`h-5 w-1/2 rounded-md ${shimmerClass}`} />

            <div className="space-y-1.5 pt-2">
              <div className={`h-3 w-8 rounded-sm ${shimmerClass}`} />
              <div className={`h-12 w-32 rounded-md ${shimmerClass}`} />
            </div>

            <div className="space-y-2.5">
              <div className={`h-4 w-full rounded-md ${shimmerClass}`} />
              <div className={`h-4 w-5/6 rounded-md ${shimmerClass}`} />
            </div>

            {/* Action Card Placeholder */}
            <div className={`p-5 rounded-2xl border space-y-4 ${bgBoxClass} ${borderClass}`}>
              <div className="flex items-center justify-between">
                <div className={`h-8 w-24 rounded-xl ${shimmerClass}`} />
                <div className={`h-10 w-10 rounded-xl ${shimmerClass}`} />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className={`h-12 rounded-xl ${shimmerClass}`} />
                <div className={`h-12 rounded-xl ${shimmerClass}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Technical specs tab placeholder */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 border-t pt-16 mt-16 ${borderClass}`}>
          <div className="lg:col-span-6 space-y-8 text-left">
            <div>
              <div className={`h-6 w-1/3 rounded-md mb-4 ${shimmerClass}`} />
              <div className="space-y-3.5">
                <div className={`h-4 w-5/6 rounded-md ${shimmerClass}`} />
                <div className={`h-4 w-4/5 rounded-md ${shimmerClass}`} />
                <div className={`h-4 w-full rounded-md ${shimmerClass}`} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 text-left">
            <div className={`h-6 w-1/3 rounded-md mb-4 ${shimmerClass}`} />
            <div className={`border rounded-2xl p-4 space-y-3.5 ${bgBoxClass} ${borderClass}`}>
              <div className="flex justify-between"><div className={`h-4 w-1/4 rounded ${shimmerClass}`} /><div className={`h-4 w-1/3 rounded ${shimmerClass}`} /></div>
              <div className="flex justify-between"><div className={`h-4 w-1/4 rounded ${shimmerClass}`} /><div className={`h-4 w-1/3 rounded ${shimmerClass}`} /></div>
              <div className="flex justify-between"><div className={`h-4 w-1/4 rounded ${shimmerClass}`} /><div className={`h-4 w-1/3 rounded ${shimmerClass}`} /></div>
              <div className="flex justify-between"><div className={`h-4 w-1/4 rounded ${shimmerClass}`} /><div className={`h-4 w-1/3 rounded ${shimmerClass}`} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
