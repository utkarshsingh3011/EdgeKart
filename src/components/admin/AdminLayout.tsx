import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
  addToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  theme,
  onThemeToggle
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white relative">
      {/* Mesh Background Grid */}
      <div className="fixed inset-0 grid-bg-dark opacity-40 pointer-events-none z-0" />
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 left-1/4 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Collapsible Left Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 relative z-10 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Navigation Bar */}
        <AdminNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          theme={theme}
          onThemeToggle={onThemeToggle}
        />

        {/* Dynamic Nested Route Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
