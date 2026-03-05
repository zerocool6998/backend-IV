import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Check, ChevronRight, ShoppingCart, Star } from 'lucide-react';

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
  'Comprehensive analysis of Rights Management in the digital age.',
  'Strategic guides for Amazon KDP vs. Direct-to-Consumer models.',
  'The future of AI-assisted publishing workflows.',
];

function MainBookVisual() {
  return (
    <div className="mx-auto flex aspect-[1.06/0.8] max-w-[540px] items-center justify-center rounded-[4px] bg-gradient-to-br from-[#8ca69b] via-[#a3bbb0] to-[#cbd9d3]">
      <div className="relative h-[70%] w-[38%] rounded-[2px] bg-gradient-to-br from-[#678b7d] to-[#547466] shadow-[20px_24px_28px_rgba(15,23,42,0.18)]">
        <div className="absolute left-0 top-0 h-full w-2 bg-[#476457]" />
        <div className="absolute inset-x-[18%] top-[38%] text-center text-[10px] leading-tight text-white/80">
          <p>Modern</p>
          <p>Digital Publishing</p>
        </div>
      </div>
    </div>
  );
}

function Thumb({ variant }: { variant: 'open' | 'stack' | 'tablet' | 'icon' }) {
  if (variant === 'open') {
    return (
      <div className="relative h-full w-full rounded-[2px] bg-gradient-to-br from-slate-100 via-white to-slate-200">
        <div className="absolute left-1/2 top-1/2 h-[62%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-[2px] border border-slate-300 bg-white" />
        <div className="absolute left-1/2 top-1/2 h-[62%] w-[2px] -translate-x-1/2 -translate-y-1/2 bg-slate-200" />
      </div>
    );
  }

  if (variant === 'stack') {
    return (
      <div className="flex h-full w-full flex-col justify-center gap-1 rounded-[2px] bg-gradient-to-br from-[#59422c] to-[#bba387] p-3">
        <div className="h-3 bg-[#2f2318]" />
        <div className="h-3 bg-[#71573f]" />
        <div className="h-3 bg-[#c8b399]" />
        <div className="h-3 bg-[#453321]" />
      </div>
    );
  }

  if (variant === 'tablet') {
    return (
      <div className="relative h-full w-full rounded-[2px] bg-gradient-to-br from-[#edd2af] to-[#f4e6d2]">
        <div className="absolute left-1/2 top-1/2 h-[60%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-[4px] border border-slate-500 bg-slate-900" />
        <div className="absolute left-1/2 top-1/2 h-[50%] w-[28%] -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center rounded-[2px] bg-white">
      <BookOpen className="h-6 w-6 text-[#8fa0b6]" />
    </div>
  );
}

export function ProductPage() {
  const [activeTab, setActiveTab] = useState<'description' | 'contents' | 'sample' | 'author'>(
    'description',
  );

  return (
    <>
      <Helmet>
        <title>Modern Digital Publishing - Academic Press</title>
        <meta
          name="description"
          content="Modern Digital Publishing product details, technical specifications, and purchase options."
        />
      </Helmet>

      <div className="bg-background-light py-20 text-[#12233f]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.58fr)_minmax(320px,1.02fr)] lg:items-start">
            <section>
              <div className="rounded-[4px] border border-border-light bg-[#eef3f7] p-8 sm:p-10">
                <MainBookVisual />
              </div>

              <div className="mt-6 grid grid-cols-4 gap-3">
                <button type="button" className="aspect-square rounded-[4px] border border-primary bg-white p-3 shadow-sm">
                  <Thumb variant="open" />
                </button>
                <button type="button" className="aspect-square rounded-[4px] border border-border-light bg-white p-3">
                  <Thumb variant="stack" />
                </button>
                <button type="button" className="aspect-square rounded-[4px] border border-border-light bg-white p-3">
                  <Thumb variant="tablet" />
                </button>
                <button type="button" className="aspect-square rounded-[4px] border border-border-light bg-white p-3">
                  <Thumb variant="icon" />
                </button>
              </div>

              <div className="mt-10 border-t border-border-light pt-8">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8d9bb0]">
                  Technical Specifications
                </p>
                <div className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  {specs.map(([label, value]) => (
                    <div key={label} className="border-b border-border-light pb-3">
                      <div className="flex items-center justify-between gap-4 text-[15px]">
                        <span className="text-[#72809a]">{label}</span>
                        <span className="font-medium text-[#16223a]">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="lg:pt-1">
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7f8ea8]">
                <span className="rounded-[4px] bg-primary-light px-2 py-1 text-primary shadow-sm">New Release</span>
                <span className="flex items-center gap-0.5 text-[#d2a11d]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </span>
                <span className="normal-case tracking-normal text-[#7f8ea8]">(48 reviews)</span>
              </div>

              <h1 className="mt-4 max-w-sm text-5xl leading-[1.02] text-primary">Modern Digital Publishing</h1>
              <p className="mt-6 max-w-md text-[17px] text-text-muted">
                A comprehensive, academic guide to the future of independent publishing. Master digital distribution,
                rights management, and global content scaling.
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

              <div className="mt-7 rounded-[4px] border border-border-light bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8d9bb0]">
                  Digital Scholar Edition
                </p>
                <p className="mt-3 text-6xl font-black tracking-tight text-primary">$29.99</p>
                <p className="mt-2 text-[15px] text-[#6f7d93]">One-time purchase, lifetime access.</p>

                <ul className="mt-7 space-y-4">
                  {purchaseItems.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[15px] text-[#223350]">
                      <Check className="h-4 w-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-[4px] bg-primary px-4 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-primary-dark"
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

              <div className="mt-6 flex items-start gap-4 rounded-[4px] border border-border-light bg-white p-4 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-[4px] bg-primary-light">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-[#16223a]">Institutional Access?</p>
                  <p className="mt-1 text-sm text-[#6f7d93]">
                    Get multi-user licensing for your university.{' '}
                    <span className="font-semibold text-primary">Contact Sales</span>
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-14 border-t border-border-light pt-10">
            <section>
              <div className="flex flex-wrap gap-8 border-b border-border-light text-[15px] font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab('description')}
                  className={`pb-4 ${activeTab === 'description' ? 'border-b-2 border-primary text-primary' : 'text-[#8593a9]'}`}
                >
                    Description
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('contents')}
                  className={`pb-4 ${activeTab === 'contents' ? 'border-b-2 border-primary text-primary' : 'text-[#8593a9]'}`}
                >
                    Table of Contents
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('sample')}
                  className={`pb-4 ${activeTab === 'sample' ? 'border-b-2 border-primary text-primary' : 'text-[#8593a9]'}`}
                >
                    Sample Chapter
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('author')}
                  className={`pb-4 ${activeTab === 'author' ? 'border-b-2 border-primary text-primary' : 'text-[#8593a9]'}`}
                >
                  Meet the Author
                </button>
              </div>

              <div className="pt-8">
                {activeTab === 'description' && (
                  <>
                  <h2 className="text-4xl">Master the Mechanics</h2>
                  <p className="mt-7 max-w-3xl text-[17px] text-[#31415d]">
                    Most publishing ventures fail not because they can&apos;t create content, but because they
                    can&apos;t distribute it. Dr. James Sterling breaks down the exact frameworks used by independent
                    presses to scale global distribution without losing creative integrity.
                  </p>
                  <p className="mt-7 max-w-3xl text-[17px] text-[#31415d]">
                    In <span className="italic">Modern Digital Publishing</span>, you will learn how to identify the
                    &quot;distribution bottlenecks&quot; in your current model before they become fatal, how to
                    leverage metadata for discovery, and how to build a technical infrastructure that supports readers
                    on every continent.
                  </p>

                  <ul className="mt-8 space-y-4">
                    {bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3 text-[17px] text-[#31415d]">
                        <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-light text-primary">
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  </>
                )}

                {activeTab === 'contents' && (
                  <div className="max-w-3xl rounded-[4px] border border-border-light bg-white p-8 shadow-sm">
                    <h2 className="text-3xl">Table of Contents</h2>
                    <ol className="mt-6 space-y-4 text-[17px] text-[#31415d]">
                      <li>1. The Modern Publishing Landscape</li>
                      <li>2. Metadata, Discovery, and Distribution Channels</li>
                      <li>3. Rights Management for Global Audiences</li>
                      <li>4. Platform Strategy: Retail vs. Direct-to-Consumer</li>
                      <li>5. Building Durable Reader Infrastructure</li>
                      <li>6. AI Workflows and Editorial Governance</li>
                    </ol>
                  </div>
                )}

                {activeTab === 'sample' && (
                  <div className="max-w-3xl rounded-[4px] border border-border-light bg-white p-8 shadow-sm">
                    <h2 className="text-3xl">Sample Chapter</h2>
                    <p className="mt-6 text-[17px] text-[#31415d]">
                      The first bottleneck in digital publishing is rarely editorial quality. It is almost always
                      discoverability. A title can be exceptional and still fail if its metadata, distribution path,
                      and acquisition funnel are treated as afterthoughts.
                    </p>
                    <p className="mt-5 text-[17px] text-[#31415d]">
                      In this opening chapter, Sterling outlines the foundational systems every independent press
                      needs: structured metadata, channel-specific packaging, rights-aware asset management, and a
                      sustainable direct relationship with readers.
                    </p>
                  </div>
                )}

                {activeTab === 'author' && (
                  <div className="max-w-3xl rounded-[4px] border border-border-light bg-white p-8 shadow-sm">
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
                    <p className="mt-6 text-[17px] text-[#55657d]">
                      Dr. Sterling has spent 15 years at the intersection of technology and literature, advising major
                      university presses on digital transition strategies.
                    </p>
                    <p className="mt-5 text-[17px] text-[#55657d]">
                      His work focuses on rights frameworks, platform economics, and building resilient publishing
                      operations that scale globally without sacrificing editorial integrity.
                    </p>
                    <button type="button" className="mt-7 text-sm font-semibold text-primary">
                      View Author Profile
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
