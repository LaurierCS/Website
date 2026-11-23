/**
 * Importing events from a CSV file, as a print order: the file is checked against the saved events, the new and
 * updated ones come out of the press as the tickets they will be, and Import saves all of them or none.
 */
import { RotateCw } from 'lucide-react';
import { EVENT_IMPORT } from '../components/events/event-import';
import { ImportTicket } from '../components/events/ImportTicket';
import { Button } from '../components/ui/Button';
import { CsvImport } from '../components/ui/CsvImport';
import { FormPageHeading } from '../components/ui/FormPageHeading';
import type { ImportView } from '../components/ui/import-view';
import { StateBlock } from '../components/ui/StateBlock';
import { useEvents, useImportEvents } from '../hooks/useEvents';
import { EVENTS_CSV } from '../lib/csv-formats';
import { messageFor } from '../lib/errors';
import { PATHS } from '../paths';
import type { Event, EventFields } from '../types/event';

const BACK = { to: PATHS.events, section: 'Events' };

const VIEW: ImportView<Event, EventFields> = { ...EVENT_IMPORT, front: (entry) => <ImportTicket entry={entry} /> };

export function ImportEventsPage() {
  return (
    <main
      // Wider than the other pages, so there is room for the print order beside the tickets.
      className="mx-auto max-w-7xl px-4 py-10 sm:px-8"
    >
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
          view={VIEW}
          saver={saver}
          back={BACK}
        />
      );
  }
}
