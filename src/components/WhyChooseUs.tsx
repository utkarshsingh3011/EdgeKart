import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Truck, Headphones, Award } from 'lucide-react';

interface CounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}

const Counter: React.FC<CounterProps> = ({ target, duration = 1.5, suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number | null = null;
    const startValue = 0;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Ease out quad
      const easedProgress = progress * (2 - progress);
      const currentValue = startValue + easedProgress * (target - startValue);
      
      setCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [target, duration, isInView]);

  return (
    <span ref={ref} className="font-mono">
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};

interface FeatureItem {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

const FEATURES: FeatureItem[] = [
  {
    title: 'Laboratory Tested Quality',
    description: 'Every chip, development board, and sensor undergoes strict quality assurance tests and is shipped in premium antistatic ESD shielding bags.',
    icon: ShieldCheck,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  },
  {
    title: 'Express Worldwide Shipping',
    description: 'We process orders within 12 hours. Enjoy super-fast, tracked express shipping worldwide, with free postage on orders over $50.',
    icon: Truck,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    title: 'Expert Technical Support',
    description: 'Have a wiring question or compilation bug? Connect directly with our team of embedded systems engineers for responsive assistance.',
    icon: Headphones,
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  },
  {
    title: 'Trusted by Professionals',
    description: 'EdgeKart components power prototypes at top universities, robotics labs, and Silicon Valley hardware engineering centers.',
    icon: Award,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  },
];

interface WhyChooseUsProps {
  theme: 'dark' | 'light';
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ theme }) => {
  return (
    <section
      className={`py-24 transition-colors duration-300 relative overflow-hidden ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
      }`}
    >
      {/* Decorative side light */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Title and Counters */}
          <div className="lg:col-span-5 text-left space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Why EdgeKart</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight font-sans">
                Engineered for{' '}
                <span className="bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
                  Reliability and Speed
                </span>
              </h2>
              <p className={`text-base leading-relaxed ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-650'
              }`}>
                We understand that hardware prototyping requires absolute component precision. That's why we supply only certified, original microcontrollers and sensory modules.
              </p>
            </div>

            {/* Counters Grid */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className={`p-5 rounded-2xl border ${
                theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200/60'
              }`}>
                <p className="text-4xl font-black text-blue-500 font-sans">
                  <Counter target={99.9} decimals={1} suffix="%" />
                </p>
                <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">Quality Tested</p>
              </div>

              <div className={`p-5 rounded-2xl border ${
                theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200/60'
              }`}>
                <p className="text-4xl font-black text-indigo-500 font-sans">
                  <Counter target={48} suffix="k+" />
                </p>
                <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">Shipped Orders</p>
              </div>

              <div className={`p-5 rounded-2xl border ${
                theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200/60'
              }`}>
                <p className="text-4xl font-black text-purple-500 font-sans">
                  <Counter target={24} suffix="/7" />
                </p>
                <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">Tech Support</p>
              </div>

              <div className={`p-5 rounded-2xl border ${
                theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200/60'
              }`}>
                <p className="text-4xl font-black text-emerald-500 font-sans">
                  <Counter target={4.9} decimals={1} suffix="★" />
                </p>
                <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">Customer Rating</p>
              </div>
            </div>
          </div>

          {/* Right Column: Key Features Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`p-6 rounded-2xl border text-left flex flex-col justify-start relative group transition-colors duration-300 ${
                    theme === 'dark'
                      ? 'bg-slate-900/20 border-slate-800/80 hover:bg-slate-900/40 hover:border-slate-700/60'
                      : 'bg-slate-50/50 border-slate-200/60 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {/* Icon Block */}
                  <div className={`inline-flex p-3 rounded-xl border self-start mb-6 ${feat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-bold font-sans mb-2 group-hover:text-blue-500 transition-colors">
                    {feat.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-655'
                  }`}>
                    {feat.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
