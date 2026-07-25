import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ShoppingBag, Cpu, Search, Heart, Bell } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { ProfileMenu } from './ProfileMenu';
import { NotificationPanel } from './NotificationPanel';

interface NavbarProps {
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
  onSearchFocus: () => void;
}

const navItems = [
  { label: 'Home', id: 'home' },
  { label: 'Categories', id: 'categories' },
  { label: 'Products', id: 'products' },
  { label: 'Reviews', id: 'reviews' },
  { label: 'Contact', id: 'contact' },
];

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onThemeToggle,
  onSearchFocus,
}) => {
  const { cartCount, setCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, notifications, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Only track active landing page sections when on the Home route
      if (location.pathname !== '/') {
        setActiveSection('');
        return;
      }

      const scrollPosition = window.scrollY + 100;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    navigate(`/#${id}`);
  };

  const triggerSearch = () => {
    setMobileMenuOpen(false);
    navigate('/#products');
    setTimeout(() => {
      onSearchFocus();
    }, 200);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? theme === 'dark'
            ? 'bg-slate-950/80 border-b border-slate-800/80 shadow-lg shadow-black/20 backdrop-blur-md'
            : 'bg-white/80 border-b border-slate-200/80 shadow-md shadow-slate-100/50 backdrop-blur-md'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
        scrolled ? 'h-16' : 'h-20'
      }`}>
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-blue-600/10 border border-blue-500/30 group-hover:bg-blue-600/20 group-hover:border-blue-500/50 transition-all duration-300">
            <Cpu className="w-6 h-6 text-blue-500 animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
            EdgeKart
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={`/#${item.id}`}
              className={`text-sm font-semibold transition-all relative py-2 cursor-pointer ${
                activeSection === item.id
                  ? 'text-blue-500'
                  : theme === 'dark'
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeNavLine"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Live Search Trigger */}
          <button
            onClick={triggerSearch}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-850 hover:bg-slate-100'
            }`}
            title="Search Products"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900/60 border-slate-800 text-amber-400 hover:text-amber-300 hover:bg-slate-800'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-850 hover:bg-slate-100'
            }`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Wishlist Heart Icon */}
          <Link
            to="/wishlist"
            className={`relative p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900/60 border-slate-800 text-rose-500 hover:bg-slate-800 hover:text-rose-400'
                : 'bg-slate-50 border-slate-200 text-rose-500 hover:bg-slate-100 hover:text-rose-600'
            }`}
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4 fill-rose-500" />
            <AnimatePresence>
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Cart Icon */}
          <button
            id="navbar-cart-btn"
            onClick={() => setCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md hover:shadow-blue-500/20 duration-300 cursor-pointer"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  id="navbar-cart-badge"
                  initial={{ scale: 0.6 }}
                  animate={{ scale: [0.6, 1.25, 1] }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900 animate-none"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Notifications Bell */}
          {user && (
            <button
              onClick={() => setNotificationsOpen(true)}
              className={`relative p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <AnimatePresence>
                {unreadNotifCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 bg-blue-550 text-white font-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900"
                  >
                    {unreadNotifCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}

          {/* User Account Portal */}
          {user ? (
            <div className="relative pl-1.5">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-9.5 h-9.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-lg cursor-pointer hover:scale-105 transition-transform"
                aria-label="User Menu"
              >
                {user.avatar}
              </button>
              <ProfileMenu
                isOpen={profileMenuOpen}
                onClose={() => setProfileMenuOpen(false)}
                theme={theme}
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2 pl-1.5">
              <Link
                to="/login"
                className={`text-xs font-bold py-2.5 px-4 rounded-xl border transition-colors ${
                  theme === 'dark'
                    ? 'border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-550 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation controls */}
        <div className="flex items-center space-x-3 md:hidden">
          {/* Mobile Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-amber-400'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Mobile Wishlist Trigger */}
          <Link
            to="/wishlist"
            className={`relative p-2 rounded-lg border cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 text-rose-500' : 'bg-slate-100 border-slate-200 text-rose-500'
            }`}
            aria-label="Wishlist"
          >
            <Heart className="w-4.5 h-4.5 fill-rose-500" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Mobile Cart Trigger */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-lg bg-blue-600 text-white cursor-pointer"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Notifications Trigger */}
          {user && (
            <button
              onClick={() => setNotificationsOpen(true)}
              className={`relative p-2 rounded-lg border cursor-pointer ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-205 text-slate-500'
              }`}
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[9px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full">
                  {unreadNotifCount}
                </span>
              )}
            </button>
          )}

          {/* Hamburger Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-805 text-slate-305'
                : 'bg-slate-100 border-slate-205 text-slate-700'
            }`}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-b overflow-hidden ${
              theme === 'dark'
                ? 'bg-slate-950 border-slate-800 text-slate-200'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left block py-3 px-4 rounded-xl text-base font-semibold transition-all cursor-pointer ${
                    activeSection === item.id
                      ? 'bg-blue-600/10 text-blue-500'
                      : theme === 'dark'
                      ? 'hover:bg-slate-900 text-slate-300 hover:text-white'
                      : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className={`pt-4 border-t flex flex-col gap-4 px-4 ${
                theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <button
                  onClick={() => { triggerSearch(); setMobileMenuOpen(false); }}
                  className={`flex items-center space-x-2 text-sm font-semibold cursor-pointer ${
                    theme === 'dark' ? 'text-slate-405 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Search Catalog</span>
                </button>

                {/* Profile/Auth section for Mobile Menu */}
                {user ? (
                  <div className="space-y-2 pt-2 border-t border-slate-800/10">
                    <div className="flex items-center space-x-3 py-1">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-lg shadow-xs">
                        {user.avatar}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold truncate">{user.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-2.5 rounded-xl text-xs font-bold ${
                        theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
                      }`}
                    >
                      My Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-2.5 rounded-xl text-xs font-bold ${
                        theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
                      }`}
                    >
                      Orders
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-2.5 rounded-xl text-xs font-bold ${
                        theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
                      }`}
                    >
                      Settings
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                        navigate('/login');
                      }}
                      className="w-full text-left block py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/5 transition-colors cursor-pointer"
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-center py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        theme === 'dark' ? 'border-slate-805 text-slate-350 bg-slate-900/60' : 'border-slate-205 text-slate-650 bg-slate-50'
                      }`}
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <NotificationPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        theme={theme}
      />
    </header>
  );
};
