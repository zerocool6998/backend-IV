import { Helmet } from 'react-helmet-async';
import {
  BookOpen,
  CreditCard,
  Globe,
  Landmark,
  Lock,
  ShoppingCart,
  TrendingUp,
  Twitter,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const curriculum = [
  {
    icon: TrendingUp,
    title: 'Macroeconomic Theory',
    description:
      'Master the core principles of aggregate economic performance, structure, and behavior on a global scale.',
  },
  {
    icon: Globe,
    title: 'Global Trade',
    description:
      'Understand the complex dynamics of international exchange, tariffs, and supply chain logistics in a modern era.',
  },
  {
    icon: Landmark,
    title: 'Fiscal Management',
    description:
      'Analyze government spending, taxation, and debt management strategies used by leading global economies.',
  },
  {
    icon: BookOpen,
    title: 'Digital Transformation',
    description:
      'Navigate the impact of fintech, digital currencies, and automated markets on traditional economic models.',
  },
];

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Modern Economics - Academic Press</title>
        <meta
          name="description"
          content="A definitive academic exploration of fiscal policy in the 21st century."
        />
      </Helmet>

      <div className="flex-grow bg-background-light text-[#12233f]">
        <section className="overflow-hidden py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
              <div className="z-10 max-w-2xl flex-1 text-center lg:text-left">
                <div className="mb-6 inline-flex items-center gap-2 rounded-[4px] bg-primary-light px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Featured Release
                </div>

                <h1 className="mb-6 text-4xl leading-[1.03] text-primary sm:text-5xl lg:text-6xl">
                  Modern Economics:
                  <br className="hidden lg:block" />
                  Global Markets &amp; Policy
                </h1>

                <p className="mx-auto mb-8 max-w-xl text-lg text-text-muted lg:mx-0">
                  A definitive academic exploration of fiscal policy in the 21st century. Available now in digital,
                  hardcover, and institutional licensing formats.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                  <Link
                    to="/product"
                    className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-primary px-8 py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-primary-dark sm:w-auto"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Purchase Now $49.99
                  </Link>

                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-[4px] border border-border-light bg-white px-8 py-3.5 text-base font-bold text-primary shadow-sm transition-colors hover:bg-background-light sm:w-auto"
                  >
                    <BookOpen className="h-4 w-4" />
                    Read Sample
                  </button>
                </div>

                <p className="mt-4 text-xs text-[#7f8ea8]">
                  *Institutional access available via Shibboleth &amp; OpenAthens
                </p>
              </div>

              <div className="relative flex w-full flex-1 justify-center">
                <div className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-primary/10 to-transparent blur-3xl" />
                <div className="book-hero-3d relative z-10 aspect-[2/3] w-[280px] rounded-r-xl sm:w-[340px]">
                  <div className="absolute inset-0 overflow-hidden rounded-lg bg-gradient-to-br from-[#0d2631] via-[#214a57] to-[#6d8b8c] shadow-[0_25px_45px_rgba(15,23,42,0.28)]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/45 via-transparent to-transparent" />
                    <div className="absolute left-0 top-0 h-full w-4 bg-[#08131a]" />

                    <div className="absolute left-[18%] top-[24%] h-[44%] w-[64%] rounded-[2px] border border-white/10 bg-gradient-to-br from-[#8aa4a0] to-[#6f8f8f] shadow-[12px_16px_28px_rgba(15,23,42,0.28)]">
                      <div className="absolute inset-x-[18%] top-[16%] text-center text-[10px] font-medium uppercase tracking-[0.18em] text-[#0f2430]">
                        Modern
                        <br />
                        Economics
                      </div>

                      <div className="absolute inset-x-[18%] bottom-[18%] flex items-end justify-between">
                        <div className="h-10 w-3 bg-[#214f69] shadow-sm" />
                        <div className="h-14 w-3 bg-[#2c6482] shadow-sm" />
                        <div className="h-18 w-3 bg-[#3a7695] shadow-sm" />
                        <div className="h-24 w-3 bg-[#4c89a7] shadow-sm" />
                        <div className="h-28 w-3 bg-[#5d9ab5] shadow-sm" />
                      </div>

                      <div className="absolute left-[16%] top-[44%] h-1 w-[62%] rotate-[-28deg] bg-[#c69534] shadow-sm" />
                      <div className="absolute left-[44%] top-[34%] h-3 w-3 rotate-45 border-r-2 border-t-2 border-[#c69534]" />
                    </div>

                    <div className="absolute bottom-0 left-0 p-8">
                      <p className="mb-2 text-sm font-bold uppercase tracking-[0.28em] text-[#173a73]">
                        Academic Press
                      </p>
                      <h3 className="font-serif text-3xl leading-none text-white">
                        Modern
                        <br />
                        Economics
                      </h3>
                    </div>
                  </div>

                  <div className="absolute bottom-[2px] left-[-14px] top-[2px] w-4 rounded-l-sm bg-[#0b1820] shadow-inner" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border-light bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <span className="mb-4 block text-xs font-bold uppercase tracking-[0.22em] text-primary">
                Curriculum
              </span>
              <h2 className="text-4xl md:text-5xl">What You Will Learn</h2>
              <p className="mx-auto mt-6 max-w-2xl text-text-muted">
                Comprehensive chapters designed to take you from foundational understanding to advanced application.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {curriculum.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[4px] border border-border-light bg-background-light p-8 transition-colors hover:border-[#cfd9e6]"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[4px] bg-primary-light text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-3 text-2xl leading-tight text-primary">{item.title}</h3>
                  <p className="text-sm text-text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border-light py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
              <div className="relative shrink-0">
                <div className="relative z-10 flex h-64 w-64 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#d9e1ec] shadow-[0_16px_32px_rgba(15,23,42,0.12)] sm:h-80 sm:w-80">
                  <svg className="h-20 w-20 text-[#8b9ab0]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="absolute -left-4 top-4 h-64 w-64 rounded-full border-2 border-[#173a73]/15 sm:h-80 sm:w-80" />
              </div>

              <div className="flex-1 text-center lg:text-left">
                <span className="mb-4 block text-xs font-bold uppercase tracking-[0.22em] text-primary">
                  Meet the Author
                </span>
                <h2 className="mb-6 text-3xl md:text-4xl">
                  Dr. Eleanor Vance, Economic Policy Expert
                </h2>
                <p className="mx-auto mb-8 max-w-3xl text-lg text-text-muted lg:mx-0">
                  Dr. Eleanor Vance is a distinguished Professor of Economics specializing in macro-economic policy
                  and global trade dynamics. With over two decades of experience advising international monetary
                  organizations, her work bridges the gap between theoretical frameworks and practical fiscal
                  application.
                </p>

                <div className="flex items-center justify-center gap-4 lg:justify-start">
                  <a href="#" className="text-[#8a98ad] transition-colors hover:text-primary">
                    <Globe className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-[#8a98ad] transition-colors hover:text-primary">
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border-light bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <span className="mb-8 block text-[10px] font-bold uppercase tracking-[0.22em] text-[#8b99ae]">
              Secure Payment Via
            </span>
            <div className="flex flex-wrap items-center justify-center gap-8 text-[#6d7b91] opacity-70 md:gap-12">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span className="text-sm font-bold tracking-tight">VISA</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span className="text-sm font-bold tracking-tight">MASTERCARD</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span className="text-sm font-bold tracking-tight">STRIPE</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                <span className="text-sm font-bold tracking-tight">SSL SECURE</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-xl text-center">
              <h3 className="text-3xl">Stay Updated</h3>
              <p className="mb-8 mt-2 text-sm text-[#7f8ea8]">
                Receive notifications about new releases and research updates.
              </p>
              <form className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-grow rounded-[4px] border border-border-light bg-white px-4 py-3 text-sm text-[#12233f] outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
                <button
                  type="submit"
                  className="rounded-[4px] bg-primary px-8 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-dark"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
