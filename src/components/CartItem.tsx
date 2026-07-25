import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { ProductImage } from './ProductImage';
import type { CartItem as CartItemType } from '../context/CartContext';

interface CartItemProps {
  item: CartItemType;
  theme: 'dark' | 'light';
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  isCompact?: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  theme,
  onUpdateQuantity,
  onRemove,
  isCompact = false,
}) => {
  const itemSubtotal = item.price * item.quantity;

  if (isCompact) {
    return (
      <div className={`flex items-center space-x-4 p-3.5 rounded-xl border transition-all ${theme === 'dark'
        ? 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-900/40'
        : 'bg-slate-50 border-slate-150 hover:bg-slate-100/50'
        }`}>
        {/* Item Image */}
        <div className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border p-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-200'
          }`}>
          <ProductImage id={item.imageId || item.productId} className="w-full h-full" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-left">
          <h3 className="font-semibold text-xs sm:text-sm truncate leading-snug">{item.name}</h3>
          <p className="text-blue-500 font-extrabold text-xs sm:text-sm mt-0.5">₹{item.price.toLocaleString('en-IN')}</p>

          {/* Quantity Controls */}
          <div className="flex items-center space-x-2.5 mt-2">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className={`p-1 rounded-md transition-colors cursor-pointer ${item.quantity <= 1
                ? 'opacity-40 cursor-not-allowed text-slate-500'
                : theme === 'dark'
                  ? 'hover:bg-slate-800 text-slate-400'
                  : 'hover:bg-slate-200 text-slate-655'
                }`}
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs sm:text-sm font-bold w-6 text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className={`p-1 rounded-md transition-colors cursor-pointer ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-655'
                }`}
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="p-2 text-rose-500 hover:text-rose-450 hover:bg-rose-550/10 rounded-lg transition-colors cursor-pointer"
          aria-label="Remove item from cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Detailed version for Dedicated Cart Page
  return (
    <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${theme === 'dark'
      ? 'bg-slate-900/30 border-slate-800/80 hover:bg-slate-900/40 hover:border-slate-800'
      : 'bg-white border-slate-200 hover:shadow-xl hover:shadow-slate-100/50'
      }`}>
      {/* Product Image & Title Info */}
      <div className="flex items-center space-x-4 w-full sm:w-auto">
        <div className={`w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden border p-2 flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-200'
          }`}>
          <ProductImage id={item.imageId || item.productId} className="w-16 h-16 sm:w-20 sm:h-20" />
        </div>
        <div className="text-left flex-1 min-w-0">
          <h3 className="font-sans font-bold text-sm sm:text-base leading-snug truncate">{item.name}</h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">Product ID: {item.productId}</p>
          <div className="flex items-center space-x-3.5 mt-2.5 sm:hidden">
            <span className="text-blue-500 font-extrabold text-sm">₹{item.price.toLocaleString('en-IN')}</span>
            <span className="text-[11px] text-slate-400 font-medium">Subtotal: ₹{itemSubtotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Pricing and Controls for wider screen */}
      <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800/10">
        {/* Unit Price */}
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Unit Price</span>
          <span className="text-sm font-extrabold mt-0.5">₹{item.price.toLocaleString('en-IN')}</span>
        </div>

        {/* Quantity control buttons */}
        <div className="flex flex-col items-center">
          <span className="hidden sm:block text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1">Quantity</span>
          <div className={`flex items-center rounded-xl border p-1 ${theme === 'dark' ? 'border-slate-800 bg-slate-950/60' : 'border-slate-250 bg-slate-50'
            }`}>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${item.quantity <= 1
                ? 'opacity-40 cursor-not-allowed text-slate-500'
                : theme === 'dark'
                  ? 'hover:bg-slate-800 text-slate-400'
                  : 'hover:bg-slate-200 text-slate-655'
                }`}
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-bold w-7 text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-655'
                }`}
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Subtotal */}
        <div className="hidden sm:flex flex-col text-right min-w-[90px]">
          <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Subtotal</span>
          <span className="text-sm font-black text-blue-500 mt-0.5">₹{itemSubtotal.toLocaleString('en-IN')}</span>
        </div>

        {/* Action controls */}
        <button
          onClick={() => onRemove(item.id)}
          className="p-2.5 text-rose-500 hover:text-rose-450 hover:bg-rose-550/10 rounded-xl transition-all cursor-pointer"
          title="Remove Item"
        >
          <Trash2 className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
};
