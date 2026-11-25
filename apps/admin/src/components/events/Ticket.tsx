/**
 * An event drawn as a ticket: a date stub coloured by its status, a perforated tear line, the picture, title,
 * when and where, and a barcode end. It lays itself out by its own width, not the screen's: a band across the
 * top when narrow (a phone, or the ticket printer), a stub on the left when wide. `actions` go at the end of
 * the body, like Edit and Delete on the Events list. In a CSV import a ticket also shows its `importKind` (new
 * or updated) and puts a highlighter over the `marked` values that will change.
 */
import { Calendar, Clock, ImageIcon, MapPin } from 'lucide-react';
import type { ReactNode } from 'react';
import { formatEventDay } from '../../lib/time/dates';
import type { EventStatus, TicketFace } from '../../types/event';
import type { ImportKind } from '../ui/import-labels';
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

type TicketProps = {
  face: TicketFace;
  status: EventStatus;
  actions?: ReactNode;
  importKind?: ImportKind;
  /** Values a CSV import changes, marked so they stand out. */
  marked?: ReadonlySet<keyof TicketFace>;
};

const NOTHING_MARKED: ReadonlySet<keyof TicketFace> = new Set();

export function Ticket({ face, status, actions, importKind, marked = NOTHING_MARKED }: TicketProps) {
  const look = LOOKS[status];

  return (
    <div className="@container">
      <div className="grid overflow-hidden rounded-card bg-card shadow-(--shadow-cutout) @3xl:grid-cols-[8rem_minmax(0,1fr)_3.5rem]">
        <TicketStub date={face.date} colours={look.stub} punched={look.faded} importKind={importKind} />

        {/* The tear line is this border; the two notches are bites out of the ticket at each end of it. */}
        <div className="relative grid grid-cols-[auto_minmax(0,1fr)] gap-4 border-t-3 border-dashed border-deep p-4 @3xl:grid-cols-[auto_minmax(0,1fr)_auto] @3xl:items-center @3xl:gap-5 @3xl:border-t-0 @3xl:border-l-3 @3xl:px-6 @3xl:py-5">
          <span aria-hidden="true" className="absolute -top-2.5 -left-2.5 size-5 rounded-full bg-deep" />
          <span
            aria-hidden="true"
            className="absolute -top-2.5 -right-2.5 size-5 rounded-full bg-deep @3xl:top-auto @3xl:right-auto @3xl:-bottom-2.5 @3xl:-left-2.5"
          />

          <Thumbnail url={face.pictureUrl} faded={look.faded} />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              {/* Long titles wrap to two lines when narrow and cut to one when wide; the tooltip has it all. */}
              <h2
                title={face.title}
                className={`min-w-0 font-display text-xl font-bold line-clamp-2 @3xl:flex-1 @3xl:text-2xl @3xl:line-clamp-1 ${look.faded ? 'text-text-2' : 'text-white'}`}
              >
                <Marked on={marked.has('title')}>{face.title}</Marked>
              </h2>
              <Tag tone={look.tag}>{look.label}</Tag>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-text-2">
              <Detail icon={<Calendar aria-hidden="true" className="size-4" />} marked={marked.has('date')}>
                {face.date ? formatEventDay(face.date) : 'Day not set'}
              </Detail>
              <Detail icon={<Clock aria-hidden="true" className="size-4" />} marked={marked.has('time')}>
                {face.time ?? 'Time TBA'}
              </Detail>
              <Detail icon={<MapPin aria-hidden="true" className="size-4" />} marked={marked.has('location')}>
                {face.location ?? 'Location TBA'}
              </Detail>
            </div>
          </div>

          {actions}
        </div>

        <div aria-hidden="true" className="hidden flex-col items-center justify-center gap-0.5 border-l border-line/60 @3xl:flex">
          {BARS.map((height, index) => (
            <span key={index} className={`w-5.5 ${height} ${look.faded ? 'bg-line' : 'bg-muted'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** One fact about the event with its icon, like the time. */
function Detail({ icon, marked, children }: { icon: ReactNode; marked: boolean; children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      <Marked on={marked}>{children}</Marked>
    </span>
  );
}

/** A highlighter stroke over a value that will change. */
function Marked({ on, children }: { on: boolean; children: string }) {
  return on ? <mark className="rounded-sm bg-yellow/35 px-1 text-inherit">{children}</mark> : children;
}

/** The event's picture, or a labelled empty frame when it has none. */
function Thumbnail({ url, faded }: { url: string | null; faded: boolean }) {
  if (!url) {
    return (
      <div className="grid size-16 shrink-0 place-content-center justify-items-center gap-1 rounded-xl border-2 border-dashed border-line bg-slate font-display text-xs font-bold text-text-2 uppercase @3xl:size-21">
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
      className={`size-16 shrink-0 rounded-xl object-cover @3xl:size-21 ${faded ? 'opacity-60' : ''}`}
    />
  );
}
