/**
 * Editing an event. It loads the event from the URL's id, then saves only the fields the exec changed, stamps
 * the ticket "Reissued" and goes back to the list, which says what was saved.
 */
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { EventForm } from '../components/events/EventForm';
import { Button } from '../components/ui/Button';
import { FormPageHeading } from '../components/ui/FormPageHeading';
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
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <FormPageHeading title="Edit event" back={{ to: PATHS.events, section: 'Events' }} />
      <div className="mt-8">
        <EventToEdit id={id} />
      </div>
    </main>
  );
}

/** The form once the event has loaded, or why there isn't one: still loading, failed, or no such event. */
function EventToEdit({ id }: { id: string }) {
  const event = useEvent(id);

  switch (event.status) {
    case 'pending':
      return (
        <div role="status" aria-label="Loading the event" className="h-96 animate-pulse rounded-card bg-card motion-reduce:animate-none" />
      );
    case 'error':
      return (
        <div role="alert">
          <p className="text-text-2">{messageFor(event.error)}</p>
          <Button variant="quiet" size="small" className="mt-4" onClick={() => void event.refetch()}>
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
  // The saved title, once saving has worked, for the list's "Saved" notice.
  const [savedTitle, setSavedTitle] = useState<string | null>(null);

  return (
    <EventForm
      kind="edit"
      defaultValues={formValuesFor(event)}
      unreadableTime={unreadableTime(event)}
      pictureUrl={event.pictureUrl}
      saving={update.isPending}
      error={update.isError ? messageFor(update.error) : null}
      onSave={(values, changed, picture) =>
        update.mutate(
          { changes: changedEventFields(values, changed), picture },
          { onSuccess: () => setSavedTitle(values.title) },
        )
      }
      whenStamped={savedTitle === null ? null : () => navigate(PATHS.events, { state: savedNotice(savedTitle) })}
    />
  );
}

function NoSuchEvent() {
  return (
    <div>
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
