import React from 'react';
import { Cpu, Mail, ExternalLink, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  theme: 'dark' | 'light';
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`border-t transition-colors duration-300 ${theme === 'dark'
        ? 'bg-slate-950 border-slate-900 text-slate-400'
        : 'bg-white border-slate-200 text-slate-600'
        }`}
    >
      {/* Upper Footer: Brand and Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12">

          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-5 text-left">
            <Link
              to="/#home"
              className="inline-flex items-center space-x-2.5 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
              aria-label="EdgeKart Home"
            >
              <div className="p-2 rounded-xl bg-blue-600/10 border border-blue-500/30 transition-all duration-300 group-hover:border-blue-500/50">
                <Cpu className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
                EdgeKart
              </span>
            </Link>

            <p className="text-sm leading-relaxed max-w-sm text-slate-400">
              Helping students, makers, and embedded engineers discover reliable development hardware for learning, prototyping, and production.
            </p>

            {/* Single GitHub Repository Link */}
            <div className="flex items-center">
              <a
                href="https://github.com/utkarshsingh3011/EdgeKart"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub Repository"
                className={`p-2 rounded-lg border transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 text-slate-400 hover:text-blue-400'
                  : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-slate-100 text-slate-600 hover:text-blue-500'
                  }`}
                aria-label="GitHub Repository"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Directory Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-left">

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                }`}>Quick Links</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    to="/#home"
                    className="hover:text-blue-500 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                    aria-label="Home"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#products"
                    className="hover:text-blue-500 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                    aria-label="Browse Components"
                  >
                    Browse Components
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#categories"
                    className="hover:text-blue-500 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                    aria-label="Categories"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#reviews"
                    className="hover:text-blue-500 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                    aria-label="Reviews"
                  >
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#contact"
                    className="hover:text-blue-500 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                    aria-label="Developer Club"
                  >
                    Developer Club
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="hover:text-blue-500 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                    aria-label="Profile"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/wishlist"
                    className="hover:text-blue-500 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                    aria-label="Wishlist"
                  >
                    Wishlist
                  </Link>
                </li>
              </ul>
            </div>

            {/* Learning */}
            <div className="space-y-4">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                }`}>Learning</h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: 'Datasheets', url: 'https://www.espressif.com/en/support/documents/technical-documents' },
                  { label: 'Arduino Docs', url: 'https://docs.arduino.cc/' },
                  { label: 'ESP32 Docs', url: 'https://docs.espressif.com/projects/esp-idf/en/latest/esp32/' },
                  { label: 'STM32 Docs', url: 'https://www.st.com/en/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html' },
                  { label: 'Raspberry Pi Docs', url: 'https://www.raspberrypi.com/documentation/' },
                  { label: 'KiCad', url: 'https://www.kicad.org/' },
                  { label: 'PlatformIO', url: 'https://platformio.org/' },
                ].map((doc) => (
                  <li key={doc.label}>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 hover:text-blue-500 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm group"
                      aria-label={`Open ${doc.label} documentation`}
                    >
                      <span className="truncate">{doc.label}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Product Categories */}
            <div className="space-y-4">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                }`}>Categories</h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  'Development Boards',
                  'Sensors',
                  'Displays',
                  'Power Modules',
                  'Communication',
                  'Accessories',
                ].map((cat) => (
                  <li key={cat}>
                    <Link
                      to="/#products"
                      className="hover:text-blue-500 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                      aria-label={`Filter catalog by ${cat}`}
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                }`}>Contact</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href="mailto:support@edgekart.in"
                    className="inline-flex items-center space-x-2 hover:text-blue-500 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                    aria-label="Email Support"
                  >
                    <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="truncate">Email Support</span>
                  </a>
                </li>
                <li>
                  <Link
                    to="/#home"
                    className="inline-flex items-center space-x-2 hover:text-blue-500 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                    aria-label="Project Documentation"
                  >
                    <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="truncate">Documentation</span>
                  </Link>
                </li>

              </ul>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright, Privacy, License */}
      <div className={`border-t py-6 text-xs ${theme === 'dark' ? 'border-slate-900 bg-slate-950/60 text-slate-500' : 'border-slate-100 bg-slate-50/50 text-slate-500'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; {currentYear} EdgeKart. Built as an Embedded Systems Engineering Platform.</p>
          <div className="flex items-center space-x-6">
            <Link
              to="/security"
              className="hover:text-blue-500 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
              aria-label="Privacy Policy & Security"
            >
              Privacy
            </Link>
            <a
              href="https://github.com/utkarshsingh3011/EdgeKart/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
              aria-label="Software License"
            >
              License
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
