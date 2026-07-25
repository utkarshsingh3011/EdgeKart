import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { Products as CustomerProducts } from './components/Products';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Reviews } from './components/Reviews';
import { Newsletter as CustomerNewsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { WishlistPage } from './components/WishlistPage';
import { SecurityPage } from './components/SecurityPage';
import { SitemapPage } from './components/SitemapPage';
import { useScrollToHash } from './hooks/useScrollToHash';

import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { ProfilePage } from './components/ProfilePage';
import { OrdersPage } from './components/OrdersPage';
import { SettingsPage } from './components/SettingsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CartPage } from './components/CartPage';

// Admin Console Imports
import AdminProtectedRoute from './admin/components/AdminProtectedRoute';
import AdminLayout from './admin/layout/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import Products from './admin/pages/Products';
import Orders from './admin/pages/Orders';
import Users from './admin/pages/Users';
import Messages from './admin/pages/Messages';
import Newsletter from './admin/pages/Newsletter';
import Settings from './admin/pages/Settings';

import { useToast } from './context/ToastContext';

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { toasts, addToast, removeToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isAdminRoute = location.pathname.startsWith('/admin');

  // Trigger smooth offset scroll-to-hash updates on path transitions
  useScrollToHash();

  // Sync theme class to document root for Tailwind CSS v4 dark variant
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSearchFocus = () => {
    // If they focus search on a sub-page, navigate back home first
    navigate('/');
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 150);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Sticky Navigation Bar (Only rendered on customer storefront paths) */}
      {!isAdminRoute && (
        <Navbar
          theme={theme}
          onThemeToggle={handleThemeToggle}
          onSearchFocus={handleSearchFocus}
        />
      )}

      {/* React Router Views Switcher */}
      <Routes>
        {/* Protected Administration Portal Routes */}
        <Route path="/admin" element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
            <Route path="messages" element={<Messages />} />
            <Route path="newsletter" element={<Newsletter />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>

        {/* Customer Storefront Routes */}
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Hero Section */}
              <Hero theme={theme} />

              {/* Categories Grid */}
              <Categories
                theme={theme}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
              />

              {/* Products catalog grid */}
              <CustomerProducts
                theme={theme}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                searchRef={searchInputRef}
              />

              {/* Why Choose Us info metrics */}
              <WhyChooseUs theme={theme} />

              {/* Reviews testimonials grid */}
              <Reviews theme={theme} />

              {/* Newsletter signup container */}
              <CustomerNewsletter theme={theme} addToast={addToast} />
            </motion.div>
          }
        />
        
        <Route
          path="/products/:id"
          element={
            <ProductDetails
              theme={theme}
              addToast={addToast}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <CartPage
              theme={theme}
              addToast={addToast}
            />
          }
        />

        <Route
          path="/login"
          element={<Login theme={theme} />}
        />

        <Route
          path="/register"
          element={<Register theme={theme} />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage theme={theme} />}
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage theme={theme} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage theme={theme} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage theme={theme} addToast={addToast} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage theme={theme} toggleTheme={handleThemeToggle} addToast={addToast} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/security"
          element={<SecurityPage theme={theme} />}
        />

        <Route
          path="/sitemap"
          element={<SitemapPage theme={theme} />}
        />
      </Routes>

      {/* Footer directory index (Only rendered on customer storefront paths) */}
      {!isAdminRoute && <Footer theme={theme} />}

      {/* Sliding Side-Cart (Only rendered on customer storefront paths) */}
      {!isAdminRoute && <CartSidebar theme={theme} />}

      {/* Sliding Toast Notification Stack */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
              className={`p-4 rounded-xl border shadow-2xl flex items-center space-x-3 pointer-events-auto backdrop-blur-md transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-black/40'
                  : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-200/50'
              }`}
            >
              {toast.type === 'success' && (
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
              {toast.type === 'info' && (
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              )}
              <div className="flex-1 text-xs sm:text-sm font-semibold">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-200 transition-colors text-xs cursor-pointer p-1"
                aria-label="Dismiss toast"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
