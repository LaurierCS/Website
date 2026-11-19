/** What an admin sees at a URL the admin doesn't have, with a way back to Events. */
import { Link } from 'react-router';
import { PATHS } from '../paths';

export function NotFoundPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
      <h1 className="text-5xl font-extrabold">Page not found</h1>
      <p className="mt-4 max-w-lg text-lg text-text-2">There's nothing at this address. The link may be old or mistyped.</p>
      <Link
        to={PATHS.events}
        className="mt-8 inline-flex font-display text-lg font-bold text-sky underline-offset-4 hover:underline"
      >
        Back to Events
      </Link>
    </main>
  );
}
