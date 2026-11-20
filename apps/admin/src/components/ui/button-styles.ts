/**
 * How the admin's buttons look and press, shared by `Button` and `ButtonLink`. A new look is one more entry in
 * `VARIANTS`.
 */

const VARIANTS = {
  /** The one main action on a screen. */
  primary: 'bg-pink text-ink shadow-key shadow-pink-ink hover:shadow-key-lifted',
  /** Something that can't be undone, like deleting, when it is the action being confirmed. */
  danger: 'bg-danger text-danger-ink shadow-key shadow-danger-ink hover:shadow-key-lifted',
  /** Signing in with Discord: Discord's own blue, so people recognise it at a glance. */
  discord: 'bg-discord text-white shadow-key shadow-discord-ink hover:shadow-key-lifted',
  /** Signing in with Notion: Notion's black-on-white, so people recognise it at a glance. */
  notion: 'border-2 border-ink bg-white text-ink shadow-key shadow-ink hover:shadow-key-lifted',
  /** A secondary action on a light surface, like the login pass. */
  ghost: 'border-2 border-current bg-transparent text-ink-2 hover:bg-ink/5',
  /** A secondary action on the dark background, like Edit or Cancel. */
  quiet: 'border-2 border-line bg-transparent text-white hover:bg-slate',
  /** A dangerous action offered next to others, like Delete on a list item. It asks before doing anything. */
  'danger-quiet': 'border-2 border-danger-soft bg-transparent text-danger-soft hover:bg-slate',
} as const;

const SIZES = {
  /** On its own, like the sign-in buttons. */
  regular: 'px-6 py-3.5 text-lg',
  /** Beside other actions, in lists, dialogs and the header. Still a 44px touch target. */
  small: 'min-h-11 px-5 py-2 text-base',
} as const;

export type ButtonVariant = keyof typeof VARIANTS;
export type ButtonSize = keyof typeof SIZES;

/** The classes for a button's look. */
export function buttonClasses(variant: ButtonVariant, size: ButtonSize): string {
  return `inline-flex items-center justify-center gap-2.5 rounded-full font-display font-bold tracking-wide whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]}`;
}

/** Lift on hover, press onto the edge on click. Springy, because it is something you touch. */
export const KEY_PRESS = {
  whileHover: { y: -2 },
  whileTap: { y: 3, scale: 0.98, boxShadow: '0 0 0 transparent' },
  transition: { type: 'spring', stiffness: 600, damping: 30 },
} as const;
