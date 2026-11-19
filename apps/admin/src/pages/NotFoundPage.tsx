/**
 * What an admin sees at a URL the admin doesn't have: a backstage door sign for "Room 404" with Doug peeking over
 * it, and a way back to Events.
 */
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { MASCOTS } from '../assets/brand';
import { PATHS } from '../paths';

export function NotFoundPage() {
  return (
    <main className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-8 md:grid-cols-[auto_1fr] md:gap-16">
      <DoorSign />
      <div>
        <h1 className="text-hero font-extrabold">Wrong door.</h1>
        <p className="mt-4 max-w-lg text-lg text-text-2">There's nothing at this address. The link may be old or mistyped.</p>
        <Link
          to={PATHS.events}
          className="mt-8 inline-flex font-display text-lg font-bold text-sky underline-offset-4 hover:underline"
        >
          Back to Events
        </Link>
      </div>
    </main>
  );
}

/** The sign on a door that doesn't exist, with Doug popping up from behind it to see who knocked. */
function DoorSign() {
  return (
    <div className="relative mx-auto w-fit pt-20 md:mx-0">
      <motion.img
        src={MASCOTS.doug}
        alt=""
        className="absolute inset-x-0 top-0 z-0 mx-auto h-32 w-auto"
        initial={{ y: 70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 13, delay: 0.25 }}
      />
      <div className="relative z-10 -rotate-3 rounded-card bg-yellow px-12 pb-6 pt-6 text-ink shadow-(--shadow-float)">
        <span aria-hidden="true" className="absolute left-4 top-4 size-2.5 rounded-full bg-yellow-ink/50" />
        <span aria-hidden="true" className="absolute right-4 top-4 size-2.5 rounded-full bg-yellow-ink/50" />
        <p className="font-display text-sm font-extrabold uppercase tracking-label text-yellow-ink">Room</p>
        <p className="font-display text-hero font-extrabold leading-none">404</p>
      </div>
    </div>
  );
}
