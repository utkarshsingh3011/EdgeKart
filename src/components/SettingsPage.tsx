import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Bell, 
  Sun, 
  Moon, 
  Mail, 
  Trash2, 
  ChevronRight, 
  ArrowLeft,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SettingsPageProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

type TabType = 'profile' | 'security' | 'notifications' | 'appearance' | 'newsletter' | 'account';

export const SettingsPage: React.FC<SettingsPageProps> = ({ theme, toggleTheme, addToast }) => {
  const { user, updateProfile, updateSecurity, clearRecentlyViewed } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  // Profile Edit fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '🤖');

  // Security fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityErrors, setSecurityErrors] = useState<Record<string, string>>({});
  const [securityStatus, setSecurityStatus] = useState<'idle' | 'loading'>('idle');

  // Newsletter fields
  const [notificationsSettings, setNotificationsSettings] = useState(
    user?.notificationsSettings || { orders: true, stock: true, newsletter: true }
  );

  const avatarsList = ['🤖', '🚀', '💻', '⚙️', '🔋', '🛠️', '📡', '🛰️'];

  if (!user) return null;

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Profile name cannot be empty.', 'error');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }

    updateProfile({ name: name.trim(), email: email.trim(), avatar: selectedAvatar });
    addToast('Profile settings saved successfully!', 'success');
  };

  const handleSecuritySave = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!currentPassword) errors.currentPassword = 'Current password is required.';
    if (!newPassword) {
      errors.newPassword = 'New password is required.';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters.';
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setSecurityErrors(errors);
      return;
    }

    setSecurityErrors({});
    setSecurityStatus('loading');

    const success = await updateSecurity(currentPassword, newPassword);
    setSecurityStatus('idle');

    if (success) {
      addToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      addToast('Incorrect current password.', 'error');
    }
  };

  const handleNotificationsSave = (key: 'orders' | 'stock' | 'newsletter') => {
    const updated = {
      ...notificationsSettings,
      [key]: !notificationsSettings[key]
    };
    setNotificationsSettings(updated);
    updateProfile({ notificationsSettings: updated });
    addToast('Notification preferences updated!', 'success');
  };

  const handleClearSession = () => {
    clearRecentlyViewed();
    addToast('Recently viewed history cleared!', 'info');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleProfileSave} className="space-y-6">
            <h3 className="text-lg font-bold font-sans">Profile Details</h3>
            <p className="text-xs text-slate-400">Update workspace visibility details and avatar symbols.</p>
            
            {/* Avatar picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Workspace Avatar</label>
              <div className="flex flex-wrap gap-3">
                {avatarsList.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center border transition-all cursor-pointer ${
                      selectedAvatar === av
                        ? 'bg-blue-600/10 border-blue-600 scale-105'
                        : (theme === 'dark' ? 'bg-slate-950 border-slate-850 hover:bg-slate-900' : 'bg-slate-50 border-slate-200 hover:bg-slate-100')
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-3.5 rounded-xl text-sm font-medium border focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-955 border-slate-800 text-slate-100 focus:border-slate-700'
                    : 'bg-white border-slate-250 text-slate-900 focus:border-blue-400'
                }`}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-3.5 rounded-xl text-sm font-medium border focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-955 border-slate-800 text-slate-100 focus:border-slate-700'
                    : 'bg-white border-slate-250 text-slate-900 focus:border-blue-400'
                }`}
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-550 text-white font-bold py-3 px-6 rounded-xl text-xs transition-transform transform active:translate-y-0 cursor-pointer shadow-md shadow-blue-500/20"
            >
              Save Profile Settings
            </button>
          </form>
        );

      case 'security':
        return (
          <form onSubmit={handleSecuritySave} className="space-y-5">
            <h3 className="text-lg font-bold font-sans">Credentials Security</h3>
            <p className="text-xs text-slate-400">Regularly update your password to shield your orders history.</p>

            {/* Current password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => { setCurrentPassword(e.target.value); delete securityErrors.currentPassword; }}
                placeholder="••••••••"
                className={`w-full p-3.5 rounded-xl text-sm font-medium border focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-955 border-slate-805 text-slate-100'
                    : 'bg-white border-slate-250 text-slate-900'
                } ${securityErrors.currentPassword ? 'border-rose-500' : ''}`}
              />
              {securityErrors.currentPassword && (
                <span className="text-rose-500 text-[10px] font-semibold block">{securityErrors.currentPassword}</span>
              )}
            </div>

            {/* New password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); delete securityErrors.newPassword; }}
                placeholder="Min 6 characters"
                className={`w-full p-3.5 rounded-xl text-sm font-medium border focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-955 border-slate-805 text-slate-100'
                    : 'bg-white border-slate-250 text-slate-900'
                } ${securityErrors.newPassword ? 'border-rose-500' : ''}`}
              />
              {securityErrors.newPassword && (
                <span className="text-rose-500 text-[10px] font-semibold block">{securityErrors.newPassword}</span>
              )}
            </div>

            {/* Confirm new password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); delete securityErrors.confirmPassword; }}
                placeholder="Re-enter new password"
                className={`w-full p-3.5 rounded-xl text-sm font-medium border focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-955 border-slate-805 text-slate-100'
                    : 'bg-white border-slate-250 text-slate-900'
                } ${securityErrors.confirmPassword ? 'border-rose-500' : ''}`}
              />
              {securityErrors.confirmPassword && (
                <span className="text-rose-500 text-[10px] font-semibold block">{securityErrors.confirmPassword}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={securityStatus === 'loading'}
              className="bg-blue-600 hover:bg-blue-550 text-white font-bold py-3 px-6 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center"
            >
              {securityStatus === 'loading' ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold font-sans">Notification Preferences</h3>
              <p className="text-xs text-slate-400">Configure where you receive hardware delivery logs.</p>
            </div>

            <div className="space-y-4">
              {[
                { key: 'orders', title: 'Order Shipments', desc: 'Alert me immediately on tracking status changes.' },
                { key: 'stock', title: 'Stock Restocks', desc: 'Notify me when items in my wishlist are back in stock.' },
                { key: 'newsletter', title: 'Maker Club Bulletins', desc: 'Receive discount coupons and embedded project tutorials.' }
              ].map((item) => (
                <div key={item.key} className="flex items-start justify-between p-3.5 border border-slate-800/10 rounded-xl bg-slate-950/10">
                  <div className="pr-4">
                    <h4 className="text-xs font-bold text-slate-250">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleNotificationsSave(item.key as any)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 cursor-pointer ${
                      notificationsSettings[item.key as keyof typeof notificationsSettings] ? 'bg-blue-600' : 'bg-slate-700'
                    }`}
                  >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      notificationsSettings[item.key as keyof typeof notificationsSettings] ? 'translate-x-5' : ''
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-5">
            <h3 className="text-lg font-bold font-sans">Visual Themes</h3>
            <p className="text-xs text-slate-400">Toggle light/dark appearance for optimal PCB contrast.</p>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <button
                onClick={() => theme === 'light' && toggleTheme()}
                className={`p-5 rounded-2xl border flex flex-col items-center justify-center space-y-3 cursor-pointer transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-900/60 border-blue-500 text-blue-500'
                    : 'bg-slate-955 border-slate-850 hover:bg-slate-900 text-slate-400'
                }`}
              >
                <Moon className="w-6 h-6" />
                <span className="text-xs font-bold">Dark Dimension</span>
              </button>
              
              <button
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`p-5 rounded-2xl border flex flex-col items-center justify-center space-y-3 cursor-pointer transition-all ${
                  theme === 'light'
                    ? 'bg-blue-50/20 border-blue-500 text-blue-600'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-500'
                }`}
              >
                <Sun className="w-6 h-6" />
                <span className="text-xs font-bold">Light Prototyping</span>
              </button>
            </div>
          </div>
        );

      case 'newsletter':
        return (
          <div className="space-y-5">
            <h3 className="text-lg font-bold font-sans">Mailing Bulletins</h3>
            <p className="text-xs text-slate-400">Configure your direct developer communications channels.</p>

            <div className="p-4 rounded-xl border border-slate-800/10 bg-slate-950/10 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-slate-200">Developer Newsletter Subscription</h4>
                <p className="text-[11px] text-slate-500 mt-1">Get 15% off and weekly IoT tutorial packages.</p>
              </div>
              <button
                onClick={() => {
                  updateProfile({ newsletterSubscribed: !user.newsletterSubscribed });
                  addToast(user.newsletterSubscribed ? 'Unsubscribed from newsletter.' : 'Subscribed to developer club!', 'info');
                }}
                className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 cursor-pointer ${
                  user.newsletterSubscribed ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  user.newsletterSubscribed ? 'translate-x-5' : ''
                }`} />
              </button>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold font-sans">Workspace Cache</h3>
            <p className="text-xs text-slate-400">Manage locally persisted cookie arrays and product visits history.</p>

            <div className="space-y-4">
              <div className="p-4 border border-slate-800/10 rounded-xl bg-slate-950/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-250">Clear Visited Components</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Flush the recently viewed logs database.</p>
                </div>
                <button
                  type="button"
                  onClick={handleClearSession}
                  className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg text-xs font-bold border border-rose-500/15 cursor-pointer"
                >
                  Clear History
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumbs */}
        <nav className="flex items-center space-x-1.5 text-xs text-slate-400 font-semibold mb-6">
          <Link to="/" className="hover:text-blue-500 transition-colors cursor-pointer">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/profile" className="hover:text-blue-500 transition-colors cursor-pointer">My Profile</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-bold text-blue-500">Settings</span>
        </nav>

        {/* Title Header */}
        <div className="border-b border-slate-800/10 pb-6 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight font-sans flex items-center gap-2.5">
              <Settings className="w-8 h-8 text-blue-500" />
              <span>Workspace Settings</span>
            </h1>
            <p className="text-xs text-slate-400">Configure developer attributes, notification gates, and session cache.</p>
          </div>
          
          <Link
            to="/profile"
            className={`inline-flex items-center space-x-1.5 text-xs font-bold py-2 px-3.5 rounded-xl border transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                : 'border-slate-200 text-slate-650 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Settings Layout Tab Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Vertical Tabs Sidebar Selector */}
          <div className="md:col-span-3 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-1.5 p-1 bg-slate-950/20 border border-slate-800/10 rounded-2xl md:bg-transparent md:border-0">
            {[
              { id: 'profile', label: 'Pro Profile', icon: <User className="w-4 h-4" /> },
              { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
              { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
              { id: 'appearance', label: 'Appearance', icon: <Sun className="w-4 h-4" /> },
              { id: 'newsletter', label: 'Newsletter', icon: <Mail className="w-4 h-4" /> },
              { id: 'account', label: 'Account Cache', icon: <Trash2 className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap md:w-full text-left ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15'
                    : (theme === 'dark' ? 'text-slate-400 hover:bg-slate-900/60 hover:text-white' : 'text-slate-650 hover:bg-slate-100 hover:text-slate-900')
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className={`md:col-span-9 p-6 sm:p-8 rounded-3xl border ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80 backdrop-blur-md' : 'bg-white border-slate-200 shadow-md shadow-slate-100/30'
          }`}>
            {renderTabContent()}
          </div>

        </div>

      </div>
    </motion.div>
  );
};
export default SettingsPage;
