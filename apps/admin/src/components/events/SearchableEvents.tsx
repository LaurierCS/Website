/**
 * The events with a title search above them, a count of what is shown, and a message when nothing matches.
 */
import { useState } from 'react';
import { clubToday } from '../../lib/time/dates';
import { type Event, withStatuses } from '../../types/event';
import { Button } from '../ui/Button';
import { SearchField } from '../ui/SearchField';
import { StateBlock } from '../ui/StateBlock';
import { EventList } from './EventList';

export function SearchableEvents({ events }: { events: readonly Event[] }) {
  const [search, setSearch] = useState('');
  // Statuses come from every event, not just the matches, so searching never moves the "next up" sticker.
  const tickets = withStatuses(events, clubToday());
  const query = search.trim().toLowerCase();
  const matches = tickets.filter(({ event }) => event.title.toLowerCase().includes(query));

  return (
    <>
      <div className="max-w-md">
        <SearchField label="Search by title" placeholder="CP312, hackathon…" value={search} onChange={setSearch} />
      </div>
      {/* Read out as it changes, so people using a screen reader hear how many events match. */}
      <p aria-live="polite" className="mt-6 mb-3 font-display text-xs font-bold tracking-widest text-text-2 uppercase">
        {countLine(matches.length, tickets.length, query !== '')}
      </p>
      {matches.length > 0 ? (
        <EventList tickets={matches} />
      ) : (
        <StateBlock
          tone="calm"
          mascot="coco"
          title={`No events match "${search.trim()}".`}
          body="Check the spelling, or search for part of the title."
          action={
            <Button variant="quiet" size="small" onClick={() => setSearch('')}>
              Clear search
            </Button>
          }
        />
      )}
    </>
  );
}

/** "6 events · newest first", or "1 of 6 events" while searching. */
function countLine(shown: number, total: number, searching: boolean): string {
  const all = `${total} ${total === 1 ? 'event' : 'events'}`;
  return searching ? `${shown} of ${all}` : `${all} · newest first`;
}
