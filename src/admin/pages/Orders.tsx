import React, { useState, useEffect, useCallback } from 'react';
import {
  ShoppingBag,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  User,
  MapPin,
  CreditCard,
  Trash2,
  Boxes
} from 'lucide-react';

import adminService, {
  type AdminOrder,
  type AdminOrdersQueryParams
} from '../../services/adminService';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const ORDER_STATUSES = ['Ordered', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
const PAYMENT_STATUSES = ['Paid', 'Pending', 'Failed', 'Refunded'];

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('All');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('All');

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalOrdersCount, setTotalOrdersCount] = useState<number>(0);

  // Detail Drawer & Modals state
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deletingOrder, setDeletingOrder] = useState<AdminOrder | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Notification state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch orders from MongoDB API
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params: AdminOrdersQueryParams = {
        page,
        limit: 10,
        search: searchQuery.trim() || undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        paymentStatus: paymentStatusFilter !== 'All' ? paymentStatusFilter : undefined,
        dateRange: dateRangeFilter !== 'All' ? dateRangeFilter : undefined
      };

      const res = await adminService.getAdminOrders(params);
      if (res.success && Array.isArray(res.orders)) {
        setOrders(res.orders);
        setTotalOrdersCount(res.totalOrders || res.orders.length);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err: any) {
      console.error('Error fetching admin orders:', err);
      showNotification(err.response?.data?.message || 'Failed to load orders from MongoDB', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, statusFilter, paymentStatusFilter, dateRangeFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Lock body scrolling when modal or drawer is active
  useEffect(() => {
    if (selectedOrder || deleteModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedOrder, deleteModalOpen]);

  // Handle Escape key press to close drawer or modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedOrder(null);
        if (!isDeleting) {
          setDeleteModalOpen(false);
          setDeletingOrder(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDeleting]);

  // Update order status in MongoDB
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const res = await adminService.updateOrderStatus(orderId, newStatus);
      if (res.success && res.order) {
        showNotification(`Order status updated to "${newStatus}"`);
        setSelectedOrder(res.order);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId || o.orderNumber === orderId ? res.order : o))
        );
      }
    } catch (err: any) {
      console.error('Update status error:', err);
      showNotification(err.response?.data?.message || 'Failed to update order status', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Update payment status in MongoDB
  const handleUpdatePaymentStatus = async (orderId: string, newPaymentStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const res = await adminService.updateOrderStatus(orderId, undefined, newPaymentStatus);
      if (res.success && res.order) {
        showNotification(`Payment status updated to "${newPaymentStatus}"`);
        setSelectedOrder(res.order);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId || o.orderNumber === orderId ? res.order : o))
        );
      }
    } catch (err: any) {
      console.error('Update payment status error:', err);
      showNotification(err.response?.data?.message || 'Failed to update payment status', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Confirm delete order
  const handleDeleteConfirm = async () => {
    if (!deletingOrder) return;
    setIsDeleting(true);
    const orderId = deletingOrder._id || deletingOrder.orderNumber;
    const num = deletingOrder.orderNumber;

    try {
      await adminService.deleteOrder(orderId);
      showNotification(`Order ${num} deleted successfully.`);
      if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.orderNumber === num)) {
        setSelectedOrder(null);
      }
      setOrders((prev) => prev.filter((o) => o._id !== orderId && o.orderNumber !== num));
    } catch (err: any) {
      console.error('Delete order error:', err);
      showNotification(err.response?.data?.message || `Failed to delete order ${num}.`, 'error');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setDeletingOrder(null);
      fetchOrders();
    }
  };

  // Helper badge for status rendering
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
            <Truck className="w-3 h-3 mr-1" />
            Shipped
          </span>
        );
      case 'Packed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Boxes className="w-3 h-3 mr-1" />
            Packed
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            Processing
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
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

  // Helper badge for payment status
  const getPaymentStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'Paid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Paid
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Pending
          </span>
        );
      case 'Failed':
      case 'Refunded':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            {paymentStatus}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-300">
            {paymentStatus || 'Paid'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitor customer hardware orders, track fulfillment timeline, inspect invoices, and update dispatch statuses.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer self-start sm:self-auto"
          title="Refresh Orders"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass p-4 rounded-2xl border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="lg:col-span-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by Order ID (EK-ORD-...) or Customer..."
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* Order Status Filter */}
        <div className="lg:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
          >
            <option value="All">Order Status: All</option>
            {ORDER_STATUSES.map((st) => (
              <option key={st} value={st}>
                Status: {st}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status Filter */}
        <div className="lg:col-span-3">
          <select
            value={paymentStatusFilter}
            onChange={(e) => {
              setPaymentStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
          >
            <option value="All">Payment Status: All</option>
            {PAYMENT_STATUSES.map((ps) => (
              <option key={ps} value={ps}>
                Payment: {ps}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="lg:col-span-2">
          <select
            value={dateRangeFilter}
            onChange={(e) => {
              setDateRangeFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
          >
            <option value="All">Date: All Time</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="glass rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-4 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Products</th>
                <th className="px-4 py-3.5">Total Amount</th>
                <th className="px-4 py-3.5">Payment</th>
                <th className="px-4 py-3.5">Order Status</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-slate-400 text-xs">Fetching hardware orders from MongoDB...</p>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <ShoppingBag className="w-8 h-8 text-slate-600 mb-1" />
                      <p className="font-medium text-slate-300">No customer orders match search/filters.</p>
                      <p className="text-slate-500 text-[11px]">Try clearing search keywords or selecting different status options.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const customerName = order.user?.name || 'Customer';
                  const customerEmail = order.user?.email || 'N/A';
                  const itemsCount = order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
                  const firstItemName = order.items && order.items.length > 0 ? order.items[0].name : 'Hardware Item';
                  const orderTotal = order.totalPrice || order.price || 0;
                  const orderDate = order.createdAt || order.date;

                  return (
                    <tr
                      key={order._id || order.orderNumber}
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-slate-900/50 transition-colors cursor-pointer group"
                    >
                      {/* Order ID */}
                      <td className="px-5 py-4 font-mono font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                        {order.orderNumber || `EK-ORD-${order._id.substring(0, 6)}`}
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-[11px]">
                            {order.user?.avatar || customerName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-200">{customerName}</span>
                            <span className="text-[11px] text-slate-500">{customerEmail}</span>
                          </div>
                        </div>
                      </td>

                      {/* Products Summary */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-200 truncate max-w-[180px]" title={firstItemName}>
                            {firstItemName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="px-4 py-4 font-bold text-emerald-400">
                        ₹{orderTotal.toLocaleString()}
                      </td>

                      {/* Payment Status */}
                      <td className="px-4 py-4">
                        {getPaymentStatusBadge(order.paymentStatus || 'Paid')}
                      </td>

                      {/* Order Status */}
                      <td className="px-4 py-4">
                        {getStatusBadge(order.status)}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 text-slate-400 text-xs">
                        {orderDate
                          ? new Date(orderDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-blue-400 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>

                          <button
                            onClick={() => {
                              setDeletingOrder(order);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                            title="Delete Order"
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
            Showing <span className="font-medium text-slate-200">{orders.length}</span> of{' '}
            <span className="font-medium text-slate-200">{totalOrdersCount}</span> orders
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

      {/* Side Drawer: Order Details & Status Timeline */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-slate-950 border-l border-slate-800 shadow-2xl h-full flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <span>{selectedOrder.orderNumber}</span>
                    {getStatusBadge(selectedOrder.status)}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Placed on{' '}
                    {new Date(selectedOrder.createdAt || selectedOrder.date || '').toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Order Status Control Box */}
              <div className="glass p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Update Order Status
                  </span>
                  {isUpdatingStatus && (
                    <span className="text-xs text-blue-400 flex items-center">
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Saving to MongoDB...
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {ORDER_STATUSES.map((st) => {
                    const isActive = selectedOrder.status === st;
                    return (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(selectedOrder._id || selectedOrder.orderNumber, st)}
                        disabled={isUpdatingStatus}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Order Fulfillment Timeline Progress */}
              <div className="glass p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Fulfillment Progress Timeline
                </span>

                {selectedOrder.status === 'Cancelled' ? (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center">
                    <XCircle className="w-4 h-4 text-rose-400 mr-2 flex-shrink-0" />
                    This order has been cancelled and fulfillment is stopped.
                  </div>
                ) : (
                  <div className="relative flex items-center justify-between pt-2">
                    {/* Progress Bar Background Line */}
                    <div className="absolute left-4 right-4 top-5 h-0.5 bg-slate-800 -z-0" />

                    {['Ordered', 'Processing', 'Packed', 'Shipped', 'Delivered'].map((step, idx) => {
                      const timelineSteps = ['Ordered', 'Processing', 'Packed', 'Shipped', 'Delivered'];
                      const currentIdx = timelineSteps.indexOf(selectedOrder.status);
                      const isDone = currentIdx >= idx;
                      const isCurrent = currentIdx === idx;

                      return (
                        <div key={step} className="flex flex-col items-center relative z-10">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                              isCurrent
                                ? 'bg-blue-600 text-white border-blue-400 ring-4 ring-blue-500/20'
                                : isDone
                                ? 'bg-emerald-500 text-white border-emerald-400'
                                : 'bg-slate-900 text-slate-600 border-slate-800'
                            }`}
                          >
                            {isDone ? '✓' : idx + 1}
                          </div>
                          <span
                            className={`text-[10px] font-medium mt-1.5 ${
                              isCurrent ? 'text-blue-400 font-bold' : isDone ? 'text-slate-200' : 'text-slate-600'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Customer & Payment Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Details */}
                <div className="glass p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center">
                    <User className="w-3.5 h-3.5 text-purple-400 mr-1.5" />
                    Customer Details
                  </h4>
                  <div className="text-xs text-slate-200 space-y-1">
                    <p className="font-bold text-sm text-slate-100">{selectedOrder.user?.name || 'Customer'}</p>
                    <p className="text-slate-400">{selectedOrder.user?.email || 'N/A'}</p>
                    <p className="text-slate-500 text-[11px]">Role: {selectedOrder.user?.role || 'Customer'}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="glass p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                    Shipping Address
                  </h4>
                  <div className="text-xs text-slate-300 space-y-0.5">
                    <p>{selectedOrder.shippingAddress?.address || '101 Prototype Lab, Silicon Valley'}</p>
                    <p>
                      {selectedOrder.shippingAddress?.city || 'Bangalore'}, {selectedOrder.shippingAddress?.postalCode || '560001'}
                    </p>
                    <p className="text-slate-400">{selectedOrder.shippingAddress?.country || 'India'}</p>
                  </div>
                </div>
              </div>

              {/* Ordered Products Table */}
              <div className="glass rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-3.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center">
                    <Package className="w-4 h-4 text-emerald-400 mr-1.5" />
                    Ordered Products ({selectedOrder.items?.length || 0})
                  </h4>
                </div>

                <div className="divide-y divide-slate-800/60">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, i) => (
                      <div key={i} className="p-3.5 flex items-center justify-between hover:bg-slate-900/40 text-xs">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 font-bold flex-shrink-0">
                            <Package className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-slate-100">{item.name}</h5>
                            <p className="text-[11px] text-slate-500">
                              Unit Price: ₹{item.price} × Qty: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <span className="font-bold text-emerald-400">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-xs text-slate-500 text-center">No order line items listed.</p>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="glass p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-semibold text-slate-400 flex items-center">
                    <CreditCard className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                    Payment ({selectedOrder.paymentMethod || 'Online Payment'})
                  </span>
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedOrder.paymentStatus || 'Paid'}
                      onChange={(e) => handleUpdatePaymentStatus(selectedOrder._id || selectedOrder.orderNumber, e.target.value)}
                      disabled={isUpdatingStatus}
                      className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {PAYMENT_STATUSES.map((ps) => (
                        <option key={ps} value={ps}>
                          {ps}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Items Subtotal</span>
                  <span>₹{(selectedOrder.itemsPrice || selectedOrder.totalPrice).toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">GST Tax (18%)</span>
                  <span>₹{(selectedOrder.taxPrice || 0).toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Shipping Charge</span>
                  <span>{selectedOrder.shippingPrice === 0 ? 'FREE' : `₹${selectedOrder.shippingPrice}`}</span>
                </div>

                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount Applied</span>
                    <span>-₹{selectedOrder.discountAmount}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-slate-100">
                  <span>Grand Total</span>
                  <span className="text-emerald-400">₹{(selectedOrder.totalPrice || selectedOrder.price || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Order Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setDeletingOrder(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title={deletingOrder ? `Delete Order ${deletingOrder.orderNumber}` : 'Delete Order Record'}
        message={
          deletingOrder
            ? `Are you sure you want to delete order ${deletingOrder.orderNumber} placed by ${deletingOrder.user?.name || 'Customer'}? This will permanently remove the order record from MongoDB.`
            : 'Are you sure you want to delete this order? This action cannot be undone.'
        }
      />
    </div>
  );
};

export default Orders;
