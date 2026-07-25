import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  theme: 'dark' | 'light';
}

export const LoginPage: React.FC<LoginPageProps> = ({ theme }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to home
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className={`min-h-[80vh] py-16 flex items-center justify-center relative overflow-hidden transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Background patterns */}
      <div className={`absolute inset-0 pointer-events-none opacity-20 ${
        theme === 'dark' ? 'grid-bg-dark' : 'grid-bg-light'
      }`} />
      
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full px-4 relative z-10">
        <div className={`p-8 sm:p-10 rounded-3xl border glow-blue text-center space-y-6 ${
          theme === 'dark'
            ? 'bg-slate-900/40 border-slate-800/85 backdrop-blur-md'
            : 'bg-white border-slate-200/85 shadow-2xl shadow-slate-100/50'
        }`}>
          {/* Logo Header */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-500 flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>EdgeKart Authentication</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
              Welcome{' '}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
                Back Maker
              </span>
            </h1>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Sign in to manage your component builds, orders, and wishlist.
            </p>
          </div>

          {/* Form */}
          <LoginForm theme={theme} />

          {/* Registration link */}
          <p className="text-xs text-slate-400 font-semibold mt-6">
            New to EdgeKart?{' '}
            <Link
              to="/register"
              className="text-blue-500 hover:text-blue-450 hover:underline transition-all cursor-pointer font-bold"
            >
              Create Pro Account
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
export default LoginPage;
