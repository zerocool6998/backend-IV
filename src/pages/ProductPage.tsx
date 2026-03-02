import { Helmet } from 'react-helmet-async';
import { BookOpen, Check, ChevronRight, ShoppingCart, Star } from 'lucide-react';

const thumbs = [
  { type: 'book' },
  { type: 'stack' },
  { type: 'tablet' },
  { type: 'icon' },
];

const specs = [
  ['Format', 'PDF, ePub, Mobi'],
  ['File Size', '145 MB (Total)'],
  ['Pages', '342 Print Equivalent'],
  ['Language', 'English'],
  ['ISBN-13', '978-3-16-148410-0'],
  ['Publisher', 'Academic Press Inc.'],
];

const purchaseItems = [
  'Instant PDF & ePub Download',
  'Lifetime Free Updates',
  'DRM-Free Content',
  'Supplementary Material Access',
];

const bullets = [
  'Comprehensive analysis of rights management in the digital age.',
  'Strategic guides for Amazon KDP vs. Direct-to-Consumer models.',
  'The future of AI-assisted publishing workflows.',
];

function Thumb({ type }: { type: 'book' | 'stack' | 'tablet' | 'icon' }) {
  if (type === 'book') {
    return (
      <div className="relative h-full w-full rounded-md bg-gradient-to-br from-slate-50 via-white to-slate-200 shadow-inner">
        <div className="absolute left-1/2 top-1/2 h-[70%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-sm border border-slate-300 bg-white shadow-sm" />
        <div className="absolute left-1/2 top-1/2 h-[70%] w-[2px] -translate-x-1/2 -translate-y-1/2 bg-slate-200" />
      </div>
    );
  }

  if (type === 'stack') {
    return (
      <div className="flex h-full w-full flex-col justify-center gap-1 rounded-md bg-gradient-to-br from-stone-200 to-stone-500 p-3 shadow-inner">
        <div className="h-3 rounded bg-[#3a2c1e]" />
        <div className="h-3 rounded bg-[#79624c]" />
        <div className="h-3 rounded bg-[#cab59b]" />
        <div className="h-3 rounded bg-[#4d3826]" />
      </div>
    );
  }

  if (type === 'tablet') {
    return (
      <div className="relative h-full w-full rounded-md bg-gradient-to-br from-[#efd7b8] to-[#f4e6d3] shadow-inner">
        <div className="absolute left-1/2 top-1/2 h-[62%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-md border border-slate-400 bg-slate-900" />
        <div className="absolute left-1/2 top-1/2 h-[52%] w-[28%] -translate-x-1/2 -translate-y-1/2 rounded-sm bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center rounded-md bg-white">
      <BookOpen className="h-6 w-6 text-slate-400" />
    </div>
  );
}

export function ProductPage() {
  return (
    <>
      <Helmet>
        <title>Modern Digital Publishing - Academic Press</title>
        <meta
          name="description"
          content="Modern Digital Publishing product details, technical specifications, and purchase options."
        />
      </Helmet>

      <div className="bg-[#f5f7fa] py-10 text-[#12233f]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.45fr)_340px]">
            <section>
              <div className="grid gap-10 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                <div>
                  <div className="rounded-md border border-[#dbe3ec] bg-[#eef3f7] p-10">
                    <div className="mx-auto flex aspect-[1.08/0.82] max-w-[460px] items-center justify-center rounded-sm bg-gradient-to-br from-[#8fa99c] via-[#a4bbb0] to-[#d0ddd8] shadow-inner">
                      <div className="relative h-[76%] w-[42%] rounded-sm bg-gradient-to-br from-[#6f9387] to-[#5a7f74] shadow-[10px_20px_24px_rgba(16,24,40,0.18)]">
                        <div className="absolute left-0 top-0 h-full w-2 rounded-l-sm bg-[#46665c]" />
                        <div className="absolute inset-x-[18%] top-[35%] space-y-2 text-center text-[10px] leading-tight text-white/80">
                          <p className="font-medium">Modern</p>
                          <p className="font-medium">Digital Publishing</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-4 gap-3">
                    {thumbs.map((thumb, index) => (
                      <button
                        key={thumb.type}
                        type="button"
                        className={`aspect-square rounded-md border p-3 ${
                          index === 0
                            ? 'border-[#173a73] bg-white'
                            : 'border-[#dbe3ec] bg-[#f8fafc]'
                        }`}
                      >
                        <Thumb type={thumb.type as 'book' | 'stack' | 'tablet' | 'icon'} />
                      </button>
                    ))}
                  </div>

                  <div className="mt-10 border-t border-[#dbe3ec] pt-8">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8c9ab1]">
                      Technical Specifications
                    </p>
                    <div className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                      {specs.map(([label, value]) => (
                        <div key={label} className="border-b border-[#dbe3ec] pb-3">
                          <div className="flex items-center justify-between gap-4 text-[15px]">
                            <span className="text-[#72809a]">{label}</span>
                            <span className="font-medium text-[#16223a]">{value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <aside>
                  <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7f8ea8]">
                    <span className="rounded bg-[#e7edf5] px-2 py-1 text-[#5c6f8c]">New Release</span>
                    <span className="flex items-center gap-0.5 text-[#d2a11d]">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </span>
                    <span className="normal-case tracking-normal text-[#7f8ea8]">(48 reviews)</span>
                  </div>

                  <h1 className="mt-4 max-w-sm text-5xl font-black leading-[1.02] tracking-tight text-[#0d1733]">
                    Modern Digital Publishing
                  </h1>
                  <p className="mt-6 max-w-md text-[17px] leading-9 text-[#364865]">
                    A comprehensive, academic guide to the future of independent publishing. Master digital
                    distribution, rights management, and global content scaling.
                  </p>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#c3a06d] to-[#e3c99d] text-xs font-bold text-white">
                      JS
                    </div>
                    <div>
                      <p className="font-semibold text-[#17223b]">Dr. James Sterling</p>
                      <p className="text-sm text-[#7a879d]">Senior Editor, Oxford Tech Review</p>
                    </div>
                  </div>

                  <div className="mt-7 rounded-md border border-[#dbe3ec] bg-[#eef3f8] p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8d9bb0]">
                      Digital Scholar Edition
                    </p>
                    <p className="mt-3 text-6xl font-black tracking-tight text-[#0c1530]">$29.99</p>
                    <p className="mt-2 text-[15px] text-[#6f7d93]">One-time purchase, lifetime access.</p>

                    <ul className="mt-7 space-y-4">
                      {purchaseItems.map((item) => (
                        <li key={item} className="flex items-center gap-3 text-[15px] text-[#223350]">
                          <Check className="h-4 w-4 text-[#153a74]" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      className="mt-8 flex w-full items-center justify-center gap-2 rounded-[3px] bg-[#0d3874] px-4 py-3 text-base font-bold text-white transition-colors hover:bg-[#0a2d5e]"
                    >
                      Add to Cart
                      <ShoppingCart className="h-4 w-4" />
                    </button>

                    <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#90a0b7]">
                      Secure Checkout by Paddle
                    </p>
                    <div className="mt-2 flex items-center justify-center gap-3 text-[#aeb9c9]">
                      <span className="h-2.5 w-3 rounded-sm border border-current" />
                      <span className="h-2.5 w-3 rounded-sm border border-current" />
                      <span className="h-2.5 w-3 rounded-sm border border-current" />
                    </div>
                  </div>

                  <div className="mt-6 flex items-start gap-4 rounded-md border border-[#dbe3ec] bg-white p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#eef3f8]">
                      <BookOpen className="h-5 w-5 text-[#153a74]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#16223a]">Institutional Access?</p>
                      <p className="mt-1 text-sm text-[#6f7d93]">
                        Get multi-user licensing for your university. <span className="font-semibold text-[#153a74]">Contact Sales</span>
                      </p>
                    </div>
                  </div>
                </aside>
              </div>
            </section>

            <div className="hidden lg:block" />
          </div>

          <div className="mt-14 border-t border-[#dbe3ec] pt-10">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.45fr)_340px]">
              <section>
                <div className="flex gap-10 border-b border-[#dbe3ec] text-[15px] font-medium">
                  <button type="button" className="border-b-2 border-[#173a73] pb-4 text-[#0d1733]">
                    Description
                  </button>
                  <button type="button" className="pb-4 text-[#8593a9]">
                    Table of Contents
                  </button>
                  <button type="button" className="pb-4 text-[#8593a9]">
                    Sample Chapter
                  </button>
                </div>

                <div className="pt-8">
                  <h2 className="text-4xl font-black tracking-tight text-[#0d1733]">Master the Mechanics</h2>
                  <p className="mt-7 text-[17px] leading-9 text-[#31415d]">
                    Most publishing ventures fail not because they can&apos;t create content, but because they
                    can&apos;t distribute it. Dr. James Sterling breaks down the exact frameworks used by independent
                    presses to scale global distribution without losing creative integrity.
                  </p>
                  <p className="mt-7 text-[17px] leading-9 text-[#31415d]">
                    In <span className="italic">Modern Digital Publishing</span>, you will learn how to identify the
                    &quot;distribution bottlenecks&quot; in your current model before they become fatal, how to leverage
                    metadata for discovery, and how to build a technical infrastructure that supports readers on every
                    continent.
                  </p>

                  <ul className="mt-8 space-y-4">
                    {bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3 text-[17px] text-[#31415d]">
                        <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#e6edf5] text-[#173a73]">
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <aside className="h-fit rounded-md border border-[#dbe3ec] bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8d9bb0]">Meet the Author</p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#c3a06d] to-[#e3c99d] text-xs font-bold text-white">
                    JS
                  </div>
                  <div>
                    <p className="font-semibold text-[#16223a]">Dr. James Sterling</p>
                    <p className="text-sm text-[#7a879d]">Expert in Digital Economics</p>
                  </div>
                </div>
                <p className="mt-6 text-[15px] leading-8 text-[#55657d]">
                  Dr. Sterling has spent 15 years at the intersection of technology and literature, advising major
                  university presses on digital transition strategies.
                </p>
                <button type="button" className="mt-7 text-sm font-semibold text-[#173a73]">
                  View Author Profile
                </button>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
