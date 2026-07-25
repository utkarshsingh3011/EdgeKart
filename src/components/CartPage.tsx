import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import { CartItem } from './CartItem';
import { EmptyCart } from './EmptyCart';
import { ShippingProgress } from './ShippingProgress';
import { CouponInput } from './CouponInput';
import { OrderSummary } from './OrderSummary';

interface CartPageProps {
  theme: 'dark' | 'light';
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const CartPage: React.FC<CartPageProps> = ({ theme, addToast }) => {
  const {
    cart,
    updateQuantity,
    removeItem,
    clearCart,
    cartCount,
    cartSubtotal,
    shippingEstimate,
    gstAmount,
    cartTotal,
    coupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { user, fetchOrders } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Shopping Cart | EdgeKart';
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/orders' } } });
      addToast('Please sign in to proceed to checkout!', 'info');
      return;
    }

    if (cart.length === 0) return;

    try {
      setIsSubmitting(true);
      const res = await orderService.checkout({
        discountAmount,
      });

      if (res.success) {
        await clearCart();
        await fetchOrders();
        addToast('Order placed successfully! Thank you for choosing EdgeKart.', 'success');
        navigate('/orders');
      } else {
        addToast(res.message || 'Checkout failed', 'error');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      const message = err.response?.data?.message || err.message || 'Checkout failed. Please try again.';
      addToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueShopping = () => {
    navigate('/#products');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      addToast('Shopping cart cleared.', 'info');
    }
  };

  return (
    <div className={`min-h-screen pt-28 pb-20 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="text-left">
            <button
              onClick={handleContinueShopping}
              className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-blue-500 hover:text-blue-400 transition-colors mb-3 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back To Catalog</span>
            </button>
            <h1 className="text-3xl sm:text-4xl font-sans font-black tracking-tight flex items-center space-x-3.5">
              <ShoppingBag className="w-8 h-8 text-blue-500" />
              <span>Shopping Cart</span>
              <span className={`text-xs px-3 py-1 rounded-full font-extrabold ${
                theme === 'dark' ? 'bg-slate-900 border border-slate-800 text-slate-450' : 'bg-blue-50 text-blue-600'
              }`}>
                {cartCount} items
              </span>
            </h1>
          </div>

          {cart.length > 0 && (
            <button
              onClick={handleClearCart}
              className={`py-2.5 px-4 rounded-xl border font-bold text-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5 self-start md:self-auto ${
                theme === 'dark'
                  ? 'border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-rose-500'
                  : 'border-slate-200 text-slate-550 hover:bg-slate-100 hover:text-rose-500'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Entire Cart</span>
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="py-12">
            <EmptyCart theme={theme} onContinueShopping={handleContinueShopping} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Items and Coupon */}
            <div className="lg:col-span-8 space-y-6">
              {/* Shipping Progress */}
              <ShippingProgress subtotal={cartSubtotal} theme={theme} />

              {/* Items List */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    theme={theme}
                    onUpdateQuantity={updateQuantity}
                    onRemove={(id) => {
                      removeItem(id);
                      addToast(`Removed ${item.name} from cart.`, 'info');
                    }}
                    isCompact={false}
                  />
                ))}
              </div>

              {/* Coupon Input */}
              <CouponInput
                onApply={(code) => {
                  const res = applyCoupon(code);
                  if (res.success) {
                    addToast(res.message, 'success');
                  } else {
                    addToast(res.message, 'error');
                  }
                  return res;
                }}
                couponCode={coupon}
                discountAmount={discountAmount}
                onRemove={() => {
                  removeCoupon();
                  addToast('Promo coupon removed.', 'info');
                }}
                theme={theme}
              />
            </div>

            {/* Right Column: Order Summary (Sticky) */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <OrderSummary
                subtotal={cartSubtotal}
                shipping={shippingEstimate}
                tax={gstAmount}
                discount={discountAmount}
                total={cartTotal}
                couponCode={coupon}
                onCheckout={handleCheckout}
                onContinueShopping={handleContinueShopping}
                theme={theme}
                isLoading={isSubmitting}
              />
            </div>
            
          </div>
        )}
        
      </div>
    </div>
  );
};
