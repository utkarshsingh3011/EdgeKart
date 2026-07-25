import React, { useState } from 'react';
import { CreditCard, Truck, Bell, Shield, Save, Globe, Lock } from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';

export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Admin Console Settings"
        subtitle="Configure store general settings, payment integration, shipping rates, and security policies."
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Settings' }
        ]}
      />

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'general', label: 'Store General', icon: Globe },
          { id: 'payments', label: 'Payment Gateways', icon: CreditCard },
          { id: 'shipping', label: 'Shipping & Logistics', icon: Truck },
          { id: 'notifications', label: 'Alert Preferences', icon: Bell },
          { id: 'security', label: 'Security & Access', icon: Shield }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="glass p-6 rounded-2xl border border-slate-800/80 space-y-6">
        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <Lock className="w-4 h-4" /> Settings configuration saved successfully!
          </div>
        )}

        {activeTab === 'general' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">General Store Preferences</h3>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Store Name</label>
              <input
                type="text"
                defaultValue="EdgeKart Electronics"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Contact Email</label>
              <input
                type="email"
                defaultValue="support@edgekart.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Default Currency</label>
              <select className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500">
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Payment Gateways Setup</h3>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold text-slate-200">Razorpay / UPI Payment Gateway</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active
                </span>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Key ID</label>
                <input
                  type="text"
                  defaultValue="rzp_live_89123891230"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Shipping Rules</h3>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Flat Rate Shipping Fee (₹)</label>
              <input
                type="number"
                defaultValue={49}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Free Shipping Order Threshold (₹)</label>
              <input
                type="number"
                defaultValue={999}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Notification Dispatch Triggers</h3>
            <div className="space-y-2 text-xs text-slate-300">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded border-slate-800 bg-slate-900" />
                <span>Send admin email alert when inventory falls below threshold</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded border-slate-800 bg-slate-900" />
                <span>Notify customer via email upon order status dispatch update</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Security & Access Control</h3>
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-slate-300">
              <p className="font-semibold text-blue-400 mb-1">Role-Based Access Enforcement</p>
              Only authenticated users with <code className="text-blue-300 font-mono">role: "admin"</code> are allowed to access <code className="text-blue-300 font-mono">/admin/*</code> console endpoints.
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
