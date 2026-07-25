import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, RotateCcw, Check, Star } from 'lucide-react';

interface FilterSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedPriceRanges: string[]; // ['0-199', '200-499', '500']
  onPriceRangesChange: (ranges: string[]) => void;
  availability: { inStock: boolean; outOfStock: boolean };
  onAvailabilityChange: (avail: { inStock: boolean; outOfStock: boolean }) => void;
  minRating: number; // 0, 3, 4
  onMinRatingChange: (rating: number) => void;
  onResetAll: () => void;
  theme: 'dark' | 'light';
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const CATEGORIES = ['All', 'Development Boards', 'Sensors', 'Displays', 'Accessories'];

const PRICE_RANGES = [
  { id: '0-199', label: '₹0 – ₹199' },
  { id: '200-499', label: '₹200 – ₹499' },
  { id: '500', label: '₹500+' },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedPriceRanges,
  onPriceRangesChange,
  availability,
  onAvailabilityChange,
  minRating,
  onMinRatingChange,
  onResetAll,
  theme,
  isOpenMobile,
  onCloseMobile,
}) => {
  const handlePriceCheckboxChange = (id: string) => {
    if (selectedPriceRanges.includes(id)) {
      onPriceRangesChange(selectedPriceRanges.filter((r) => r !== id));
    } else {
      onPriceRangesChange([...selectedPriceRanges, id]);
    }
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < count ? 'fill-amber-450 text-amber-450' : 'text-slate-600'
        }`}
      />
    ));
  };

  const sidebarContent = () => (
    <div className="space-y-7 text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/10">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-blue-500" />
          <h3 className="font-bold text-base font-sans uppercase tracking-wider">Filters</h3>
        </div>
        <button
          onClick={onResetAll}
          className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center space-x-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</h4>
        <div className="flex flex-col space-y-2">
          {CATEGORIES.map((cat) => {
            const isChecked = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-blue-600 text-white font-bold'
                    : theme === 'dark'
                    ? 'hover:bg-slate-900 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>{cat}</span>
                {isChecked && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Price</h4>
        <div className="space-y-2.5">
          {PRICE_RANGES.map((range) => {
            const isChecked = selectedPriceRanges.includes(range.id);
            return (
              <label
                key={range.id}
                className="flex items-center space-x-3 text-sm font-semibold cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handlePriceCheckboxChange(range.id)}
                  className={`w-4 h-4 rounded border-slate-750 transition-colors focus:ring-blue-500 cursor-pointer ${
                    theme === 'dark' ? 'bg-slate-950 accent-blue-500' : 'bg-white accent-blue-600'
                  }`}
                />
                <span className={isChecked ? 'text-blue-500' : ''}>{range.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Availability</h4>
        <div className="space-y-2.5">
          <label className="flex items-center space-x-3 text-sm font-semibold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={availability.inStock}
              onChange={() => onAvailabilityChange({ ...availability, inStock: !availability.inStock })}
              className={`w-4 h-4 rounded border-slate-750 focus:ring-blue-500 cursor-pointer ${
                theme === 'dark' ? 'bg-slate-950 accent-blue-500' : 'bg-white accent-blue-600'
              }`}
            />
            <span className={availability.inStock ? 'text-blue-500' : ''}>In Stock</span>
          </label>
          <label className="flex items-center space-x-3 text-sm font-semibold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={availability.outOfStock}
              onChange={() => onAvailabilityChange({ ...availability, outOfStock: !availability.outOfStock })}
              className={`w-4 h-4 rounded border-slate-750 focus:ring-blue-500 cursor-pointer ${
                theme === 'dark' ? 'bg-slate-950 accent-blue-500' : 'bg-white accent-blue-600'
              }`}
            />
            <span className={availability.outOfStock ? 'text-blue-500' : ''}>Out of Stock</span>
          </label>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Minimum Rating</h4>
        <div className="flex flex-col space-y-2">
          {[0, 4, 3].map((val) => {
            const isActive = minRating === val;
            return (
              <button
                key={val}
                onClick={() => onMinRatingChange(val)}
                className={`flex items-center space-x-2.5 py-2 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/10'
                    : theme === 'dark'
                    ? 'hover:bg-slate-900 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                {val === 0 ? (
                  <span>All Ratings</span>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-1">
                      <div className="flex">{renderStars(val)}</div>
                      <span className="text-xs ml-1">& above</span>
                    </div>
                    {isActive && <Check className="w-4 h-4" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (inline, sticky) */}
      <aside
        className={`hidden lg:block w-full sticky top-24 p-6 rounded-2xl border ${
          theme === 'dark' ? 'bg-slate-900/35 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        {sidebarContent()}
      </aside>

      {/* Mobile Drawer (with AnimatePresence) */}
      <AnimatePresence>
        {isOpenMobile && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs lg:hidden"
            />

            {/* Drawer Sliding Sheet */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={`fixed left-0 top-0 bottom-0 z-55 w-full max-w-xs h-full p-6 flex flex-col overflow-y-auto shadow-2xl border-r lg:hidden ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-100'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              {/* Close button inside mobile drawer */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={onCloseMobile}
                  className={`p-2 rounded-full border transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-850 text-slate-450 hover:text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-550'
                  }`}
                  aria-label="Close filters drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sidebar Filters */}
              {sidebarContent()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
