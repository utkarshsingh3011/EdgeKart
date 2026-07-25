import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldAlert, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RegisterFormProps {
  theme: 'dark' | 'light';
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ theme }) => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Strength meter states
  const [strength, setStrength] = useState(0); // 0 to 4
  const [strengthLabel, setStrengthLabel] = useState('Weak');

  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [regError, setRegError] = useState('');

  // Password strength checker effect
  useEffect(() => {
    let score = 0;
    if (!password) {
      setStrength(0);
      setStrengthLabel('Too Short');
      return;
    }

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    setStrength(score);

    switch (score) {
      case 0:
      case 1:
        setStrengthLabel('Weak');
        break;
      case 2:
      case 3:
        setStrengthLabel('Medium');
        break;
      case 4:
        setStrengthLabel('Strong');
        break;
      default:
        setStrengthLabel('Weak');
    }
  }, [password]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'name') setName(value);
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    if (field === 'confirmPassword') setConfirmPassword(value);

    // Clear validation errors
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (regError) setRegError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setRegError('');

    try {
      const success = await register(name, email, password);
      if (success) {
        setStatus('success');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1200);
      } else {
        setStatus('error');
        setRegError('An account with this email address already exists.');
      }
    } catch (err) {
      setStatus('error');
      setRegError('Registration service failed. Please try again.');
    }
  };

  const getStrengthBarColor = () => {
    if (strength <= 1) return 'bg-rose-500';
    if (strength <= 3) return 'bg-amber-500';
    return 'bg-emerald-500';
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
            <h3 className="text-xl font-bold font-sans">Account Created!</h3>
            <p className="text-xs text-slate-400">Logging you in and setting up your workspace...</p>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Registration errors */}
          {regError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-rose-500 text-xs flex items-start space-x-2"
            >
              <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{regError}</span>
            </motion.div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-450">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={status === 'loading'}
                placeholder="Alex Maker"
                className={`w-full py-3.5 pl-11 pr-4 rounded-xl text-sm font-medium border focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-955 border-slate-800 text-slate-100 placeholder-slate-655 focus:border-slate-700'
                    : 'bg-white border-slate-250 text-slate-900 placeholder-slate-400 focus:border-blue-400'
                } ${errors.name ? 'border-rose-500/60 focus:ring-rose-500' : ''}`}
              />
            </div>
            {errors.name && (
              <span className="text-rose-500 text-[11px] font-semibold block">{errors.name}</span>
            )}
          </div>

          {/* Email */}
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
                placeholder="alex@example.com"
                className={`w-full py-3.5 pl-11 pr-4 rounded-xl text-sm font-medium border focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-955 border-slate-800 text-slate-100 placeholder-slate-655 focus:border-slate-700'
                    : 'bg-white border-slate-250 text-slate-900 placeholder-slate-400 focus:border-blue-400'
                } ${errors.email ? 'border-rose-500/60 focus:ring-rose-500' : ''}`}
              />
            </div>
            {errors.email && (
              <span className="text-rose-500 text-[11px] font-semibold block">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-450">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={status === 'loading'}
                placeholder="Min 6 characters"
                className={`w-full py-3.5 pl-11 pr-4 rounded-xl text-sm font-medium border focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-955 border-slate-800 text-slate-100 placeholder-slate-655 focus:border-slate-700'
                    : 'bg-white border-slate-250 text-slate-900 placeholder-slate-400 focus:border-blue-400'
                } ${errors.password ? 'border-rose-500/60 focus:ring-rose-500' : ''}`}
              />
            </div>

            {/* Password strength meter visual */}
            {password && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <span>Password Strength</span>
                  <span className={strength <= 1 ? 'text-rose-500' : strength <= 3 ? 'text-amber-500' : 'text-emerald-500'}>
                    {strengthLabel}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${getStrengthBarColor()}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(strength / 4) * 100}%` }}
                    transition={{ duration: 0.25 }}
                  />
                </div>
              </div>
            )}

            {errors.password && (
              <span className="text-rose-500 text-[11px] font-semibold block">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-455">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                disabled={status === 'loading'}
                placeholder="Re-enter password"
                className={`w-full py-3.5 pl-11 pr-4 rounded-xl text-sm font-medium border focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-955 border-slate-800 text-slate-100 placeholder-slate-655 focus:border-slate-700'
                    : 'bg-white border-slate-250 text-slate-900 placeholder-slate-400 focus:border-blue-400'
                } ${errors.confirmPassword ? 'border-rose-500/60 focus:ring-rose-500' : ''}`}
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-rose-500 text-[11px] font-semibold block">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Agree to terms */}
          <div className="space-y-1.5 pt-1 text-left">
            <label className="flex items-start space-x-2.5 text-xs font-semibold cursor-pointer select-none text-slate-400 leading-relaxed">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (errors.agreeTerms) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.agreeTerms;
                      return next;
                    });
                  }
                }}
                disabled={status === 'loading'}
                className={`w-4 h-4 rounded border-slate-750 focus:ring-blue-500 cursor-pointer mt-0.5 ${
                  theme === 'dark' ? 'bg-slate-950 accent-blue-500' : 'bg-white accent-blue-600'
                }`}
              />
              <span>
                I agree to the EdgeKart Terms of Service, prototyping privacy agreements, and ESD hardware disclosures.
              </span>
            </label>
            {errors.agreeTerms && (
              <span className="text-rose-500 text-[11px] font-semibold block">{errors.agreeTerms}</span>
            )}
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
              <span>Create Account</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
export default RegisterForm;
