import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  Store,
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
  CheckCheck,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminNavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  setSidebarOpen,
  theme,
  onThemeToggle
}) => {
  const { user, logout, notifications, markAllNotificationsAsRead } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close dropdown menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left section: Sidebar toggle & Logo/Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/80 transition-colors cursor-pointer"
          aria-label="Toggle Sidebar Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/admin/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
            EK
          </div>
          <div className="hidden sm:block">
            <span className="font-extrabold text-slate-100 text-sm tracking-tight">EdgeKart</span>
            <span className="ml-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Admin
            </span>
          </div>
        </Link>
      </div>

      {/* Middle section: Global Admin Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders, products, customers..."
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-12 py-2 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right section: Store Link, Theme Toggle, Notifications, Profile */}
      <div className="flex items-center space-x-2.5">
        {/* Customer Storefront button */}
        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
          title="Return to Customer Storefront"
        >
          <Store className="w-3.5 h-3.5 text-blue-400" />
          <span>Customer Site</span>
        </Link>

        {/* Theme switcher toggle */}
        <button
          onClick={onThemeToggle}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/80 transition-colors cursor-pointer"
          aria-label="Toggle Dark/Light Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/80 transition-colors cursor-pointer"
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
            <div className="absolute right-0 mt-2 w-80 sm:w-96 glass rounded-2xl border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Admin Notifications</h4>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No admin alerts at this time.</p>
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
                      <div className="flex items-start justify-between">
                        <span className="font-semibold text-slate-100">{notif.title}</span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1 leading-snug">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin User Profile Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="flex items-center space-x-2 p-1.5 rounded-xl border border-slate-800/80 bg-slate-900/80 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sm">
              {user?.avatar || '👑'}
            </div>
            <div className="hidden lg:block text-left pr-1">
              <div className="text-xs font-semibold text-slate-200 max-w-[100px] truncate">{user?.name || 'Admin User'}</div>
              <div className="text-[10px] text-blue-400 font-medium capitalize">{user?.role || 'admin'}</div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 glass rounded-2xl border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-2.5 border-b border-slate-800 mb-1">
                <p className="text-xs font-bold text-slate-100">{user?.name || 'Admin User'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@edgekart.com'}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Shield className="w-3 h-3" />
                  Role: {user?.role || 'admin'}
                </div>
              </div>

              <div className="space-y-0.5">
                <Link
                  to="/admin/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  Admin Settings
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  User Profile
                </Link>
                <Link
                  to="/"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                >
                  <Store className="w-3.5 h-3.5 text-blue-400" />
                  View Storefront
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
