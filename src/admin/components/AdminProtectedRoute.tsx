import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AdminProtectedRouteProps {
  children?: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users or non-admin users back to the home page
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdminProtectedRoute;
