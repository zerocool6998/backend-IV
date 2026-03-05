import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, Menu, X } from 'lucide-react';

const navigation = [
  { name: 'Catalog', href: '/library' },
  { name: 'Authors', href: '/authors' },
  { name: 'About Us', href: '/about' },
  { name: 'Support', href: '/support' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-[#0f1730]">
          <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-primary text-white shadow-sm">
            <BookOpen size={18} />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight">Academic Press</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-medium text-text-muted transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/library"
            className="inline-flex items-center rounded-[4px] bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            Browse Library
          </Link>
        </div>

        <div className="flex md:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-[4px] p-2.5 text-text-muted"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-[#E2E8F0] bg-white/95 md:hidden"
          >
            <div className="space-y-1 px-4 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block rounded-[4px] px-3 py-2 text-base font-medium text-text-muted hover:bg-background-light hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-4 px-3">
                <Link
                  to="/library"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-[4px] bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm"
                >
                  Browse Library
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
