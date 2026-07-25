import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  theme: 'dark' | 'light';
  searchRef?: React.RefObject<HTMLInputElement | null>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search components...',
  theme,
  searchRef,
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Sync local input state with external value changes (e.g., reset buttons)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce the change propagation to parent
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [localValue, onChange, value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    if (searchRef?.current) {
      searchRef.current.focus();
    }
  };

  return (
    <div className="relative w-full">
      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </span>
      <input
        ref={searchRef}
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className={`w-full py-3 pl-11 pr-10 rounded-xl text-sm font-medium border focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all ${
          theme === 'dark'
            ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-slate-700'
            : 'bg-white border-slate-250 text-slate-900 placeholder-slate-455 focus:border-blue-400'
        }`}
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
