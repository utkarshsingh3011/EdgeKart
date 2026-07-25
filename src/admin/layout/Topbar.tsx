import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut, CheckCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopbarProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/dashboard': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
  '/admin/users': 'Users',
  '/admin/messages': 'Messages',
  '/admin/newsletter': 'Newsletter',
  '/admin/settings': 'Settings',
};

export const Topbar: React.FC<TopbarProps> = ({ setSidebarOpen }) => {
  const { user, logout, notifications, markAllNotificationsAsRead } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const currentPageTitle = PAGE_TITLES[location.pathname] || 'Admin Console';
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left section: Sidebar toggle & Dynamic Page Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/80 transition-colors cursor-pointer"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight">
          {currentPageTitle}
        </h1>
      </div>

      {/* Right section: Notifications, Admin Name & Logout */}
      <div className="flex items-center space-x-3">
        {/* Notifications Icon & Panel */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/80 transition-colors cursor-pointer"
            aria-label="Admin Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-slate-950 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass rounded-2xl border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Notifications</h4>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No notifications.</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-xl border text-xs transition-colors ${
                        notif.isRead
                          ? 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                          : 'bg-slate-900 border-blue-500/30 text-slate-200'
                      }`}
                    >
                      <div className="font-semibold text-slate-100">{notif.title}</div>
                      <p className="text-slate-400 text-[11px] mt-0.5">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Logged-in Admin Name & Badge */}
        <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl border border-slate-800/80 bg-slate-900/80">
          <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sm">
            {user?.avatar || '👑'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-200 leading-tight">
              {user?.name || 'Administrator'}
            </div>
            <div className="text-[10px] text-blue-400 font-medium">
              Admin
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
