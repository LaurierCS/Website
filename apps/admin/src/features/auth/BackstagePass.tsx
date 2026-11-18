/**
 * The login's signature moment: a backstage pass that drops in on its lanyard, with a mascot peeking over the
 * top. Whatever the login is doing is written on the pass.
 */
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { MASCOTS, type MascotName } from '../../ui/brand-assets';
import { ScrapbookWord } from '../../ui/ScrapbookWord';

// Bar widths for the decorative barcode; fixed so the pass looks the same on every visit.
const BARCODE = [3, 1, 2, 1, 4, 1, 1, 3, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 1, 1, 2, 3, 1, 4, 2, 1];
const BAR_COLOURS = ['bg-pink', 'bg-ink', 'bg-blue', 'bg-ink', 'bg-orange', 'bg-ink', 'bg-yellow'];

type BackstagePassProps = {
  mascot: MascotName;
  /** The mascot pops up for a better look, e.g. when the visitor goes for the sign-in button. */
  mascotUp: boolean;
  /** A rubber stamp for a verdict, placed under the pass's text. */
  stamp?: ReactNode;
  children: ReactNode;
};

export function BackstagePass({ mascot, mascotUp, stamp, children }: BackstagePassProps) {
  return (
    <div className="relative mx-auto w-full max-w-[27rem]">
      <motion.div
        className="relative origin-top"
        initial={{ y: '-120vh', rotate: -16 }}
        animate={{ y: 0, rotate: 0 }}
        // A slow, heavy swing, like a pass let go from above: it takes a bit over a second to settle.
        transition={{ type: 'spring', stiffness: 40, damping: 7, mass: 1.4 }}
      >
        <Lanyard />

        <motion.img
          key={mascot}
          src={MASCOTS[mascot]}
          alt=""
          className="absolute -top-2 right-5 z-0 h-32 w-auto"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: mascotUp ? -78 : -46, rotate: mascotUp ? 9 : 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 16 }}
        />

        <div className="relative z-10 overflow-hidden rounded-[1.75rem] bg-paper text-ink shadow-(--shadow-float)">
          <div className="bg-pink px-6 pb-4 pt-8">
            <h1>
              <span className="sr-only">LCS </span>
              <ScrapbookWord word="ADMIN" className="text-[clamp(3.25rem,14vw,4.25rem)]" />
            </h1>
            <p className="mt-1 flex justify-between font-display text-sm font-extrabold uppercase tracking-[0.25em] text-pink-ink">
              <span>Backstage pass</span>
              <span aria-hidden="true">Exec crew</span>
            </p>
          </div>
          <span aria-hidden="true" className="absolute left-1/2 top-2.5 h-2.5 w-16 -translate-x-1/2 rounded-full bg-deep" />

          <div className="relative min-h-[17rem] px-6 py-7">
            {children}
            {/* The verdict gets its own spot under the text, so it never covers what it is announcing. */}
            {stamp && <div className="mt-6 flex justify-end pr-2">{stamp}</div>}
          </div>

          <div className="perforated h-2.5" aria-hidden="true" />
          <div className="flex items-end justify-between gap-4 px-6 pb-5 pt-3" aria-hidden="true">
            <div className="flex h-9 items-stretch gap-[2px]">
              {BARCODE.map((width, index) => (
                <span key={index} className={BAR_COLOURS[index % BAR_COLOURS.length]} style={{ width }} />
              ))}
            </div>
            <span className="font-display text-xs font-bold tracking-widest text-ink-2">ADMIN.LAURIERCS.ORG</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/** The strap the pass hangs from, running up off the top of the screen. */
function Lanyard() {
  return (
    <div aria-hidden="true" className="absolute bottom-[calc(100%-1.6rem)] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center">
      <div className="flex h-[60vh] w-9 items-end justify-center overflow-hidden bg-blue">
        <span className="mb-8 whitespace-nowrap font-display text-xs font-extrabold tracking-[0.5em] text-white/80 [writing-mode:vertical-rl]">
          LCS · LCS · LCS · LCS · LCS · LCS · LCS · LCS · LCS · LCS
        </span>
      </div>
      <div className="h-5 w-12 rounded-b-lg border-4 border-t-0 border-text-2 bg-muted" />
    </div>
  );
}
