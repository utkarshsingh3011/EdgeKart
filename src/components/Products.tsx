import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';
import type { Product } from '../types/product';
import { productService } from '../services/productService';
import { ProductCard } from './ProductCard';
import { SearchBar } from './SearchBar';
import { FilterSidebar } from './FilterSidebar';
import { SortDropdown, type SortOption } from './SortDropdown';
import { Pagination } from './Pagination';
import { EmptyState } from './EmptyState';
import { SkeletonCard } from './SkeletonCard';
import { QuickViewModal } from './QuickViewModal';

interface ProductsProps {
  theme: 'dark' | 'light';
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
}

export const Products: React.FC<ProductsProps> = ({
  theme,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchQueryChange,
  searchRef,
}) => {
  // Dynamic products loaded from MongoDB API
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  // Advanced Filter states
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [availability, setAvailability] = useState({ inStock: true, outOfStock: true });
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Mobile Drawer Toggle
  const [isFiltersOpenMobile, setIsFiltersOpenMobile] = useState(false);

  // Loading & Error states
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Quick View Modal product
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, selectedPriceRanges, availability, minRating, searchQuery, sortBy]);

  // Fetch products dynamically from MongoDB API via productService
  const fetchProductsFromApi = async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const response = await productService.getProducts({
        category: activeCategory !== 'All' ? activeCategory : undefined,
        search: searchQuery || undefined,
        sortBy: sortBy,
        limit: 100, // Fetch catalog data for responsive client-side pagination & filtering
      });

      if (response && response.data) {
        setDbProducts(response.data);
      } else {
        setDbProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products from API:', error);
      setHasError(true);
      setDbProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsFromApi();
  }, [activeCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    onSelectCategory('All');
    onSearchQueryChange('');
    setSelectedPriceRanges([]);
    setAvailability({ inStock: true, outOfStock: true });
    setMinRating(0);
    setSortBy('featured');
    setCurrentPage(1);
  };

  // Filter products from dynamic MongoDB dataset
  const filteredProducts = dbProducts.filter((product) => {
    // 1. Category filter
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;

    // 2. Search query filter (name, category, description, tags)
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    // 3. Price ranges filter
    let matchesPrice = true;
    if (selectedPriceRanges.length > 0) {
      matchesPrice = selectedPriceRanges.some((range) => {
        if (range === '0-199') return product.price <= 199;
        if (range === '200-499') return product.price >= 200 && product.price <= 499;
        if (range === '500') return product.price >= 500;
        return true;
      });
    }

    // 4. Availability filter
    const productIsStock = product.stock !== undefined ? product.stock > 0 : (product.stockCount !== undefined ? product.stockCount > 0 : (product.isStock ?? true));
    const matchesStock =
      (productIsStock && availability.inStock) || (!productIsStock && availability.outOfStock);

    // 5. Rating filter
    const matchesRating = (product.rating ?? 5.0) >= minRating;

    return matchesCategory && matchesSearch && matchesPrice && matchesStock && matchesRating;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating ?? 5.0) - (a.rating ?? 5.0);
      case 'popular':
        return (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0);
      case 'newest':
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      default:
        return 0; // featured / original array index ordering
    }
  });

  // Paginate products
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section
      id="products"
      className={`py-24 transition-colors duration-300 relative ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Component Catalog</span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans"
          >
            Featured{' '}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
              Products
            </span>
          </motion.h2>
          <p className={`text-base sm:text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Power your next prototyping project with our highly reliable, laboratory-tested hardware modules.
          </p>
        </div>

        {/* Search, Sort, Mobile Filters Row */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Custom SearchBar */}
          <div className="w-full md:max-w-md">
            <SearchBar
              value={searchQuery}
              onChange={onSearchQueryChange}
              placeholder="Search components (e.g. ESP32, sensor)..."
              theme={theme}
              searchRef={searchRef}
            />
          </div>

          {/* Filters & Sorting buttons */}
          <div className="flex items-center gap-3.5 w-full md:w-auto justify-end">
            <button
              onClick={() => setIsFiltersOpenMobile(true)}
              className={`lg:hidden flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold border transition-all cursor-pointer select-none w-full sm:w-auto ${theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-850'
                : 'bg-white border-slate-250 text-slate-700 hover:bg-slate-50'
                }`}
            >
              <Filter className="w-4 h-4 text-blue-500" />
              <span>Filters</span>
            </button>

            <SortDropdown value={sortBy} onChange={setSortBy} theme={theme} />
          </div>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Desktop Filters Sidebar / Mobile Drawer */}
          <div className="lg:col-span-3">
            <FilterSidebar
              selectedCategory={activeCategory}
              onCategoryChange={onSelectCategory}
              selectedPriceRanges={selectedPriceRanges}
              onPriceRangesChange={setSelectedPriceRanges}
              availability={availability}
              onAvailabilityChange={setAvailability}
              minRating={minRating}
              onMinRatingChange={setMinRating}
              onResetAll={handleResetFilters}
              theme={theme}
              isOpenMobile={isFiltersOpenMobile}
              onCloseMobile={() => setIsFiltersOpenMobile(false)}
            />
          </div>

          {/* Right: Products Area */}
          <div className="lg:col-span-9 space-y-8 w-full">
            {/* Dynamic Product Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400 font-medium">
                Showing{' '}
                <span className="font-semibold text-blue-500">
                  {filteredProducts.length === 0 ? 0 : startIndex + 1}–
                  {Math.min(startIndex + itemsPerPage, sortedProducts.length)}
                </span>{' '}
                of <span className="font-semibold">{sortedProducts.length}</span> products
              </p>
            </div>

            {/* Catalog Grid / Skeletons / Empty States */}
            <div className="relative min-h-[400px]">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  /* Loading Skeletons */
                  <motion.div
                    key="skeletons"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <SkeletonCard key={idx} theme={theme} />
                    ))}
                  </motion.div>
                ) : hasError ? (
                  /* Error State */
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-12"
                  >
                    <EmptyState
                      type="search"
                      theme={theme}
                      onAction={fetchProductsFromApi}
                      actionText="Retry Loading"
                      customTitle="Unable to load products"
                      customDescription="Failed to connect to product API server. Please make sure the server is running and try again."
                    />
                  </motion.div>
                ) : sortedProducts.length === 0 ? (
                  /* Reusable Empty State */
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-12"
                  >
                    <EmptyState
                      type={searchQuery ? 'search' : 'category'}
                      theme={theme}
                      onAction={handleResetFilters}
                      actionText={searchQuery ? 'Try Another Keyword' : 'Reset Filters'}
                      customTitle={searchQuery ? 'No components found' : `No products in ${activeCategory}`}
                      customDescription={
                        searchQuery
                          ? `We couldn't find anything matching "${searchQuery}". Try editing filters or keywords.`
                          : `There are currently no products stocked in ${activeCategory}. Reset filters to see our collection.`
                      }
                    />
                  </motion.div>
                ) : (
                  /* Paginated Products Grid */
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    <motion.div
                      layout
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                      <AnimatePresence mode="popLayout">
                        {paginatedProducts.map((product) => (
                          <ProductCard
                            key={product.id || (product as any)._id}
                            product={product}
                            theme={theme}
                            searchQuery={searchQuery}
                            onQuickView={() => setQuickViewProduct(product)}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.div>

                    {/* Pagination Controls */}
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      theme={theme}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
        theme={theme}
      />
    </section>
  );
};
