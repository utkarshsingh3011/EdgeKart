import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { SkeletonNewsletter } from './Skeletons';
import API from '../services/api';

interface NewsletterProps {
  theme: 'dark' | 'light';
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const Newsletter: React.FC<NewsletterProps> = ({ theme, addToast }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const validateEmail = (emailStr: string) => {
    // Standard RFC 5322 email regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.trim()) {
      setStatus('error');
      setErrorMsg('Please enter an email address.');
      return;
    }

    if (!validateEmail(email.trim())) {
      setStatus('error');
      setErrorMsg('Please provide a valid email address (e.g. user@example.com).');
      return;
    }

    setStatus('loading');
    const submittedEmail = email.trim();

    try {
      const { data } = await API.post('/newsletter', { email: submittedEmail });
      if (data.success) {
        setStatus('success');
        if (addToast) addToast(data.message || `Successfully subscribed ${submittedEmail}!`, 'success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMsg(data.message || 'Failed to subscribe');
        if (addToast) addToast(data.message || 'Failed to subscribe', 'error');
      }
    } catch (err: any) {
      console.error('Newsletter subscribe error:', err);
      setStatus('error');
      const message = err.response?.data?.message || 'Failed to subscribe. Please try again.';
      setErrorMsg(message);
      if (addToast) addToast(message, 'error');
    }
  };

  return (
    <section
      id="contact"
      className={`py-24 transition-colors duration-300 relative overflow-hidden ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
      }`}
    >
      {/* Decorative gradient orb */}
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {isLoading ? (
          <SkeletonNewsletter theme={theme} />
        ) : (
          /* Glow Panel Wrapper */
          <div className={`p-8 md:p-14 rounded-3xl border glow-blue relative overflow-hidden text-center md:text-left ${
            theme === 'dark'
              ? 'bg-slate-900/40 border-slate-800 grid-bg-dark'
              : 'bg-slate-50 border-slate-200/80 grid-bg-light'
          }`}>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Text description */}
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Stay Connected</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
                  Join the EdgeKart{' '}
                  <span className="bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
                    Developer Club
                  </span>
                </h2>
                <p className={`text-sm leading-relaxed max-w-md ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-655'
                }`}>
                  Subscribe to receive launch announcements, embedded systems project tutorials, and a <strong className="text-blue-500">15% discount code</strong> for your next purchase.
                </p>
              </div>

              {/* Input Form Column */}
              <div className="lg:col-span-6 w-full">
                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-left space-y-3"
                    >
                      <div className="flex items-center space-x-2.5 text-emerald-500">
                        <CheckCircle className="w-6 h-6 flex-shrink-0" />
                        <h3 className="font-bold text-lg font-sans">You're Subscribed!</h3>
                      </div>
                      <p className={`text-xs leading-relaxed ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Check your email shortly for confirmation. Use discount code <span className="font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-md font-bold text-sm">EDGEKART15</span> on checkout!
                      </p>
                      <button
                        onClick={() => setStatus('idle')}
                        className="text-xs text-blue-500 hover:text-blue-400 font-bold underline cursor-pointer"
                      >
                        Subscribe another email
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="form" className="space-y-4">
                      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
                        <div className="relative flex-1">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-450">
                            <Mail className="w-4.5 h-4.5" />
                          </span>
                          <input
                            type="text"
                            placeholder="Enter your email address..."
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (status === 'error') setStatus('idle');
                            }}
                            disabled={status === 'loading'}
                            className={`w-full py-3.5 pl-11 pr-4 rounded-xl text-sm font-medium border focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all ${
                              theme === 'dark'
                                ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-slate-700'
                                : 'bg-white border-slate-250 text-slate-900 placeholder-slate-455 focus:border-blue-400'
                            }`}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={status === 'loading'}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 flex-shrink-0 cursor-pointer disabled:opacity-50"
                        >
                          {status === 'loading' ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <span>Subscribe</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </form>

                      {/* Error display */}
                      <AnimatePresence>
                        {status === 'error' && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex items-center space-x-2 text-rose-500 text-xs text-left"
                          >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{errorMsg}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>
        )}
      </div>
    </section>
  );
};
