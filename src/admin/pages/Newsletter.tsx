import React, { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Trash2,
  X,
  UserPlus,
  UserCheck,
  UserX,
  Sparkles
} from 'lucide-react';

import adminService, {
  type NewsletterSubscriberItem,
  type NewsletterQueryParams
} from '../../services/adminService';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export const Newsletter: React.FC = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriberItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Metrics
  const [totalSubscribers, setTotalSubscribers] = useState<number>(0);
  const [activeSubscribers, setActiveSubscribers] = useState<number>(0);
  const [unsubscribedCount, setUnsubscribedCount] = useState<number>(0);
  const [newThisMonthCount, setNewThisMonthCount] = useState<number>(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Add Subscriber Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newStatus, setNewStatus] = useState<'Subscribed' | 'Unsubscribed'>('Subscribed');
  const [isSubmittingNew, setIsSubmittingNew] = useState<boolean>(false);

  // Delete Confirm Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deletingSubscriber, setDeletingSubscriber] = useState<NewsletterSubscriberItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Toast Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch subscribers from MongoDB API
  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const params: NewsletterQueryParams = {
        page,
        limit: 10,
        search: searchQuery.trim() || undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        sort: sortBy
      };

      const res = await adminService.getNewsletterSubscribers(params);
      if (res.success && Array.isArray(res.subscribers)) {
        setSubscribers(res.subscribers);
        setTotalSubscribers(res.totalSubscribers || 0);
        setActiveSubscribers(res.activeSubscribers || 0);
        setUnsubscribedCount(res.unsubscribedCount || 0);
        setNewThisMonthCount(res.newThisMonthCount || 0);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err: any) {
      console.error('Error fetching newsletter subscribers:', err);
      showNotification(err.response?.data?.message || 'Failed to fetch subscribers from MongoDB', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, statusFilter, sortBy]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isAddModalOpen || deleteModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isAddModalOpen, deleteModalOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!isSubmittingNew) setIsAddModalOpen(false);
        if (!isDeleting) {
          setDeleteModalOpen(false);
          setDeletingSubscriber(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmittingNew, isDeleting]);

  // Handle Add Subscriber
  const handleAddSubscriberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      showNotification('Email address is required', 'error');
      return;
    }

    setIsSubmittingNew(true);
    try {
      const res = await adminService.addNewsletterSubscriber({
        email: newEmail.trim(),
        name: newName.trim(),
        status: newStatus
      });

      if (res.success) {
        showNotification(res.message || 'Subscriber added successfully!');
        setIsAddModalOpen(false);
        setNewEmail('');
        setNewName('');
        setNewStatus('Subscribed');
        fetchSubscribers();
      }
    } catch (err: any) {
      console.error('Add subscriber error:', err);
      showNotification(err.response?.data?.message || 'Failed to add subscriber', 'error');
    } finally {
      setIsSubmittingNew(false);
    }
  };

  // Toggle Subscription Status (Unsubscribe / Resubscribe)
  const handleToggleStatus = async (sub: NewsletterSubscriberItem) => {
    const targetId = sub._id || sub.id || '';
    const newStatusTarget: 'Subscribed' | 'Unsubscribed' =
      sub.status === 'Subscribed' ? 'Unsubscribed' : 'Subscribed';

    setActionLoadingId(targetId);
    try {
      const res = await adminService.updateNewsletterStatus(targetId, newStatusTarget);
      if (res.success && res.data) {
        showNotification(`Subscriber "${sub.email}" is now ${newStatusTarget.toLowerCase()}.`);
        setSubscribers((prev) =>
          prev.map((s) => ((s._id || s.id) === targetId ? { ...s, status: newStatusTarget } : s))
        );
        fetchSubscribers();
      }
    } catch (err: any) {
      console.error('Toggle status error:', err);
      showNotification(err.response?.data?.message || 'Failed to update subscriber status', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Delete Subscriber
  const handleDeleteConfirm = async () => {
    if (!deletingSubscriber) return;
    const targetId = deletingSubscriber._id || deletingSubscriber.id || '';
    const targetEmail = deletingSubscriber.email;

    setIsDeleting(true);
    try {
      await adminService.deleteNewsletterSubscriber(targetId);
      showNotification(`Subscriber "${targetEmail}" deleted successfully.`);
      setSubscribers((prev) => prev.filter((s) => (s._id || s.id) !== targetId));
    } catch (err: any) {
      console.error('Delete subscriber error:', err);
      showNotification(err.response?.data?.message || `Failed to delete subscriber.`, 'error');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setDeletingSubscriber(null);
      fetchSubscribers();
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
            Newsletter Subscribers
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage EdgeKart Developer Club subscriber lists, review active memberships, and update subscription status.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Subscriber</span>
          </button>

          <button
            onClick={fetchSubscribers}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Subscribers</span>
            <Mail className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-2">{totalSubscribers}</p>
        </div>

        <div className="glass p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Subscribed</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-2">{activeSubscribers}</p>
        </div>

        <div className="glass p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Unsubscribed</span>
            <UserX className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-300 mt-2">{unsubscribedCount}</p>
        </div>

        <div className="glass p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">New This Month</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-purple-400 mt-2">{newThisMonthCount}</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass p-4 rounded-2xl border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search Bar */}
        <div className="lg:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search subscriber by email address or name..."
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* Status Filter */}
        <div className="lg:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
          >
            <option value="All">Subscription Status: All</option>
            <option value="Subscribed">Subscribed Only</option>
            <option value="Unsubscribed">Unsubscribed Only</option>
          </select>
        </div>

        {/* Sort By Filter */}
        <div className="lg:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
          </select>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="glass rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Email Address</th>
                <th className="px-4 py-3.5">Name</th>
                <th className="px-4 py-3.5">Subscription Status</th>
                <th className="px-4 py-3.5">Joined Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-slate-400 text-xs">Loading newsletter subscribers from MongoDB...</p>
                    </div>
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Mail className="w-8 h-8 text-slate-600 mb-1" />
                      <p className="font-medium text-slate-300">No newsletter subscribers match your query.</p>
                      <p className="text-slate-500 text-[11px]">Try adjusting your search email or status filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => {
                  const targetId = sub._id || sub.id || '';
                  const isRowUpdating = actionLoadingId === targetId;

                  return (
                    <tr key={targetId} className="hover:bg-slate-900/50 transition-colors">
                      {/* Email Address */}
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold flex-shrink-0">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-100">{sub.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Name */}
                      <td className="px-4 py-4 text-slate-300 font-medium">
                        {sub.name ? sub.name : <span className="text-slate-500 italic">Developer Subscriber</span>}
                      </td>

                      {/* Subscription Status Badge */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            sub.status === 'Subscribed'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {sub.status === 'Subscribed' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Subscribed
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-slate-500" /> Unsubscribed
                            </>
                          )}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="px-4 py-4 text-slate-400 text-xs">
                        {sub.createdAt
                          ? new Date(sub.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Toggle Status Button */}
                          <button
                            onClick={() => handleToggleStatus(sub)}
                            disabled={isRowUpdating}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 ${
                              sub.status === 'Subscribed'
                                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                            }`}
                          >
                            {sub.status === 'Subscribed' ? 'Unsubscribe' : 'Resubscribe'}
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              setDeletingSubscriber(sub);
                              setDeleteModalOpen(true);
                            }}
                            disabled={isRowUpdating}
                            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer disabled:opacity-40"
                            title="Delete Subscriber Record"
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
            Showing <span className="font-medium text-slate-200">{subscribers.length}</span> of{' '}
            <span className="font-medium text-slate-200">{totalSubscribers}</span> subscribers
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

      {/* Add Subscriber Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => {
            if (!isSubmittingNew) setIsAddModalOpen(false);
          }}
        >
          <div
            className="glass w-full max-w-md p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-5 relative bg-slate-950"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-400" />
                Add New Subscriber
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                disabled={isSubmittingNew}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubscriberSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="subscriber@example.com"
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subscriber Name (Optional)</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Initial Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as 'Subscribed' | 'Unsubscribed')}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                >
                  <option value="Subscribed">Subscribed</option>
                  <option value="Unsubscribed">Unsubscribed</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmittingNew}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNew || !newEmail.trim()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center space-x-2 shadow-lg shadow-blue-500/20 disabled:opacity-40 cursor-pointer"
                >
                  {isSubmittingNew ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Add Subscriber</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setDeletingSubscriber(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title={deletingSubscriber ? `Delete Subscriber "${deletingSubscriber.email}"` : 'Delete Subscriber'}
        message={
          deletingSubscriber
            ? `Are you sure you want to delete subscriber record for "${deletingSubscriber.email}"? This will permanently erase their entry from MongoDB.`
            : 'Are you sure you want to delete this subscriber? This action cannot be undone.'
        }
      />
    </div>
  );
};

export default Newsletter;
