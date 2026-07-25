import React, { useState, useEffect, useCallback } from 'react';
import {
  Users as UsersIcon,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Shield,
  ShieldAlert,
  Ban,
  CheckCircle2,
  Trash2,
  X,
  ShoppingBag,
  Heart,
  ShoppingCart,
  Calendar
} from 'lucide-react';

import adminService, {
  type AdminUserItem,
  type AdminUsersQueryParams,
  type AdminOrder
} from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export const Users: React.FC = () => {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalUsersCount, setTotalUsersCount] = useState<number>(0);

  // Detail Drawer state
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);
  const [selectedUserOrders, setSelectedUserOrders] = useState<AdminOrder[]>([]);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Delete Confirm Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deletingUser, setDeletingUser] = useState<AdminUserItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Toast Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch users from MongoDB API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: AdminUsersQueryParams = {
        page,
        limit: 10,
        search: searchQuery.trim() || undefined,
        role: roleFilter !== 'All' ? roleFilter : undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        sort: sortBy
      };

      const res = await adminService.getAdminUsers(params);
      if (res.success && Array.isArray(res.users)) {
        setUsers(res.users);
        setTotalUsersCount(res.totalUsers || res.users.length);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err: any) {
      console.error('Error fetching admin users:', err);
      showNotification(err.response?.data?.message || 'Failed to fetch users from MongoDB', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, roleFilter, statusFilter, sortBy]);

  useEffect(() => {
    document.title = 'Users Management | EdgeKart';
    fetchUsers();
  }, [fetchUsers]);

  // Fetch user detailed profile and order history when opening drawer
  const openUserDrawer = async (userItem: AdminUserItem) => {
    setSelectedUser(userItem);
    setLoadingDetail(true);
    try {
      const targetId = userItem._id || userItem.id || '';
      const res = await adminService.getAdminUserById(targetId);
      if (res.success && res.user) {
        setSelectedUser(res.user);
        setSelectedUserOrders(res.orders || []);
      }
    } catch (err: any) {
      console.error('Error fetching user detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Lock body scrolling when drawer or modal is active
  useEffect(() => {
    if (selectedUser || deleteModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedUser, deleteModalOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedUser(null);
        if (!isDeleting) {
          setDeleteModalOpen(false);
          setDeletingUser(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDeleting]);

  // Handle Promote / Demote Role
  const handleToggleRole = async (targetUser: AdminUserItem) => {
    const targetId = targetUser._id || targetUser.id || '';
    const newRole: 'admin' | 'user' = targetUser.role === 'admin' ? 'user' : 'admin';

    // Client-side safety check: logged-in admin demotion
    if (currentUser?.id === targetId || currentUser?._id === targetId) {
      showNotification('Safety block: You cannot demote your own active admin account.', 'error');
      return;
    }

    setActionLoadingId(targetId);
    try {
      const res = await adminService.updateUserRole(targetId, newRole);
      if (res.success && res.user) {
        showNotification(`User role updated to "${newRole}"`);
        setUsers((prev) =>
          prev.map((u) => ((u._id || u.id) === targetId ? { ...u, role: newRole } : u))
        );
        if (selectedUser && (selectedUser._id === targetId || selectedUser.id === targetId)) {
          setSelectedUser({ ...selectedUser, role: newRole });
        }
      }
    } catch (err: any) {
      console.error('Update role error:', err);
      showNotification(err.response?.data?.message || 'Failed to update user role', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Block / Unblock Account
  const handleToggleBlock = async (targetUser: AdminUserItem) => {
    const targetId = targetUser._id || targetUser.id || '';
    const newBlockState = !targetUser.isBlocked;

    // Client-side safety check: logged-in admin blocking
    if ((currentUser?.id === targetId || currentUser?._id === targetId) && newBlockState) {
      showNotification('Safety block: You cannot block your own active admin account.', 'error');
      return;
    }

    setActionLoadingId(targetId);
    try {
      const res = await adminService.toggleUserBlock(targetId, newBlockState);
      if (res.success && res.user) {
        showNotification(`User account ${newBlockState ? 'blocked' : 'unblocked'} successfully.`);
        setUsers((prev) =>
          prev.map((u) => ((u._id || u.id) === targetId ? { ...u, isBlocked: newBlockState } : u))
        );
        if (selectedUser && (selectedUser._id === targetId || selectedUser.id === targetId)) {
          setSelectedUser({ ...selectedUser, isBlocked: newBlockState });
        }
      }
    } catch (err: any) {
      console.error('Toggle block error:', err);
      showNotification(err.response?.data?.message || 'Failed to update user status', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;
    const targetId = deletingUser._id || deletingUser.id || '';
    const name = deletingUser.name;

    // Client-side safety check: logged-in admin deletion
    if (currentUser?.id === targetId || currentUser?._id === targetId) {
      showNotification('Safety block: You cannot delete your own active admin account.', 'error');
      setDeleteModalOpen(false);
      setDeletingUser(null);
      return;
    }

    setIsDeleting(true);
    try {
      await adminService.deleteUser(targetId);
      showNotification(`User "${name}" deleted successfully.`);
      if (selectedUser && (selectedUser._id === targetId || selectedUser.id === targetId)) {
        setSelectedUser(null);
      }
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== targetId));
    } catch (err: any) {
      console.error('Delete user error:', err);
      showNotification(err.response?.data?.message || `Failed to delete user "${name}".`, 'error');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setDeletingUser(null);
      fetchUsers();
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
            Users Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage customer accounts, inspect administrative role permissions, and review user profile records.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer self-start sm:self-auto"
          title="Refresh Users List"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass p-4 rounded-2xl border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search Bar */}
        <div className="lg:col-span-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search users by name or email address..."
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* Role Filter */}
        <div className="lg:col-span-3">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
          >
            <option value="All">Role: All</option>
            <option value="admin">Admins Only</option>
            <option value="user">Customers / Users</option>
          </select>
        </div>

        {/* Account Status Filter */}
        <div className="lg:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
          >
            <option value="All">Account Status: All</option>
            <option value="Active">Active Accounts</option>
            <option value="Blocked">Blocked Accounts</option>
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
            <option value="oldest">Sort: Oldest</option>
            <option value="most-orders">Sort: Most Orders</option>
            <option value="alphabetical">Sort: A - Z</option>
          </select>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="glass rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">User Profile</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Joined Date</th>
                <th className="px-4 py-3.5 text-center">Orders</th>
                <th className="px-4 py-3.5 text-center">Wishlist</th>
                <th className="px-4 py-3.5 text-center">Cart</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-slate-400 text-xs">Fetching registered user accounts from MongoDB...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <UsersIcon className="w-8 h-8 text-slate-600 mb-1" />
                      <p className="font-medium text-slate-300">No user accounts match search/filters.</p>
                      <p className="text-slate-500 text-[11px]">Try adjusting your search query or role filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const targetId = u._id || u.id || '';
                  const isCurrent = currentUser?.id === targetId || currentUser?._id === targetId;
                  const isRowActionLoading = actionLoadingId === targetId;

                  return (
                    <tr
                      key={targetId}
                      onClick={() => openUserDrawer(u)}
                      className="hover:bg-slate-900/50 transition-colors cursor-pointer group"
                    >
                      {/* User Profile */}
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                            {u.avatar || u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-100 flex items-center gap-1.5 group-hover:text-purple-400 transition-colors">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            u.role === 'admin'
                              ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          {u.role}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            u.isBlocked
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}
                        >
                          {u.isBlocked ? (
                            <>
                              <Ban className="w-3 h-3" /> Blocked
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </>
                          )}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="px-4 py-4 text-slate-400 text-xs">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : 'N/A'}
                      </td>

                      {/* Orders Count */}
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200">
                          <ShoppingBag className="w-3 h-3 text-blue-400 mr-1" />
                          {u.ordersCount ?? 0}
                        </span>
                      </td>

                      {/* Wishlist Count */}
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200">
                          <Heart className="w-3 h-3 text-rose-400 mr-1" />
                          {u.wishlistCount ?? 0}
                        </span>
                      </td>

                      {/* Cart Count */}
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200">
                          <ShoppingCart className="w-3 h-3 text-amber-400 mr-1" />
                          {u.cartCount ?? 0}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Role Toggle Button */}
                          <button
                            onClick={() => handleToggleRole(u)}
                            disabled={isRowActionLoading || isCurrent}
                            className={`p-1.5 rounded-lg border border-slate-800 bg-slate-900 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                              u.role === 'admin'
                                ? 'hover:bg-purple-500/20 text-purple-400'
                                : 'hover:bg-slate-800 text-slate-400'
                            }`}
                            title={
                              isCurrent
                                ? 'Cannot change your own admin role'
                                : u.role === 'admin'
                                ? 'Demote to User'
                                : 'Promote to Admin'
                            }
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </button>

                          {/* Block Toggle Button */}
                          <button
                            onClick={() => handleToggleBlock(u)}
                            disabled={isRowActionLoading || isCurrent}
                            className={`p-1.5 rounded-lg border border-slate-800 bg-slate-900 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                              u.isBlocked
                                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                : 'hover:bg-amber-500/20 text-amber-400'
                            }`}
                            title={
                              isCurrent
                                ? 'Cannot block your own admin account'
                                : u.isBlocked
                                ? 'Unblock Account'
                                : 'Block Account'
                            }
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              setDeletingUser(u);
                              setDeleteModalOpen(true);
                            }}
                            disabled={isRowActionLoading || isCurrent}
                            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            title={isCurrent ? 'Cannot delete your own admin account' : 'Delete User Account'}
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
            Showing <span className="font-medium text-slate-200">{users.length}</span> of{' '}
            <span className="font-medium text-slate-200">{totalUsersCount}</span> users
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

      {/* Side Drawer: User Details & Profile */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-slate-950 border-l border-slate-800 shadow-2xl h-full flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-lg">
                  {selectedUser.avatar || selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <span>{selectedUser.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        selectedUser.role === 'admin'
                          ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {selectedUser.role}
                    </span>
                    {selectedUser.isBlocked && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        BLOCKED
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedUser.email}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-300">
              {/* Admin Actions Bar in Drawer */}
              <div className="glass p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Admin Control Actions
                </span>

                <div className="flex flex-wrap gap-2.5">
                  {/* Role Button */}
                  <button
                    onClick={() => handleToggleRole(selectedUser)}
                    disabled={
                      actionLoadingId === (selectedUser._id || selectedUser.id) ||
                      currentUser?.id === (selectedUser._id || selectedUser.id) ||
                      currentUser?._id === (selectedUser._id || selectedUser.id)
                    }
                    className={`px-3 py-2 rounded-xl border font-semibold flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-40 ${
                      selectedUser.role === 'admin'
                        ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        : 'bg-purple-600 hover:bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/20'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>{selectedUser.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}</span>
                  </button>

                  {/* Block Button */}
                  <button
                    onClick={() => handleToggleBlock(selectedUser)}
                    disabled={
                      actionLoadingId === (selectedUser._id || selectedUser.id) ||
                      currentUser?.id === (selectedUser._id || selectedUser.id) ||
                      currentUser?._id === (selectedUser._id || selectedUser.id)
                    }
                    className={`px-3 py-2 rounded-xl border font-semibold flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-40 ${
                      selectedUser.isBlocked
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                        : 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>{selectedUser.isBlocked ? 'Unblock Account' : 'Block Account'}</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      setDeletingUser(selectedUser);
                      setDeleteModalOpen(true);
                    }}
                    disabled={
                      actionLoadingId === (selectedUser._id || selectedUser.id) ||
                      currentUser?.id === (selectedUser._id || selectedUser.id) ||
                      currentUser?._id === (selectedUser._id || selectedUser.id)
                    }
                    className="px-3 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete User</span>
                  </button>
                </div>
              </div>

              {/* Registration & Account Info */}
              <div className="glass p-4 rounded-xl border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center">
                  <Calendar className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                  Account & Registration Info
                </h4>

                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-500 block">User ID</span>
                    <span className="font-mono text-[11px] text-slate-200">{selectedUser._id || selectedUser.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Joined Date</span>
                    <span>
                      {selectedUser.createdAt
                        ? new Date(selectedUser.createdAt).toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order History Summary */}
              <div className="glass rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-3.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center">
                    <ShoppingBag className="w-4 h-4 text-blue-400 mr-1.5" />
                    Order History Summary ({selectedUserOrders.length})
                  </h4>
                </div>

                <div className="divide-y divide-slate-800/60 max-h-48 overflow-y-auto">
                  {loadingDetail ? (
                    <div className="p-4 text-center text-slate-500">Loading user order records...</div>
                  ) : selectedUserOrders.length > 0 ? (
                    selectedUserOrders.map((ord) => (
                      <div key={ord._id || ord.orderNumber} className="p-3 flex items-center justify-between hover:bg-slate-900/40">
                        <div>
                          <p className="font-mono font-bold text-slate-200">{ord.orderNumber}</p>
                          <p className="text-[11px] text-slate-500">
                            {new Date(ord.createdAt || ord.date || '').toLocaleDateString()} • {ord.items?.length || 1} items
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-emerald-400">₹{(ord.totalPrice || ord.price || 0).toLocaleString()}</p>
                          <span className="text-[10px] text-slate-400">{ord.status}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-500">No past orders placed by this user yet.</div>
                  )}
                </div>
              </div>

              {/* Wishlist Items */}
              <div className="glass rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-3.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center">
                    <Heart className="w-4 h-4 text-rose-400 mr-1.5" />
                    Wishlist Contents ({selectedUser.wishlist?.length || 0})
                  </h4>
                </div>

                <div className="p-3">
                  {selectedUser.wishlist && selectedUser.wishlist.length > 0 ? (
                    <div className="space-y-2">
                      {selectedUser.wishlist.map((item: any, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{item.name || 'Saved Product'}</span>
                          {item.price && <span className="text-emerald-400 font-bold">₹{item.price}</span>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-2">Wishlist is empty.</p>
                  )}
                </div>
              </div>

              {/* Cart Contents */}
              <div className="glass rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-3.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center">
                    <ShoppingCart className="w-4 h-4 text-amber-400 mr-1.5" />
                    Current Cart Items ({selectedUser.cart?.length || 0})
                  </h4>
                </div>

                <div className="p-3">
                  {selectedUser.cart && selectedUser.cart.length > 0 ? (
                    <div className="space-y-2">
                      {selectedUser.cart.map((cItem: any, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <span>
                            {cItem.product?.name || 'Hardware Item'} <span className="text-slate-500">(Qty: {cItem.quantity})</span>
                          </span>
                          {cItem.product?.price && (
                            <span className="text-emerald-400 font-bold">₹{cItem.product.price * cItem.quantity}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-2">Cart is empty.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setDeletingUser(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title={deletingUser ? `Delete User "${deletingUser.name}"` : 'Delete User Account'}
        message={
          deletingUser
            ? `Are you sure you want to delete user "${deletingUser.name}" (${deletingUser.email})? This will permanently erase their account record and profile from MongoDB.`
            : 'Are you sure you want to delete this user account? This action cannot be undone.'
        }
      />
    </div>
  );
};

export default Users;
