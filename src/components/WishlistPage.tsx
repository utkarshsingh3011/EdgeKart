import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { productService } from '../services/productService';
import type { Product } from '../types/product';
import { EmptyState } from './EmptyState';
import { QuickViewModal } from './QuickViewModal';
import { ProductCard } from './ProductCard';
import { SkeletonCard } from './SkeletonCard';

interface WishlistPageProps {
  theme: 'dark' | 'light';
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ theme }) => {
  const { wishlist, clearWishlist } = useWishlist();
  const navigate = useNavigate();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [wishlistedItems, setWishlistedItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'Wishlist | EdgeKart';
    let isMounted = true;
    setIsLoading(true);

    const fetchWishlistProducts = async () => {
      try {
        if (wishlist.length === 0) {
          if (isMounted) {
            setWishlistedItems([]);
            setIsLoading(false);
          }
          return;
        }

        const response = await productService.getProducts({ limit: 100 });
        if (isMounted && response && response.data) {
          const matched = response.data.filter((p) => {
            const mongoId = (p as any)._id || p.id;
            const customId = p.customId || p.imageId;
            return (
              wishlist.includes(mongoId) ||
              wishlist.includes(p.id) ||
              (customId && wishlist.includes(customId))
            );
          });
          setWishlistedItems(matched);
        }
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchWishlistProducts();

    return () => {
      isMounted = false;
    };
  }, [wishlist]);

  const handleBrowseCatalog = () => {
    navigate('/#products');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className={`min-h-screen pt-24 pb-20 text-left ${
        theme === 'dark' ? 'bg-slate-955 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-slate-400 mb-8 py-2 border-b border-slate-800/10">
          <Link
            to="/"
            className="hover:text-blue-500 transition-colors font-medium cursor-pointer"
          >
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-bold text-blue-500">Wishlist</span>
        </nav>

        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Your Favorites</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans mt-1 flex items-center gap-3">
              <span>Saved Wishlist</span>
              <span className="text-xs font-bold bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full border border-blue-500/10">
                {wishlistedItems.length} items
              </span>
            </h1>
          </div>

          {wishlistedItems.length > 0 && (
            <button
              onClick={clearWishlist}
              className={`inline-flex items-center space-x-1.5 text-xs font-bold py-2.5 px-4 rounded-xl border transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-rose-500'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-rose-500'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Wishlist</span>
            </button>
          )}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div
              key="skeletons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {Array.from({ length: 3 }).map((_, idx) => (
                <SkeletonCard key={idx} theme={theme} />
              ))}
            </motion.div>
          ) : wishlistedItems.length === 0 ? (
            <EmptyState
              type="wishlist"
              theme={theme}
              onAction={handleBrowseCatalog}
              actionText="Browse Products"
            />
          ) : (
            <>
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {wishlistedItems.map((product) => (
                    <ProductCard
                      key={product.id || (product as any)._id}
                      product={product}
                      theme={theme}
                      onQuickView={() => setQuickViewProduct(product)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              <QuickViewModal
                product={quickViewProduct}
                isOpen={quickViewProduct !== null}
                onClose={() => setQuickViewProduct(null)}
                theme={theme}
              />
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
