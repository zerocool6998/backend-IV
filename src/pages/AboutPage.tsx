import { Helmet } from 'react-helmet-async';

export function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us - Academic Press</title>
        <meta name="description" content="Learn more about Academic Press and our mission." />
      </Helmet>
      
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-6 font-serif text-4xl font-bold text-slate-900 dark:text-white">About Us</h1>
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Academic Press is dedicated to empowering independent researchers with professional publishing tools. 
            Founded in 2018, we have helped thousands of scholars share their work with the world.
          </p>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Our mission is to democratize academic publishing by providing accessible, high-quality digital distribution 
            channels that respect the intellectual property rights of authors while maximizing their reach.
          </p>
        </div>
      </div>
    </>
  );
}
