import { Link } from 'react-router-dom';
import SeoHead from '../components/seo/SeoHead';
import { PatternBackground } from '../components/universal/PatternBackground';

export default function NotFound() {
  return (
    <>
      <SeoHead
        title="Page not found | Laurier Computing Society"
        description="That page does not exist on the Laurier Computing Society site."
        canonicalPath="/"
        robots="noindex, nofollow"
      />
      <div className="relative min-h-screen overflow-hidden">
        <PatternBackground />
        <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="text-4xl font-bold md:text-5xl" style={{ fontFamily: 'var(--font-dosis)' }}>
            Page not found
          </h1>
          <p className="mt-4 max-w-md text-white/80" style={{ fontFamily: 'var(--font-montserrat)' }}>
            That page does not exist on Laurier Computing Society.
          </p>
          <Link
            to="/"
            className="mt-8 rounded-xl border border-white/30 px-5 py-2 text-sm hover:bg-white/10"
            style={{ fontFamily: 'var(--font-dosis)' }}
          >
            Back to home
          </Link>
        </main>
      </div>
    </>
  );
}
