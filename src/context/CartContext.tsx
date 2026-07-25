import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/product';
import API from '../services/api';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string; // Mongo _id or primary key
  productId: string; // Mongo _id for API requests
  imageId: string; // Canonical SVG illustration key (e.g. 'esp32')
  name: string;
  price: number;
  quantity: number;
  selectedOptions?: Record<string, string>;
  addedTimestamp: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, event?: any) => Promise<boolean>;
  safeAddToCart: (product: Product, quantity?: number, event?: any) => Promise<boolean>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  cartSubtotal: number;
  shippingEstimate: number;
  gstAmount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  
  // Coupon additions
  coupon: string | null;
  discountAmount: number;
  discountPercent: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Parabolic flying animation helper
const triggerFlyToCartAnimation = (event: any) => {
  try {
    const target = event.currentTarget || event.target;
    if (!target) return;
    
    const rect = target.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    
    const cartBtn = document.getElementById('navbar-cart-btn');
    if (!cartBtn) return;
    const endRect = cartBtn.getBoundingClientRect();
    const endX = endRect.left + endRect.width / 2;
    const endY = endRect.top + endRect.height / 2;
    
    const dx = endX - startX;
    const dy = endY - startY;
    
    const flyer = document.createElement('div');
    flyer.className = 'animate-fly-to-cart';
    flyer.style.position = 'fixed';
    flyer.style.left = `${startX - 20}px`;
    flyer.style.top = `${startY - 20}px`;
    flyer.style.width = '40px';
    flyer.style.height = '40px';
    flyer.style.borderRadius = '50%';
    flyer.style.border = '2px solid #3b82f6';
    flyer.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.8)';
    flyer.style.backgroundColor = '#0f172a';
    flyer.style.zIndex = '99999';
    flyer.style.pointerEvents = 'none';
    
    flyer.style.setProperty('--dx', `${dx}px`);
    flyer.style.setProperty('--dy', `${dy}px`);
    
    const parentCard = target.closest('.group') || target.closest('.min-h-screen') || document;
    const svg = parentCard.querySelector('svg');
    if (svg) {
      const clone = svg.cloneNode(true) as SVGSVGElement;
      clone.setAttribute('width', '24px');
      clone.setAttribute('height', '24px');
      clone.style.width = '24px';
      clone.style.height = '24px';
      clone.className.baseVal = '';
      flyer.style.display = 'flex';
      flyer.style.alignItems = 'center';
      flyer.style.justifyContent = 'center';
      flyer.appendChild(clone);
    } else {
      const dot = document.createElement('div');
      dot.className = 'w-3 h-3 bg-blue-500 rounded-full';
      flyer.style.display = 'flex';
      flyer.style.alignItems = 'center';
      flyer.style.justifyContent = 'center';
      flyer.appendChild(dot);
    }
    
    document.body.appendChild(flyer);
    
    setTimeout(() => {
      flyer.remove();
      const badge = document.getElementById('navbar-cart-badge');
      if (badge) {
        badge.classList.remove('animate-none');
        badge.classList.add('animate-bounce');
        setTimeout(() => {
          badge.classList.remove('animate-bounce');
          badge.classList.add('animate-none');
        }, 800);
      }
    }, 850);
  } catch (e) {
    console.error('Failed to trigger add-to-cart flying animation:', e);
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [isCartOpen, setCartOpen] = useState(false);
  const { addToast } = useToast();
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  const mockCoupons: Record<string, number> = {
    'EDGE10': 0.10,
    'WELCOME': 0.15,
    'STUDENT15': 0.15,
  };

  const fetchCart = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    if (!token && !storedToken) {
      setCart([]);
      return;
    }

    try {
      const { data } = await API.get('/cart');
      if (data.success && Array.isArray(data.cart)) {
        const formattedCart: CartItem[] = data.cart
          .map((item: any) => {
            const prod = item.product || {};
            const prodId =
              typeof prod === 'object' && prod !== null
                ? prod._id || prod.id || ''
                : String(item.product || '');
            const imgId =
              typeof prod === 'object' && prod !== null
                ? prod.imageId || prod.customId || prod.slug || prodId
                : String(prodId);

            return {
              id: String(prodId),
              productId: String(prodId),
              imageId: String(imgId),
              name: typeof prod === 'object' && prod?.name ? prod.name : 'Product',
              price: typeof prod === 'object' && typeof prod?.price === 'number' ? prod.price : 0,
              quantity: item.quantity || 1,
              selectedOptions: {},
              addedTimestamp: Date.now(),
            };
          })
          .filter((item: CartItem) => Boolean(item.productId));

        setCart(formattedCart);
      }
    } catch (error) {
      console.error('Failed to fetch cart from server:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const safeAddToCart = async (product: Product, quantity: number = 1, event?: any): Promise<boolean> => {
    if (quantity <= 0) return false;

    // 1. Verify authentication
    const storedToken = localStorage.getItem('token');
    if (!isAuthenticated && !token && !storedToken) {
      addToast('Please log in to add items to your cart.', 'error');
      navigate('/login', { state: { from: window.location.pathname } });
      return false;
    }

    // 2. Live stock validation check
    const isOutOfStock =
      product.stock !== undefined
        ? product.stock <= 0
        : product.stockCount !== undefined
        ? product.stockCount <= 0
        : product.isStock === false;

    if (isOutOfStock) {
      console.warn(`Cannot add "${product.name}" to cart: Item is out of stock.`);
      addToast(`"${product.name}" is out of stock and cannot be added to cart.`, 'error');
      return false;
    }

    const targetId = product._id || product.id || product.customId;

    try {
      // 3. Backend API call BEFORE any UI/state update
      const response = await API.post('/cart/add', { productId: targetId, quantity });

      if (response.status === 200 || response.status === 201 || response.data?.success) {
        // 4. AFTER backend success ONLY: update cart, trigger animation, open drawer
        await fetchCart();
        addToast(`Added ${quantity > 1 ? `${quantity} x ` : ''}"${product.name}" to cart.`, 'success');

        if (event) {
          triggerFlyToCartAnimation(event);
        }

        setCartOpen(true);
        return true;
      } else {
        addToast('Unable to add item to cart. Please try again.', 'error');
        return false;
      }
    } catch (error: any) {
      console.error('Failed to add item to cart via API:', error);
      addToast('Unable to add item to cart. Please try again.', 'error');
      return false;
    }
  };

  const addToCart = safeAddToCart;

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(id);
      return;
    }

    try {
      await API.patch(`/cart/update/${id}`, { quantity });
      await fetchCart();
    } catch (error) {
      console.error('Failed to update cart quantity via API:', error);
    }
  };

  const removeItem = async (id: string) => {
    try {
      await API.delete(`/cart/remove/${id}`);
      await fetchCart();
    } catch (error) {
      console.error('Failed to remove item from cart via API:', error);
    }
  };

  const clearCart = async () => {
    try {
      await API.delete('/cart/clear');
      await fetchCart();
      setCoupon(null);
    } catch (error) {
      console.error('Failed to clear cart via API:', error);
    }
  };

  const applyCoupon = (code: string) => {
    const formattedCode = code.trim().toUpperCase();
    if (mockCoupons[formattedCode] !== undefined) {
      setCoupon(formattedCode);
      return { success: true, message: `Coupon "${formattedCode}" applied successfully!` };
    }
    return { success: false, message: 'Invalid coupon code. Try EDGE10, WELCOME, or STUDENT15.' };
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discountPercent = coupon ? mockCoupons[coupon.toUpperCase()] || 0 : 0;
  const discountAmount = Math.round(cartSubtotal * discountPercent);

  // Free shipping on subtotal above 999
  const shippingEstimate = cartSubtotal > 999 || cartSubtotal === 0 ? 0 : 99;

  // Tax computed on net subtotal
  const gstAmount = Math.round((cartSubtotal - discountAmount) * 0.18);

  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingEstimate + gstAmount);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        safeAddToCart,
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
        discountPercent,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
