/**
 * A ticket-stub card on the home page showing what is in the events table: how many, and the latest one. It
 * has a look for each state: loading, failed, none yet, and some.
 */
import { motion } from 'motion/react';
import { useEvents } from '../../hooks/useEvents';
import { formatEventDay } from '../../lib/dates';
import { messageFor } from '../../lib/errors';
import { Button } from '../ui/Button';

export function EventsSummary() {
  return (
    <section
      aria-labelledby="events-summary-title"
      className="relative overflow-hidden rounded-card border-2 border-line bg-card p-6 shadow-[6px_6px_0_var(--bg-deep)]"
    >
      <h2 id="events-summary-title" className="font-display text-sm font-bold uppercase tracking-[0.3em] text-yellow">
        Events in Supabase
      </h2>
      <EventsCount />
    </section>
  );
}

function EventsCount() {
  const events = useEvents();

  switch (events.status) {
    case 'pending':
      return (
        <div role="status" aria-label="Loading events" className="mt-4 grid gap-3">
          <motion.div
            className="h-12 w-24 rounded-lg bg-line/60"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <div className="h-4 w-2/3 rounded bg-line/40" />
        </div>
      );
    case 'error':
      return (
        <div role="alert" className="mt-4">
          <p className="text-text-2">{messageFor(events.error)}</p>
          <Button variant="quiet" className="mt-4 px-4 py-2 text-base" onClick={() => void events.refetch()}>
            Try again
          </Button>
        </div>
      );
    case 'success': {
      const [latest] = events.data;
      if (!latest) return <p className="mt-4 text-text-2">No events yet. The first one you add will show up here.</p>;
      return (
        <>
          <p className="mt-3 font-display text-6xl font-extrabold text-white">{events.data.length}</p>
          <p className="mt-2 text-text-2">
            Latest: <span className="font-semibold text-pink">{latest.title}</span> on {formatEventDay(latest.date)}
          </p>
        </>
      );
    }
  }
}
