import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  theme: 'dark' | 'light';
}

export const Hero: React.FC<HeroProps> = ({ theme }) => {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className={`relative min-h-screen pt-28 pb-20 flex items-center justify-center overflow-hidden transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Background Grid & Decorative Gradients */}
      <div className={`absolute inset-0 z-0 pointer-events-none opacity-40 ${
        theme === 'dark' ? 'grid-bg-dark mesh-gradient-dark' : 'grid-bg-light mesh-gradient-light'
      }`} />

      {/* Decorative Orbs - Drifting and Pulsing */}
      <motion.div 
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
          x: [0, 10, 0],
          y: [0, -10, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" 
      />
      <motion.div 
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.8, 1, 0.8],
          x: [0, -15, 0],
          y: [0, 15, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12 md:py-20">
        
        {/* Left Content (Text and CTAs) */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-8">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="self-start inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/5 text-xs font-semibold text-blue-500 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <span>Next-Gen Electronics Store</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] font-sans"
          >
            Build the Future with{' '}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
              Embedded Systems
            </span>
          </motion.h1>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-650'
            }`}
          >
            Discover EdgeKart's premium selection of development boards, intelligent sensors, power modules, and IoT connectivity accessories. Engineered for creators, engineers, and hobbyists alike.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
          >
            <motion.button
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/#products')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20 active:translate-y-0 flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <span>Explore Products</span>
              <motion.span
                variants={{
                  hover: { x: 5 }
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/#products')}
              className={`font-semibold py-4 px-8 rounded-xl border transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2.5 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-900/60 border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-white hover:border-slate-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <ShoppingCart className="w-5 h-5 text-blue-500" />
              <span>Shop Development Kits</span>
            </motion.button>
          </motion.div>

          {/* Quick Info Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t ${
              theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
            }`}
          >
            <div className="text-left">
              <p className="text-xl sm:text-2xl font-extrabold text-blue-500">100%</p>
              <p className="text-[10px] sm:text-xs text-slate-450 mt-1 uppercase font-semibold tracking-wider">Quality Tested</p>
            </div>
            <div className="text-left">
              <p className="text-xl sm:text-2xl font-extrabold text-indigo-500">Fast</p>
              <p className="text-[10px] sm:text-xs text-slate-450 mt-1 uppercase font-semibold tracking-wider">Global Shipping</p>
            </div>
            <div className="text-left">
              <p className="text-xl sm:text-2xl font-extrabold text-purple-500">24/7</p>
              <p className="text-[10px] sm:text-xs text-slate-450 mt-1 uppercase font-semibold tracking-wider">Expert Support</p>
            </div>
          </motion.div>
        </div>

        {/* Right Content (Animated Circuit Board Art with Floating Motion) */}
        <div className="lg:col-span-5 relative w-full aspect-square flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: [0, -10, 0]
            }}
            transition={{ 
              scale: { type: 'spring', damping: 20, stiffness: 100, delay: 0.2 },
              opacity: { duration: 0.5, delay: 0.2 },
              y: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="w-full max-w-[450px] relative aspect-square"
          >
            {/* Pulsing glow under the graphic */}
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-[80px] animate-pulse" />

            <svg viewBox="0 0 400 400" className="w-full h-full relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer boundary circuit traces */}
              <circle cx="200" cy="200" r="180" stroke="url(#circleGrad)" strokeWidth="1" strokeDasharray="10 5 2 5" />
              
              {/* Core board */}
              <rect x="70" y="70" width="260" height="260" rx="20" fill={theme === 'dark' ? '#0f172a' : '#ffffff'} stroke="url(#boardBorderGrad)" strokeWidth="2" />
              
              {/* PCB circuit trace lines */}
              <g opacity="0.3" stroke={theme === 'dark' ? '#3b82f6' : '#2563eb'} strokeWidth="1.5">
                <path d="M100 100 L130 130 H270 L300 100" />
                <path d="M100 300 L130 270 H270 L300 300" />
                <path d="M100 150 V250" />
                <path d="M300 150 V250" />
                <path d="M150 150 H250 V250 H150 Z" />
              </g>

              {/* Glowing animated signals along paths */}
              <g stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round">
                <motion.path
                  d="M100 100 L130 130 H270 L300 100"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                <motion.path
                  d="M300 300 L270 270 H130 L100 300"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 2 }}
                />
              </g>

              {/* Main Microcontroller SoC at Center */}
              <motion.g
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                {/* Outer shadow glow */}
                <rect x="135" y="135" width="130" height="130" rx="10" fill={theme === 'dark' ? '#1e293b' : '#f1f5f9'} stroke="#3b82f6" strokeWidth="2.5" className="drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
                <rect x="145" y="145" width="110" height="110" rx="6" fill={theme === 'dark' ? '#0f172a' : '#e2e8f0'} />
                
                {/* Silicon CPU pattern */}
                <circle cx="200" cy="200" r="30" fill="url(#siliconGrad)" />
                <rect x="175" y="175" width="50" height="50" rx="4" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 2" />
                
                {/* Text */}
                <text x="200" y="204" fill="#60a5fa" fontSize="12" fontWeight="bold" textAnchor="middle" letterSpacing="2">ARM</text>
                <text x="200" y="218" fill={theme === 'dark' ? '#64748b' : '#475569'} fontSize="6" textAnchor="middle">CORTEX-M7</text>

                {/* Pin leads coming from chip */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <g key={i}>
                    {/* Top pins */}
                    <line x1={155 + i * 12} y1="130" x2={155 + i * 12} y2="135" stroke="#cbd5e1" strokeWidth="2" />
                    {/* Bottom pins */}
                    <line x1={155 + i * 12} y1="265" x2={155 + i * 12} y2="270" stroke="#cbd5e1" strokeWidth="2" />
                    {/* Left pins */}
                    <line x1="130" y1={155 + i * 12} x2="135" y2={155 + i * 12} stroke="#cbd5e1" strokeWidth="2" />
                    {/* Right pins */}
                    <line x1="265" y1={155 + i * 12} x2="270" y2={155 + i * 12} stroke="#cbd5e1" strokeWidth="2" />
                  </g>
                ))}
              </motion.g>

              {/* Peripheral components */}
              {/* Capacitors */}
              <circle cx="100" cy="180" r="8" fill="#f59e0b" stroke="#d97706" />
              <line x1="100" y1="172" x2="100" y2="167" stroke="#94a3b8" strokeWidth="2" />
              <line x1="100" y1="188" x2="100" y2="193" stroke="#94a3b8" strokeWidth="2" />

              <circle cx="300" cy="220" r="8" fill="#10b981" stroke="#059669" />

              {/* Quartz Oscillator */}
              <rect x="280" y="150" width="22" height="12" rx="3" fill="#cbd5e1" stroke="#94a3b8" />
              <text x="291" y="158" fill="#475569" fontSize="6" fontWeight="bold" textAnchor="middle">16.000</text>

              {/* Status LEDs (Blinking) */}
              <g>
                <circle cx="100" cy="230" r="4" fill="#ef4444" />
                <motion.circle
                  cx="100"
                  cy="230"
                  r="7"
                  stroke="#ef4444"
                  strokeWidth="1"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </g>

              <g>
                <circle cx="100" cy="245" r="4" fill="#10b981" />
                <motion.circle
                  cx="100"
                  cy="245"
                  r="7"
                  stroke="#10b981"
                  strokeWidth="1"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
                />
              </g>

              <defs>
                <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="boardBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#1d4ed8" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <radialGradient id="siliconGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#0f172a" />
                </radialGradient>
              </defs>
            </svg>

            {/* Floating Tech Badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute top-10 right-4 p-3 rounded-2xl border flex items-center space-x-2.5 shadow-xl backdrop-blur-md cursor-default ${
                theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'
              }`}
            >
              <Cpu className="w-5 h-5 text-indigo-500" />
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status</p>
                <p className="text-xs font-bold text-emerald-500">System Ready</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center space-y-2 pointer-events-none">
        <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-450 opacity-70">Scroll to Explore</span>
        <div className={`w-6 h-10 rounded-full border-2 flex justify-center p-1.5 ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-300'
        }`}>
          <motion.div
            animate={{
              y: [0, 12, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-1.5 h-1.5 rounded-full bg-blue-500"
          />
        </div>
      </div>
    </section>
  );
};
