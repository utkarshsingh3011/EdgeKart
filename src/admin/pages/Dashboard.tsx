import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Users,
  Clock,
  AlertTriangle,
  Plus,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Boxes,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit3
} from 'lucide-react';

import adminService, { type DashboardStatsResponse, type DashboardOrder, type DashboardUser } from '../../services/adminService';
import productService from '../../services/productService';
import type { Product } from '../../types/product';
import ProductFormModal from '../components/ProductFormModal';

const CATEGORIES = [
  'All',
  'Development Boards',
  'Sensors',
  'Displays',
  'Motors & Actuators',
  'Power Supplies',
  'Prototyping Kits',
  'Connectivity',
  'Accessories'
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Modal states for Quick Action "Add Product" or editing low stock products
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch Dashboard Stats from Backend API
  const fetchDashboardStats = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await adminService.getDashboardStats();
      if (res.success) {
        setStatsData(res);
        if (isManualRefresh) {
          showNotification('Dashboard metrics updated with live backend data', 'success');
        }
      }
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      const errMsg = err.response?.data?.message || 'Failed to connect to backend server';
      showNotification(errMsg, 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Admin Dashboard | EdgeKart';
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Handle Save product from Modal
  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      if (editingProduct) {
        const targetId = editingProduct._id || editingProduct.id || editingProduct.customId || '';
        await productService.updateProduct(targetId, productData);
        showNotification(`Product "${productData.name}" updated successfully!`, 'success');
      } else {
        await productService.createProduct(productData);
        showNotification(`New product "${productData.name}" added to catalog!`, 'success');
      }
      setIsAddModalOpen(false);
      setEditingProduct(null);
      fetchDashboardStats(true);
    } catch (err: any) {
      console.error('Error saving product:', err);
      showNotification(err.response?.data?.message || 'Failed to save product to MongoDB database', 'error');
    }
  };

  // Helper for status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Package className="w-3 h-3 mr-1" />
            Shipped
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            Processing
          </span>
        );
      case 'Ordered':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3 mr-1" />
            Ordered
          </span>
        );
    }
  };

  const kpis = {
    totalProducts: statsData?.totalProducts ?? statsData?.kpis?.totalProducts ?? 0,
    totalOrders: statsData?.totalOrders ?? statsData?.kpis?.totalOrders ?? 0,
    totalUsers: statsData?.totalUsers ?? statsData?.kpis?.totalUsers ?? 0,
    revenue: statsData?.totalRevenue ?? statsData?.kpis?.totalRevenue ?? statsData?.kpis?.revenue ?? 0,
    pendingOrders: statsData?.pendingOrders ?? statsData?.kpis?.pendingOrders ?? 0,
    lowStockCount: statsData?.lowStockProductsCount ?? statsData?.kpis?.lowStockProductsCount ?? statsData?.kpis?.lowStockCount ?? 0
  };

  const recentOrders = statsData?.recentOrders || [];
  const lowStockProducts = statsData?.lowStockProducts || [];
  const recentUsers = statsData?.recentUsers || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification Alert */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl flex items-center space-x-3 transition-all duration-300 ${
            notification.type === 'error'
              ? 'bg-rose-950/90 border-rose-800 text-rose-200'
              : notification.type === 'info'
              ? 'bg-blue-950/90 border-blue-800 text-blue-200'
              : 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass p-6 rounded-2xl border border-slate-800/80 shadow-xl">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Admin Dashboard
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
              Live Backend API
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Real-time analytics, inventory monitoring, order processing, and administrative controls.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          <button
            onClick={() => navigate('/admin/orders')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium text-xs sm:text-sm transition-all cursor-pointer hover:border-slate-700"
          >
            <ShoppingBag className="w-4 h-4 text-blue-400" />
            <span>View Orders</span>
          </button>

          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium text-xs sm:text-sm transition-all cursor-pointer hover:border-slate-700"
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>Manage Users</span>
          </button>

          <button
            onClick={() => fetchDashboardStats(true)}
            disabled={refreshing || loading}
            title="Refresh Live Data"
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (6 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* KPI 1: Total Products */}
        <div className="glass p-5 rounded-2xl border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Products
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            {loading ? (
              <div className="h-8 w-16 bg-slate-800/80 animate-pulse rounded" />
            ) : (
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                {kpis.totalProducts}
              </span>
            )}
            <span className="text-[11px] font-medium text-emerald-400 flex items-center">
              Active catalog
            </span>
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className="glass p-5 rounded-2xl border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            {loading ? (
              <div className="h-8 w-16 bg-slate-800/80 animate-pulse rounded" />
            ) : (
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                {kpis.totalOrders}
              </span>
            )}
            <span className="text-[11px] font-medium text-indigo-400 flex items-center">
              Processed
            </span>
          </div>
        </div>

        {/* KPI 3: Total Users */}
        <div className="glass p-5 rounded-2xl border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Users
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            {loading ? (
              <div className="h-8 w-16 bg-slate-800/80 animate-pulse rounded" />
            ) : (
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                {kpis.totalUsers}
              </span>
            )}
            <span className="text-[11px] font-medium text-purple-400 flex items-center">
              Registered
            </span>
          </div>
        </div>

        {/* KPI 4: Revenue */}
        <div className="glass p-5 rounded-2xl border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Revenue
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            {loading ? (
              <div className="h-8 w-24 bg-slate-800/80 animate-pulse rounded" />
            ) : (
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 tracking-tight">
                ₹{kpis.revenue.toLocaleString()}
              </span>
            )}
            <span className="text-[11px] font-medium text-slate-400 flex items-center">
              Gross Sales
            </span>
          </div>
        </div>

        {/* KPI 5: Pending Orders */}
        <div className="glass p-5 rounded-2xl border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Pending Orders
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            {loading ? (
              <div className="h-8 w-16 bg-slate-800/80 animate-pulse rounded" />
            ) : (
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">
                {kpis.pendingOrders}
              </span>
            )}
            <span className="text-[11px] font-medium text-amber-400 flex items-center">
              Needs action
            </span>
          </div>
        </div>

        {/* KPI 6: Low Stock Products */}
        <div className="glass p-5 rounded-2xl border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Low Stock
            </span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            {loading ? (
              <div className="h-8 w-16 bg-slate-800/80 animate-pulse rounded" />
            ) : (
              <span
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  kpis.lowStockCount > 0 ? 'text-rose-400' : 'text-slate-100'
                }`}
              >
                {kpis.lowStockCount}
              </span>
            )}
            <span className="text-[11px] font-medium text-rose-400 flex items-center">
              Stock &lt; 5
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout (2 Columns on large screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Orders & Low Stock List (2 Columns wide) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Orders Section */}
          <div className="glass rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center">
                  <ShoppingBag className="w-5 h-5 text-blue-400 mr-2" />
                  Recent Orders
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Latest customer hardware purchases from Express backend.
                </p>
              </div>

              <button
                onClick={() => navigate('/admin/orders')}
                className="inline-flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer group"
              >
                <span>View All Orders</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800/80">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Order ID</th>
                    <th className="py-3.5 px-4 sm:px-6">Customer</th>
                    <th className="py-3.5 px-4 sm:px-6">Amount</th>
                    <th className="py-3.5 px-4 sm:px-6">Status</th>
                    <th className="py-3.5 px-4 sm:px-6">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loading ? (
                    // Skeleton Rows
                    [...Array(4)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="py-4 px-4 sm:px-6">
                          <div className="h-4 w-24 bg-slate-800 rounded" />
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="h-4 w-32 bg-slate-800 rounded" />
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="h-4 w-16 bg-slate-800 rounded" />
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="h-6 w-20 bg-slate-800 rounded-full" />
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="h-4 w-24 bg-slate-800 rounded" />
                        </td>
                      </tr>
                    ))
                  ) : recentOrders.length > 0 ? (
                    recentOrders.map((order: DashboardOrder) => {
                      const customerName = order.user?.name || 'Customer';
                      const customerEmail = order.user?.email || 'N/A';
                      const orderPrice = order.totalPrice || order.price || 0;
                      const orderDate = order.createdAt || order.date;

                      return (
                        <tr
                          key={order._id || order.id || order.orderNumber}
                          className="hover:bg-slate-900/40 transition-colors"
                        >
                          <td className="py-4 px-4 sm:px-6 font-mono font-semibold text-slate-100">
                            {order.orderNumber || `EK-ORD-${order._id.substring(0, 6)}`}
                          </td>
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-200">{customerName}</span>
                              <span className="text-[11px] text-slate-500">{customerEmail}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 sm:px-6 font-semibold text-emerald-400">
                            ₹{orderPrice.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 sm:px-6">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="py-4 px-4 sm:px-6 text-slate-400 text-xs">
                            {orderDate
                              ? new Date(orderDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              : 'Recent'}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    // Empty state
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <ShoppingBag className="w-8 h-8 text-slate-600" />
                          <p className="text-sm font-medium">No recent orders recorded yet.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Products Section */}
          <div className="glass rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-amber-400 mr-2" />
                  Low Stock Inventory Alert
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Products with stock levels under 5 units requiring replenishment.
                </p>
              </div>

              <button
                onClick={() => navigate('/admin/products')}
                className="inline-flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer group"
              >
                <span>Manage Inventory</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-slate-800/60 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : lowStockProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {lowStockProducts.map((prod: Product) => {
                    const prodId = prod._id || prod.id || prod.customId || '';
                    return (
                      <div
                        key={prodId}
                        className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-center space-x-3.5">
                          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xs flex-shrink-0 border border-slate-700">
                            {prod.category?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-100 text-sm leading-tight">
                              {prod.name}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-[11px] text-slate-400">{prod.category}</span>
                              <span className="text-[11px] text-slate-600">•</span>
                              <span className="text-[11px] font-semibold text-emerald-400">
                                ₹{prod.price}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              prod.stock === 0
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                            }`}
                          >
                            {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} Left`}
                          </span>

                          <button
                            onClick={() => {
                              setEditingProduct(prod);
                              setIsAddModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                            title="Quick Edit Stock"
                          >
                            <Edit3 className="w-4 h-4 text-blue-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-300">All inventory levels healthy</p>
                  <p className="text-xs text-slate-500 mt-0.5">No products are currently under 5 units of stock.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Users & System Quick Stats (1 Column wide) */}
        <div className="space-y-8">
          {/* Recent Users Card */}
          <div className="glass rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center">
                  <Users className="w-4 h-4 text-purple-400 mr-2" />
                  Latest Registered Users
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Recent user account registrations.
                </p>
              </div>

              <button
                onClick={() => navigate('/admin/users')}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Manage Users"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-slate-800/60 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : recentUsers.length > 0 ? (
                <div className="space-y-3">
                  {recentUsers.map((u: DashboardUser) => (
                    <div
                      key={u._id}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                          {u.avatar || u.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-100 text-xs leading-snug">
                            {u.name}
                          </h4>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-slate-500">
                  <Users className="w-6 h-6 text-slate-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">No registered users found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Store Health Card */}
          <div className="glass p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center">
              <TrendingUp className="w-4 h-4 text-emerald-400 mr-2" />
              Administrative Overview
            </h3>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Express Server</span>
                <span className="font-semibold text-emerald-400 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-ping" />
                  Online :5000
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Database Engine</span>
                <span className="font-semibold text-blue-400">MongoDB Atlas / Local</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Catalog Health</span>
                <span className="font-semibold text-purple-400">
                  {kpis.lowStockCount === 0 ? 'Optimal' : `${kpis.lowStockCount} Low Stock`}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/admin/products')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Package className="w-4 h-4 text-blue-400" />
                <span>Go to Full Products Manager</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal for Quick Add / Edit */}
      {isAddModalOpen && (
        <ProductFormModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
          productToEdit={editingProduct}
          categories={CATEGORIES}
        />
      )}
    </div>
  );
};

export default Dashboard;
