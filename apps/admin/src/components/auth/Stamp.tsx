/**
 * A rubber stamp on the backstage pass, under its text, saying whether you get in. It lands fast, then stays
 * long enough to read before `onStamped` fires.
 */
import { motion } from 'motion/react';

const TONES = {
  granted: 'text-blue-ink',
  denied: 'text-orange-ink',
} as const;

// 1.5 s in all, counting the delay. The landing takes about the first 0.4 s; the stamp then holds still so it
// can be read before the screen moves on.
const DELAY_S = 0.25;
const DURATION_S = 1.25;
const LANDING = [0, 0.19, 0.26, 0.32, 1];

type StampProps = {
  text: string;
  tone: keyof typeof TONES;
  /** Called once the stamp has landed and been on show. */
  onStamped?: () => void;
};

export function Stamp({ text, tone, onStamped }: StampProps) {
  return (
    <motion.p
      aria-hidden="true"
      className={`pointer-events-none w-fit rounded-lg border-[5px] border-double border-current px-3 py-1 font-display text-2xl font-extrabold uppercase tracking-widest mix-blend-multiply ${TONES[tone]}`}
      initial={{ scale: 2.6, rotate: -28, opacity: 0 }}
      animate={{
        scale: [2.6, 0.9, 1.05, 1, 1],
        rotate: [-28, -9, -12, -11, -11],
        opacity: [0, 0.9, 0.85, 0.85, 0.85],
      }}
      transition={{ duration: DURATION_S, times: LANDING, ease: 'easeOut', delay: DELAY_S }}
      onAnimationComplete={() => onStamped?.()}
    >
      {text}
    </motion.p>
  );
}
