/**
 * How each LCS accent fills a shape, like a department label or a member's initial. Dark text on every accent,
 * so it passes contrast. Which accent something gets is decided in `lib/accents.ts`.
 */
import type { Accent } from '../../lib/accents';

export const ACCENT_FILLS: Readonly<Record<Accent, string>> = {
  pink: 'bg-pink text-ink',
  yellow: 'bg-yellow text-ink',
  blue: 'bg-blue text-ink',
  sky: 'bg-sky text-ink',
  orange: 'bg-orange text-ink',
};
