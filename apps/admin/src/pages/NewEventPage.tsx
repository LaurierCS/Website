/** Adding an event. After saving it goes back to the list, which says what was saved. */
import { useNavigate } from 'react-router';
import { EventForm } from '../components/events/EventForm';
import { useCreateEvent } from '../hooks/useEvents';
import { messageFor } from '../lib/errors';
import { EMPTY_EVENT_FORM, toEventFields } from '../lib/event-form';
import { savedNotice } from '../lib/saved-notice';
import { PATHS } from '../paths';

export function NewEventPage() {
  const navigate = useNavigate();
  const create = useCreateEvent();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <h1 className="text-hero font-extrabold">New event</h1>
      <EventForm
        defaultValues={EMPTY_EVENT_FORM}
        unreadableTime={null}
        pictureUrl={null}
        submitLabel="Create event"
        saving={create.isPending}
        error={create.isError ? messageFor(create.error) : null}
        onSave={(values, _changed, picture) => {
          const fields = toEventFields(values);
          create.mutate(
            { fields, picture },
            { onSuccess: () => navigate(PATHS.events, { state: savedNotice(fields.title) }) },
          );
        }}
      />
    </main>
  );
}
