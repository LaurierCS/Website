/**
 * Editing an event. It loads the event from the URL's id, then saves only the fields the exec changed and goes
 * back to the list, which says what was saved.
 */
import { Link, useNavigate, useParams } from 'react-router';
import { EventForm } from '../components/events/EventForm';
import { Button } from '../components/ui/Button';
import { useEvent, useUpdateEvent } from '../hooks/useEvents';
import { messageFor } from '../lib/errors';
import { changedEventFields, formValuesFor, unreadableTime } from '../lib/event-form';
import { savedNotice } from '../lib/saved-notice';
import { PATHS } from '../paths';
import type { Event } from '../types/event';

export function EditEventPage() {
  // The route is `/events/:id`, so the id is always there.
  const { id = '' } = useParams();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <h1 className="text-hero font-extrabold">Edit event</h1>
      <EventToEdit id={id} />
    </main>
  );
}

/** The form once the event has loaded, or why there isn't one: still loading, failed, or no such event. */
function EventToEdit({ id }: { id: string }) {
  const event = useEvent(id);

  switch (event.status) {
    case 'pending':
      return (
        <div role="status" aria-label="Loading the event" className="mt-8 h-96 animate-pulse rounded-card bg-card motion-reduce:animate-none" />
      );
    case 'error':
      return (
        <div role="alert" className="mt-8">
          <p className="text-text-2">{messageFor(event.error)}</p>
          <Button variant="quiet" className="mt-4 px-4 py-2 text-base" onClick={() => void event.refetch()}>
            Try again
          </Button>
        </div>
      );
    case 'success':
      return event.data ? <EditForm event={event.data} /> : <NoSuchEvent />;
  }
}

function EditForm({ event }: { event: Event }) {
  const navigate = useNavigate();
  const update = useUpdateEvent(event);

  return (
    <EventForm
      defaultValues={formValuesFor(event)}
      unreadableTime={unreadableTime(event)}
      pictureUrl={event.pictureUrl}
      submitLabel="Save changes"
      saving={update.isPending}
      error={update.isError ? messageFor(update.error) : null}
      onSave={(values, changed, picture) =>
        update.mutate(
          { changes: changedEventFields(values, changed), picture },
          { onSuccess: () => navigate(PATHS.events, { state: savedNotice(values.title) }) },
        )
      }
    />
  );
}

function NoSuchEvent() {
  return (
    <div className="mt-8">
      <p className="text-text-2">There's no event at this address. It may have been deleted.</p>
      <Link
        to={PATHS.events}
        className="mt-4 inline-flex font-display text-lg font-bold text-sky underline-offset-4 hover:underline"
      >
        Back to Events
      </Link>
    </div>
  );
}
