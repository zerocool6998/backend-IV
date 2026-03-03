import { Helmet } from 'react-helmet-async';

export function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us - Academic Press</title>
        <meta name="description" content="Learn more about Academic Press and our mission." />
      </Helmet>

      <div className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-md border border-[#e3e9f0] bg-white p-8 sm:p-12">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.22em] text-[#173a73]">About</span>
            <h1 className="font-serif text-4xl font-bold text-[#0e1731] sm:text-5xl">About Us</h1>
            <div className="mt-8 space-y-6 text-lg leading-9 text-[#4d5f7b]">
              <p>
                Academic Press is dedicated to empowering independent researchers with professional publishing tools.
                Founded in 2018, we have helped thousands of scholars share their work with the world.
              </p>
              <p>
                Our mission is to democratize academic publishing by providing accessible, high-quality digital
                distribution channels that respect the intellectual property rights of authors while maximizing their
                reach.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
