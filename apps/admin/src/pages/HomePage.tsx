/**
 * The admin's first page: proof that it can read Supabase. It shows how many events there are and the latest
 * one, or says plainly that they are loading, failed or don't exist yet.
 */
import { useEvents } from '../hooks/useEvents';
import { messageFor } from '../lib/errors';

export function HomePage() {
  return (
    <main>
      <h1>LCS Admin</h1>
      <h2>Events in Supabase</h2>
      <EventsCount />
    </main>
  );
}

function EventsCount() {
  const events = useEvents();

  switch (events.status) {
    case 'pending':
      return <p role="status">Loading events…</p>;
    case 'error':
      return (
        <div role="alert">
          <p>{messageFor(events.error)}</p>
          <button type="button" onClick={() => void events.refetch()}>
            Try again
          </button>
        </div>
      );
    case 'success': {
      const [latest] = events.data;
      if (!latest) return <p>No events yet.</p>;
      const count = events.data.length;
      return <p>{`${count} ${count === 1 ? 'event' : 'events'}. Latest: ${latest.title} (${latest.date})`}</p>;
    }
  }
}
