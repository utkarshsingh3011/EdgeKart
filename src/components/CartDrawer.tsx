import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import { CartItem } from './CartItem';
import { EmptyCart } from './EmptyCart';
import { ShippingProgress } from './ShippingProgress';
import { CouponInput } from './CouponInput';
import { OrderSummary } from './OrderSummary';

interface CartDrawerProps {
  theme: 'dark' | 'light';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ theme }) => {
  const { addToast } = useToast();
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
    isCartOpen,
    setCartOpen,
    coupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { user, fetchOrders } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      setCartOpen(false);
      navigate('/login', { state: { from: { pathname: '/orders' } } });
      addToast("Please sign in to proceed to checkout!", "info");
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
        setCartOpen(false);
        addToast("Order placed successfully!", "success");
        navigate('/orders');
      } else {
        addToast(res.message || 'Checkout failed', "error");
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      const message = err.response?.data?.message || err.message || 'Checkout failed. Please try again.';
      addToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewCartPage = () => {
    setCartOpen(false);
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs"
          />

          {/* Sliding Panel Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-md h-full flex flex-col shadow-2xl border-l ${
              theme === 'dark'
                ? 'bg-slate-900/95 border-slate-800 text-slate-100'
                : 'bg-white/95 border-slate-200 text-slate-800'
            } backdrop-blur-md`}
          >
            {/* Header */}
            <div className={`p-6 flex items-center justify-between border-b ${
              theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold font-sans">Shopping Cart</h2>
                <span className="bg-blue-500/10 text-blue-500 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {cartCount} items
                </span>
              </div>
              
              <button
                onClick={() => setCartOpen(false)}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-950'
                }`}
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="py-8">
                  <EmptyCart theme={theme} onContinueShopping={() => setCartOpen(false)} />
                </div>
              ) : (
                <>
                  {/* Free Shipping Progress */}
                  <ShippingProgress subtotal={cartSubtotal} theme={theme} />

                  {/* Cart Items compact list */}
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {cart.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
                        >
                          <CartItem
                            item={item}
                            theme={theme}
                            onUpdateQuantity={updateQuantity}
                            onRemove={removeItem}
                            isCompact={true}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Coupon Codes inside Drawer */}
                  <div className="pt-2">
                    <CouponInput
                      onApply={applyCoupon}
                      couponCode={coupon}
                      discountAmount={discountAmount}
                      onRemove={removeCoupon}
                      theme={theme}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer Summary Container */}
            {cart.length > 0 && (
              <div className={`p-6 border-t space-y-4 ${
                theme === 'dark' ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50'
              }`}>
                <OrderSummary
                  subtotal={cartSubtotal}
                  shipping={shippingEstimate}
                  tax={gstAmount}
                  discount={discountAmount}
                  total={cartTotal}
                  couponCode={coupon}
                  onCheckout={handleCheckout}
                  onContinueShopping={() => setCartOpen(false)}
                  theme={theme}
                  showCheckoutBtn={false} // Customizing buttons inside drawer
                />

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={handleViewCartPage}
                    className={`py-3 px-4 rounded-xl border font-bold text-xs transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                      theme === 'dark'
                        ? 'border-slate-800 text-slate-350 hover:bg-slate-850 hover:text-white'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>View Cart Page</span>
                  </button>

                  <button
                    onClick={handleCheckout}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-blue-500/20 active:translate-y-0 cursor-pointer flex items-center justify-center space-x-1"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Checkout</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={clearCart}
                  className={`w-full py-2 rounded-xl border font-bold text-[10px] transition-colors cursor-pointer flex items-center justify-center space-x-1.5 ${
                    theme === 'dark'
                      ? 'border-slate-800/80 text-slate-500 hover:bg-slate-850 hover:text-rose-500'
                      : 'border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-rose-500'
                  }`}
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear Entire Cart</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
