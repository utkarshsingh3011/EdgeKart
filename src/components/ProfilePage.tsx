import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  ShoppingBag, 
  Heart, 
  Eye, 
  Mail, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Settings, 
  Calendar 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { productService } from '../services/productService';
import type { Product } from '../types/product';
import { ProductImage } from './ProductImage';

interface ProfilePageProps {
  theme: 'dark' | 'light';
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ theme }) => {
  const { user, orders, recentlyViewed, updateProfile, logout } = useAuth();
  const { wishlist } = useWishlist();
  
  const navigate = useNavigate();

  // Address editing states
  const [newAddress, setNewAddress] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressError, setAddressError] = useState('');

  // Dynamic products states
  const [wishlistedProducts, setWishlistedProducts] = useState<Product[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingProducts(true);

    const fetchProductsForProfile = async () => {
      try {
        const response = await productService.getProducts({ limit: 100 });
        if (isMounted && response && response.data) {
          const allProducts = response.data;
          
          const wishlisted = allProducts.filter((p) => {
            const pid = p.id || (p as any)._id;
            return wishlist.includes(pid) || wishlist.includes(p.id);
          });

          const recents = allProducts.filter((p) => {
            const pid = p.id || (p as any)._id;
            return recentlyViewed.includes(pid) || recentlyViewed.includes(p.id);
          });

          setWishlistedProducts(wishlisted);
          setRecentProducts(recents);
        }
      } catch (error) {
        console.error('Error loading profile products:', error);
      } finally {
        if (isMounted) {
          setIsLoadingProducts(false);
        }
      }
    };

    fetchProductsForProfile();

    return () => {
      isMounted = false;
    };
  }, [wishlist, recentlyViewed]);

  if (!user) return null;

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) {
      setAddressError('Address description cannot be empty.');
      return;
    }
    const updatedAddresses = [...user.addresses, newAddress.trim()];
    updateProfile({ addresses: updatedAddresses });
    setNewAddress('');
    setShowAddAddress(false);
    setAddressError('');
  };

  const handleDeleteAddress = (idx: number) => {
    const updated = user.addresses.filter((_, i) => i !== idx);
    updateProfile({ addresses: updated });
  };

  const handleNewsletterToggle = () => {
    updateProfile({ newsletterSubscribed: !user.newsletterSubscribed });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className={`min-h-screen py-12 transition-colors duration-300 text-left ${
        theme === 'dark' ? 'bg-slate-955 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center space-x-1.5 text-xs text-slate-400 font-semibold mb-6">
          <Link to="/" className="hover:text-blue-500 transition-colors cursor-pointer">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-bold text-blue-500">My Profile</span>
        </nav>

        {/* Dashboard Title Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-800/10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-3xl shadow-md">
              {user.avatar}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight font-sans">{user.name}</h1>
              <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                <span>{user.email}</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span className="flex items-center text-slate-500 gap-1 text-xs">
                  <Calendar className="w-3.5 h-3.5" /> Member since {user.memberSince}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/settings"
              className={`inline-flex items-center space-x-1.5 text-xs font-bold py-2.5 px-4 rounded-xl border transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="text-xs font-bold py-2.5 px-4 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/15 hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Area (Addresses & Preferences) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Address Management Card */}
            <div className={`p-6 rounded-2xl border text-left space-y-4 ${
              theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'
            }`}>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm font-sans flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>Saved Addresses</span>
                </h3>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="p-1.5 rounded-lg bg-blue-600/15 text-blue-500 border border-blue-500/10 hover:bg-blue-650/20 cursor-pointer"
                  title="Add Address"
                >
                  <Plus className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Add address sub-form */}
              {showAddAddress && (
                <form onSubmit={handleAddAddressSubmit} className="space-y-3 pt-2">
                  <textarea
                    rows={2}
                    value={newAddress}
                    onChange={(e) => { setNewAddress(e.target.value); setAddressError(''); }}
                    placeholder="Enter full shipping address..."
                    className={`w-full p-3 rounded-xl text-xs font-medium border focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-655 focus:border-slate-700'
                        : 'bg-white border-slate-250 text-slate-900 placeholder-slate-400 focus:border-blue-400'
                    }`}
                  />
                  {addressError && (
                    <span className="text-rose-500 text-[10px] font-semibold block">{addressError}</span>
                  )}
                  <div className="flex space-x-2 justify-end">
                    <button
                      type="button"
                      onClick={() => { setShowAddAddress(false); setAddressError(''); }}
                      className="px-3 py-1.5 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {user.addresses.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">No shipping addresses registered.</p>
              ) : (
                <div className="space-y-3 pt-1">
                  {user.addresses.map((addr, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex justify-between items-start text-xs ${
                        theme === 'dark' ? 'bg-slate-950/40 border-slate-850' : 'bg-slate-50/50 border-slate-150'
                      }`}
                    >
                      <p className={`leading-relaxed pr-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {addr}
                      </p>
                      <button
                        onClick={() => handleDeleteAddress(idx)}
                        className="text-slate-500 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                        title="Delete Address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Newsletter Preferences Card */}
            <div className={`p-6 rounded-2xl border text-left space-y-4 ${
              theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'
            }`}>
              <h3 className="font-bold text-sm font-sans flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-500" />
                <span>Mailing Lists</span>
              </h3>
              <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-450' : 'text-slate-600'}`}>
                Stay informed on new sensor launches, micro-controller restocks, and discount keys.
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-slate-400">Newsletter Subscription</span>
                <button
                  onClick={handleNewsletterToggle}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    user.newsletterSubscribed ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    user.newsletterSubscribed ? 'translate-x-5' : ''
                  }`} />
                </button>
              </div>
            </div>

          </div>

          {/* Right Area (Order Logs & Recently Viewed) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Orders Summary Panel */}
            <div className={`p-6 rounded-2xl border text-left space-y-5 ${
              theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'
            }`}>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm font-sans flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-500" />
                  <span>Recent Purchases</span>
                </h3>
                <Link
                  to="/orders"
                  className="text-xs font-bold text-blue-500 hover:underline inline-flex items-center"
                >
                  <span>All Orders</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">No order records found.</p>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 2).map((order) => (
                    <div
                      key={order.id}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs ${
                        theme === 'dark' ? 'bg-slate-950/40 border-slate-850' : 'bg-slate-50/50 border-slate-150'
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="font-bold font-mono text-blue-500">{order.orderNumber}</p>
                        <p className="text-slate-450">
                          {new Date(order.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-slate-400 mt-1">
                          {order.items.map((it) => `${it.name} (x${it.quantity})`).join(', ')}
                        </p>
                      </div>

                      <div className="flex sm:flex-col sm:items-end justify-between items-center gap-2">
                        <span className="text-base font-black text-slate-100">₹{order.price}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/25'
                            : 'bg-blue-500/5 text-blue-500 border-blue-500/25'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Panel */}
            <div className={`p-6 rounded-2xl border text-left space-y-5 ${
              theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'
            }`}>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm font-sans flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Wishlisted Components</span>
                </h3>
                <Link
                  to="/wishlist"
                  className="text-xs font-bold text-blue-500 hover:underline inline-flex items-center"
                >
                  <span>Manage Wishlist</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {isLoadingProducts ? (
                <p className="text-xs text-slate-500 animate-pulse py-4 text-center">Loading wishlist...</p>
              ) : wishlistedProducts.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">Your wishlist is empty.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {wishlistedProducts.slice(0, 4).map((product) => (
                    <div
                      key={product.id || (product as any)._id}
                      onClick={() => navigate(`/products/${product.id || (product as any)._id}`)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                        theme === 'dark'
                          ? 'bg-slate-950/40 border-slate-850 hover:border-blue-500/50 hover:bg-slate-900/40'
                          : 'bg-slate-50/50 border-slate-150 hover:border-blue-400/50 hover:bg-slate-100/50'
                      }`}
                    >
                      <div className="w-16 h-16 mb-2">
                        <ProductImage id={product.imageId || product.customId || product.id || (product as any)._id} className="w-full h-full object-contain" />
                      </div>
                      <h4 className="text-[11px] font-bold truncate w-full font-sans text-slate-300">
                        {product.name}
                      </h4>
                      <span className="text-xs font-bold text-blue-500 mt-1">₹{product.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recently Viewed Panel */}
            <div className={`p-6 rounded-2xl border text-left space-y-5 ${
              theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'
            }`}>
              <h3 className="font-bold text-sm font-sans flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-500" />
                <span>Recently Viewed</span>
              </h3>

              {isLoadingProducts ? (
                <p className="text-xs text-slate-500 animate-pulse py-4 text-center">Loading recent items...</p>
              ) : recentProducts.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">No recently viewed components.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {recentProducts.map((product) => (
                    <div
                      key={product.id || (product as any)._id}
                      onClick={() => navigate(`/products/${product.id || (product as any)._id}`)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                        theme === 'dark'
                          ? 'bg-slate-955 border-slate-850 hover:border-blue-500/50 hover:bg-slate-900/40'
                          : 'bg-slate-50/50 border-slate-150 hover:border-blue-400/50 hover:bg-slate-100/50'
                      }`}
                    >
                      <div className="w-14 h-14 mb-2">
                        <ProductImage id={product.imageId || product.customId || product.id || (product as any)._id} className="w-full h-full object-contain" />
                      </div>
                      <h4 className="text-[10px] font-bold truncate w-full font-sans text-slate-400">
                        {product.name}
                      </h4>
                      <span className="text-xs font-bold text-blue-500 mt-1">₹{product.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </motion.div>
  );
};
export default ProfilePage;
