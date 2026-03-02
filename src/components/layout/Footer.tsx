import { Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white pt-16 pb-8 dark:bg-background-dark border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
                <div className="h-6 w-6 text-primary">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
                    </svg>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">Academic Press</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Empowering independent researchers with professional publishing tools since 2018.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 dark:text-white">Products</h3>
            <ul className="space-y-3">
              <li><Link to="/library" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">Digital Library</Link></li>
              <li><a href="#" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">Journals</a></li>
              <li><a href="#" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">Course Packs</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 dark:text-white">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/authors" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">Authors</Link></li>
              <li><Link to="/support" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 dark:text-white">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">Terms of Service</a></li>
              <li><Link to="/privacy" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Academic Press Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">
            <Globe size={18} />
            <span className="text-sm font-medium">English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
