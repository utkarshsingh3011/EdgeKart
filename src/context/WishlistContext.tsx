import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (id: string) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isWishlisted: (id: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('edgekart_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load wishlist from localStorage:', e);
      return [];
    }
  });

  const fetchWishlist = useCallback(async () => {
    try {
      const token = localStorage.getItem('edgekart_token');
      if (!token) return;

      const { data } = await API.get('/wishlist');
      if (data.success && Array.isArray(data.wishlist)) {
        const ids: string[] = [];
        data.wishlist.forEach((item: any) => {
          if (typeof item === 'object' && item !== null) {
            if (item._id) ids.push(String(item._id));
            if (item.id) ids.push(String(item.id));
            if (item.customId) ids.push(String(item.customId));
            if (item.imageId) ids.push(String(item.imageId));
          } else if (item) {
            ids.push(String(item));
          }
        });
        const uniqueIds = Array.from(new Set(ids));
        setWishlist(uniqueIds);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist from server:', error);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Sync wishlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('edgekart_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage:', e);
    }
  }, [wishlist]);

  const toggleWishlist = async (id: string) => {
    if (!id) return;
    const exists = isWishlisted(id);

    try {
      const token = localStorage.getItem('edgekart_token');
      if (token) {
        if (exists) {
          await API.delete(`/wishlist/${id}`);
          addToast('Item removed from wishlist.', 'info');
        } else {
          await API.post('/wishlist/add', { productId: id });
          addToast('Item added to wishlist.', 'success');
        }
        await fetchWishlist();
        return;
      }
    } catch (error) {
      console.error('Failed to sync wishlist with API:', error);
    }

    // Fallback local toggle if unauthenticated
    setWishlist((prev) => {
      if (prev.includes(id)) {
        addToast('Item removed from wishlist.', 'info');
        return prev.filter((item) => item !== id);
      }
      addToast('Item added to wishlist.', 'success');
      return [...prev, id];
    });
  };

  const removeFromWishlist = async (id: string) => {
    if (!id) return;
    try {
      const token = localStorage.getItem('edgekart_token');
      if (token) {
        await API.delete(`/wishlist/${id}`);
        await fetchWishlist();
        return;
      }
    } catch (error) {
      console.error('Failed to remove from wishlist via API:', error);
    }

    setWishlist((prev) => prev.filter((item) => item !== id));
  };

  const clearWishlist = async () => {
    try {
      const token = localStorage.getItem('edgekart_token');
      if (token) {
        for (const item of wishlist) {
          try {
            await API.delete(`/wishlist/${item}`);
          } catch (e) {
            // Ignore individual failure during clear loop
          }
        }
        await fetchWishlist();
      }
    } catch (error) {
      console.error('Failed to clear wishlist via API:', error);
    }

    setWishlist([]);
  };

  const isWishlisted = (id: string) => {
    if (!id) return false;
    return wishlist.includes(id);
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlisted,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
