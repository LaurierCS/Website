/**
 * The admin's button. It lifts on hover and presses down onto its shadow when clicked, like a real key.
 */
import { type HTMLMotionProps, motion } from 'motion/react';
import type { ReactNode } from 'react';

const VARIANTS = {
  /** The one main action on a screen. */
  primary: 'bg-pink text-ink shadow-[0_5px_0_var(--pink-ink)] hover:shadow-[0_7px_0_var(--pink-ink)]',
  /** Signing in with Discord: Discord's own blue, so people recognise it at a glance. */
  discord: 'bg-discord text-white shadow-[0_5px_0_var(--discord-ink)] hover:shadow-[0_7px_0_var(--discord-ink)]',
  /** Signing in with Notion: Notion's black-on-white, so people recognise it at a glance. */
  notion: 'border-2 border-ink bg-white text-ink shadow-[0_5px_0_var(--ink)] hover:shadow-[0_7px_0_var(--ink)]',
  /** A secondary action next to a primary one. */
  ghost: 'border-2 border-current bg-transparent text-ink-2 hover:bg-ink/5',
  /** A quiet action on a dark surface, like signing out. */
  quiet: 'border-2 border-line bg-transparent text-text-2 hover:border-sky hover:text-sky',
} as const;

export type ButtonVariant = keyof typeof VARIANTS;

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  variant: ButtonVariant;
  icon?: ReactNode;
  children: ReactNode;
};

export function Button({ variant, icon, children, className = '', type = 'button', ...rest }: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={{ y: -2 }}
      whileTap={{ y: 3, scale: 0.98, boxShadow: '0 0 0 transparent' }}
      transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      className={`inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 font-display text-lg font-bold tracking-wide transition-[background-color,border-color,color,box-shadow] duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </motion.button>
  );
}
