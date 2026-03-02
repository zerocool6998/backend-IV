import { Helmet } from 'react-helmet-async';
import { 
  ShoppingCart, 
  BookOpen, 
  TrendingUp, 
  Globe, 
  Landmark, 
  RefreshCw, 
  Twitter, 
  CreditCard, 
  Lock 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Modern Economics - Academic Press</title>
        <meta name="description" content="A definitive academic exploration of fiscal policy in the 21st century." />
      </Helmet>

      <div className="flex-grow bg-white dark:bg-background-dark">
        {/* Hero Section */}
        <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 dark:bg-slate-900/50">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div className="flex flex-col items-start">
              <span className="mb-6 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary dark:bg-blue-900/30 dark:text-blue-300">
                Featured Release
              </span>
              <h1 className="mb-6 font-serif text-5xl font-bold leading-tight text-slate-900 sm:text-6xl dark:text-white">
                Modern Economics: Global Markets & Policy
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                A definitive academic exploration of fiscal policy in the 21st century. Available now in digital, hardcover, and institutional licensing formats.
              </p>
              <div className="mb-4 flex flex-wrap gap-4">
                <Button className="flex items-center gap-2 bg-primary px-8 py-6 text-base font-bold text-white hover:bg-primary-dark">
                  <ShoppingCart size={20} />
                  Purchase Now $49.99
                </Button>
                <Button variant="outline" className="flex items-center gap-2 border-slate-300 px-8 py-6 text-base font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">
                  <BookOpen size={20} />
                  Read Sample
                </Button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                *Institutional access available via Shibboleth & OpenAthens
              </p>
            </div>

            {/* Right Image */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative aspect-[3/4] w-full max-w-md shadow-2xl">
                 {/* Book Cover Placeholder */}
                <div className="flex h-full w-full flex-col justify-between bg-slate-800 p-8 text-white shadow-2xl">
                    <div className="mt-12 border-l-2 border-white/20 pl-6">
                        <h2 className="font-serif text-4xl font-light text-white/90">MODERN<br/>ECONOMICS</h2>
                    </div>
                    <div className="mb-12">
                         <div className="mb-4 h-32 w-full rounded bg-gradient-to-tr from-blue-500/20 to-teal-500/20 backdrop-blur-sm">
                             {/* Abstract Chart Graphic */}
                             <svg className="h-full w-full text-blue-400/50" viewBox="0 0 100 100" preserveAspectRatio="none">
                                 <path d="M0 100 L20 80 L40 85 L60 50 L80 60 L100 20 V100 H0 Z" fill="currentColor" />
                             </svg>
                         </div>
                         <p className="text-sm font-bold uppercase tracking-widest text-blue-400">Academic Press</p>
                         <h3 className="font-serif text-2xl text-white">Modern<br/>Economics</h3>
                    </div>
                </div>
                {/* Book Spine Effect */}
                <div className="absolute left-0 top-0 h-full w-4 bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">Curriculum</span>
              <h2 className="font-serif text-4xl font-bold text-slate-900 dark:text-white">What You Will Learn</h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
                Comprehensive chapters designed to take you from foundational understanding to advanced application.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: TrendingUp,
                  title: 'Macroeconomic Theory',
                  desc: 'Master the core principles of aggregate economic performance, structure, and behavior on a global scale.'
                },
                {
                  icon: Globe,
                  title: 'Global Trade',
                  desc: 'Understand the complex dynamics of international exchange, tariffs, and supply chain logistics in a modern era.'
                },
                {
                  icon: Landmark,
                  title: 'Fiscal Management',
                  desc: 'Analyze government spending, taxation, and debt management strategies used by leading global economies.'
                },
                {
                  icon: RefreshCw,
                  title: 'Digital Transformation',
                  desc: 'Navigate the impact of fintech, digital currencies, and automated markets on traditional economic models.'
                }
              ].map((item, i) => (
                <div key={i} className="group rounded-lg bg-slate-50 p-8 transition-colors hover:bg-white hover:shadow-lg dark:bg-slate-800/50 dark:hover:bg-slate-800">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-primary dark:bg-blue-900/30 dark:text-blue-300">
                    <item.icon size={24} />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Author Section */}
        <section className="bg-slate-50 px-4 py-24 sm:px-6 lg:px-8 dark:bg-slate-900/50">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-12">
            <div className="flex justify-center lg:col-span-5">
              <div className="relative h-80 w-80 overflow-hidden rounded-full border-8 border-white shadow-2xl dark:border-slate-800">
                <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400 dark:bg-slate-700">
                    {/* Placeholder for Author Image */}
                    <svg className="h-32 w-32" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">Meet the Author</span>
              <h2 className="mb-6 font-serif text-4xl font-bold text-slate-900 dark:text-white">
                Dr. Eleanor Vance, Economic Policy Expert
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                Dr. Eleanor Vance is a distinguished Professor of Economics specializing in macro-economic policy and global trade dynamics. With over two decades of experience advising international monetary organizations, her work bridges the gap between theoretical frameworks and practical fiscal application.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 transition-colors hover:text-primary">
                  <Globe size={20} />
                </a>
                <a href="#" className="text-slate-400 transition-colors hover:text-primary">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Icons */}
        <section className="border-t border-slate-200 py-12 dark:border-slate-800">
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <p className="mb-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Secure Payment Via</p>
                <div className="flex flex-wrap justify-center gap-8 text-slate-400 grayscale transition-all hover:grayscale-0">
                    <div className="flex items-center gap-2">
                        <CreditCard size={20} />
                        <span className="font-bold">VISA</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CreditCard size={20} />
                        <span className="font-bold">MASTERCARD</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CreditCard size={20} />
                        <span className="font-bold">STRIPE</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Lock size={20} />
                        <span className="font-bold">SSL SECURE</span>
                    </div>
                </div>
            </div>
        </section>

        {/* Newsletter */}
        <section className="bg-white px-4 py-24 sm:px-6 lg:px-8 dark:bg-background-dark">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold text-slate-900 dark:text-white">Stay Updated</h2>
            <p className="mb-8 text-slate-600 dark:text-slate-400">
              Receive notifications about new releases and research updates.
            </p>
            <form className="flex flex-col gap-4 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-grow rounded-lg border border-slate-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <Button className="bg-primary px-8 py-3 font-bold text-white hover:bg-primary-dark">
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
