import React from 'react';
import { motion } from 'framer-motion';
import { Star, Eye, ShoppingCart, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/product';
import { ProductImage } from './ProductImage';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Badge } from './Badge';
import { HighlightedText } from './HighlightedText';

interface ProductCardProps {
  product: Product;
  theme: 'dark' | 'light';
  searchQuery?: string;
  onQuickView?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  theme,
  searchQuery = '',
  onQuickView,
}) => {
  const navigate = useNavigate();
  const { safeAddToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  // Helper to render rating stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <div key={i} className="relative">
            <Star className="w-3.5 h-3.5 text-slate-600" />
            <div className="absolute top-0 left-0 w-[50%] overflow-hidden">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-slate-600" />);
      }
    }
    return stars;
  };

  const targetId = (product as any)._id || product.id;
  const imageId = product.imageId || product.customId || product.slug || targetId;

  const stockVal = product.stock !== undefined ? product.stock : (product.stockCount !== undefined ? product.stockCount : (product.isStock === false ? 0 : 1));
  const isOutOfStock = stockVal <= 0;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.no-modal-trigger') || target.closest('button')) {
      return;
    }
    // Navigate to product details React Router path
    navigate(`/products/${targetId}`);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className={`rounded-2xl border overflow-hidden flex flex-col group transition-all duration-300 relative cursor-pointer hover:-translate-y-1.5 ${
        theme === 'dark'
          ? 'bg-slate-900/40 border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-blue-500/10'
          : 'bg-white border-slate-200/85 hover:border-blue-400/50 hover:bg-slate-50/20 hover:shadow-2xl hover:shadow-blue-500/5'
      }`}
    >
      {/* Badges Container */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
        <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
          theme === 'dark'
            ? 'bg-slate-950/90 text-blue-400 border border-slate-800'
            : 'bg-blue-50/90 text-blue-600 border border-blue-100'
        }`}>
          {product.category}
        </span>
        {isOutOfStock ? (
          <Badge type="outofstock" theme={theme} />
        ) : (
          <>
            {product.isBestSeller && <Badge type="bestseller" theme={theme} />}
            {product.isNew && <Badge type="new" theme={theme} />}
            {stockVal > 0 && stockVal <= 5 && <Badge type="limited" theme={theme} />}
            {discountPercent > 0 && (
              <Badge type="sale" discountPercent={discountPercent} theme={theme} />
            )}
          </>
        )}
      </div>

      {/* Wishlist Heart Toggle */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(targetId);
        }}
        className={`absolute top-4 right-4 z-10 p-2.5 rounded-full border transition-all cursor-pointer no-modal-trigger ${
          isWishlisted(targetId) || isWishlisted(imageId)
            ? 'bg-rose-500/10 border-rose-500/35 text-rose-500 hover:bg-rose-500/20'
            : theme === 'dark'
            ? 'bg-slate-950/90 border-slate-800 text-slate-400 hover:text-rose-500 hover:bg-slate-900'
            : 'bg-white border-slate-200 text-slate-500 hover:text-rose-500 hover:bg-slate-50'
        }`}
        title={isWishlisted(targetId) || isWishlisted(imageId) ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <Heart className={`w-3.5 h-3.5 ${isWishlisted(targetId) || isWishlisted(imageId) ? 'fill-rose-500' : ''}`} />
      </motion.button>

      {/* Product Image Area */}
      <div className={`relative aspect-square p-6 flex items-center justify-center overflow-hidden border-b ${
        theme === 'dark' ? 'bg-slate-950/40 border-slate-850' : 'bg-slate-50/50 border-slate-100'
      }`}>
        <div className="w-40 h-40 transform transition-transform duration-500 group-hover:scale-110">
          <ProductImage id={imageId} className="w-full h-full" />
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 backdrop-blur-xs no-modal-trigger">
          {onQuickView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView();
              }}
              className="p-3 bg-white text-slate-950 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg font-bold flex items-center space-x-2 text-xs cursor-pointer"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
              <span>Quick View</span>
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) safeAddToCart(product, 1, e);
            }}
            disabled={isOutOfStock}
            className={`p-3 rounded-xl transition-all shadow-lg font-bold flex items-center space-x-2 text-xs cursor-pointer ${
              isOutOfStock
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 opacity-90 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:scale-110 active:scale-95 hover:bg-blue-500'
            }`}
            title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col justify-between text-left">
        <div>
          {/* Rating */}
          <div className="flex items-center space-x-1.5 mb-2.5 group/stars">
            <div className="flex transition-transform duration-300 group-hover/stars:scale-105">{renderStars(product.rating ?? 5.0)}</div>
            <span className="text-xs text-slate-450">({product.reviewsCount ?? 0})</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-blue-500 transition-colors font-sans">
            <HighlightedText text={product.name} highlight={searchQuery} />
          </h3>

          {/* Description */}
          <p className={`text-sm leading-relaxed mb-4 line-clamp-2 ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-655'
          }`}>
            <HighlightedText text={product.description} highlight={searchQuery} />
          </p>

          {/* Primary Specs Badges */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {Object.entries(product.specifications ?? product.specs ?? {}).slice(0, 3).map(([key, val]) => (
              <span
                key={key}
                className={`text-[10px] px-2.5 py-1 rounded-md font-semibold tracking-wide ${
                  theme === 'dark' 
                    ? 'bg-slate-800/80 text-slate-350 border border-slate-750/30' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200/50'
                }`}
              >
                {key}: {val}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/10">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Price</span>
            <span className="text-2xl font-black text-blue-500 font-sans">₹{product.price}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) safeAddToCart(product, 1, e);
            }}
            disabled={isOutOfStock}
            className={`no-modal-trigger md:opacity-0 md:group-hover:opacity-100 py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 transform flex items-center space-x-1.5 cursor-pointer ${
              isOutOfStock
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-not-allowed opacity-90'
                : 'bg-blue-600 hover:bg-blue-500 text-white active:translate-y-0 hover:shadow-md hover:shadow-blue-500/20'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isOutOfStock ? "Out of Stock" : "Add"}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
