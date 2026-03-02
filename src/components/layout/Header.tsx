import { Link } from 'react-router-dom';
import { Menu, X, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/Button';

const navigation = [
  { name: 'Catalog', href: '/library' },
  { name: 'Authors', href: '/authors' },
  { name: 'About Us', href: '/about' },
  { name: 'Support', href: '/support' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-light bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-border-dark dark:bg-background-dark/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 text-slate-900 dark:text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
                    <BookOpen size={20} />
                </div>
                <span className="text-lg font-bold tracking-tight">Academic Press</span>
            </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/library">
            <Button className="bg-primary px-6 font-medium text-white hover:bg-primary-dark">
                Browse Library
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
            <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-700 dark:text-slate-200"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="sr-only">Open main menu</span>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-border-light bg-white md:hidden dark:border-border-dark dark:bg-background-dark"
          >
            <div className="space-y-1 px-4 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary dark:text-slate-200 dark:hover:bg-slate-800"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
                <div className="mt-4 px-3">
                    <Link to="/library" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-primary text-white hover:bg-primary-dark">
                            Browse Library
                        </Button>
                    </Link>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
