/**
 * Each typing mascot's colour: on their "…" bubble in the clubhouse and on their name in the about window's
 * title bar while they type.
 */
import type { Typist } from '../../content/home';

export const TYPIST_STYLES: Readonly<Record<Typist, Readonly<{ text: string; bubble: string; dot: string }>>> = {
  doug: { text: 'text-blue', bubble: 'border-blue', dot: 'bg-blue' },
  coco: { text: 'text-orange', bubble: 'border-orange', dot: 'bg-orange' },
  krill: { text: 'text-yellow', bubble: 'border-yellow', dot: 'bg-yellow' },
};
