import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginFormProps {
  theme: 'dark' | 'light';
}

import { useToast } from '../context/ToastContext';

export const LoginForm: React.FC<LoginFormProps> = ({ theme }) => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [authError, setAuthError] = useState('');

  // Intended destination
  const fromPath = (location.state as any)?.from?.pathname || '/';

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);

    // Clear validation errors on type
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (authError) setAuthError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setAuthError('');

    try {
      const success = await login(email, password, rememberMe);
      if (success) {
        setStatus('success');
        setTimeout(() => {
          navigate(fromPath, { replace: true });
        }, 1200);
      } else {
        setStatus('error');
        setAuthError('Incorrect email or password. Hint: maker@edgekart.com / password123');
      }
    } catch (err) {
      setStatus('error');
      setAuthError('Authentication service failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 text-left">
      {status === 'success' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-8 rounded-3xl border text-center flex flex-col items-center justify-center space-y-4 ${
            theme === 'dark'
              ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-2xl shadow-black/40'
              : 'bg-white border-slate-200 text-slate-900 shadow-xl shadow-slate-200/50'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <Check className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-sans">Access Granted!</h3>
            <p className="text-xs text-slate-400">Loading your profile dashboard...</p>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Auth warning error alert */}
          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-rose-500 text-xs flex items-start space-x-2"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{authError}</span>
            </motion.div>
          )}

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-450">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={status === 'loading'}
                placeholder="maker@edgekart.com"
                className={`w-full py-3.5 pl-11 pr-4 rounded-xl text-sm font-medium border focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-655 focus:border-slate-700'
                    : 'bg-white border-slate-250 text-slate-900 placeholder-slate-400 focus:border-blue-400'
                } ${errors.email ? 'border-rose-500/60 focus:ring-rose-500' : ''}`}
              />
            </div>
            {errors.email && (
              <span className="text-rose-500 text-[11px] font-semibold block">{errors.email}</span>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-455">Password</label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                disabled={status === 'loading'}
                className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={status === 'loading'}
                placeholder="••••••••"
                className={`w-full py-3.5 pl-11 pr-4 rounded-xl text-sm font-medium border focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-655 focus:border-slate-700'
                    : 'bg-white border-slate-250 text-slate-900 placeholder-slate-400 focus:border-blue-400'
                } ${errors.password ? 'border-rose-500/60 focus:ring-rose-500' : ''}`}
              />
            </div>
            {errors.password && (
              <span className="text-rose-500 text-[11px] font-semibold block">{errors.password}</span>
            )}
          </div>

          {/* Remember me row */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer select-none text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={status === 'loading'}
                className={`w-4 h-4 rounded border-slate-750 focus:ring-blue-500 cursor-pointer ${
                  theme === 'dark' ? 'bg-slate-950 accent-blue-500' : 'bg-white accent-blue-600'
                }`}
              />
              <span>Remember Me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer mt-4"
          >
            {status === 'loading' ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Log In</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className={`absolute inset-0 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`} />
            <span className={`relative px-4 text-xs font-bold text-slate-500 uppercase tracking-widest ${
              theme === 'dark' ? 'bg-slate-950' : 'bg-white'
            }`}>
              Or Continue With
            </span>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => addToast('Social Google sign-in is UI only in this prototype. Please log in with your email/password.', 'info')}
            disabled={status === 'loading'}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all border flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-50 ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white'
                : 'bg-white border-slate-250 text-slate-650 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </form>
      )}
    </div>
  );
};
export default LoginForm;
