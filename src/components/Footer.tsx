import React from 'react';
import { Cpu, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  theme: 'dark' | 'light';
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`border-t transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-slate-950 border-slate-900 text-slate-400'
          : 'bg-white border-slate-200 text-slate-600'
      }`}
    >
      {/* Upper Footer: Brand and Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <Link
              to="/#home"
              className="inline-flex items-center space-x-2 group cursor-pointer"
            >
              <div className="p-2 rounded-xl bg-blue-600/10 border border-blue-500/30 transition-all duration-300">
                <Cpu className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
                EdgeKart
              </span>
            </Link>
            
            <p className="text-sm leading-relaxed max-w-xs">
              Premium hardware supplier for IoT, robotics, and embedded systems prototyping. Build the future, one node at a time.
            </p>

            {/* Social Icons with Glow effects */}
            <div className="flex items-center space-x-3.5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg border transition-all duration-300 hover:scale-110 ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 text-slate-400 hover:text-blue-400'
                    : 'bg-slate-50 border-slate-250 hover:border-blue-400 hover:bg-slate-100 text-slate-650 hover:text-blue-500'
                }`}
                aria-label="GitHub"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg border transition-all duration-300 hover:scale-110 ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 text-slate-400 hover:text-blue-400'
                    : 'bg-slate-50 border-slate-250 hover:border-blue-400 hover:bg-slate-100 text-slate-655 hover:text-blue-500'
                }`}
                aria-label="Twitter"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg border transition-all duration-300 hover:scale-110 ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 text-slate-400 hover:text-blue-400'
                    : 'bg-slate-50 border-slate-250 hover:border-blue-400 hover:bg-slate-100 text-slate-655 hover:text-blue-500'
                }`}
                aria-label="LinkedIn"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
            </div>
          </div>

          {/* Directory Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-left">
            
            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-slate-200' : 'text-slate-850'
              }`}>Quick Links</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    to="/#home"
                    className="hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#reviews"
                    className="hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#contact"
                    className="hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    Contact Support
                  </Link>
                </li>
                <li>
                  <span className="opacity-50 cursor-default">Careers</span>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-slate-200' : 'text-slate-850'
              }`}>Categories</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    to="/#products"
                    className="hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    Development Boards
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#products"
                    className="hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    Sensors
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#products"
                    className="hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    Displays
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#products"
                    className="hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-slate-200' : 'text-slate-850'
              }`}>Resources</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href="https://www.espressif.com/en/support/documents/technical-documents"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    <span>Datasheets</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://randomnerdtutorials.com/esp32-pinout-reference-gpios/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    <span>Pinout Helper</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://fritzing.org/projects"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    <span>Fritzing Files</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/utkarshsingh3011"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    <span>GitHub Code Repo</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-slate-200' : 'text-slate-850'
              }`}>Contact</h3>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="truncate">support@edgekart.in</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>+91 80 4912 3456</span>
                </li>
                <li className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Bengaluru, India</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>

      {/* Lower Footer: Copyright and Made with Heart */}
      <div className={`border-t py-8 text-xs ${
        theme === 'dark' ? 'border-slate-900 bg-slate-950/80' : 'border-slate-100 bg-slate-50/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; {currentYear} EdgeKart Inc. All rights reserved. Designed for makers globally.</p>
          <p className="font-semibold text-slate-400">
            Made with <span className="text-rose-500">❤️</span> for the Embedded Systems Community.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/security"
              className="hover:text-blue-500 transition-colors cursor-pointer"
            >
              Security Certifications
            </Link>
            <Link
              to="/sitemap"
              className="hover:text-blue-500 transition-colors cursor-pointer"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
