/**
 * How each LCS accent looks: filling a shape (a department label, a member's initial) with dark text on it so it
 * passes contrast, or as text itself. Which accent something gets is decided in `lib/accents.ts`.
 */
import type { Accent } from '../../lib/accents';

export const ACCENT_FILLS: Readonly<Record<Accent, string>> = {
  pink: 'bg-pink text-ink',
  yellow: 'bg-yellow text-ink',
  blue: 'bg-blue text-ink',
  sky: 'bg-sky text-ink',
  orange: 'bg-orange text-ink',
};

/** Each accent as text on the dark background, like the sign on a form's sheet. */
export const ACCENT_TEXT: Readonly<Record<Accent, string>> = {
  pink: 'text-pink',
  yellow: 'text-yellow',
  blue: 'text-blue',
  sky: 'text-sky',
  orange: 'text-orange',
};
