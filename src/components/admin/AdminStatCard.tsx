import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  description?: string;
  iconColor?: string;
  accentColor?: string;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  description,
  iconColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20'
}) => {
  return (
    <div className="glass p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden group">
      {/* Background glow hover effect */}
      <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-blue-600/5 rounded-full blur-2xl group-hover:bg-blue-600/15 transition-all duration-500" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl border ${iconColor} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(change || description) && (
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
          {change && (
            <span
              className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full ${
                isPositive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {change}
            </span>
          )}
          {description && <span className="text-slate-400">{description}</span>}
        </div>
      )}
    </div>
  );
};

export default AdminStatCard;
