import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowLeft, Globe, Database, BookOpen, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface SitemapPageProps {
  theme: 'dark' | 'light';
}

export const SitemapPage: React.FC<SitemapPageProps> = ({ theme }) => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Sitemap | EdgeKart';
  }, []);

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
          <span className="font-bold text-blue-500">Sitemap</span>
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
          <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Directory Directory</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans mt-1">
            Website Sitemap
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            A comprehensive index of all pages, categories, and technical resources available on the EdgeKart hardware portal.
          </p>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Section 1: Main Portal Pages */}
          <div className={`p-6 rounded-2xl border space-y-4 ${
            theme === 'dark' ? 'bg-slate-900/30 border-slate-800/80 shadow-2xl' : 'bg-white border-slate-200 shadow-xl shadow-slate-100/50'
          }`}>
            <div className="flex items-center space-x-2 text-blue-500">
              <Globe className="w-5 h-5" />
              <h3 className="font-bold text-base">Portal Sections</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-500 transition-colors font-medium">
                  Home Landing page
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-blue-500 transition-colors font-medium">
                  Wishlist page
                </Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-blue-500 transition-colors font-medium">
                  Security Certifications
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="hover:text-blue-500 transition-colors font-medium">
                  Sitemap page
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 2: Product Categories */}
          <div className={`p-6 rounded-2xl border space-y-4 ${
            theme === 'dark' ? 'bg-slate-900/30 border-slate-800/80 shadow-2xl' : 'bg-white border-slate-200 shadow-xl shadow-slate-100/50'
          }`}>
            <div className="flex items-center space-x-2 text-blue-500">
              <Database className="w-5 h-5" />
              <h3 className="font-bold text-base">Catalog Grid</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/#products"
                  className="hover:text-blue-500 transition-colors font-medium"
                >
                  All Components
                </Link>
              </li>
              <li>
                <Link
                  to="/#products"
                  className="hover:text-blue-500 transition-colors font-medium"
                >
                  Development Boards
                </Link>
              </li>
              <li>
                <Link
                  to="/#products"
                  className="hover:text-blue-500 transition-colors font-medium"
                >
                  Sensors
                </Link>
              </li>
              <li>
                <Link
                  to="/#products"
                  className="hover:text-blue-500 transition-colors font-medium"
                >
                  Displays
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Technical Resources */}
          <div className={`p-6 rounded-2xl border space-y-4 ${
            theme === 'dark' ? 'bg-slate-900/30 border-slate-800/80 shadow-2xl' : 'bg-white border-slate-200 shadow-xl shadow-slate-100/50'
          }`}>
            <div className="flex items-center space-x-2 text-blue-500">
              <BookOpen className="w-5 h-5" />
              <h3 className="font-bold text-base">Maker Resources</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://www.espressif.com/en/support/documents/technical-documents"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-blue-500 transition-colors font-medium"
                >
                  <span>Datasheets</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://randomnerdtutorials.com/esp32-pinout-reference-gpios/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-blue-500 transition-colors font-medium"
                >
                  <span>Pinout Helper</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://fritzing.org/projects"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-blue-500 transition-colors font-medium"
                >
                  <span>Fritzing Files</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/utkarshsingh3011"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-blue-500 transition-colors font-medium"
                >
                  <span>GitHub Code Repo</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
