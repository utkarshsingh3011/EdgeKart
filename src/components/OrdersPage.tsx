import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  ChevronRight, 
  MapPin, 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  Truck, 
  CreditCard 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Order } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import type { Product } from '../types/product';
import { ProductImage } from './ProductImage';

interface OrdersPageProps {
  theme: 'dark' | 'light';
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ theme, addToast }) => {
  const { orders, fetchOrders } = useAuth();
  useEffect(() => {
    document.title = 'My Orders | EdgeKart';
  }, []);
  const { safeAddToCart } = useCart();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleExpandOrder = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleDownloadInvoice = (orderNumber: string) => {
    addToast(`Generating invoice for ${orderNumber}...`, 'info');
    setTimeout(() => {
      addToast(`Invoice ${orderNumber}.pdf downloaded successfully!`, 'success');
    }, 1200);
  };

  const handleReorder = async (order: Order) => {
    let reorderCount = 0;
    try {
      const response = await productService.getProducts({ limit: 100 });
      const products = response?.data || [];

      for (const item of order.items) {
        let product: Product | undefined = products.find((p) => (p.id || (p as any)._id) === item.id);
        if (!product && item.id) {
          try {
            const detailRes = await productService.getProductById(item.id);
            if (detailRes?.data) {
              product = detailRes.data;
            }
          } catch (e) {
            // fallback ignore
          }
        }
        if (product) {
          const success = await safeAddToCart(product, item.quantity);
          if (success) {
            reorderCount += item.quantity;
          }
        }
      }

      if (reorderCount > 0) {
        addToast(`Successfully added ${reorderCount} items from ${order.orderNumber} back to cart!`, 'success');
      } else {
        addToast('Failed to reorder. Items may no longer be available.', 'error');
      }
    } catch (err) {
      console.error('Error during reorder:', err);
      addToast('Failed to reorder items. Please try again.', 'error');
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Ordered':
        return <CreditCard className="w-4 h-4" />;
      case 'Processing':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'Shipped':
        return <Truck className="w-4 h-4 animate-bounce" />;
      case 'Delivered':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <ShoppingBag className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Ordered':
        return 'bg-blue-500/5 text-blue-500 border-blue-500/20';
      case 'Processing':
        return 'bg-amber-500/5 text-amber-500 border-amber-500/20';
      case 'Shipped':
        return 'bg-purple-500/5 text-purple-500 border-purple-500/20';
      case 'Delivered':
        return 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20';
      default:
        return 'bg-slate-500/5 text-slate-500 border-slate-500/20';
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumbs */}
        <nav className="flex items-center space-x-1.5 text-xs text-slate-400 font-semibold mb-6">
          <Link to="/" className="hover:text-blue-500 transition-colors cursor-pointer">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/profile" className="hover:text-blue-500 transition-colors cursor-pointer">My Profile</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-bold text-blue-500">Order History</span>
        </nav>

        {/* Header Title */}
        <div className="border-b border-slate-800/10 pb-6 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight font-sans flex items-center gap-2.5">
              <ShoppingBag className="w-8 h-8 text-blue-500" />
              <span>Purchase History</span>
            </h1>
            <p className="text-xs text-slate-400">
              Check delivery statuses, print invoices, or re-order prototyping parts.
            </p>
          </div>
          <Link
            to="/profile"
            className={`inline-flex items-center space-x-1 text-xs font-bold py-2 px-3.5 rounded-xl border transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                : 'border-slate-200 text-slate-650 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Order Cards Container */}
        {orders.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'
          }`}>
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="font-bold text-lg">No orders recorded</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              You haven't ordered any micro-electronics yet. Build a cart and simulate checkout to populate this view.
            </p>
            <Link
              to="/#products"
              className="inline-block mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-505 text-white rounded-xl text-xs font-bold"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    theme === 'dark'
                      ? 'bg-slate-900/40 border-slate-805 hover:border-slate-750'
                      : 'bg-white border-slate-200 hover:shadow-lg'
                  }`}
                >
                  {/* Order main row card header */}
                  <div className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${
                    theme === 'dark' ? 'border-slate-850 bg-slate-950/20' : 'border-slate-150 bg-slate-50/50'
                  }`}>
                    <div className="grid grid-cols-2 sm:flex sm:items-center sm:space-x-8 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[9px]">
                          Order Number
                        </span>
                        <span className="font-mono font-bold text-blue-500 text-sm mt-0.5 block">
                          {order.orderNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[9px]">
                          Date Placed
                        </span>
                        <span className="font-bold text-slate-300 mt-0.5 block">
                          {new Date(order.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[9px]">
                          Total Price
                        </span>
                        <span className="font-black text-slate-100 text-sm mt-0.5 block">
                          ₹{order.price}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5 sm:self-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase border flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Order items listing body */}
                  <div className="p-5 space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg border p-1.5 flex items-center justify-center flex-shrink-0 ${
                          theme === 'dark' ? 'bg-slate-950/60 border-slate-850' : 'bg-slate-50 border-slate-100'
                        }`}>
                          <ProductImage id={item.imageId || item.image || item.id || String(item.product)} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0 text-xs">
                          <h4 className="font-bold truncate font-sans text-slate-200">{item.name}</h4>
                          <p className="text-slate-400 mt-0.5">Quantity: {item.quantity}</p>
                        </div>
                        <span className="text-xs font-bold text-slate-300">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer actions row */}
                  <div className={`p-4 border-t flex flex-wrap items-center justify-between gap-4 ${
                    theme === 'dark' ? 'border-slate-850/80 bg-slate-950/10' : 'border-slate-150 bg-slate-50/20'
                  }`}>
                    <button
                      onClick={() => toggleExpandOrder(order.id)}
                      className={`text-xs font-bold hover:underline cursor-pointer flex items-center space-x-1 text-slate-400 hover:text-white`}
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Delivery Timeline'}</span>
                    </button>

                    <div className="flex items-center space-x-2.5">
                      <button
                        onClick={() => handleDownloadInvoice(order.orderNumber)}
                        className={`inline-flex items-center space-x-1.5 text-xs font-bold py-2 px-3 rounded-lg border transition-colors cursor-pointer ${
                          theme === 'dark'
                            ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                            : 'border-slate-200 text-slate-650 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                        title="Download Invoice PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Invoice</span>
                      </button>

                      <button
                        onClick={() => handleReorder(order)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-md shadow-blue-500/20"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reorder Items</span>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Delivery Stepper Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className={`border-t transition-colors overflow-hidden ${
                          theme === 'dark' ? 'border-slate-850 bg-slate-955' : 'border-slate-150 bg-slate-50'
                        }`}
                      >
                        <div className="p-6 space-y-6 text-xs text-left">
                          <h4 className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                            Simulated Shipping Journey
                          </h4>
                          
                          {/* Visual Stepper timeline */}
                          <div className="relative flex justify-between items-center max-w-md mx-auto pt-2">
                            {/* Connector line */}
                            <div className="absolute left-4 right-4 h-0.5 bg-slate-800 top-[15px]" />
                            <div className={`absolute left-4 right-4 h-0.5 bg-blue-600 top-[15px] transition-all duration-500`}
                              style={{
                                width: order.status === 'Ordered' ? '0%' :
                                       order.status === 'Processing' ? '33%' :
                                       order.status === 'Shipped' ? '66%' : '100%'
                              }}
                            />

                            {/* Stepper items */}
                            {[
                              { label: 'Ordered', desc: 'Payment Approved' },
                              { label: 'Processing', desc: 'ESD Packed' },
                              { label: 'Shipped', desc: 'In Transit' },
                              { label: 'Delivered', desc: 'Handed Over' }
                            ].map((step, idx) => {
                              const steps = ['Ordered', 'Processing', 'Shipped', 'Delivered'];
                              const currentIdx = steps.indexOf(order.status);
                              const isPassed = idx <= currentIdx;
                              const isActive = idx === currentIdx;

                              return (
                                <div key={step.label} className="relative z-10 flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs ${
                                    isActive
                                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30'
                                      : isPassed
                                      ? 'bg-slate-900 border-blue-600 text-blue-500'
                                      : 'bg-slate-950 border-slate-800 text-slate-600'
                                  }`}>
                                    {idx + 1}
                                  </div>
                                  <span className={`font-bold mt-2 text-[10px] ${isPassed ? 'text-slate-200' : 'text-slate-500'}`}>
                                    {step.label}
                                  </span>
                                  <span className="text-[8px] text-slate-500 mt-0.5 hidden sm:inline">
                                    {step.desc}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          <div className={`p-4 rounded-xl border mt-4 flex items-start space-x-2.5 ${
                            theme === 'dark' ? 'bg-slate-900 border-slate-800/80' : 'bg-white border-slate-200'
                          }`}>
                            <MapPin className="w-4.5 h-4.5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h5 className="font-bold text-[11px] text-slate-400">Destination Hub</h5>
                              <p className="text-slate-300 mt-1 leading-relaxed">
                                {order.items.length > 0 ? 'Alex Lab 101, Prototyping Bay' : 'No address selected'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </motion.div>
  );
};
export default OrdersPage;
