/**
 * One event in the list: its picture, title, when and where, whether it's coming up, and links to edit or
 * delete it. A card on a phone; a row of columns on wider screens.
 */
import { Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import { generatePath } from 'react-router';
import { useDeleteEvent } from '../../hooks/useEvents';
import { formatEventDay } from '../../lib/dates';
import { messageFor } from '../../lib/errors';
import { PATHS } from '../../paths';
import { type Event, isUpcoming } from '../../types/event';
import { Button } from '../ui/Button';
import { ButtonLink } from '../ui/ButtonLink';
import { ConfirmDialog } from '../ui/ConfirmDialog';

type EventRowProps = {
  event: Event;
  /** `YYYY-MM-DD` in the club's zone, read once for the whole list. */
  today: string;
};

export function EventRow({ event, today }: EventRowProps) {
  const [confirming, setConfirming] = useState(false);
  const deletion = useDeleteEvent();

  function stopConfirming() {
    setConfirming(false);
    deletion.reset();
  }

  return (
    <li className="grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1 rounded-card bg-card p-4 md:grid-cols-[4rem_minmax(0,2fr)_minmax(0,1.6fr)_minmax(0,1fr)_auto] md:gap-y-0">
      <Thumbnail url={event.pictureUrl} />
      <div className="min-w-0">
        <h2 className="truncate font-display text-xl font-bold">{event.title}</h2>
        {isUpcoming(event, today) ? (
          <span className="mt-1 inline-block rounded-full bg-sky px-2.5 py-0.5 text-xs font-bold text-ink">Upcoming</span>
        ) : (
          <span className="mt-1 inline-block rounded-full border border-line px-2.5 py-0.5 text-xs font-bold text-muted">Past</span>
        )}
      </div>
      <p className="col-start-2 text-text-2 md:col-start-auto">
        {formatEventDay(event.date)}
        <br />
        {event.time ?? 'Time TBA'}
      </p>
      <p className="col-start-2 text-text-2 md:col-start-auto">{event.location ?? 'Location TBA'}</p>
      <div className="col-span-2 mt-3 flex gap-2 md:col-span-1 md:mt-0">
        {/* Every row has an Edit and a Delete, so each one's name says which event it is for. */}
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
    </li>
  );
}

/** The event's picture, or a labelled empty frame when it has none. */
function Thumbnail({ url }: { url: string | null }) {
  if (!url) {
    return (
      <div className="row-span-3 grid size-16 place-items-center rounded-md border-2 border-dashed border-line text-center text-xs text-muted md:row-span-1">
        No photo
      </div>
    );
  }
  return <img src={url} alt="" loading="lazy" className="row-span-3 size-16 rounded-md object-cover md:row-span-1" />;
}
