/** The Team section. Listing and editing team members arrive in later changes; until then Coco keeps the spot. */
import { motion } from 'motion/react';
import { MASCOTS } from '../assets/brand';

export function TeamPage() {
  return (
    <main className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-8 md:grid-cols-[1fr_auto]">
      <div>
        <p className="font-display text-sm font-bold uppercase tracking-label text-sky">Coming next</p>
        <h1 className="mt-3 text-hero font-extrabold">Team</h1>
        <p className="mt-5 max-w-lg text-lg font-light leading-relaxed text-text-2">
          Editing the team from here isn't ready yet. It's the next part of the dashboard being built.
        </p>
      </div>
      <motion.img
        src={MASCOTS.coco}
        alt=""
        className="hidden h-72 w-auto md:block"
        initial={{ y: 30, rotate: 8, opacity: 0 }}
        animate={{ y: 0, rotate: -4, opacity: 1 }}
        whileHover={{ rotate: 4, y: -8 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14 }}
      />
    </main>
  );
}
