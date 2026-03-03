import { Helmet } from 'react-helmet-async';
import { Bell, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

type CatalogItem = {
  title: string;
  author: string;
  badge: string;
  price: string;
  coverClass: string;
  detailHref?: string;
};

const categories = ['Humanities', 'Social Sciences', 'Natural Sciences', 'Technology'];

const catalogItems: CatalogItem[] = [
  { title: 'Modern Digital Publishing', author: 'Dr. James Sterling', badge: 'New Release', price: '$29.99', coverClass: 'from-[#7b968e] to-[#58756d]', detailHref: '/product' },
  { title: 'Ecological Systems', author: 'Prof. Elena Rodriguez', badge: 'Bestseller', price: '$32.50', coverClass: 'from-[#557ea2] to-[#335d81]', detailHref: '/product' },
  { title: 'Quantum Futures', author: 'J. Doe & K. West', badge: 'Coming Soon', price: 'Late 2024', coverClass: 'from-[#586476] to-[#1e2835]' },
  { title: 'Historical Linguistics', author: 'Dr. Sarah Jenkins', badge: 'Monograph', price: '$28.00', coverClass: 'from-[#c68b58] to-[#a55b37]', detailHref: '/product' },
  { title: 'Digital Ethics Quarterly', author: 'Multiple Authors', badge: 'Journal', price: '$15.00', coverClass: 'from-[#9f79bf] to-[#77569d]', detailHref: '/product' },
  { title: 'Urban Resilience', author: 'M. Chang', badge: 'Coming Soon', price: 'Early 2025', coverClass: 'from-[#4b8198] to-[#2b5973]' },
  { title: 'Poetics of Nature', author: 'Ed. L. Green', badge: 'Anthology', price: '$22.00', coverClass: 'from-[#d8a2aa] to-[#b87485]', detailHref: '/product' },
  { title: 'Architecture 101', author: 'Prof. R. Koolhaas', badge: 'Textbook', price: '$55.00', coverClass: 'from-[#858a92] to-[#51565f]', detailHref: '/product' },
];

function CatalogCard({ item }: { item: CatalogItem }) {
  const isAvailable = Boolean(item.detailHref);

  return (
    <div className="overflow-hidden rounded-md border border-[#e3e9f0] bg-white">
      <div className="relative flex aspect-[3/4] items-center justify-center bg-[#eef3f7] p-8">
        <div className={`h-full w-full rounded-sm bg-gradient-to-br ${item.coverClass} shadow-[0_12px_20px_rgba(15,23,42,0.14)]`} />
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white">Preview</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className="rounded bg-[#edf3fa] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#173a73]">{item.badge}</span>
          <span className="text-xs font-semibold text-[#8190a6]">{item.price}</span>
        </div>
        <h3 className="mt-4 text-2xl font-bold leading-tight text-[#121d37]">{item.title}</h3>
        <p className="mt-1 text-sm text-[#6d7b91]">{item.author}</p>
        <div className="mt-5">
          {isAvailable ? (
            <Link
              to={item.detailHref!}
              className="flex w-full items-center justify-center gap-2 rounded-[3px] bg-[#0d3874] py-3 text-sm font-bold text-white transition-colors hover:bg-[#0a2d5e]"
            >
              <ShoppingBag size={16} />
              View Article
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-[3px] bg-[#edf2f7] py-3 text-sm font-bold text-[#9aa7bb]"
            >
              <Bell size={16} />
              Notify Me
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

      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.22em] text-[#173a73]">Catalog</span>
            <h1 className="font-serif text-4xl font-bold text-[#0e1731] sm:text-5xl">Digital Library Catalog</h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-[#4d5f7b]">
              Explore our collection of peer-reviewed digital monographs and academic journals. Click any available title to open the full article detail page.
            </p>
          </div>

          <div className="mb-10 flex flex-wrap gap-3 border-b border-[#e3e9f0] pb-6">
            <button type="button" className="rounded-full bg-[#0d1733] px-5 py-2 text-sm font-semibold text-white">All Categories</button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className="rounded-full bg-white px-5 py-2 text-sm font-medium text-[#52647f] ring-1 ring-[#d8e0ea] transition-colors hover:bg-[#edf3fa]"
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {catalogItems.map((item) => (
              <CatalogCard key={item.title} item={item} />
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center gap-2">
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-md text-[#7f8ea8] hover:bg-white">
              <ChevronLeft size={20} />
            </button>
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-md bg-[#0d3874] text-sm font-bold text-white">1</button>
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium text-[#52647f] hover:bg-white">2</button>
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium text-[#52647f] hover:bg-white">3</button>
            <span className="flex h-10 w-10 items-center justify-center text-[#9aa7bb]">...</span>
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium text-[#52647f] hover:bg-white">12</button>
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-md text-[#7f8ea8] hover:bg-white">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
