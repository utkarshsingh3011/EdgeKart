import React from 'react';
import { ChevronRight, RefreshCw } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  onRefresh?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs = [{ label: 'Admin', href: '/admin/dashboard' }],
  actions,
  onRefresh
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        {/* Breadcrumb Trail */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1.5">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
                <span
                  className={idx === breadcrumbs.length - 1 ? 'text-blue-400 font-medium' : 'hover:text-slate-200 transition-colors'}
                >
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </nav>
        )}

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">{title}</h1>
        {subtitle && <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{subtitle}</p>}
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-2.5">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
        {actions}
      </div>
    </div>
  );
};

export default AdminHeader;
