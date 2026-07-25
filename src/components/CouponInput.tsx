import React, { useState } from 'react';
import { Tag, X, Check } from 'lucide-react';

interface CouponInputProps {
  onApply: (code: string) => { success: boolean; message: string };
  couponCode: string | null;
  discountAmount: number;
  onRemove: () => void;
  theme: 'dark' | 'light';
}

export const CouponInput: React.FC<CouponInputProps> = ({
  onApply,
  couponCode,
  discountAmount,
  onRemove,
  theme,
}) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const res = onApply(code);
    if (res.success) {
      setMessage({ text: res.message, isError: false });
      setCode('');
    } else {
      setMessage({ text: res.message, isError: true });
    }
  };

  const handleClearMessage = () => {
    setMessage(null);
  };

  return (
    <div className={`p-4 rounded-xl border text-left ${
      theme === 'dark'
        ? 'bg-slate-900/40 border-slate-800'
        : 'bg-white border-slate-250'
    }`}>
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
        <Tag className="w-3.5 h-3.5 text-blue-500" />
        <span>Apply Promo Code</span>
      </h4>

      {couponCode ? (
        <div className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
          theme === 'dark'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <div className="flex items-center space-x-2 text-xs font-bold">
            <Check className="w-4 h-4 text-emerald-500" />
            <div>
              <p className="font-extrabold uppercase tracking-wide">{couponCode}</p>
              <p className="text-[10px] opacity-80">Saved ₹{discountAmount.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <button
            onClick={() => {
              onRemove();
              handleClearMessage();
            }}
            className="p-1 rounded-md hover:bg-rose-500/15 text-rose-500 transition-colors cursor-pointer"
            aria-label="Remove coupon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            placeholder="e.g. WELCOME"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (message) setMessage(null);
            }}
            className={`flex-1 px-3.5 py-2 text-xs rounded-xl border font-semibold outline-hidden transition-all ${
              theme === 'dark'
                ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30'
                : 'bg-slate-50 border-slate-250 text-slate-900 placeholder-slate-400 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30'
            }`}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
            Apply
          </button>
        </form>
      )}

      {message && (
        <div className={`mt-2.5 text-[10px] font-bold flex items-center justify-between p-2 rounded-lg border ${
          message.isError
            ? theme === 'dark'
              ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              : 'bg-rose-50 border-rose-200 text-rose-800'
            : theme === 'dark'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <span>{message.text}</span>
          <button onClick={handleClearMessage} className="text-slate-400 hover:text-slate-200 p-0.5 cursor-pointer">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {!couponCode && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {['WELCOME', 'EDGE10', 'STUDENT15'].map((demoCode) => (
            <button
              key={demoCode}
              type="button"
              onClick={() => {
                setCode(demoCode);
                if (message) setMessage(null);
              }}
              className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border tracking-wider transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-550/40'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-500/40'
              }`}
            >
              {demoCode}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
