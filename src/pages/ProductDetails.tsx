import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  ShoppingCart,
  Heart,
  Package,
  ArrowLeft,
  Star,
  Check,
  Plus,
  Minus,
  ShieldCheck,
  Zap,
  AlertCircle,
  Tag
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product } from '../types/product';
import { productService } from '../services/productService';
import { ProductImage } from '../components/ProductImage';
import { SkeletonProductDetail } from '../components/SkeletonProductDetail';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

interface ProductDetailsProps {
  theme?: 'dark' | 'light';
  addToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  theme = 'dark',
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addRecentlyViewed } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [stockInfo, setStockInfo] = useState<{ inStock: boolean; stockCount: number } | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  const [activeVariant, setActiveVariant] = useState<'default' | 'pinout' | 'dimensions'>('default');
  const [quantity, setQuantity] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);

  // Fetch product data using productService.getProductById(id)
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setIsNotFound(false);
    setActiveVariant('default');
    setQuantity(1);
    setIsZoomed(false);

    if (!id) {
      setIsLoading(false);
      setIsNotFound(true);
      return;
    }

    const fetchProductDetails = async () => {
      try {
        const response = await productService.getProductById(id);

        if (isMounted && response && response.success && response.data) {
          const raw = response.data;

          // Normalize ID property if coming as MongoDB _id, customId, or id
          const productId = raw.id || (raw as any)._id || (raw as any).customId || id;
          const specsObj = raw.specifications ?? raw.specs ?? {};
          const stockNum = raw.stockCount ?? raw.stock ?? 0;
          const isInStockBool = raw.isStock ?? (stockNum > 0);
          const isNewBool = raw.isNew ?? raw.isNewProduct ?? false;

          const normalizedProduct: Product = {
            ...raw,
            id: productId,
            specs: specsObj,
            specifications: specsObj,
            stockCount: stockNum,
            stock: stockNum,
            isStock: isInStockBool,
            isNew: isNewBool,
            features: raw.features ?? [],
            packageContents: raw.packageContents ?? [],
            images: (raw.images && raw.images.length > 0) ? (raw.images as any) : ['default'],
            rating: raw.rating ?? 5.0,
            reviewsCount: raw.reviewsCount ?? 0,
            description: raw.description ?? '',
            sku: raw.sku ?? '',
          };

          setProduct(normalizedProduct);
          document.title = `${normalizedProduct.name} | EdgeKart`;

          if (response.stockValidation) {
            setStockInfo(response.stockValidation);
          } else {
            setStockInfo({
              inStock: isInStockBool,
              stockCount: stockNum,
            });
          }

          // Track recently viewed product
          if (productId) {
            addRecentlyViewed(productId);
          }

          // Fetch related components by category
          try {
            if (raw.category) {
              const catResponse = await productService.getProductsByCategory(raw.category);
              if (isMounted && catResponse?.data) {
                const filtered = catResponse.data
                  .filter((p) => (p.id || (p as any)._id || (p as any).customId) !== productId)
                  .slice(0, 3);
                setRelatedProducts(filtered);
              }
            }
          } catch (catErr) {
            console.warn('Failed to fetch related products:', catErr);
          }

        } else {
          if (isMounted) setIsNotFound(true);
        }
      } catch (error: any) {
        console.error(`Error fetching product data for id "${id}":`, error);
        if (isMounted) setIsNotFound(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProductDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Loading skeleton view
  if (isLoading) {
    return <SkeletonProductDetail theme={theme} />;
  }

  // Friendly 404 State when product is missing or API returns not found
  if (isNotFound || !product) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`min-h-[75vh] py-24 flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
          }`}
      >
        <div className="max-w-md w-full text-center px-4">
          <div className={`mx-auto w-20 h-20 rounded-3xl border flex items-center justify-center mb-6 shadow-xl ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-rose-400' : 'bg-white border-slate-200 text-rose-500'
            }`}>
            <AlertCircle className="w-10 h-10" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500 block mb-2">404 - Not Found</span>
          <h1 className="text-3xl font-extrabold tracking-tight font-sans mb-3">Product Not Found</h1>
          <p className={`text-sm leading-relaxed mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            We couldn't find the component or module you were looking for. It may have been renamed, removed, or is temporarily out of stock.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/20 cursor-pointer flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Catalog</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Stock status determination
  const isInStock = stockInfo
    ? stockInfo.inStock && stockInfo.stockCount > 0
    : product.stock !== undefined
    ? product.stock > 0
    : product.stockCount !== undefined
    ? product.stockCount > 0
    : product.isStock ?? true;

  const availableStockCount = stockInfo ? stockInfo.stockCount : (product.stock ?? product.stockCount);

  // Price & Discount calculations
  const originalPrice = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice
    : Math.round(product.price * 1.3);

  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  const isFavorited = isWishlisted(product.id);
  const imageVariants = product.images && product.images.length > 0
    ? product.images
    : (['default', 'pinout', 'dimensions'] as const);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    addToCart(product, quantity, e);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const renderStars = (rating: number = 5) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
          }`}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className={`min-h-screen pt-24 pb-20 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-slate-400 mb-8 py-2 border-b border-slate-800/10">
          <button
            onClick={() => navigate('/')}
            className="hover:text-blue-500 transition-colors font-medium cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-medium text-slate-400">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-bold text-blue-500 truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className={`mb-6 inline-flex items-center space-x-2 text-xs font-semibold py-2 px-3.5 rounded-xl border transition-all cursor-pointer ${theme === 'dark'
              ? 'bg-slate-900 border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-white'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        {/* Main Product Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">

          {/* Left Column: Product Image Gallery */}
          <div className="lg:col-span-6 flex flex-col space-y-6">

            {/* Main Interactive Zoom Container */}
            <div
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              className={`relative aspect-square rounded-3xl border overflow-hidden flex items-center justify-center p-8 cursor-zoom-in ${theme === 'dark'
                  ? 'bg-slate-900/30 border-slate-800/80 shadow-2xl shadow-black/30'
                  : 'bg-white border-slate-200 shadow-xl shadow-slate-100/50'
                }`}
            >
              <div
                className="w-80 h-80 transition-transform duration-100 ease-out"
                style={{
                  transform: isZoomed ? 'scale(1.8)' : 'scale(1)',
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                }}
              >
                <ProductImage id={product.imageId || product.customId || product.id || (product as any)._id} variant={activeVariant} className="w-full h-full" />
              </div>

              {/* Zoom Overlay Tip */}
              <div className="absolute bottom-4 left-4 bg-slate-950/70 backdrop-blur-xs text-[10px] text-slate-300 font-bold px-3 py-1.5 rounded-full pointer-events-none border border-slate-800">
                Hover image to Zoom
              </div>
            </div>

            {/* Image Variant Selector Thumbnails */}
            <div className="grid grid-cols-3 gap-4">
              {imageVariants.map((imgType) => {
                const label =
                  imgType === 'default'
                    ? 'Main Board'
                    : imgType === 'pinout'
                      ? 'Pinout Board'
                      : 'CAD Dimensions';

                return (
                  <button
                    key={imgType}
                    onClick={() => setActiveVariant(imgType as any)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all cursor-pointer relative overflow-hidden ${activeVariant === imgType
                        ? 'border-blue-500 bg-blue-500/10 shadow-md shadow-blue-500/10'
                        : theme === 'dark'
                          ? 'border-slate-800 bg-slate-900/30 hover:border-slate-700/60'
                          : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                      }`}
                  >
                    <div className="w-14 h-14 opacity-80 group-hover:opacity-100">
                      <ProductImage id={product.imageId || product.customId || product.id || (product as any)._id} variant={imgType as any} className="w-full h-full p-1" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Column: Name, Pricing, Rating, Stock & Actions */}
          <div className="lg:col-span-6 space-y-6 text-left">

            {/* Category tag & Stock status */}
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${theme === 'dark'
                  ? 'bg-slate-900 text-blue-400 border border-slate-800'
                  : 'bg-blue-50 text-blue-600 border border-blue-100'
                }`}>
                {product.category}
              </span>

              <span className={`flex items-center space-x-1.5 text-xs font-bold ${isInStock ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                <span className={`w-2 h-2 rounded-full ${isInStock ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                <span>{isInStock ? `In Stock ${availableStockCount ? `(${availableStockCount} units)` : ''}` : 'Out of Stock'}</span>
              </span>
            </div>

            {/* Product Name */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight font-sans">
                {product.name}
              </h1>
              {product.sku && (
                <p className="text-xs text-slate-500 mt-2 font-mono uppercase tracking-wider">
                  SKU: {product.sku}
                </p>
              )}
            </div>

            {/* Rating & Reviews Count */}
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-800/10">
              <div className="flex space-x-1">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm font-semibold text-slate-400">
                {product.rating ? product.rating.toFixed(1) : '5.0'} / 5.0 ({product.reviewsCount || 0} verified reviews)
              </span>
            </div>

            {/* Price, Original Price & Discount */}
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Price</span>
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-black text-blue-500 font-sans">₹{product.price}</span>
                {originalPrice > product.price && (
                  <>
                    <span className="text-base text-slate-400 font-semibold line-through">₹{originalPrice}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <Tag className="w-3 h-3" />
                      <span>{discountPercent}% OFF</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Product Description */}
            <p className={`text-sm sm:text-base leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-655'
              }`}>
              {product.description}
            </p>

            {/* Action Bar Container: Quantity, Wishlist, Add to Cart, Buy Now */}
            <div className={`p-5 rounded-2xl border space-y-4 ${theme === 'dark' ? 'bg-slate-900/20 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
              <div className="flex items-center justify-between">
                {/* Quantity Controller */}
                <div className="flex items-center space-x-3.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quantity:</span>
                  <div className={`flex items-center rounded-xl border p-1 ${theme === 'dark' ? 'border-slate-800 bg-slate-950/60' : 'border-slate-250 bg-white'
                    }`}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={!isInStock}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
                        }`}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={!isInStock}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
                        }`}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${isFavorited
                      ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                      : theme === 'dark'
                        ? 'border-slate-800 text-slate-400 hover:text-rose-500 hover:bg-slate-800/40'
                        : 'border-slate-250 text-slate-600 hover:text-rose-500 hover:bg-slate-100'
                    }`}
                  title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Purchase & Cart Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className="w-full bg-slate-900/60 hover:bg-slate-800/80 text-blue-400 border border-slate-800 font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{isInStock ? 'Add To Cart' : 'Out of Stock'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!isInStock}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-5 h-5 fill-white" />
                  <span>{isInStock ? 'Buy Now' : 'Out of Stock'}</span>
                </button>
              </div>
            </div>

            {/* Assurance Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-semibold text-slate-400">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>Laboratory Tested</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Package className="w-5 h-5 text-blue-500" />
                <span>ESD Safe Shielding Bag</span>
              </div>
            </div>

          </div>

        </div>

        {/* Features & Specifications Tabs / Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-slate-800/10 pt-16 mb-20 text-left">

          {/* Features & Package Contents */}
          <div className="lg:col-span-6 space-y-10">
            {/* Features */}
            {(product.features ?? []).length > 0 && (
              <div>
                <h3 className="text-xl font-bold font-sans mb-4 bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
                  Key Features
                </h3>
                <ul className="space-y-3.5">
                  {(product.features ?? []).map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-sm">
                      <span className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Package Contents */}
            {(product.packageContents ?? []).length > 0 && (
              <div>
                <h3 className="text-xl font-bold font-sans mb-4 bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
                  Package Contents
                </h3>
                <ul className="space-y-3.5">
                  {(product.packageContents ?? []).map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-sm">
                      <span className="p-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 flex-shrink-0 mt-0.5">
                        <Package className="w-3.5 h-3.5" />
                      </span>
                      <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Specifications Table */}
          <div className="lg:col-span-6">
            <h3 className="text-xl font-bold font-sans mb-4 bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
              Specifications Table
            </h3>
            {Object.keys(product.specifications ?? product.specs ?? {}).length > 0 ? (
              <div className={`border rounded-2xl overflow-hidden ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
                }`}>
                <table className="w-full text-left border-collapse text-sm">
                  <tbody>
                    {Object.entries(product.specifications ?? product.specs ?? {}).map(([key, val], idx) => (
                      <tr
                        key={key}
                        className={`${idx % 2 === 0
                            ? theme === 'dark'
                              ? 'bg-slate-950/40'
                              : 'bg-slate-50/50'
                            : 'bg-transparent'
                          } border-b last:border-b-0 ${theme === 'dark' ? 'border-slate-800/80' : 'border-slate-100'
                          }`}
                      >
                        <td className="py-3.5 px-4 font-bold text-slate-450 w-2/5">{key}</td>
                        <td className={`py-3.5 px-4 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                          }`}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No specific specs provided for this module.</p>
            )}
          </div>

        </div>

        {/* Related Components Recommendations */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-slate-800/10 pt-16 text-left">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Curated Recommendations</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans mt-1">
                  Related Components
                </h2>
              </div>
              <button
                onClick={() => navigate('/')}
                className="text-blue-500 hover:text-blue-400 text-sm font-bold flex items-center space-x-1 cursor-pointer"
              >
                <span>View All Catalog</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p) => {
                const relId = p.id || (p as any)._id;
                return (
                  <motion.div
                    key={relId}
                    whileHover={{ y: -6, scale: 1.02 }}
                    onClick={() => navigate(`/products/${relId}`)}
                    className={`p-5 rounded-2xl border text-left flex flex-col justify-between group transition-all duration-300 cursor-pointer relative ${theme === 'dark'
                        ? 'bg-slate-900/40 border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-900/60'
                        : 'bg-white border-slate-200/85 hover:border-blue-400/50 hover:bg-slate-50/20'
                      }`}
                  >
                    <div>
                      <span className={`absolute top-4 left-4 z-10 text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${theme === 'dark' ? 'bg-slate-950/90 text-blue-400 border border-slate-800' : 'bg-blue-50/90 text-blue-600 border border-blue-100'
                        }`}>
                        {p.category}
                      </span>

                      <div className={`relative aspect-square p-6 flex items-center justify-center overflow-hidden border-b rounded-xl mb-4 ${theme === 'dark' ? 'bg-slate-950/40 border-slate-850' : 'bg-slate-50/50 border-slate-100'
                        }`}>
                        <div className="w-32 h-32 transform transition-transform duration-500 group-hover:scale-105">
                          <ProductImage id={p.imageId || p.customId || relId} className="w-full h-full" />
                        </div>
                      </div>

                      <h3 className="font-bold text-base leading-snug mb-2 group-hover:text-blue-500 transition-colors font-sans truncate">
                        {p.name}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {p.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/10 mt-auto">
                      <span className="text-lg font-black text-blue-500">₹{p.price}</span>
                      <span className="text-xs font-bold text-blue-500 group-hover:translate-x-1 transition-transform duration-300">
                        Details &rarr;
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default ProductDetails;
