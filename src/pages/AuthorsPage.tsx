import { Helmet } from 'react-helmet-async';

const authors = [
  {
    name: 'Dr. Eleanor Vance',
    field: 'Economics',
    bio: 'Expert in global trade dynamics and fiscal policy with a focus on academic publishing frameworks.',
  },
  {
    name: 'Dr. James Sterling',
    field: 'Digital Publishing',
    bio: 'Researches rights management, platform strategy, and modern distribution systems for scholarly works.',
  },
  {
    name: 'Prof. Elena Rodriguez',
    field: 'Environmental Studies',
    bio: 'Writes on ecological systems, long-term policy planning, and sustainable institutional models.',
  },
];

export function AuthorsPage() {
  return (
    <>
      <Helmet>
        <title>Authors - Academic Press</title>
        <meta name="description" content="Meet our distinguished authors." />
      </Helmet>

      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.22em] text-[#173a73]">Authors</span>
            <h1 className="font-serif text-4xl font-bold text-[#0e1731] sm:text-5xl">Our Authors</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-[#4d5f7b]">
              Meet the brilliant minds behind our publications.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {authors.map((author) => (
              <div key={author.name} className="rounded-md border border-[#e3e9f0] bg-white p-8">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#d9e1ec] text-[#8b9ab0]">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#121d37]">{author.name}</h2>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-[#173a73]">{author.field}</p>
                <p className="mt-4 text-[15px] leading-8 text-[#5a6981]">{author.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
