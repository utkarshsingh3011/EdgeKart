import React, { useState, useEffect, useCallback } from 'react';
import {
  Store,
  CreditCard,
  Boxes,
  ShoppingBag,
  Bell,
  ShieldCheck,
  Save,
  RotateCcw,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Globe,
  Mail,
  Phone,
  Building,
  FileText
} from 'lucide-react';

import adminService, { type StoreSettingsItem } from '../../services/adminService';

const defaultSettings: StoreSettingsItem = {
  storeName: 'EdgeKart Hardware Store',
  storeDescription: 'Premium Microcontrollers, Sensors, and Embedded Development Boards',
  supportEmail: 'support@edgekart.io',
  supportPhone: '+91 98765 43210',
  companyAddress: 'Innovation Tech Park, Sector 62, Noida, UP - 201309',
  gstNumber: '09AAACE1234F1Z5',
  website: 'https://edgekart.io',
  currency: '₹ (INR)',
  taxPercentage: 18,
  shippingCharge: 99,
  freeShippingThreshold: 999,
  codEnabled: true,
  lowStockThreshold: 5,
  autoHideOutOfStock: false,
  defaultProductStatus: 'Active',
  autoConfirmOrders: true,
  autoUpdateInventory: true,
  allowOrderCancellation: true,
  emailNotifications: true,
  newOrderAlerts: true,
  lowStockAlerts: true,
  newsletterNotifications: true,
  sessionTimeout: 60,
  requireStrongPasswords: true,
  enableAdminActivityLogs: true
};

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettingsItem>(defaultSettings);
  const [initialSettings, setInitialSettings] = useState<StoreSettingsItem>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Section Collapse state
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    store: false,
    business: false,
    inventory: false,
    orders: false,
    notifications: false,
    security: false
  });

  // Toast notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch settings from MongoDB API
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getStoreSettings();
      if (res.success && res.settings) {
        setSettings(res.settings);
        setInitialSettings(res.settings);
      }
    } catch (err: any) {
      console.error('Error fetching store settings:', err);
      showNotification(err.response?.data?.message || 'Failed to fetch settings from MongoDB', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Store Settings | EdgeKart';
    fetchSettings();
  }, [fetchSettings]);

  // Detect unsaved changes
  const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  // Toggle switch helper
  const handleToggle = (key: keyof StoreSettingsItem) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Field change handler
  const handleChange = (key: keyof StoreSettingsItem, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Save changes to MongoDB
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await adminService.updateStoreSettings(settings);
      if (res.success && res.settings) {
        showNotification('Store settings saved successfully to MongoDB!');
        setSettings(res.settings);
        setInitialSettings(res.settings);
      }
    } catch (err: any) {
      console.error('Save settings error:', err);
      showNotification(err.response?.data?.message || 'Failed to save store settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default values
  const handleResetDefaults = () => {
    setSettings(defaultSettings);
    showNotification('Settings form reset to standard store defaults.', 'success');
  };

  // Discard changes
  const handleDiscardChanges = () => {
    setSettings(initialSettings);
    showNotification('Unsaved changes discarded.', 'success');
  };

  return (
    <div className="space-y-6 pb-16">
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Store Administration & Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure store metadata, pricing rules, tax thresholds, fulfillment workflows, and security policies.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSaveChanges}
            disabled={isSaving || !hasUnsavedChanges}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 flex items-center space-x-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {hasUnsavedChanges && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between shadow-xl animate-in fade-in">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="font-semibold">You have unsaved changes in store configuration.</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDiscardChanges}
              className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 cursor-pointer"
            >
              Save Now
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-900/60 border border-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* SECTION 1: Store Information */}
          <div className="glass rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
            <button
              type="button"
              onClick={() => toggleSection('store')}
              className="w-full p-5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-left hover:bg-slate-900/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Store Information</h3>
                  <p className="text-[11px] text-slate-400">General business identity, contact channels, and address details.</p>
                </div>
              </div>
              {collapsedSections.store ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </button>

            {!collapsedSections.store && (
              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 flex items-center">
                      <Store className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => handleChange('storeName', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 flex items-center">
                      <Globe className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                      Website URL
                    </label>
                    <input
                      type="text"
                      value={settings.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center">
                    <FileText className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                    Store Description
                  </label>
                  <textarea
                    rows={2}
                    value={settings.storeDescription}
                    onChange={(e) => handleChange('storeDescription', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-3.5 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 flex items-center">
                      <Mail className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => handleChange('supportEmail', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 flex items-center">
                      <Phone className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                      Support Phone
                    </label>
                    <input
                      type="text"
                      value={settings.supportPhone}
                      onChange={(e) => handleChange('supportPhone', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 flex items-center">
                      <Building className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                      GST Number
                    </label>
                    <input
                      type="text"
                      value={settings.gstNumber}
                      onChange={(e) => handleChange('gstNumber', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company Registered Address</label>
                  <input
                    type="text"
                    value={settings.companyAddress}
                    onChange={(e) => handleChange('companyAddress', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: Business & Pricing Settings */}
          <div className="glass rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
            <button
              type="button"
              onClick={() => toggleSection('business')}
              className="w-full p-5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-left hover:bg-slate-900/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Business & Pricing Settings</h3>
                  <p className="text-[11px] text-slate-400">Tax calculation, currency symbol, shipping thresholds, and COD options.</p>
                </div>
              </div>
              {collapsedSections.business ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </button>

            {!collapsedSections.business && (
              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Base Currency</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleChange('currency', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                    >
                      <option value="₹ (INR)">₹ (INR - Indian Rupee)</option>
                      <option value="$ (USD)">$ (USD - US Dollar)</option>
                      <option value="€ (EUR)">€ (EUR - Euro)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">GST Tax Percentage (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={settings.taxPercentage}
                      onChange={(e) => handleChange('taxPercentage', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Flat Shipping Charge (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={settings.shippingCharge}
                      onChange={(e) => handleChange('shippingCharge', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Free Shipping Threshold (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={settings.freeShippingThreshold}
                      onChange={(e) => handleChange('freeShippingThreshold', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="font-semibold text-slate-200 block">Cash on Delivery (COD) Payment</span>
                    <span className="text-[11px] text-slate-400">Allow customers to choose cash payment upon delivery.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('codEnabled')}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settings.codEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        settings.codEnabled ? 'left-5.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: Inventory Settings */}
          <div className="glass rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
            <button
              type="button"
              onClick={() => toggleSection('inventory')}
              className="w-full p-5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-left hover:bg-slate-900/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Boxes className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Inventory & Stock Rules</h3>
                  <p className="text-[11px] text-slate-400">Low stock alert thresholds and out-of-stock product visibility.</p>
                </div>
              </div>
              {collapsedSections.inventory ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </button>

            {!collapsedSections.inventory && (
              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Low Stock Warning Threshold (units)</label>
                    <input
                      type="number"
                      min={1}
                      value={settings.lowStockThreshold}
                      onChange={(e) => handleChange('lowStockThreshold', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Default Product Status for New Items</label>
                    <select
                      value={settings.defaultProductStatus}
                      onChange={(e) => handleChange('defaultProductStatus', e.target.value as 'Active' | 'Draft')}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Active">Active (Publish immediately)</option>
                      <option value="Draft">Draft (Requires manual approval)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="font-semibold text-slate-200 block">Auto Hide Out-of-Stock Products</span>
                    <span className="text-[11px] text-slate-400">Automatically hide products from customer catalog when stock hits 0.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('autoHideOutOfStock')}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settings.autoHideOutOfStock ? 'bg-purple-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        settings.autoHideOutOfStock ? 'left-5.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: Orders Settings */}
          <div className="glass rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
            <button
              type="button"
              onClick={() => toggleSection('orders')}
              className="w-full p-5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-left hover:bg-slate-900/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Orders & Fulfillment Rules</h3>
                  <p className="text-[11px] text-slate-400">Order processing, automated inventory updates, and cancellation policies.</p>
                </div>
              </div>
              {collapsedSections.orders ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </button>

            {!collapsedSections.orders && (
              <div className="p-6 space-y-3 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="font-semibold text-slate-200 block">Auto Confirm Orders</span>
                    <span className="text-[11px] text-slate-400">Automatically mark newly placed orders as "Ordered" status.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('autoConfirmOrders')}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settings.autoConfirmOrders ? 'bg-amber-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        settings.autoConfirmOrders ? 'left-5.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="font-semibold text-slate-200 block">Auto Update Inventory</span>
                    <span className="text-[11px] text-slate-400">Deduct product stock automatically when orders are confirmed.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('autoUpdateInventory')}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settings.autoUpdateInventory ? 'bg-amber-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        settings.autoUpdateInventory ? 'left-5.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="font-semibold text-slate-200 block">Allow Order Cancellation</span>
                    <span className="text-[11px] text-slate-400">Permit customers to cancel orders before shipment.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('allowOrderCancellation')}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settings.allowOrderCancellation ? 'bg-amber-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        settings.allowOrderCancellation ? 'left-5.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 5: Notifications Settings */}
          <div className="glass rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
            <button
              type="button"
              onClick={() => toggleSection('notifications')}
              className="w-full p-5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-left hover:bg-slate-900/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Notifications & Alerts</h3>
                  <p className="text-[11px] text-slate-400">System email triggers, admin alert preferences, and newsletter automation.</p>
                </div>
              </div>
              {collapsedSections.notifications ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </button>

            {!collapsedSections.notifications && (
              <div className="p-6 space-y-3 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="font-semibold text-slate-200 block">Email Notifications</span>
                    <span className="text-[11px] text-slate-400">Send transactional email notifications to customers for orders.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('emailNotifications')}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settings.emailNotifications ? 'bg-rose-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        settings.emailNotifications ? 'left-5.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="font-semibold text-slate-200 block">New Order Alerts</span>
                    <span className="text-[11px] text-slate-400">Notify admin team instantly when a new order is received.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('newOrderAlerts')}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settings.newOrderAlerts ? 'bg-rose-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        settings.newOrderAlerts ? 'left-5.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="font-semibold text-slate-200 block">Low Stock Alerts</span>
                    <span className="text-[11px] text-slate-400">Trigger warnings when product inventory falls below threshold.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('lowStockAlerts')}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settings.lowStockAlerts ? 'bg-rose-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        settings.lowStockAlerts ? 'left-5.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 6: Security Controls */}
          <div className="glass rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
            <button
              type="button"
              onClick={() => toggleSection('security')}
              className="w-full p-5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-left hover:bg-slate-900/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Security & Access Controls</h3>
                  <p className="text-[11px] text-slate-400">Session timeout policies, password requirements, and admin audit logging.</p>
                </div>
              </div>
              {collapsedSections.security ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </button>

            {!collapsedSections.security && (
              <div className="p-6 space-y-4 text-xs">
                <div className="max-w-xs">
                  <label className="block text-slate-300 font-semibold mb-1">Session Inactivity Timeout (minutes)</label>
                  <input
                    type="number"
                    min={5}
                    max={1440}
                    value={settings.sessionTimeout}
                    onChange={(e) => handleChange('sessionTimeout', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="font-semibold text-slate-200 block">Require Strong Passwords</span>
                    <span className="text-[11px] text-slate-400">Enforce minimum 8 characters with numbers and special symbols.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('requireStrongPasswords')}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settings.requireStrongPasswords ? 'bg-indigo-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        settings.requireStrongPasswords ? 'left-5.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="font-semibold text-slate-200 block">Enable Admin Activity Logging</span>
                    <span className="text-[11px] text-slate-400">Audit administrative actions and record IP timestamps.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('enableAdminActivityLogs')}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settings.enableAdminActivityLogs ? 'bg-indigo-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        settings.enableAdminActivityLogs ? 'left-5.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
