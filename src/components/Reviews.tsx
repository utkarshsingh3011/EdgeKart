import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck } from 'lucide-react';
import { SkeletonReviews } from './Skeletons';

interface ReviewItem {
  name: string;
  role: string;
  organization: string;
  content: string;
  rating: number;
  avatarText: string;
  avatarBg: string;
}

const REVIEWS: ReviewItem[] = [
  {
    name: 'Rahul Sharma',
    role: 'Embedded Systems Engineer',
    organization: 'AeroSystems IoT',
    content: "EdgeKart is our go-to shop for rapid prototyping. The ESP32 DevKit V1 and OLED displays we ordered arrived in pristine condition, individually packed in ESD shielding. The board traces are remarkably robust.",
    rating: 5,
    avatarText: 'RS',
    avatarBg: 'bg-blue-600/20 text-blue-500 border-blue-500/30',
  },
  {
    name: 'Neha Verma',
    role: 'IoT Developer',
    organization: 'SmartGrid Solutions',
    content: "Outstanding quality. The ESP32 microcontrollers have excellent RF reception, sturdy solder joints on the pins, and clean silkscreen printing. Finding reliable components online is tough, but EdgeKart delivers.",
    rating: 5,
    avatarText: 'NV',
    avatarBg: 'bg-emerald-600/20 text-emerald-500 border-emerald-500/30',
  },
  {
    name: 'Arjun Patel',
    role: 'Robotics Club Lead',
    organization: 'IIT Delhi',
    content: "Their MQ2 gas sensors and jumper wires rescued our robotics competition project. The premium copper cores in the wires make a tight connection on the breadboard. Highly recommend their accessories!",
    rating: 5,
    avatarText: 'AP',
    avatarBg: 'bg-purple-600/20 text-purple-500 border-purple-500/30',
  },
  {
    name: 'Priya Gupta',
    role: 'ECE Student',
    organization: 'VIT Vellore',
    content: "Affordable components are essential for college projects, and EdgeKart hits the sweet spot. The Arduino Uno R3 board has survived numerous wiring mistakes and accidental short circuits, proving its durability.",
    rating: 5,
    avatarText: 'PG',
    avatarBg: 'bg-indigo-600/20 text-indigo-500 border-indigo-500/30',
  },
];

interface ReviewsProps {
  theme: 'dark' | 'light';
}

export const Reviews: React.FC<ReviewsProps> = ({ theme }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="reviews"
      className={`py-24 transition-colors duration-300 relative overflow-hidden ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Decorative background grid */}
      <div className={`absolute inset-0 z-0 pointer-events-none opacity-20 ${
        theme === 'dark' ? 'grid-bg-dark' : 'grid-bg-light'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
            Trusted by the{' '}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
              Maker Community
            </span>
          </h2>
          <p className={`text-base sm:text-lg ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-650'
          }`}>
            Read feedback from the researchers, students, and firmware engineers who rely on our electronic components.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonReviews key={idx} theme={theme} />
            ))
          ) : (
            REVIEWS.map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className={`p-6 md:p-8 rounded-2xl border text-left flex flex-col justify-between transition-all duration-305 relative ${
                  theme === 'dark'
                    ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700/60'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100/50'
                }`}
              >
                {/* Star and Verified Icon Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Purchase</span>
                  </div>
                </div>

                {/* Content */}
                <p className={`text-sm md:text-base leading-relaxed mb-8 italic ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  "{review.content}"
                </p>

                {/* Reviewer Details */}
                <div className="flex items-center space-x-4 mt-auto pt-4 border-t border-slate-800/10">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm border flex-shrink-0 ${review.avatarBg}`}>
                    {review.avatarText}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm truncate font-sans">{review.name}</h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {review.role}, <span className="text-blue-500 font-semibold">{review.organization}</span>
                    </p>
                  </div>
                </div>

              </motion.div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};
