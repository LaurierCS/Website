/**
 * The Events section, where the admin lands after sign-in: every event as a ticket, newest first, with a title
 * search, a link to add one, export to and import from CSV, and edit and delete on each. After a save it says
 * which event was saved.
 */
import { Plus, RotateCw } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { DOODLES } from '../assets/brand';
import { EventListSkeleton } from '../components/events/EventListSkeleton';
import { SearchableEvents } from '../components/events/SearchableEvents';
import { Button } from '../components/ui/Button';
import { ButtonLink } from '../components/ui/ButtonLink';
import { ExportCsvButton } from '../components/ui/ExportCsvButton';
import { ImportCsvLink } from '../components/ui/ImportCsvLink';
import { SavedNotice } from '../components/ui/SavedNotice';
import { ScrapbookWord } from '../components/ui/ScrapbookWord';
import { StateBlock } from '../components/ui/StateBlock';
import { useEvents } from '../hooks/useEvents';
import { csvFile, EVENTS_CSV } from '../lib/csv-formats';
import { clubToday } from '../lib/dates';
import { messageFor } from '../lib/errors';
import { savedNameFrom } from '../lib/saved-notice';
import { PATHS } from '../paths';

export function EventsPage() {
  const navigate = useNavigate();
  const saved = savedNameFrom(useLocation().state);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1>
            <ScrapbookWord word="Events" className="text-hero" />
          </h1>
          <img src={DOODLES.asterisk} alt="" className="hidden h-10 w-auto sm:block" />
        </div>
        <div className="flex flex-wrap gap-3">
          <ExportEventsButton />
          <ImportCsvLink to={PATHS.importEvents} />
          <NewEventLink />
        </div>
      </div>

      {saved && (
        <div className="mt-6">
          {/* Dismissing also clears it from the history entry, so going back here doesn't show it again. */}
          <SavedNotice message={`Saved "${saved}".`} onDismiss={() => navigate('.', { replace: true, state: null })} />
        </div>
      )}

      <div className="mt-8">
        <EventResults />
      </div>
    </main>
  );
}

/** The events, or why there aren't any: still loading, failed, or none yet. */
function EventResults() {
  const events = useEvents();

  switch (events.status) {
    case 'pending':
      return <EventListSkeleton />;
    case 'error':
      return (
        <StateBlock
          tone="failed"
          mascot="doug"
          title={messageFor(events.error)}
          body="Check your connection, then try again. Nothing was changed."
          action={
            <Button
              variant="primary"
              size="small"
              icon={<RotateCw aria-hidden="true" className="size-4" />}
              onClick={() => void events.refetch()}
            >
              Try again
            </Button>
          }
        />
      );
    case 'success':
      if (events.data.length === 0) {
        return (
          <StateBlock
            tone="calm"
            mascot="krill"
            title="No events yet."
            body="The first one you add will show up here."
            action={<NewEventLink />}
          />
        );
      }
      return <SearchableEvents events={events.data} />;
  }
}

/** Saves every loaded event as a CSV file. */
function ExportEventsButton() {
  const events = useEvents();
  return <ExportCsvButton getFile={events.status === 'success' ? () => csvFile(EVENTS_CSV, events.data, clubToday()) : null} />;
}

function NewEventLink() {
  return (
    <ButtonLink to={PATHS.newEvent} variant="primary" size="small" icon={<Plus aria-hidden="true" className="size-4" />}>
      New event
    </ButtonLink>
  );
}
