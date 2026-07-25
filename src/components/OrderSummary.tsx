import React from 'react';
import { CreditCard, ShoppingBag, Truck, Percent, Tag, ArrowRight, RefreshCw } from 'lucide-react';

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  couponCode: string | null;
  onCheckout: () => void;
  onContinueShopping?: () => void;
  theme: 'dark' | 'light';
  showCheckoutBtn?: boolean;
  isLoading?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shipping,
  tax,
  discount,
  total,
  couponCode,
  onCheckout,
  onContinueShopping,
  theme,
  showCheckoutBtn = true,
  isLoading = false,
}) => {
  return (
    <div className={`p-6 rounded-2xl border text-left ${
      theme === 'dark'
        ? 'bg-slate-900/40 border-slate-800 text-slate-100 shadow-xl shadow-black/20'
        : 'bg-white border-slate-200 text-slate-800 shadow-xl shadow-slate-100/50'
    }`}>
      <h3 className="text-lg font-bold font-sans tracking-tight mb-4 flex items-center space-x-2 border-b pb-3 border-slate-800/10">
        <span>Order Summary</span>
      </h3>

      <div className="space-y-3 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Subtotal</span>
          <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        {/* Discount (if any) */}
        {discount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-emerald-500 flex items-center">
              <Tag className="w-3.5 h-3.5 mr-1" />
              <span>Discount {couponCode ? `(${couponCode})` : ''}</span>
            </span>
            <span className="font-bold text-emerald-500">-₹{discount.toLocaleString('en-IN')}</span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex justify-between items-center">
          <span className="text-slate-400 flex items-center">
            <Truck className="w-3.5 h-3.5 mr-1 text-slate-500" />
            <span>Shipping</span>
          </span>
          <span className={`font-semibold ${shipping === 0 ? 'text-emerald-500 font-extrabold text-xs uppercase' : ''}`}>
            {shipping === 0 ? 'Free Shipping' : `₹${shipping}`}
          </span>
        </div>

        {/* GST Tax */}
        <div className="flex justify-between items-center">
          <span className="text-slate-400 flex items-center">
            <Percent className="w-3.5 h-3.5 mr-1 text-slate-500" />
            <span>GST (18%)</span>
          </span>
          <span className="font-semibold">₹{tax.toLocaleString('en-IN')}</span>
        </div>

        {/* Divider */}
        <div className={`border-t my-3.5 ${theme === 'dark' ? 'border-slate-850' : 'border-slate-200'}`} />

        {/* Estimated Total */}
        <div className="flex justify-between items-end pt-1">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Estimated Total</span>
            <span className="text-[10px] text-slate-500 font-medium">(Incl. all taxes)</span>
          </div>
          <span className="text-2xl font-black text-blue-500 font-sans leading-none">
            ₹{total.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Checkout and Shopping controls */}
      {showCheckoutBtn && (
        <div className="space-y-3 pt-6">
          <button
            onClick={onCheckout}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-blue-500/20 active:translate-y-0 cursor-pointer flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4.5 h-4.5" />
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>

          {onContinueShopping && (
            <button
              onClick={onContinueShopping}
              className={`w-full py-2.5 px-4 rounded-xl border font-bold text-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5 ${
                theme === 'dark'
                  ? 'border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-white'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
