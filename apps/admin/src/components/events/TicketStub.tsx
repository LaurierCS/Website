/**
 * The tear-off date on an event ticket: a band with the day first on a narrow ticket, a column with the weekday
 * on top on a wide one. Decorative, because the full day is written out beside the title. A ticket in a CSV
 * import also carries its `importKind`: the word beside the date when narrow, a colour tab hanging from the top
 * when wide.
 */
import { stubDay } from '../../lib/time/dates';
import { IMPORT_LABELS, type ImportKind } from '../ui/import-labels';

// What the stub says before a day has been picked, on a ticket still being filled in.
const NO_DAY = { weekday: 'Day', day: '?', month: 'Not set' } as const;

type TicketStubProps = {
  /** `YYYY-MM-DD`, or null when no day has been picked yet. */
  date: string | null;
  /** Background and text colour classes, chosen by the event's status. */
  colours: string;
  /** A punched hole, for an event that has happened. */
  punched: boolean;
  /** Whether a CSV import adds this event or updates it; none outside an import. */
  importKind?: ImportKind;
};

export function TicketStub({ date, colours, punched, importKind }: TicketStubProps) {
  const { weekday, day, month } = date ? stubDay(date) : NO_DAY;
  return (
    <div
      aria-hidden="true"
      className={`relative grid grid-cols-[auto_auto_1fr] items-center gap-x-3 px-4 py-3 font-display uppercase @3xl:grid-cols-1 @3xl:content-center @3xl:justify-items-center @3xl:gap-0 @3xl:py-4 ${colours}`}
    >
      {punched && <span className="absolute top-3 right-3 size-4.5 rounded-full bg-deep @3xl:right-auto @3xl:left-3" />}
      {importKind && (
        <span
          className={`col-start-3 row-span-2 row-start-1 w-fit rounded-tag px-2 py-0.5 text-xs font-extrabold tracking-wide @3xl:absolute @3xl:top-0 @3xl:left-1/2 @3xl:col-auto @3xl:row-auto @3xl:h-3.75 @3xl:w-11.25 @3xl:-translate-x-1/2 @3xl:rounded-t-none @3xl:rounded-b-md @3xl:p-0 ${IMPORT_LABELS[importKind].fill}`}
        >
          {/* A wide stub has room only for the colour, a tab hanging from its top edge; the word is on the print
              order and in the details. Its grid placement is cleared there, or it would hang from its grid cell. */}
          <span className="@3xl:sr-only">{IMPORT_LABELS[importKind].text}</span>
        </span>
      )}
      <span className="col-start-2 row-start-1 text-xs font-bold tracking-widest @3xl:col-start-1">{weekday}</span>
      <span className="col-start-1 row-span-2 row-start-1 text-4xl leading-none font-extrabold @3xl:row-span-1 @3xl:row-start-2 @3xl:text-5xl">
        {day}
      </span>
      <span className="col-start-2 row-start-2 text-xs font-bold tracking-widest @3xl:col-start-1 @3xl:row-start-3">{month}</span>
    </div>
  );
}
