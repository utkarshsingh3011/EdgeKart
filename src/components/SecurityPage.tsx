import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ChevronRight, ArrowLeft, Lock, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface SecurityPageProps {
  theme: 'dark' | 'light';
}

export const SecurityPage: React.FC<SecurityPageProps> = ({ theme }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className={`min-h-screen pt-24 pb-20 text-left ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-slate-400 mb-8 py-2 border-b border-slate-800/10">
          <Link
            to="/"
            className="hover:text-blue-500 transition-colors font-medium cursor-pointer"
          >
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-bold text-blue-500">Security</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className={`mb-8 inline-flex items-center space-x-2 text-xs font-semibold py-2 px-3.5 rounded-xl border transition-all cursor-pointer ${
            theme === 'dark'
              ? 'bg-slate-900 border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-white'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        {/* Title Block */}
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Trust & Safety</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans mt-1">
            Security Certifications
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            EdgeKart is committed to securing your payment transactions, protecting data privacy, and supplying 100% genuine electronics.
          </p>
        </div>

        {/* Grid Info Boxes */}
        <div className="space-y-6">
          {/* Card 1: SSL Transaction Encryption */}
          <div className={`p-6 rounded-2xl border flex flex-col md:flex-row gap-5 items-start ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80 shadow-2xl' : 'bg-white border-slate-200 shadow-xl shadow-slate-100/50'
          }`}>
            <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500 flex-shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold">PCI-DSS Compliant Encryption</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                All debit card, credit card, and UPI payment operations are processed over secure SSL connections using standard PCI-DSS level 1 certified payment gateways. EdgeKart does not store credit card credentials on our servers.
              </p>
            </div>
          </div>

          {/* Card 2: 100% Genuine Components Guarantee */}
          <div className={`p-6 rounded-2xl border flex flex-col md:flex-row gap-5 items-start ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80 shadow-2xl' : 'bg-white border-slate-200 shadow-xl shadow-slate-100/50'
          }`}>
            <div className="p-3 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold">Factory-Sourced Genuine Hardware</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                We work directly with authorized distributors and chip manufacturers (Espressif Systems, Raspberry Pi Foundation, Bosch, STMicroelectronics) to ensure zero cloned, counterfeit, or grey-market boards reach your lab.
              </p>
            </div>
          </div>

          {/* Card 3: ESD Safe Lab Packaging */}
          <div className={`p-6 rounded-2xl border flex flex-col md:flex-row gap-5 items-start ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80 shadow-2xl' : 'bg-white border-slate-200 shadow-xl shadow-slate-100/50'
          }`}>
            <div className="p-3 rounded-xl bg-blue-650/10 border border-blue-500/20 text-blue-550 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold">Static-Safe Handling</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                All microcontrollers, SOCs, and sensitive sensor modules are tested and packaged inside ESD anti-static shielding bags in humidity-controlled cleanrooms to protect gate-oxide layers from electro-static discharge failures during shipping.
              </p>
            </div>
          </div>
        </div>

        {/* Audit Verification badge */}
        <div className={`mt-12 p-6 rounded-2xl border text-center ${
          theme === 'dark' ? 'bg-slate-950 border-slate-850/80' : 'bg-slate-50 border-slate-150'
        }`}>
          <p className="text-xs text-slate-500 font-mono leading-relaxed">
            SYSTEM AUTH: ACTIVE // SSL ENCRYPTION SHA-256 SECURE // LAST COMPLIANCE AUDIT PASSED JULY 2026
          </p>
        </div>
      </div>
    </motion.div>
  );
};
