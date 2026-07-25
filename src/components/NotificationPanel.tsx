import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckSquare, Package, ShoppingBag, Heart, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { NotificationItem } from '../context/AuthContext';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, theme }) => {
  const { notifications, markAllNotificationsAsRead } = useAuth();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4.5 h-4.5 text-blue-500" />;
      case 'wishlist':
        return <Heart className="w-4.5 h-4.5 text-rose-500" />;
      case 'stock':
        return <Package className="w-4.5 h-4.5 text-amber-500" />;
      case 'newsletter':
        return <Mail className="w-4.5 h-4.5 text-purple-500" />;
      default:
        return <Bell className="w-4.5 h-4.5 text-blue-500" />;
    }
  };

  const getBgColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'wishlist':
        return 'bg-rose-500/10 border-rose-500/20';
      case 'stock':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'newsletter':
        return 'bg-purple-500/10 border-purple-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHrs < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins <= 1 ? 'Just now' : `${diffMins}m ago`;
    }
    if (diffHrs < 24) {
      return `${diffHrs}h ago`;
    }
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 pointer-events-auto"
          />

          {/* Sliding Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={`fixed right-0 top-0 bottom-0 w-full max-w-md z-50 border-l flex flex-col justify-between transition-colors duration-300 ${
              theme === 'dark'
                ? 'bg-slate-950 border-slate-850 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header section */}
            <div className={`p-6 border-b flex items-center justify-between ${
              theme === 'dark' ? 'border-slate-900' : 'border-slate-100'
            }`}>
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold font-sans">Notification Center</h2>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                    : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Notifications feed container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {notifications.length > 0 && (
                <div className="flex justify-end">
                  <button
                    onClick={markAllNotificationsAsRead}
                    className={`inline-flex items-center space-x-1 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                      theme === 'dark'
                        ? 'border-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-900'
                        : 'border-slate-200 text-slate-500 hover:text-blue-500 hover:bg-slate-50'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Mark all as read</span>
                  </button>
                </div>
              )}

              <AnimatePresence initial={false}>
                {notifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center py-20 px-4 space-y-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-slate-500/5 border border-slate-500/10 flex items-center justify-center text-slate-500 mx-auto">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm font-sans">No notifications yet</h4>
                      <p className="text-xs text-slate-450 max-w-[200px] leading-relaxed">
                        We'll alert you when orders ship, parts restock, or updates arrive.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-3.5">
                    {notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`p-4 rounded-xl border flex items-start space-x-3.5 transition-all text-left relative overflow-hidden ${
                          theme === 'dark'
                            ? 'bg-slate-900/40 border-slate-850 hover:border-slate-800'
                            : 'bg-slate-50/50 border-slate-200/60 hover:border-slate-200'
                        } ${!notif.isRead ? 'ring-1 ring-blue-500/20' : ''}`}
                      >
                        {/* Status dot for unread */}
                        {!notif.isRead && (
                          <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        )}

                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${getBgColor(notif.type)}`}>
                          {getIcon(notif.type)}
                        </div>

                        <div className="flex-1 min-w-0 pr-2">
                          <h4 className={`text-xs font-bold truncate font-sans ${
                            theme === 'dark'
                              ? (!notif.isRead ? 'text-slate-100' : 'text-slate-350')
                              : (!notif.isRead ? 'text-slate-900' : 'text-slate-500')
                          }`}>
                            {notif.title}
                          </h4>
                          <p className={`text-[11px] leading-normal mt-1.5 ${
                            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-500 font-medium block mt-2">
                            {formatTime(notif.date)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Panel footer */}
            <div className={`p-6 border-t text-center ${
              theme === 'dark' ? 'border-slate-900 bg-slate-950/20' : 'border-slate-100 bg-slate-50/50'
            }`}>
              <button
                onClick={onClose}
                className="w-full bg-slate-800/20 hover:bg-slate-800/45 border border-slate-800 hover:text-white py-3 px-6 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Dismiss Panel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default NotificationPanel;
