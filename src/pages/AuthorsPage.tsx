import { Helmet } from 'react-helmet-async';

export function AuthorsPage() {
  return (
    <>
      <Helmet>
        <title>Authors - Academic Press</title>
        <meta name="description" content="Meet our distinguished authors." />
      </Helmet>
      
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-6 font-serif text-4xl font-bold text-slate-900 dark:text-white">Our Authors</h1>
        <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
          Meet the brilliant minds behind our publications.
        </p>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder for authors list */}
          <div className="rounded-lg border border-slate-200 p-6 dark:border-slate-800">
            <div className="mb-4 h-16 w-16 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
               {/* Avatar placeholder */}
               <svg className="h-full w-full text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
               </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Dr. Eleanor Vance</h3>
            <p className="text-sm text-primary">Economics</p>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Expert in global trade dynamics and fiscal policy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
