/**
 * The LCS ticket printer beside the event form. It holds the event's ticket as the form stands, so an exec sees
 * how it will look on the Events list before saving. Once saving works, `stamp` is set: the stamp lands on the
 * ticket ("Issued" or "Reissued") and `onStamped` moves on when it has been seen.
 */
import type { EventStatus, TicketFace } from '../../types/event';
import { Stamp } from '../ui/Stamp';
import { Ticket } from './Ticket';

type TicketPrinterProps = {
  face: TicketFace;
  status: EventStatus;
  stamp: { text: string; onStamped: () => void } | null;
};

export function TicketPrinter({ face, status, stamp }: TicketPrinterProps) {
  return (
    <div>
      <div aria-hidden="true" className="rounded-t-card rounded-b-md border border-line bg-titlebar px-5 pt-4 pb-3.5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-display text-xs font-bold tracking-label text-muted uppercase">LCS ticket printer</span>
          <span className="inline-flex items-center gap-1.5 font-display text-xs font-bold text-yellow">
            <span className="size-2 rounded-full bg-yellow" />
            Printing
          </span>
        </div>
        <div className="mt-2.5 h-2 rounded-full bg-deep" />
      </div>

      {/* The ticket comes out of the slot, a little narrower than the printer. The form already says all of this
          to screen readers, so the copy here is for the eyes only. */}
      <div className="relative -mt-1 px-3">
        <div aria-hidden="true">
          <Ticket face={face} status={status} />
        </div>
        {stamp && (
          <div className="absolute top-2 right-8">
            <Stamp text={stamp.text} tone="issued" onStamped={stamp.onStamped} />
          </div>
        )}
      </div>

      <p role="status" className="mt-3 text-sm text-text-2">
        {stamp
          ? `${stamp.text}. Back to the Events list in a moment.`
          : 'The ticket prints as you type. It’s how the event shows on the Events list.'}
      </p>
    </div>
  );
}
