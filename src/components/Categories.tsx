import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Thermometer, Tv, Wifi, BatteryCharging, Wrench } from 'lucide-react';
import { productService } from '../services/productService';
import type { Product } from '../types/product';
import { SkeletonCategory } from './Skeletons';

interface CategoryItem {
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    name: 'Development Boards',
    description: 'High-performance microcontrollers & minicomputers for coding.',
    icon: Cpu,
    color: 'from-blue-500 to-cyan-400',
  },
  {
    name: 'Sensors',
    description: 'Intelligent monitoring for environmental factors and motion.',
    icon: Thermometer,
    color: 'from-emerald-500 to-teal-400',
  },
  {
    name: 'Displays',
    description: 'Vibrant OLED and graphical screens for data readout.',
    icon: Tv,
    color: 'from-amber-500 to-orange-400',
  },
  {
    name: 'Connectivity',
    description: 'Wireless, RF, Bluetooth, and transceiver adapters.',
    icon: Wifi,
    color: 'from-indigo-500 to-purple-400',
  },
  {
    name: 'Power',
    description: 'Regulators, battery management boards, and power supplies.',
    icon: BatteryCharging,
    color: 'from-rose-500 to-pink-400',
  },
  {
    name: 'Accessories',
    description: 'Prototyping wires, breadboards, headers, and connectors.',
    icon: Wrench,
    color: 'from-slate-400 to-slate-500',
  },
];

interface CategoriesProps {
  theme: 'dark' | 'light';
  onSelectCategory: (category: string) => void;
  activeCategory: string;
}

export const Categories: React.FC<CategoriesProps> = ({
  theme,
  onSelectCategory,
  activeCategory,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchCategoryCounts = async () => {
      try {
        const response = await productService.getProducts({ limit: 100 });
        if (isMounted && response && response.data) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories data:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCategoryCounts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    onSelectCategory(categoryName);
    const element = document.getElementById('products');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  return (
    <section
      id="categories"
      className={`py-24 transition-colors duration-300 relative overflow-hidden ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Inventory Directory</span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans"
          >
            Explore by{' '}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
              Category
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-base sm:text-lg ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-655'
            }`}
          >
            Select a specialized hardware category below to filter our high-performance component catalog.
          </motion.p>
        </div>

        {/* Category Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCategory key={idx} theme={theme} />
            ))
          ) : (
            CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.name;
              const count = products.filter((p) => p.category === cat.name).length;

              return (
                <motion.div
                  key={cat.name}
                  variants={cardVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col justify-between text-left group relative ${
                    isActive
                      ? theme === 'dark'
                        ? 'border-blue-500 bg-blue-950/40 shadow-lg shadow-blue-500/10'
                        : 'border-blue-500 bg-blue-50/40 shadow-lg shadow-blue-500/5'
                      : theme === 'dark'
                      ? 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700/80 hover:bg-slate-900/60 hover:shadow-xl hover:shadow-black/20'
                      : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50 hover:shadow-lg hover:shadow-slate-100/50'
                  }`}
                >
                  {/* Active glow dot */}
                  {isActive && (
                    <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-md shadow-blue-500/50 animate-pulse" />
                  )}

                  <div>
                    {/* Icon Block */}
                    <div
                      className={`inline-flex p-3.5 rounded-xl bg-gradient-to-br ${cat.color} text-white mb-6 shadow-md transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl font-bold font-sans mb-2 group-hover:text-blue-500 transition-colors">
                      {cat.name}
                    </h3>
                    <p className={`text-sm leading-relaxed mb-6 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-655'
                    }`}>
                      {cat.description}
                    </p>
                  </div>

                  {/* Footer Count info */}
                  <div className="flex items-center justify-between mt-auto">
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      {count === 0 ? 'Coming Soon' : `${count} Product${count > 1 ? 's' : ''}`}
                    </span>
                    <span className="text-sm font-bold text-blue-500 group-hover:translate-x-1.5 transition-transform duration-300">
                      Browse &rarr;
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </section>
  );
};
