import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle, ArrowLeft } from 'lucide-react';

interface NotFoundProps {
  theme?: 'dark' | 'light';
}

export const NotFound: React.FC<NotFoundProps> = ({ theme = 'dark' }) => {
  useEffect(() => {
    document.title = 'Page Not Found | EdgeKart';
  }, []);

  return (
    <div
      className={`min-h-[75vh] flex items-center justify-center px-4 py-16 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
      }`}
    >
      <div className="max-w-md w-full text-center space-y-6">
        {/* Glow & 404 Icon */}
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-3xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-500 mx-auto shadow-2xl shadow-blue-500/20">
            <AlertCircle className="w-12 h-12" />
          </div>
          <span className="absolute -bottom-2 -right-2 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-mono font-extrabold shadow-lg">
            404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Page Not Found</h1>
          <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            The page or micro-hardware endpoint you are looking for does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center space-x-3">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className={`px-4 py-3 rounded-xl border font-semibold text-xs sm:text-sm flex items-center space-x-1.5 transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
