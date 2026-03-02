import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Bell, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';

type CatalogItem = {
  title: string;
  author: string;
  badge: string;
  badgeClass: string;
  price: string;
  coverClass: string;
  detailHref?: string;
  cta: string;
};

const categories = ['Humanities', 'Social Sciences', 'Natural Sciences', 'Technology'];

const catalogItems: CatalogItem[] = [
  {
    title: 'Modern Digital Publishing',
    author: 'Dr. James Sterling',
    badge: 'New Release',
    badgeClass:
      'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-300',
    price: '$29.99',
    coverClass: 'from-emerald-500 to-emerald-800',
    detailHref: '/product',
    cta: 'View Article',
  },
  {
    title: 'Ecological Systems',
    author: 'Prof. Elena Rodriguez',
    badge: 'Bestseller',
    badgeClass: 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-300',
    price: '$32.50',
    coverClass: 'from-blue-500 to-indigo-700',
    detailHref: '/product',
    cta: 'View Article',
  },
  {
    title: 'Quantum Futures',
    author: 'J. Doe & K. West',
    badge: 'Coming Soon',
    badgeClass:
      'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400',
    price: 'Late 2024',
    coverClass: 'from-slate-700 to-slate-900',
    cta: 'Notify Me',
  },
  {
    title: 'Historical Linguistics',
    author: 'Dr. Sarah Jenkins',
    badge: 'Monograph',
    badgeClass: 'bg-slate-50 text-slate-600 ring-slate-500/10 dark:bg-slate-700/50 dark:text-slate-400',
    price: '$28.00',
    coverClass: 'from-orange-400 to-red-500',
    detailHref: '/product',
    cta: 'View Article',
  },
  {
    title: 'Digital Ethics Quarterly',
    author: 'Multiple Authors',
    badge: 'Journal',
    badgeClass: 'bg-slate-50 text-slate-600 ring-slate-500/10 dark:bg-slate-700/50 dark:text-slate-400',
    price: '$15.00',
    coverClass: 'from-purple-500 to-fuchsia-600',
    detailHref: '/product',
    cta: 'View Article',
  },
  {
    title: 'Urban Resilience',
    author: 'M. Chang',
    badge: 'Coming Soon',
    badgeClass:
      'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400',
    price: 'Early 2025',
    coverClass: 'from-cyan-600 to-blue-800',
    cta: 'Notify Me',
  },
  {
    title: 'Poetics of Nature',
    author: 'Ed. L. Green',
    badge: 'Anthology',
    badgeClass: 'bg-slate-50 text-slate-600 ring-slate-500/10 dark:bg-slate-700/50 dark:text-slate-400',
    price: '$22.00',
    coverClass: 'from-rose-300 to-pink-500',
    detailHref: '/product',
    cta: 'View Article',
  },
  {
    title: 'Architecture 101',
    author: 'Prof. R. Koolhaas',
    badge: 'Textbook',
    badgeClass: 'bg-slate-50 text-slate-600 ring-slate-500/10 dark:bg-slate-700/50 dark:text-slate-400',
    price: '$55.00',
    coverClass: 'from-gray-600 to-gray-800',
    detailHref: '/product',
    cta: 'View Article',
  },
];

function CatalogCard({ item }: { item: CatalogItem }) {
  const isAvailable = Boolean(item.detailHref);

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-800/50 ${
        isAvailable ? 'hover:-translate-y-1 hover:shadow-lg' : 'opacity-90 hover:opacity-100 hover:shadow-lg'
      }`}
    >
      <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden bg-slate-100 p-8 dark:bg-slate-700">
        <div className={`flex h-full w-full items-center justify-center rounded-sm bg-gradient-to-br ${item.coverClass} shadow-md`}>
          <div className="h-14 w-14 rounded-full border border-white/30" />
        </div>
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
            <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Preview
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${item.badgeClass}`}>
            {item.badge}
          </span>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{item.price}</span>
        </div>

        {isAvailable ? (
          <Link to={item.detailHref!} className="block">
            <h3 className="mb-1 text-lg font-bold leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-primary dark:text-slate-100">
              {item.title}
            </h3>
            <p className="text-sm font-normal text-slate-500 dark:text-slate-400">{item.author}</p>
          </Link>
        ) : (
          <div>
            <h3 className="mb-1 text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
              {item.title}
            </h3>
            <p className="text-sm font-normal text-slate-500 dark:text-slate-400">{item.author}</p>
          </div>
        )}

        <div className="mt-auto pt-4">
          {isAvailable ? (
            <Link
              to={item.detailHref!}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <ShoppingBag size={18} />
              {item.cta}
            </Link>
          ) : (
            <button
              className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5 text-sm font-medium text-slate-400 dark:bg-slate-700 dark:text-slate-500"
              disabled
            >
              <Bell size={18} />
              {item.cta}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function LibraryPage() {
  return (
    <>
      <Helmet>
        <title>Digital Library Catalog - Academic Press</title>
      </Helmet>

      <div className="flex flex-grow flex-col items-center">
        <div className="w-full max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
          <div className="mb-10 flex flex-col gap-3">
            <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 md:text-5xl dark:text-slate-100">
              Digital Library Catalog
            </h1>
            <p className="max-w-2xl text-lg font-normal leading-normal text-slate-500 dark:text-slate-400">
              Explore our collection of peer-reviewed digital monographs and academic journals. Click any available
              title to open the full article detail page.
            </p>
          </div>

          <div className="mb-10 flex flex-wrap gap-3 border-b border-slate-200 pb-6 dark:border-slate-800">
            <button className="flex h-9 items-center justify-center gap-x-2 rounded-full bg-slate-900 px-5 transition-transform active:scale-95 dark:bg-slate-100">
              <span className="text-sm font-medium leading-normal text-white dark:text-slate-900">All Categories</span>
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className="flex h-9 items-center justify-center gap-x-2 rounded-full bg-slate-100 px-5 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <span className="text-sm font-medium leading-normal text-slate-700 dark:text-slate-300">{category}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {catalogItems.map((item) => (
              <CatalogCard key={item.title} item={item} />
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              <ChevronLeft size={20} />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">1</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">2</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">3</button>
            <span className="flex h-10 w-10 items-center justify-center text-slate-400 dark:text-slate-500">...</span>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">12</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
