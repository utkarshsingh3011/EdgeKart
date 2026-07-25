import React, { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Trash2,
  X,
  Send,
  User,
  Inbox,
  MailCheck,
  MessageSquare,
  Reply
} from 'lucide-react';

import adminService, {
  type AdminMessageItem,
  type AdminMessagesQueryParams
} from '../../services/adminService';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export const Messages: React.FC = () => {
  const [messages, setMessages] = useState<AdminMessageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [pendingReplyCount, setPendingReplyCount] = useState<number>(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readFilter, setReadFilter] = useState<string>('All');
  const [repliedFilter, setRepliedFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalMessagesCount, setTotalMessagesCount] = useState<number>(0);

  // Drawer / Conversation Inspector
  const [selectedMessage, setSelectedMessage] = useState<AdminMessageItem | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [isSendingReply, setIsSendingReply] = useState<boolean>(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Delete Confirm Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deletingMessage, setDeletingMessage] = useState<AdminMessageItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Toast Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch customer inquiry messages from MongoDB API
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params: AdminMessagesQueryParams = {
        page,
        limit: 10,
        search: searchQuery.trim() || undefined,
        read: readFilter !== 'All' ? readFilter : undefined,
        replied: repliedFilter !== 'All' ? repliedFilter : undefined,
        sort: sortBy
      };

      const res = await adminService.getAdminMessages(params);
      if (res.success && Array.isArray(res.messages)) {
        setMessages(res.messages);
        setTotalMessagesCount(res.totalMessages || res.messages.length);
        setUnreadCount(res.unreadCount || 0);
        setPendingReplyCount(res.pendingReplyCount || 0);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err: any) {
      console.error('Error fetching admin messages:', err);
      showNotification(err.response?.data?.message || 'Failed to fetch messages from MongoDB', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, readFilter, repliedFilter, sortBy]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Open conversation drawer and auto-mark as read
  const openMessageDrawer = async (msg: AdminMessageItem) => {
    setSelectedMessage(msg);
    setReplyText(msg.replyMessage || '');

    // If message is unread, automatically mark as read
    if (!msg.isRead) {
      const targetId = msg._id || msg.id || '';
      try {
        await adminService.updateMessageReadStatus(targetId, true);
        setMessages((prev) =>
          prev.map((m) => ((m._id || m.id) === targetId ? { ...m, isRead: true } : m))
        );
        setSelectedMessage({ ...msg, isRead: true });
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error('Failed to auto-mark read:', err);
      }
    }
  };

  // Lock body scroll when drawer or delete modal is active
  useEffect(() => {
    if (selectedMessage || deleteModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedMessage, deleteModalOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMessage(null);
        if (!isDeleting) {
          setDeleteModalOpen(false);
          setDeletingMessage(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDeleting]);

  // Toggle Read / Unread status
  const handleToggleRead = async (msg: AdminMessageItem) => {
    const targetId = msg._id || msg.id || '';
    const newReadState = !msg.isRead;

    setActionLoadingId(targetId);
    try {
      const res = await adminService.updateMessageReadStatus(targetId, newReadState);
      if (res.success && res.data) {
        showNotification(`Message marked as ${newReadState ? 'read' : 'unread'}`);
        setMessages((prev) =>
          prev.map((m) => ((m._id || m.id) === targetId ? { ...m, isRead: newReadState } : m))
        );
        if (selectedMessage && (selectedMessage._id === targetId || selectedMessage.id === targetId)) {
          setSelectedMessage({ ...selectedMessage, isRead: newReadState });
        }
        fetchMessages();
      }
    } catch (err: any) {
      console.error('Toggle read status error:', err);
      showNotification(err.response?.data?.message || 'Failed to update read status', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Toggle Replied status or Submit Admin Response
  const handleSendReply = async () => {
    if (!selectedMessage) return;
    const targetId = selectedMessage._id || selectedMessage.id || '';

    setIsSendingReply(true);
    try {
      const res = await adminService.updateMessageRepliedStatus(targetId, true, replyText.trim());
      if (res.success && res.data) {
        showNotification('Reply response saved and marked as replied!');
        setMessages((prev) =>
          prev.map((m) =>
            (m._id || m.id) === targetId ? { ...m, isReplied: true, isRead: true, replyMessage: replyText.trim() } : m
          )
        );
        setSelectedMessage({
          ...selectedMessage,
          isReplied: true,
          isRead: true,
          replyMessage: replyText.trim(),
          repliedAt: new Date().toISOString()
        });
        fetchMessages();
      }
    } catch (err: any) {
      console.error('Submit reply error:', err);
      showNotification(err.response?.data?.message || 'Failed to submit response', 'error');
    } finally {
      setIsSendingReply(false);
    }
  };

  // Toggle Replied Status directly
  const handleToggleRepliedState = async (msg: AdminMessageItem) => {
    const targetId = msg._id || msg.id || '';
    const newRepliedState = !msg.isReplied;

    setActionLoadingId(targetId);
    try {
      const res = await adminService.updateMessageRepliedStatus(targetId, newRepliedState);
      if (res.success && res.data) {
        showNotification(`Message status updated to ${newRepliedState ? 'replied' : 'pending reply'}`);
        setMessages((prev) =>
          prev.map((m) => ((m._id || m.id) === targetId ? { ...m, isReplied: newRepliedState } : m))
        );
        if (selectedMessage && (selectedMessage._id === targetId || selectedMessage.id === targetId)) {
          setSelectedMessage({ ...selectedMessage, isReplied: newRepliedState });
        }
        fetchMessages();
      }
    } catch (err: any) {
      console.error('Toggle replied error:', err);
      showNotification(err.response?.data?.message || 'Failed to update reply status', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete message handler
  const handleDeleteConfirm = async () => {
    if (!deletingMessage) return;
    const targetId = deletingMessage._id || deletingMessage.id || '';
    const subjectTitle = deletingMessage.subject;

    setIsDeleting(true);
    try {
      await adminService.deleteMessage(targetId);
      showNotification(`Message "${subjectTitle}" deleted successfully.`);
      if (selectedMessage && (selectedMessage._id === targetId || selectedMessage.id === targetId)) {
        setSelectedMessage(null);
      }
      setMessages((prev) => prev.filter((m) => (m._id || m.id) !== targetId));
    } catch (err: any) {
      console.error('Delete message error:', err);
      showNotification(err.response?.data?.message || `Failed to delete message.`, 'error');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setDeletingMessage(null);
      fetchMessages();
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

      {/* Header & KPI Summary Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Customer Inquiry Messages
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review incoming support tickets, customer hardware inquiries, and procurement requests.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer self-start sm:self-auto"
          title="Refresh Inbox"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Inbox Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Inbox</span>
            <Inbox className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-2">{totalMessagesCount}</p>
        </div>

        <div className="glass p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Unread</span>
            <Mail className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-400 mt-2">{unreadCount}</p>
        </div>

        <div className="glass p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pending Reply</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-purple-400 mt-2">{pendingReplyCount}</p>
        </div>

        <div className="glass p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Replied</span>
            <MailCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-2">
            {Math.max(0, totalMessagesCount - pendingReplyCount)}
          </p>
        </div>
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
            placeholder="Search sender, email, subject, or message content..."
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* Read Status Filter */}
        <div className="lg:col-span-3">
          <select
            value={readFilter}
            onChange={(e) => {
              setReadFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
          >
            <option value="All">Read Status: All</option>
            <option value="unread">Unread Messages</option>
            <option value="read">Read Messages</option>
          </select>
        </div>

        {/* Reply Status Filter */}
        <div className="lg:col-span-3">
          <select
            value={repliedFilter}
            onChange={(e) => {
              setRepliedFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
          >
            <option value="All">Reply Status: All</option>
            <option value="pending">Pending Reply</option>
            <option value="replied">Replied</option>
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
          </select>
        </div>
      </div>

      {/* Messages Inbox Table */}
      <div className="glass rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Sender</th>
                <th className="px-4 py-3.5">Subject & Preview</th>
                <th className="px-4 py-3.5">Read Status</th>
                <th className="px-4 py-3.5">Reply Status</th>
                <th className="px-4 py-3.5">Received Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-slate-400 text-xs">Loading customer inquiry messages from MongoDB...</p>
                    </div>
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Inbox className="w-8 h-8 text-slate-600 mb-1" />
                      <p className="font-medium text-slate-300">No customer inquiry messages found.</p>
                      <p className="text-slate-500 text-[11px]">Try adjusting your search terms or inbox status filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                messages.map((msg) => {
                  const targetId = msg._id || msg.id || '';
                  const isRowUpdating = actionLoadingId === targetId;

                  return (
                    <tr
                      key={targetId}
                      onClick={() => openMessageDrawer(msg)}
                      className={`hover:bg-slate-900/60 transition-colors cursor-pointer group ${
                        !msg.isRead ? 'bg-blue-500/5' : ''
                      }`}
                    >
                      {/* Sender */}
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 border ${
                              !msg.isRead
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                : 'bg-slate-900 text-slate-400 border-slate-800'
                            }`}
                          >
                            {msg.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                              <span>{msg.name}</span>
                              {!msg.isRead && (
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">{msg.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Subject & Preview */}
                      <td className="px-4 py-4 max-w-xs sm:max-w-md">
                        <div className={`font-semibold text-xs ${!msg.isRead ? 'text-slate-100' : 'text-slate-300'}`}>
                          {msg.subject}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {msg.message}
                        </div>
                      </td>

                      {/* Read Badge */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            msg.isRead
                              ? 'bg-slate-800 text-slate-400 border-slate-700'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {msg.isRead ? 'Read' : 'Unread'}
                        </span>
                      </td>

                      {/* Reply Status Badge */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            msg.isReplied
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          }`}
                        >
                          {msg.isReplied ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Replied
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" /> Pending Reply
                            </>
                          )}
                        </span>
                      </td>

                      {/* Received Date */}
                      <td className="px-4 py-4 text-slate-400 text-xs">
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Toggle Read/Unread */}
                          <button
                            onClick={() => handleToggleRead(msg)}
                            disabled={isRowUpdating}
                            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer disabled:opacity-40"
                            title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle Replied Status */}
                          <button
                            onClick={() => handleToggleRepliedState(msg)}
                            disabled={isRowUpdating}
                            className={`p-1.5 rounded-lg border border-slate-800 bg-slate-900 transition-colors cursor-pointer disabled:opacity-40 ${
                              msg.isReplied
                                ? 'text-emerald-400 hover:bg-emerald-500/20'
                                : 'text-slate-400 hover:bg-purple-500/20 hover:text-purple-400'
                            }`}
                            title={msg.isReplied ? 'Mark as Pending Reply' : 'Mark as Replied'}
                          >
                            <Reply className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Message */}
                          <button
                            onClick={() => {
                              setDeletingMessage(msg);
                              setDeleteModalOpen(true);
                            }}
                            disabled={isRowUpdating}
                            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer disabled:opacity-40"
                            title="Delete Message"
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
            Showing <span className="font-medium text-slate-200">{messages.length}</span> of{' '}
            <span className="font-medium text-slate-200">{totalMessagesCount}</span> inquiries
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

      {/* Side Drawer: Conversation Inspector & Admin Reply Composer */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-slate-950 border-l border-slate-800 shadow-2xl h-full flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <span>{selectedMessage.subject}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    From {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-300">
              {/* Message Header Stats */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      selectedMessage.isReplied
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}
                  >
                    {selectedMessage.isReplied ? 'Replied' : 'Pending Reply'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Received:{' '}
                    {new Date(selectedMessage.createdAt).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleRead(selectedMessage)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
                  >
                    {selectedMessage.isRead ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => {
                      setDeletingMessage(selectedMessage);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Customer Original Message Bubble */}
              <div className="glass p-5 rounded-2xl border border-slate-800/90 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-slate-100">{selectedMessage.name}</span>
                    <span className="text-slate-500 text-[11px]">&lt;{selectedMessage.email}&gt;</span>
                  </div>
                </div>

                <p className="text-slate-200 text-xs whitespace-pre-line leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Existing Admin Response (If already replied) */}
              {selectedMessage.isReplied && selectedMessage.replyMessage && (
                <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-500/10 text-emerald-400">
                    <span className="font-bold flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Official Admin Response Sent
                    </span>
                    {selectedMessage.repliedAt && (
                      <span className="text-[11px] text-emerald-400/70">
                        {new Date(selectedMessage.repliedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-200 text-xs whitespace-pre-line leading-relaxed">
                    {selectedMessage.replyMessage}
                  </p>
                </div>
              )}

              {/* Quick Reply Composer */}
              <div className="glass p-5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center">
                  <Send className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                  Reply to Inquiry
                </h4>

                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your official administrative response here..."
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-xl p-3.5 focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    Submitting will mark this inquiry status as "Replied".
                  </span>

                  <button
                    onClick={handleSendReply}
                    disabled={isSendingReply || !replyText.trim()}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2 cursor-pointer transition-all"
                  >
                    {isSendingReply ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Response & Mark Replied</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setDeletingMessage(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title={deletingMessage ? `Delete Message "${deletingMessage.subject}"` : 'Delete Customer Message'}
        message={
          deletingMessage
            ? `Are you sure you want to delete the message "${deletingMessage.subject}" from ${deletingMessage.name}? This will permanently remove it from MongoDB.`
            : 'Are you sure you want to delete this customer inquiry? This action cannot be undone.'
        }
      />
    </div>
  );
};

export default Messages;
