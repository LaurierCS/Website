/**
 * Grey tickets in the shape of the real ones, shown while the events load. Like `Ticket`, they lay out by the
 * list's width, so they change shape at the same point.
 */
export function EventListSkeleton() {
  return (
    <div role="status" aria-label="Loading events" aria-busy="true" className="@container grid gap-4">
      {[0, 1, 2, 3].map((ticket) => (
        <div
          key={ticket}
          className="grid animate-pulse overflow-hidden rounded-card bg-card motion-reduce:animate-none @3xl:grid-cols-[8rem_minmax(0,1fr)]"
        >
          <div className="h-12 bg-slate @3xl:h-auto" />
          <div className="flex items-center gap-5 p-4 @3xl:px-6 @3xl:py-5">
            <div className="size-16 shrink-0 rounded-xl bg-slate @3xl:size-21" />
            <div className="grid flex-1 gap-3">
              <div className="h-4 w-1/2 rounded-full bg-slate" />
              <div className="h-3 w-3/4 rounded-full bg-slate" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
