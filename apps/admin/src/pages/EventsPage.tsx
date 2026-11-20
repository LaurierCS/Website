/**
 * The Events section, where the admin lands after sign-in: every event, newest first, with a title search, a
 * link to add one, and edit and delete on each. After a save it says which event was saved.
 */
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router';
import { EventList } from '../components/events/EventList';
import { Button } from '../components/ui/Button';
import { ButtonLink } from '../components/ui/ButtonLink';
import { useEvents } from '../hooks/useEvents';
import { messageFor } from '../lib/errors';
import { savedNameFrom } from '../lib/saved-notice';
import { PATHS } from '../paths';

export function EventsPage() {
  const [search, setSearch] = useState('');
  const saved = savedNameFrom(useLocation().state);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      {saved && (
        <p role="status" className="mb-6 rounded-xl border-2 border-sky px-4 py-3 font-medium text-sky">
          {`Saved "${saved}".`}
        </p>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-hero font-extrabold">Events</h1>
        <ButtonLink to={PATHS.newEvent} variant="primary" size="small" icon={<Plus aria-hidden="true" className="size-4" />}>
          New event
        </ButtonLink>
      </div>

      <label className="mt-8 block max-w-md">
        <span className="font-display text-lg font-bold">Search by title</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="mt-2 block w-full rounded-full border-2 border-line bg-deep px-5 py-2.5 text-white placeholder:text-muted focus:border-sky"
          placeholder="CP312, hackathon…"
        />
      </label>

      <div className="mt-6">
        <EventResults search={search} />
      </div>
    </main>
  );
}

/** The list for the current search, or why there isn't one: still loading, failed, no events, or no matches. */
function EventResults({ search }: { search: string }) {
  const events = useEvents();

  switch (events.status) {
    case 'pending':
      return (
        <div role="status" aria-label="Loading events" className="grid gap-3">
          {[0, 1, 2].map((row) => (
            <div key={row} className="h-24 animate-pulse rounded-card bg-card motion-reduce:animate-none" />
          ))}
        </div>
      );
    case 'error':
      return (
        <div role="alert">
          <p className="text-text-2">{messageFor(events.error)}</p>
          <Button variant="quiet" size="small" className="mt-4" onClick={() => void events.refetch()}>
            Try again
          </Button>
        </div>
      );
    case 'success': {
      if (events.data.length === 0) {
        return <p className="text-text-2">No events yet. The first one you add will show up here.</p>;
      }
      const query = search.trim().toLowerCase();
      const matches = events.data.filter((event) => event.title.toLowerCase().includes(query));
      if (matches.length === 0) return <p className="text-text-2">{`No events match "${search.trim()}".`}</p>;
      return <EventList events={matches} />;
    }
  }
}
