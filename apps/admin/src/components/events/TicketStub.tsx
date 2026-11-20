/**
 * The tear-off date on an event ticket: a band with the day first on a phone, a column with the weekday on top
 * on wider screens. Decorative, because the full day is written out beside the title.
 */
import { stubDay } from '../../lib/dates';

type TicketStubProps = {
  /** `YYYY-MM-DD`. */
  date: string;
  /** Background and text colour classes, chosen by the event's status. */
  colours: string;
  /** A punched hole, for an event that has happened. */
  punched: boolean;
};

export function TicketStub({ date, colours, punched }: TicketStubProps) {
  const { weekday, day, month } = stubDay(date);
  return (
    <div
      aria-hidden="true"
      className={`relative grid grid-cols-[auto_1fr] items-center gap-x-3 px-4 py-3 font-display uppercase md:grid-cols-1 md:content-center md:justify-items-center md:gap-0 md:py-4 ${colours}`}
    >
      {punched && <span className="absolute top-3 right-3 size-4.5 rounded-full bg-deep md:right-auto md:left-3" />}
      <span className="col-start-2 row-start-1 text-xs font-bold tracking-widest md:col-start-1">{weekday}</span>
      <span className="col-start-1 row-span-2 row-start-1 text-4xl leading-none font-extrabold md:row-span-1 md:row-start-2 md:text-5xl">
        {day}
      </span>
      <span className="col-start-2 row-start-2 text-xs font-bold tracking-widest md:col-start-1 md:row-start-3">{month}</span>
    </div>
  );
}
