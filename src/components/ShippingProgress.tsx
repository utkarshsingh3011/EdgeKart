import React from 'react';
import { Truck } from 'lucide-react';

interface ShippingProgressProps {
  subtotal: number;
  theme: 'dark' | 'light';
}

export const ShippingProgress: React.FC<ShippingProgressProps> = ({ subtotal, theme }) => {
  if (subtotal === 0) return null;

  const target = 999;
  const isFree = subtotal >= target;
  const needed = target - subtotal;
  const percentage = Math.min((subtotal / target) * 100, 100);

  return (
    <div className={`p-4 rounded-xl border mb-4 text-left ${
      theme === 'dark'
        ? 'bg-slate-900/40 border-slate-800 text-slate-200'
        : 'bg-white border-slate-250 text-slate-800'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold flex items-center space-x-1.5">
          <Truck className={`w-4 h-4 ${isFree ? 'text-emerald-500' : 'text-blue-500'}`} />
          <span>
            {isFree ? (
              <span className="text-emerald-500 font-extrabold">You have unlocked Free Shipping!</span>
            ) : (
              <span>
                <span className="text-blue-500 font-black">₹{needed.toLocaleString('en-IN')}</span> away from Free Shipping
              </span>
            )}
          </span>
        </span>
        <span className="text-[10px] font-extrabold opacity-60">
          {Math.round(percentage)}%
        </span>
      </div>
      
      {/* Progress Bar Container */}
      <div className={`w-full h-2 rounded-full overflow-hidden ${
        theme === 'dark' ? 'bg-slate-950' : 'bg-slate-100'
      }`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isFree
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-md shadow-emerald-500/20'
              : 'bg-gradient-to-r from-blue-600 to-indigo-500 shadow-md shadow-blue-500/20'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
