import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  theme: 'dark' | 'light';
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  theme,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2.5 py-6">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`p-2.5 rounded-xl border flex items-center justify-center font-bold text-xs transition-all select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
          theme === 'dark'
            ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950'
        }`}
        title="Previous Page"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span>Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1.5">
        {getPageNumbers().map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm transition-all select-none cursor-pointer ${
                isActive
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20 scale-105'
                  : theme === 'dark'
                  ? 'bg-slate-900 border-slate-850 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`p-2.5 rounded-xl border flex items-center justify-center font-bold text-xs transition-all select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
          theme === 'dark'
            ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950'
        }`}
        title="Next Page"
      >
        <span>Next</span>
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
};
