/**
 * A small upper-case label, like "Upcoming" or "Past". The tone says how much it should stand out; the words
 * always say what it means, so the colour is never the only clue.
 */
import type { ReactNode } from 'react';

const TONES = {
  /** The one thing to notice, like the next event: a yellow sticker. */
  highlight: 'bg-yellow text-ink shadow-(--shadow-sticker)',
  /** Good to know, like an event still to come. */
  info: 'bg-sky text-blue-ink',
  /** Background detail, like an event that has happened. */
  muted: 'border border-line bg-slate text-text-2',
} as const;

export type TagTone = keyof typeof TONES;

export function Tag({ tone, children }: { tone: TagTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-tag px-2.5 py-1 font-display text-xs font-bold tracking-widest uppercase ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
