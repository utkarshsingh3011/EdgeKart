import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, ShieldCheck, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminProtectedRouteProps {
  children?: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, loading, updateProfile } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400">Verifying administrative credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and remember intended destination path
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Mesh Gradient */}
        <div className="absolute inset-0 mesh-gradient-dark opacity-60 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-lg w-full glass p-8 rounded-2xl border border-slate-800 shadow-2xl relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5 text-red-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 mb-3">
            403 - Restricted Access
          </span>

          <h1 className="text-2xl font-bold text-slate-100 mb-2">Admin Rights Required</h1>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Logged in as <strong className="text-slate-200">{user.email}</strong> (<span className="capitalize">{user.role || 'user'}</span>). Access to the EdgeKart Administration Portal requires an account with an <code className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded font-mono text-xs">admin</code> role.
          </p>

          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 text-left mb-6">
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Demo / Testing Access</h4>
                <p className="text-xs text-slate-400 mt-1">
                  You can toggle your account role to <strong className="text-slate-300">admin</strong> below to test the administration dashboard layout, navigation, and pages.
                </p>
                <button
                  onClick={() => updateProfile({ role: 'admin' })}
                  className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Grant Admin Role to Current Account
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : null;
};

export default AdminProtectedRoute;
