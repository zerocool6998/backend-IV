import { Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-background-light pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-primary text-white shadow-sm">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
                </svg>
              </div>
              <span className="text-lg text-primary">Academic Press</span>
            </div>
            <p className="text-sm text-text-muted">
              Empowering independent researchers with professional publishing tools since 2018.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs uppercase tracking-[0.22em] text-primary">Products</h3>
            <ul className="space-y-3">
              <li><Link to="/library" className="text-sm text-text-muted transition-colors hover:text-primary">Digital Library</Link></li>
              <li><a href="#" className="text-sm text-text-muted transition-colors hover:text-primary">Journals</a></li>
              <li><a href="#" className="text-sm text-text-muted transition-colors hover:text-primary">Course Packs</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs uppercase tracking-[0.22em] text-primary">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-text-muted transition-colors hover:text-primary">About Us</Link></li>
              <li><Link to="/authors" className="text-sm text-text-muted transition-colors hover:text-primary">Authors</Link></li>
              <li><Link to="/support" className="text-sm text-text-muted transition-colors hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs uppercase tracking-[0.22em] text-primary">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-text-muted transition-colors hover:text-primary">Terms of Service</a></li>
              <li><Link to="/privacy" className="text-sm text-text-muted transition-colors hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/refund" className="text-sm text-text-muted transition-colors hover:text-primary">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#E2E8F0] pt-8 md:flex-row">
          <p className="text-sm text-[#8190a6]">© {new Date().getFullYear()} Academic Press Inc. All rights reserved.</p>
          <div className="flex cursor-pointer items-center gap-2 text-[#8190a6] transition-colors hover:text-primary">
            <Globe size={18} />
            <span className="text-sm font-medium">English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
