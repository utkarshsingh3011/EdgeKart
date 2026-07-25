import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  Mail,
  Settings,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
}

const MENU_ITEMS: SidebarItem[] = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  { name: 'Newsletter', path: '/admin/newsletter', icon: Mail },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  collapsed,
  setCollapsed
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 lg:z-30 bg-slate-950/95 border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-20' : 'w-64'}`}
      >
        <div>
          {/* Header Brand */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
            <Link to="/admin" className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-blue-500/25 flex-shrink-0">
                EK
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-100 text-base tracking-tight leading-none">
                    EdgeKart
                  </span>
                  <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest mt-0.5">
                    Admin Portal
                  </span>
                </div>
              )}
            </Link>

            {/* Controls */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                aria-label="Close Sidebar"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCollapsed((prev) => !prev)}
                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/60 transition-colors"
                aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1">
            {!collapsed && (
              <div className="px-3 pt-2 pb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Management
              </div>
            )}

            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 group relative ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      {!collapsed && <span className="truncate">{item.name}</span>}

                      {/* Tooltip on Collapsed Desktop View */}
                      {collapsed && (
                        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-slate-100 text-xs rounded-lg shadow-xl border border-slate-800 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                          {item.name}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        {!collapsed && (
          <div className="p-4 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-500 text-center">
              EdgeKart Console v2.4
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
