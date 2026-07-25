import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowLeft, Send, Check } from 'lucide-react';

interface ForgotPasswordPageProps {
  theme: 'dark' | 'light';
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ theme }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  
  // Timer resend state
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const validate = () => {
    if (!email) {
      setError('Email address is required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError('');
    return true;
  };

  const handleInputChange = (val: string) => {
    setEmail(val);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    
    // Simulated delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    setStatus('success');
    setCountdown(60); // Initialize 60s countdown
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, 600));
    setStatus('success');
    setCountdown(60);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className={`min-h-[80vh] py-16 flex items-center justify-center relative overflow-hidden transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-955 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className={`absolute inset-0 pointer-events-none opacity-20 ${
        theme === 'dark' ? 'grid-bg-dark' : 'grid-bg-light'
      }`} />

      <div className="max-w-md w-full px-4 relative z-10">
        <div className={`p-8 sm:p-10 rounded-3xl border glow-blue text-center space-y-6 ${
          theme === 'dark'
            ? 'bg-slate-900/40 border-slate-800/85 backdrop-blur-md'
            : 'bg-white border-slate-200/85 shadow-2xl shadow-slate-100/50'
        }`}>
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-left"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto">
                <Check className="w-7 h-7" />
              </div>
              
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-bold font-sans">Reset Email Transmitted</h3>
                <p className={`text-xs leading-relaxed ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  A password restoration key has been successfully dispatched to <strong className="text-blue-500">{email}</strong>. Please check your inbox and spam folders.
                </p>
              </div>

              {/* Resend button */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0}
                  className={`w-full py-3 px-6 rounded-xl font-bold text-xs border transition-colors cursor-pointer disabled:opacity-50 ${
                    countdown > 0
                      ? (theme === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-550' : 'bg-slate-100 border-slate-200 text-slate-400')
                      : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-500'
                  }`}
                >
                  {countdown > 0 ? `Resend Code in ${countdown}s` : 'Resend Password Link'}
                </button>
              </div>

              {/* Back to login link */}
              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-500 hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Log In</span>
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Recovery Center</span>
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
                  Recover{' '}
                  <span className="bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
                    Credentials
                  </span>
                </h1>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Input your account email below. We'll transmit a secure reset hyperlink to configure a new password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-450">Account Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => handleInputChange(e.target.value)}
                      disabled={status === 'loading'}
                      placeholder="maker@edgekart.com"
                      className={`w-full py-3.5 pl-11 pr-4 rounded-xl text-sm font-medium border focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all ${
                        theme === 'dark'
                          ? 'bg-slate-955 border-slate-800 text-slate-100 placeholder-slate-655 focus:border-slate-700'
                          : 'bg-white border-slate-250 text-slate-900 placeholder-slate-400 focus:border-blue-400'
                      } ${error ? 'border-rose-500/60 focus:ring-rose-500' : ''}`}
                    />
                  </div>
                  {error && (
                    <span className="text-rose-500 text-[11px] font-semibold block">{error}</span>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer pt-4"
                >
                  {status === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Recovery Link</span>
                    </>
                  )}
                </button>

                {/* Back to login */}
                <div className="pt-2 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-500 hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to Log In</span>
                  </Link>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
export default ForgotPasswordPage;
