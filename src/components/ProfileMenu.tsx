import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Heart, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ isOpen, onClose, theme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className={`absolute right-0 mt-2.5 w-60 rounded-2xl border shadow-2xl z-50 overflow-hidden font-medium ${
            theme === 'dark'
              ? 'bg-slate-900/95 border-slate-800 text-slate-100 backdrop-blur-md'
              : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
          }`}
        >
          {/* User Header Summary */}
          <div className={`p-4 border-b flex items-center space-x-3 text-left ${
            theme === 'dark' ? 'border-slate-800/80 bg-slate-950/20' : 'border-slate-100 bg-slate-50/50'
          }`}>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-lg shadow-sm">
              {user.avatar}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold truncate font-sans">{user.name}</h4>
              <p className="text-[10px] text-slate-450 truncate mt-0.5">{user.email}</p>
            </div>
          </div>

          {/* Actions List */}
          <div className="p-1.5 space-y-0.5">
            <Link
              to="/profile"
              onClick={onClose}
              className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs transition-colors font-semibold ${
                theme === 'dark' ? 'hover:bg-slate-800/60 hover:text-white' : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-blue-500" />
              <span>My Profile</span>
            </Link>

            <Link
              to="/orders"
              onClick={onClose}
              className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs transition-colors font-semibold ${
                theme === 'dark' ? 'hover:bg-slate-800/60 hover:text-white' : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
              <span>Orders</span>
            </Link>

            <Link
              to="/wishlist"
              onClick={onClose}
              className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs transition-colors font-semibold ${
                theme === 'dark' ? 'hover:bg-slate-800/60 hover:text-white' : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Wishlist</span>
            </Link>

            {user.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                onClick={onClose}
                className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs transition-colors font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 ${
                  theme === 'dark' ? 'hover:bg-blue-500/20' : 'hover:bg-blue-50'
                }`}
              >
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Admin Console</span>
              </Link>
            )}

            <Link
              to="/settings"
              onClick={onClose}
              className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs transition-colors font-semibold ${
                theme === 'dark' ? 'hover:bg-slate-800/60 hover:text-white' : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4 text-purple-500" />
              <span>Settings</span>
            </Link>
          </div>

          {/* Logout footer */}
          <div className={`p-1.5 border-t ${theme === 'dark' ? 'border-slate-800/80 bg-slate-950/10' : 'border-slate-100 bg-slate-50/20'}`}>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'text-rose-400 hover:bg-rose-500/10 hover:text-rose-500'
                  : 'text-rose-600 hover:bg-rose-500/10 hover:text-rose-600'
              }`}
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default ProfileMenu;
