import React from 'react';
import { motion } from 'framer-motion';
import { SearchX, FolderOpen, Heart, ShoppingBag } from 'lucide-react';

interface EmptyStateProps {
  type: 'search' | 'category' | 'wishlist' | 'cart';
  theme: 'dark' | 'light';
  onAction?: () => void;
  actionText?: string;
  customTitle?: string;
  customDescription?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  theme,
  onAction,
  actionText,
  customTitle,
  customDescription,
}) => {
  const getDetails = () => {
    switch (type) {
      case 'search':
        return {
          icon: SearchX,
          iconColor: 'text-blue-500',
          glowBg: 'bg-blue-500/10',
          title: customTitle || 'No components found',
          description: customDescription || "We couldn't find anything matching your keywords or selected filter combination.",
          actionText: actionText || 'Reset Filters',
        };
      case 'category':
        return {
          icon: FolderOpen,
          iconColor: 'text-amber-500',
          glowBg: 'bg-amber-500/10',
          title: customTitle || 'Category coming soon',
          description: customDescription || "We are currently stocking new modules. Check back soon or request a custom quote!",
          actionText: actionText || 'Back to Catalog',
        };
      case 'wishlist':
        return {
          icon: Heart,
          iconColor: 'text-rose-500',
          glowBg: 'bg-rose-500/10',
          title: customTitle || 'No saved components',
          description: customDescription || 'Your wishlist is currently empty. Save products by clicking the heart icon on cards.',
          actionText: actionText || 'Explore Catalog',
        };
      case 'cart':
        return {
          icon: ShoppingBag,
          iconColor: 'text-indigo-500',
          glowBg: 'bg-indigo-500/10',
          title: customTitle || 'Your cart is empty',
          description: customDescription || 'Power your next embedded prototyping project by adding some hardware modules.',
          actionText: actionText || 'Browse Components',
        };
      default:
        return {
          icon: FolderOpen,
          iconColor: 'text-blue-500',
          glowBg: 'bg-blue-500/10',
          title: 'Empty State',
          description: 'No items available at this moment.',
          actionText: 'Return',
        };
    }
  };

  const { icon: Icon, iconColor, glowBg, title, description, actionText: resolvedActionText } = getDetails();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      className={`py-16 px-6 text-center rounded-3xl border max-w-xl mx-auto flex flex-col items-center justify-center space-y-6 ${
        theme === 'dark'
          ? 'bg-slate-900/20 border-slate-800/80 shadow-2xl shadow-black/25'
          : 'bg-white border-slate-200 shadow-xl shadow-slate-100/50'
      }`}
    >
      {/* Icon Area with Radial Glow */}
      <div className="relative">
        <div className={`absolute -inset-4 ${glowBg} rounded-full blur-xl animate-pulse`} />
        <div className={`p-5 rounded-2xl border relative z-10 ${
          theme === 'dark'
            ? 'bg-slate-950/80 border-slate-800'
            : 'bg-slate-50 border-slate-250'
        }`}>
          <Icon className={`w-10 h-10 ${iconColor}`} />
        </div>
      </div>

      {/* Texts */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold font-sans tracking-tight">{title}</h3>
        <p className={`text-sm leading-relaxed max-w-xs sm:max-w-sm mx-auto ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-655'
        }`}>
          {description}
        </p>
      </div>

      {/* Action Button */}
      {onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all duration-300 transform active:translate-y-0 cursor-pointer shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
        >
          {resolvedActionText}
        </button>
      )}
    </motion.div>
  );
};
