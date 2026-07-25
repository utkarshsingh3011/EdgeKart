import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Star,
  Edit2,
  Trash2,
  Package,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { productService, type ProductQueryParams } from '../../services/productService';
import type { Product } from '../../types/product';
import ProductFormModal from '../components/ProductFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const CATEGORIES = [
  'All',
  'Development Boards',
  'Sensors',
  'Displays',
  'Motors & Actuators',
  'Power Supplies',
  'Prototyping Kits',
  'Connectivity'
];

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState<'All' | 'In Stock' | 'Low Stock' | 'Out of Stock'>('All');
  const [featuredFilter, setFeaturedFilter] = useState<'All' | 'Featured' | 'Non-Featured'>('All');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProductsCount, setTotalProductsCount] = useState(0);

  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch products from MongoDB API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let stockStatusParam: string | undefined;
      if (stockFilter === 'In Stock') stockStatusParam = 'inStock';
      if (stockFilter === 'Low Stock') stockStatusParam = 'lowStock';
      if (stockFilter === 'Out of Stock') stockStatusParam = 'outOfStock';

      let featuredParam: boolean | undefined;
      if (featuredFilter === 'Featured') featuredParam = true;
      if (featuredFilter === 'Non-Featured') featuredParam = false;

      const params: ProductQueryParams = {
        page,
        limit: 10,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        stockStatus: stockStatusParam,
        featured: featuredParam,
        search: searchQuery.trim() || undefined,
        sortBy
      };

      const res = await productService.getProducts(params);
      if (res.success && Array.isArray(res.data)) {
        setProducts(res.data);
        setTotalProductsCount(res.totalProducts || res.data.length);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err: any) {
      console.error('Error fetching products from API:', err);
      showNotification(err.response?.data?.message || 'Failed to fetch products from backend server', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, stockFilter, featuredFilter, searchQuery, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Create / Edit save via API
  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (editingProduct) {
      const targetId = editingProduct._id || editingProduct.id || editingProduct.customId || '';
      try {
        await productService.updateProduct(targetId, productData);
        showNotification(`Product "${productData.name}" updated successfully.`);
      } catch (err: any) {
        console.error('Update product error:', err);
        showNotification(err.response?.data?.message || `Failed to update "${productData.name}".`, 'error');
        throw err;
      }
    } else {
      try {
        await productService.createProduct(productData);
        showNotification(`Product "${productData.name}" created successfully.`);
      } catch (err: any) {
        console.error('Create product error:', err);
        showNotification(err.response?.data?.message || `Failed to create "${productData.name}".`, 'error');
        throw err;
      }
    }
    fetchProducts();
  };

  // Handle Delete confirm via API
  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    const targetId = deletingProduct._id || deletingProduct.id || deletingProduct.customId || '';
    const prodName = deletingProduct.name;

    try {
      await productService.deleteProduct(targetId);
      // Immediately remove from state for instant UI update
      setProducts((prev) => prev.filter((p) => (p._id || p.id || p.customId) !== targetId));
      showNotification(`Product "${prodName}" deleted successfully.`);
    } catch (err: any) {
      console.error('Delete product error:', err);
      showNotification(err.response?.data?.message || `Failed to delete "${prodName}".`, 'error');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setDeletingProduct(null);
      fetchProducts();
    }
  };

  // Handle Quick Toggle Featured Status via API
  const handleToggleFeatured = async (product: Product) => {
    const targetId = product._id || product.id || product.customId || '';
    try {
      await productService.toggleFeatured(targetId);
      showNotification(`Toggled featured status for "${product.name}".`);
      fetchProducts();
    } catch (err: any) {
      console.error('Toggle featured error:', err);
      showNotification(err.response?.data?.message || `Failed to update featured status.`, 'error');
    }
  };

  // Handle Quick Stock Update via API
  const handleStockChange = async (product: Product, delta: number) => {
    const targetId = product._id || product.id || product.customId || '';
    const currentStock = product.stock ?? product.stockCount ?? 0;
    const newStock = Math.max(0, currentStock + delta);

    if (newStock < 0 || (delta < 0 && currentStock <= 0)) return;

    // Optimistically update local state for instantaneous UI refresh
    setProducts((prev) =>
      prev.map((p) => ((p._id || p.id || p.customId) === targetId ? { ...p, stock: newStock } : p))
    );

    setUpdatingStockId(targetId);

    try {
      await productService.updateStock(targetId, newStock);
      showNotification(`Updated stock for "${product.name}" to ${newStock}.`);
    } catch (err: any) {
      console.error('Update stock error:', err);
      // Revert optimistic update on failure
      setProducts((prev) =>
        prev.map((p) => ((p._id || p.id || p.customId) === targetId ? { ...p, stock: currentStock } : p))
      );
      showNotification(err.response?.data?.message || `Failed to update stock for "${product.name}".`, 'error');
    } finally {
      setUpdatingStockId(null);
      fetchProducts();
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Alert */}
      {notification && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-2 ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Products Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage inventory, pricing, stock alerts, and featured hardware items.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
            title="Refresh Products"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setFormModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass p-4 rounded-2xl border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search Bar */}
        <div className="lg:col-span-3 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title, SKU, brand, category..."
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* Category Filter */}
        <div className="lg:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Status Filter */}
        <div className="lg:col-span-2">
          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value as any);
              setPage(1);
            }}
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
          >
            <option value="All">Stock: All</option>
            <option value="In Stock">In Stock (&gt; 0)</option>
            <option value="Low Stock">Low Stock (&le; 5)</option>
            <option value="Out of Stock">Out of Stock (0)</option>
          </select>
        </div>

        {/* Featured Filter */}
        <div className="lg:col-span-2">
          <select
            value={featuredFilter}
            onChange={(e) => {
              setFeaturedFilter(e.target.value as any);
              setPage(1);
            }}
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
          >
            <option value="All">Featured: All</option>
            <option value="Featured">Featured Only</option>
            <option value="Non-Featured">Non-Featured</option>
          </select>
        </div>

        {/* Sort By Filter */}
        <div className="lg:col-span-2">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="glass rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Price</th>
                <th className="px-4 py-3.5">Stock Level</th>
                <th className="px-4 py-3.5 text-center">Featured</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-slate-400 text-xs">Loading hardware products catalog...</p>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Package className="w-8 h-8 text-slate-600 mb-1" />
                      <p className="font-medium text-slate-300">No hardware products match filters.</p>
                      <p className="text-slate-500 text-[11px]">Try adjusting your search query or filter parameters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const stockNum = product.stock ?? product.stockCount ?? 0;
                  const isLowStock = stockNum > 0 && stockNum <= 5;
                  const isOutOfStock = stockNum === 0;

                  return (
                    <tr key={product.id || product._id} className="hover:bg-slate-900/50 transition-colors">
                      {/* Product Name & Artwork */}
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 font-bold flex-shrink-0">
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                              <span>{product.name}</span>
                              {product.isNew && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                  NEW
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">
                              {product.sku || product.customId || product.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 rounded-lg text-slate-300 bg-slate-900 border border-slate-800 text-[11px]">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-100">₹{product.price}</div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-[10px] text-slate-500 line-through">₹{product.originalPrice}</div>
                        )}
                      </td>

                      {/* Stock Adjustment Controls */}
                      <td className="px-4 py-4">
                        {(() => {
                          const prodId = product._id || product.id || product.customId;
                          const isRowUpdating = updatingStockId === prodId;

                          return (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleStockChange(product, -1)}
                                disabled={stockNum <= 0 || isRowUpdating}
                                className="w-6 h-6 rounded-md bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 font-bold flex items-center justify-center transition-colors cursor-pointer"
                                title={stockNum <= 0 ? 'Stock is at 0 (Cannot decrease further)' : 'Decrease Stock'}
                              >
                                -
                              </button>
                              <span className="font-mono font-semibold text-slate-200 min-w-[28px] text-center flex items-center justify-center">
                                {isRowUpdating ? (
                                  <RefreshCw className="w-3 h-3 text-blue-400 animate-spin" />
                                ) : (
                                  stockNum
                                )}
                              </span>
                              <button
                                onClick={() => handleStockChange(product, 1)}
                                disabled={isRowUpdating}
                                className="w-6 h-6 rounded-md bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 font-bold flex items-center justify-center transition-colors cursor-pointer"
                                title="Increase Stock"
                              >
                                +
                              </button>
                            </div>
                          );
                        })()}
                      </td>

                      {/* Featured Toggle */}
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            product.featured
                              ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                              : 'text-slate-600 hover:text-slate-400'
                          }`}
                          title={product.featured ? 'Featured Product (Click to unfeature)' : 'Not Featured (Click to feature)'}
                        >
                          <Star className={`w-4 h-4 ${product.featured ? 'fill-amber-400' : ''}`} />
                        </button>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            isOutOfStock
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : isLowStock
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}
                        >
                          {isOutOfStock ? (
                            <XCircle className="w-3 h-3" />
                          ) : isLowStock ? (
                            <AlertCircle className="w-3 h-3" />
                          ) : (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setFormModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-blue-400 transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingProduct(product);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 bg-slate-950/40">
          <div>
            Showing <span className="font-medium text-slate-200">{products.length}</span> of{' '}
            <span className="font-medium text-slate-200">{totalProductsCount}</span> products
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-slate-300">
              Page {page} of {totalPages || 1}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Form Modal (Add / Edit) */}
      <ProductFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
        categories={CATEGORIES.filter((c) => c !== 'All')}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setDeletingProduct(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title={deletingProduct ? `Delete "${deletingProduct.name}"` : 'Delete Hardware Product'}
        message={
          deletingProduct
            ? `Are you sure you want to delete "${deletingProduct.name}" (SKU: ${deletingProduct.sku || 'N/A'})? This action will permanently remove the product from the MongoDB database.`
            : 'Are you sure you want to delete this hardware product? This action cannot be undone.'
        }
      />
    </div>
  );
};

export default Products;
