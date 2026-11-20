/**
 * Adding an event. Once it is saved the ticket is stamped "Issued", then it goes back to the list, which says
 * what was saved.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { EventForm } from '../components/events/EventForm';
import { FormPageHeading } from '../components/ui/FormPageHeading';
import { useCreateEvent } from '../hooks/useEvents';
import { messageFor } from '../lib/errors';
import { EMPTY_EVENT_FORM, toEventFields } from '../lib/event-form';
import { savedNotice } from '../lib/saved-notice';
import { PATHS } from '../paths';

export function NewEventPage() {
  const navigate = useNavigate();
  const create = useCreateEvent();
  // The saved title, once saving has worked, for the list's "Saved" notice.
  const [savedTitle, setSavedTitle] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <FormPageHeading title="New event" back={{ to: PATHS.events, section: 'Events' }} />
      <div className="mt-8">
        <EventForm
          kind="new"
          defaultValues={EMPTY_EVENT_FORM}
          unreadableTime={null}
          pictureUrl={null}
          saving={create.isPending}
          error={create.isError ? messageFor(create.error) : null}
          onSave={(values, _changed, picture) => {
            const fields = toEventFields(values);
            create.mutate({ fields, picture }, { onSuccess: () => setSavedTitle(fields.title) });
          }}
          whenStamped={savedTitle === null ? null : () => navigate(PATHS.events, { state: savedNotice(savedTitle) })}
        />
      </div>
    </main>
  );
}
