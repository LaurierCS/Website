/**
 * One event as a ticket: a date stub coloured by its status, a perforated tear line, the picture, title, when
 * and where, Edit and Delete, and a barcode end. On a phone the stub becomes a band across the top.
 */
import { Calendar, Clock, ImageIcon, MapPin, Pencil, Trash } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { generatePath } from 'react-router';
import { useDeleteEvent } from '../../hooks/useEvents';
import { formatEventDay } from '../../lib/dates';
import { messageFor } from '../../lib/errors';
import { PATHS } from '../../paths';
import type { Event, EventStatus } from '../../types/event';
import { Button } from '../ui/Button';
import { ButtonLink } from '../ui/ButtonLink';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Tag, type TagTone } from '../ui/Tag';
import { TicketStub } from './TicketStub';

type TicketLook = {
  stub: string;
  tag: TagTone;
  label: string;
  /** Past events fade back: dimmer title, photo and barcode, and a punched stub. */
  faded: boolean;
};

const LOOKS: Readonly<Record<EventStatus, TicketLook>> = {
  'next-up': { stub: 'bg-yellow text-ink', tag: 'highlight', label: 'Next up', faded: false },
  upcoming: { stub: 'bg-sky text-ink', tag: 'info', label: 'Upcoming', faded: false },
  past: { stub: 'bg-slate text-text-2', tag: 'muted', label: 'Past', faded: true },
};

// Bar heights for the decorative barcode; fixed so every ticket prints the same code.
const BARS = ['h-0.5', 'h-px', 'h-0.75', 'h-px', 'h-px', 'h-0.5', 'h-1', 'h-px', 'h-0.5', 'h-px', 'h-0.75', 'h-0.5', 'h-px', 'h-px', 'h-0.5', 'h-0.75'];

export function EventRow({ event, status }: { event: Event; status: EventStatus }) {
  const [confirming, setConfirming] = useState(false);
  const deletion = useDeleteEvent();
  const look = LOOKS[status];

  function stopConfirming() {
    setConfirming(false);
    deletion.reset();
  }

  return (
    <div className="grid overflow-hidden rounded-card bg-card shadow-(--shadow-cutout) md:grid-cols-[8rem_minmax(0,1fr)_3.5rem]">
      <TicketStub date={event.date} colours={look.stub} punched={look.faded} />

      {/* The tear line is this border; the two notches are bites out of the ticket at each end of it. */}
      <div className="relative grid grid-cols-[auto_minmax(0,1fr)] gap-4 border-t-3 border-dashed border-deep p-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-5 md:border-t-0 md:border-l-3 md:px-6 md:py-5">
        <span aria-hidden="true" className="absolute -top-2.5 -left-2.5 size-5 rounded-full bg-deep" />
        <span
          aria-hidden="true"
          className="absolute -top-2.5 -right-2.5 size-5 rounded-full bg-deep md:top-auto md:right-auto md:-bottom-2.5 md:-left-2.5"
        />

        <Thumbnail url={event.pictureUrl} faded={look.faded} />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {/* Long titles wrap to two lines on a phone and cut to one on wider screens; the tooltip has it all. */}
            <h2
              title={event.title}
              className={`min-w-0 font-display text-xl font-bold line-clamp-2 md:flex-1 md:text-2xl md:line-clamp-1 ${look.faded ? 'text-text-2' : 'text-white'}`}
            >
              {event.title}
            </h2>
            <Tag tone={look.tag}>{look.label}</Tag>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-text-2">
            <Detail icon={<Calendar aria-hidden="true" className="size-4" />}>{formatEventDay(event.date)}</Detail>
            <Detail icon={<Clock aria-hidden="true" className="size-4" />}>{event.time ?? 'Time TBA'}</Detail>
            <Detail icon={<MapPin aria-hidden="true" className="size-4" />}>{event.location ?? 'Location TBA'}</Detail>
          </div>
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-2.5 md:col-span-1 md:flex">
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
      </div>

      <div aria-hidden="true" className="hidden flex-col items-center justify-center gap-0.5 border-l border-line/60 md:flex">
        {BARS.map((height, index) => (
          <span key={index} className={`w-5.5 ${height} ${look.faded ? 'bg-line' : 'bg-muted'}`} />
        ))}
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
    </div>
  );
}

/** One fact about the event with its icon, like the time. */
function Detail({ icon, children }: { icon: ReactNode; children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      {children}
    </span>
  );
}

/** The event's picture, or a labelled empty frame when it has none. */
function Thumbnail({ url, faded }: { url: string | null; faded: boolean }) {
  if (!url) {
    return (
      <div className="grid size-16 shrink-0 place-content-center justify-items-center gap-1 rounded-xl border-2 border-dashed border-line bg-slate font-display text-xs font-bold text-text-2 uppercase md:size-21">
        <ImageIcon aria-hidden="true" className="size-5" />
        No photo
      </div>
    );
  }
  return (
    <img
      src={url}
      alt=""
      loading="lazy"
      className={`size-16 shrink-0 rounded-xl object-cover md:size-21 ${faded ? 'opacity-60' : ''}`}
    />
  );
}
