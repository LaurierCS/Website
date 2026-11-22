/**
 * Importing events from a CSV file. The file is checked against the saved events, the new and changed ones show
 * as the tickets they will be, and Import saves all of them or none.
 */
import { RotateCw } from 'lucide-react';
import { Ticket } from '../components/events/Ticket';
import { Button } from '../components/ui/Button';
import { CsvImport } from '../components/ui/CsvImport';
import { FormPageHeading } from '../components/ui/FormPageHeading';
import { StateBlock } from '../components/ui/StateBlock';
import { useEvents, useImportEvents } from '../hooks/useEvents';
import { EVENTS_CSV } from '../lib/csv-formats';
import { clubToday } from '../lib/dates';
import { messageFor } from '../lib/errors';
import { PATHS } from '../paths';
import { isUpcoming } from '../types/event';

const BACK = { to: PATHS.events, section: 'Events' };

export function ImportEventsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <FormPageHeading title="Import events" back={BACK} />
      <div className="mt-8">
        <EventsImport />
      </div>
    </main>
  );
}

/** The import once the saved events have loaded, since the file is checked against them. */
function EventsImport() {
  const events = useEvents();
  const saver = useImportEvents();
  const today = clubToday();

  switch (events.status) {
    case 'pending':
      return <div role="status" aria-label="Loading the events" className="h-48 animate-pulse rounded-card bg-card motion-reduce:animate-none" />;
    case 'error':
      return (
        <StateBlock
          tone="failed"
          mascot="doug"
          title={messageFor(events.error)}
          body="The file is checked against the saved events, so they need to load first. Nothing was changed."
          action={
            <Button variant="primary" size="small" icon={<RotateCw aria-hidden="true" className="size-4" />} onClick={() => void events.refetch()}>
              Try again
            </Button>
          }
        />
      );
    case 'success':
      return (
        <CsvImport
          format={EVENTS_CSV}
          saved={events.data}
          noun={{ one: 'event', many: 'events' }}
          saver={saver}
          back={BACK}
          // "Next up" depends on every other event, so a preview is upcoming or past, like the form's.
          renderNew={({ fields }) => <Ticket face={{ ...fields, pictureUrl: null }} status={isUpcoming(fields, today) ? 'upcoming' : 'past'} />}
          renderChanged={({ after }) => <Ticket face={after} status={isUpcoming(after, today) ? 'upcoming' : 'past'} />}
        />
      );
  }
}
