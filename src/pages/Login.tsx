import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginProps {
  theme?: 'dark' | 'light';
}

export const Login: React.FC<LoginProps> = ({ theme = 'dark' }) => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Login | EdgeKart';
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    try {
      const success = await login(data.email, data.password, data.rememberMe);
      if (success) {
        // Successful login: AuthContext handles saving JWT and user
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setApiError(err.message || 'Invalid email or password. Please try again.');
    }
  };

  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.3 }}
      className={`min-h-[85vh] py-12 px-4 flex items-center justify-center relative overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div
          className={`p-8 sm:p-10 rounded-3xl border transition-all shadow-2xl backdrop-blur-xl ${
            isDark
              ? 'bg-slate-900/60 border-slate-800 shadow-black/50'
              : 'bg-white/90 border-slate-200 shadow-slate-200/60'
          }`}
        >
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-500">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcome Back to EdgeKart</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight font-sans">
              Sign In to Your{' '}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
                Account
              </span>
            </h1>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Enter your hardware lab credentials to access your orders, cart & profile.
            </p>
          </div>

          {/* Backend API Error Banner */}
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs flex items-start gap-3"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="flex-1 font-medium">{apiError}</div>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className={`text-xs font-bold uppercase tracking-wider block ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="login-email"
                  type="email"
                  placeholder="maker@edgekart.com"
                  disabled={isSubmitting}
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  className={`w-full py-3.5 pl-10 pr-4 rounded-xl text-sm font-medium border transition-all focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-slate-950/80 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                  } ${errors.email ? 'border-rose-500 focus:ring-rose-500' : ''}`}
                />
              </div>
              {errors.email && (
                <span className="text-rose-500 text-xs font-medium block mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="login-password"
                  className={`text-xs font-bold uppercase tracking-wider block ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-blue-500 hover:text-blue-400 hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  className={`w-full py-3.5 pl-10 pr-11 rounded-xl text-sm font-medium border transition-all focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-slate-950/80 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                  } ${errors.password ? 'border-rose-500 focus:ring-rose-500' : ''}`}
                />
                {/* Show Password Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                  aria-label={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-rose-500 text-xs font-medium block mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2.5 text-xs font-semibold cursor-pointer select-none text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  disabled={isSubmitting}
                  {...register('rememberMe')}
                  className={`w-4 h-4 rounded border-slate-700 focus:ring-blue-500 cursor-pointer ${
                    isDark ? 'bg-slate-950 accent-blue-500' : 'bg-white accent-blue-600'
                  }`}
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer mt-6"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                <>
                  <ShieldCheck className="w-4.5 h-4.5" />
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Registration Redirect Footer */}
          <div className="mt-8 pt-6 border-t border-slate-800/60 text-center">
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Don't have an EdgeKart account?{' '}
              <Link
                to="/register"
                className="text-blue-500 hover:text-blue-400 hover:underline font-bold transition-all"
              >
                Create an Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
