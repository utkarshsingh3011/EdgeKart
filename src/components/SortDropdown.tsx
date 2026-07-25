import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowUpDown } from 'lucide-react';

export type SortOption =
  | 'featured'
  | 'price-low'
  | 'price-high'
  | 'rating'
  | 'popular'
  | 'newest';

interface SortDropdownProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
  theme: 'dark' | 'light';
}

const SORT_LABELS: Record<SortOption, string> = {
  featured: 'Featured',
  'price-low': 'Price: Low → High',
  'price-high': 'Price: High → Low',
  rating: 'Highest Rated',
  popular: 'Most Popular',
  newest: 'Newest',
};

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: SortOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left w-full sm:w-60">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between py-3 px-4 rounded-xl text-sm font-semibold transition-all border cursor-pointer select-none ${
            theme === 'dark'
              ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-850 hover:border-slate-700'
              : 'bg-white border-slate-250 text-slate-700 hover:bg-slate-50 hover:border-blue-400'
          }`}
          id="sort-menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-slate-400 mr-1 uppercase tracking-wider font-semibold">Sort By</span>
            <span>{SORT_LABELS[value]}</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 z-30 mt-2 w-full origin-top-right rounded-2xl shadow-2xl border backdrop-blur-md focus:outline-hidden ${
              theme === 'dark'
                ? 'bg-slate-900/95 border-slate-800 text-slate-200 shadow-black/40'
                : 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-200/50'
            }`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="sort-menu-button"
          >
            <div className="py-2 px-1" role="none">
              {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => {
                const isActive = value === option;
                return (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold'
                        : theme === 'dark'
                        ? 'hover:bg-slate-800 text-slate-350 hover:text-white'
                        : 'hover:bg-slate-100 text-slate-650 hover:text-slate-900'
                    }`}
                    role="menuitem"
                  >
                    {SORT_LABELS[option]}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
