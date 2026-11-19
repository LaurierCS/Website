/**
 * The Events section, where the admin lands after sign-in: a greeting, how long the visitor's pass is good for,
 * and what is in the events table.
 */
import { motion } from 'motion/react';
import { MASCOTS } from '../assets/brand';
import { EventsSummary } from '../components/events/EventsSummary';
import { useCurrentAdmin } from '../context/AuthContext';
import { formatClubDay } from '../lib/dates';
import { firstName, PROVIDERS } from '../types/auth';

export function EventsPage() {
  const { account, verifiedUntil } = useCurrentAdmin();

  return (
    <main className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-8 md:grid-cols-[1fr_auto]">
      <div>
        <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-pink">You're in</p>
        <h1 className="mt-3 text-[clamp(3rem,8vw,5.5rem)] font-extrabold">{`Hey ${firstName(account)}.`}</h1>
        <p className="mt-5 max-w-lg text-lg font-light leading-relaxed text-text-2">
          {`Your backstage pass is good until ${formatClubDay(verifiedUntil)}. When it runs out, sign in again to renew it, as long as you're still in ${PROVIDERS[account.provider].community}.`}
        </p>
        <a
          href="https://lauriercs.org"
          className="mt-8 inline-flex font-display text-lg font-bold text-sky underline-offset-4 hover:underline"
        >
          See the live site at lauriercs.org
        </a>
      </div>
      <motion.img
        src={MASCOTS.krill}
        alt=""
        className="hidden h-72 w-auto md:block"
        initial={{ y: 30, rotate: -8, opacity: 0 }}
        animate={{ y: 0, rotate: 4, opacity: 1 }}
        whileHover={{ rotate: -4, y: -8 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14 }}
      />
      <div className="md:col-span-2 md:max-w-md">
        <EventsSummary />
      </div>
    </main>
  );
}
