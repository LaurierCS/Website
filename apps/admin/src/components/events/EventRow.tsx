/**
 * One event on the Events list: its ticket, with Edit and Delete. Delete asks first and names the event.
 */
import { Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import { generatePath } from 'react-router';
import { useDeleteEvent } from '../../hooks/useEvents';
import { messageFor } from '../../lib/errors';
import { PATHS } from '../../paths';
import type { Event, EventStatus } from '../../types/event';
import { Button } from '../ui/Button';
import { ButtonLink } from '../ui/ButtonLink';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Ticket } from './Ticket';

export function EventRow({ event, status }: { event: Event; status: EventStatus }) {
  const [confirming, setConfirming] = useState(false);
  const deletion = useDeleteEvent();

  function stopConfirming() {
    setConfirming(false);
    deletion.reset();
  }

  return (
    <>
      <Ticket
        face={event}
        status={status}
        actions={
          <div className="col-span-2 grid grid-cols-2 gap-2.5 @3xl:col-span-1 @3xl:flex">
            {/* Every ticket has an Edit and a Delete, so each one's name says which event it is for. */}
            <ButtonLink
              to={generatePath(PATHS.editEvent, { id: event.id })}
              variant="quiet"
              size="small"
              icon={<Pencil aria-hidden="true" className="size-4" />}
              aria-label={`Edit ${event.title}`}
            >
              Edit
            </ButtonLink>
            <Button
              variant="danger-quiet"
              size="small"
              icon={<Trash aria-hidden="true" className="size-4" />}
              aria-label={`Delete ${event.title}`}
              onClick={() => setConfirming(true)}
            >
              Delete
            </Button>
          </div>
        }
      />

      {confirming && (
        <ConfirmDialog
          kind="delete"
          question={`Delete ${event.title}?`}
          confirmLabel="Delete"
          pendingLabel="Deleting…"
          pending={deletion.isPending}
          error={deletion.isError ? messageFor(deletion.error) : null}
          onConfirm={() => deletion.mutate(event, { onSuccess: stopConfirming })}
          onCancel={stopConfirming}
        />
      )}
    </>
  );
}
