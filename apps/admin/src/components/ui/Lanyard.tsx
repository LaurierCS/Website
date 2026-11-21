/**
 * The LCS lanyard a pass or badge hangs from: a blue strap printed "LCS · LCS · LCS" and a clip. It hangs from the
 * top centre of the nearest positioned parent, with the clip reaching 1.6rem down into it, over the slot.
 */

const SIZES = {
  /** Full size, running up off the top of the screen, like the login's backstage pass. */
  pass: { lanyard: '', strap: 'h-[60vh]' },
  /** The same lanyard at 60%, with a strap that fits in the page, like the badge beside the team form. */
  badge: { lanyard: 'origin-bottom scale-60', strap: 'h-72' },
} as const;

type LanyardProps = {
  size: keyof typeof SIZES;
};

export function Lanyard({ size }: LanyardProps) {
  const look = SIZES[size];
  return (
    <div
      aria-hidden="true"
      className={`absolute bottom-[calc(100%-1.6rem)] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center ${look.lanyard}`}
    >
      <div className={`flex w-9 items-end justify-center overflow-hidden bg-blue ${look.strap}`}>
        <span className="mb-8 whitespace-nowrap font-display text-xs font-extrabold tracking-[0.5em] text-white/80 [writing-mode:vertical-rl]">
          LCS · LCS · LCS · LCS · LCS · LCS · LCS · LCS · LCS · LCS
        </span>
      </div>
      <div className="h-5 w-12 rounded-b-lg border-4 border-t-0 border-text-2 bg-muted" />
    </div>
  );
}
