import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Heart, ShoppingCart, Plus, Minus, Zap } from 'lucide-react';
import type { Product } from '../types/product';
import { ProductImage } from './ProductImage';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Badge } from './Badge';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  theme,
}) => {
  const { safeAddToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [activeVariant, setActiveVariant] = useState<'default' | 'pinout' | 'dimensions'>('default');
  const [quantity, setQuantity] = useState(1);

  // Reset local state when product changes
  useEffect(() => {
    setActiveVariant('default');
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  const targetId = (product as any)._id || product.id;
  const imageId = product.imageId || product.customId || product.slug || targetId;
  const stockVal = product.stock !== undefined ? product.stock : (product.stockCount !== undefined ? product.stockCount : (product.isStock === false ? 0 : 1));
  const isOutOfStock = stockVal <= 0;
  const isFavorited = isWishlisted(targetId) || isWishlisted(imageId);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
        }`}
      />
    ));
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    const success = await safeAddToCart(product, quantity, e);
    if (success) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
          />

          {/* Modal Content Wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 240 }}
            className={`relative w-full max-w-4xl rounded-3xl border shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh] md:max-h-[85vh] ${
              theme === 'dark'
                ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-black/55'
                : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/40'
            } backdrop-blur-md z-10`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 z-20 p-2 rounded-full border transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                  : 'bg-slate-50 border-slate-200 text-slate-550 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Box: Image Gallery */}
            <div className={`w-full md:w-1/2 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r ${
              theme === 'dark' ? 'border-slate-800 bg-slate-950/30' : 'border-slate-150 bg-slate-50/40'
            }`}>
              {/* Main Image Container */}
              <div className="flex-1 flex items-center justify-center min-h-[220px] md:min-h-[300px] py-4 relative">
                {/* Badge Container */}
                <div className="absolute top-0 left-0 flex flex-col gap-1.5 z-10 items-start">
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

                <div className="w-48 h-48 sm:w-56 sm:h-56 transform transition-transform duration-500 hover:scale-105">
                  <ProductImage id={imageId} variant={activeVariant} className="w-full h-full" />
                </div>
              </div>

              {/* Thumbnails Row */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {(product.images ?? ['default']).map((imgType) => {
                  const label =
                    imgType === 'default'
                      ? 'Main'
                      : imgType === 'pinout'
                      ? 'Pinout'
                      : 'Dimensions';
                  return (
                    <button
                      key={imgType}
                      onClick={() => setActiveVariant(imgType as any)}
                      className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                        activeVariant === imgType
                          ? 'border-blue-500 bg-blue-500/5'
                          : theme === 'dark'
                          ? 'border-slate-800 bg-slate-900/40 hover:border-slate-700/60'
                          : 'border-slate-200 bg-white hover:border-slate-350'
                      }`}
                    >
                      <div className="w-10 h-10">
                        <ProductImage id={imageId} variant={imgType as any} className="w-full h-full p-0.5" />
                      </div>
                      <span className="text-[8px] font-bold uppercase tracking-wider">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Box: Info & Actions */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-full">
              <div className="space-y-4 text-left">
                {/* Category & SKU */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    theme === 'dark'
                      ? 'bg-slate-900 text-blue-400 border border-slate-800'
                      : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}>
                    {product.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">SKU: {product.sku}</span>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-extrabold leading-snug font-sans">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center space-x-2 pb-1 border-b border-slate-800/10">
                  <div className="flex space-x-0.5">{renderStars(product.rating ?? 5.0)}</div>
                  <span className="text-xs font-semibold text-slate-400">
                    {product.rating ?? 5.0} ({product.reviewsCount ?? 0} reviews)
                  </span>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-blue-500">₹{product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xs text-slate-455 line-through">₹{product.originalPrice}</span>
                      <span className="text-xs text-emerald-500 font-bold">({discountPercent}% OFF)</span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className={`text-xs sm:text-sm leading-relaxed line-clamp-3 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-655'
                }`}>
                  {product.description}
                </p>

                {/* Simplified Specs List */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {Object.entries(product.specifications ?? product.specs ?? {}).slice(0, 4).map(([key, val]) => (
                    <div
                      key={key}
                      className={`p-2 rounded-lg border text-left ${
                        theme === 'dark'
                          ? 'bg-slate-950/40 border-slate-800/60'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">
                        {key}
                      </span>
                      <span className="text-xs font-semibold truncate block">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-6 mt-6 border-t border-slate-800/10 space-y-4">
                <div className="flex items-center justify-between">
                  {/* Quantity Counter */}
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Qty</span>
                    <div className={`flex items-center rounded-xl border p-1 ${
                      theme === 'dark' ? 'border-slate-850 bg-slate-950/60' : 'border-slate-250 bg-white'
                    }`}>
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={isOutOfStock}
                        className={`p-1 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          theme === 'dark' ? 'hover:bg-slate-850 text-slate-400' : 'hover:bg-slate-150 text-slate-650'
                        }`}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-6 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={isOutOfStock}
                        className={`p-1 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          theme === 'dark' ? 'hover:bg-slate-850 text-slate-400' : 'hover:bg-slate-150 text-slate-650'
                        }`}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Add to Wishlist */}
                  <button
                    onClick={() => toggleWishlist(targetId)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isFavorited
                        ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                        : theme === 'dark'
                        ? 'border-slate-800 text-slate-455 hover:text-rose-500 hover:bg-slate-850/50'
                        : 'border-slate-250 text-slate-550 hover:text-rose-500 hover:bg-slate-100'
                    }`}
                    title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Checkout & Cart Buttons */}
                <div className="grid grid-cols-2 gap-3.5">
                  <button
                    onClick={(e) => {
                      if (!isOutOfStock) handleAddToCart(e);
                    }}
                    disabled={isOutOfStock}
                    className="w-full bg-slate-900/60 hover:bg-slate-800/80 text-blue-455 border border-slate-800 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all duration-300 transform active:translate-y-0 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{isOutOfStock ? 'Out of Stock' : 'Add To Cart'}</span>
                  </button>

                  <button
                    onClick={async (e) => {
                      if (!isOutOfStock) {
                        const success = await safeAddToCart(product, quantity, e);
                        if (success) {
                          onClose();
                        }
                      }
                    }}
                    disabled={isOutOfStock}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-blue-500/20 active:translate-y-0 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>{isOutOfStock ? 'Out of Stock' : 'Buy Now'}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
