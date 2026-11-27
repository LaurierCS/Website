/**
 * Where the doodles sit in each section's edges, as data: which doodle, where (measured from the section's edges,
 * across the whole screen width), how big, and how it moves. Moving one, or adding one, is an edit here; the
 * sections don't change. Keep them in the empty space beside the content, two or three a section.
 */
import type { DoodleName } from '../../assets/brand';

/** How a doodle moves: turning slowly one way, slower the other way, or not turning (it still drifts). */
export type DoodleMotion = 'turn' | 'turn-back' | 'still';

export type DoodleSpot = Readonly<{
  doodle: DoodleName;
  place: Readonly<Partial<Record<'top' | 'bottom' | 'left' | 'right', string>>>;
  /** Its width. */
  size: string;
  motion: DoodleMotion;
}>;

/** The sections that have doodles, by the name each section passes in. */
export type DoodleSection = 'events' | 'mtp' | 'everythingElse' | 'resources' | 'team';

export const DOODLE_SPOTS: Readonly<Record<DoodleSection, readonly DoodleSpot[]>> = {
  events: [
    // The gap between the hero and this section's heading.
    { doodle: 'jumps', place: { top: '1.5%', left: '30%' }, size: '8rem', motion: 'still' },
    { doodle: 'star4', place: { top: '2%', left: '58%' }, size: '2.5rem', motion: 'turn' },
    { doodle: 'star13', place: { top: '5%', right: '8%' }, size: '4.5rem', motion: 'turn' },
    { doodle: 'asterisk', place: { bottom: '3%', left: '8%' }, size: '3rem', motion: 'turn-back' },
    { doodle: 'spark', place: { bottom: '3%', right: '30%' }, size: '2.75rem', motion: 'turn' },
  ],
  mtp: [
    { doodle: 'star4', place: { top: '3%', right: '14%' }, size: '2.75rem', motion: 'turn' },
    { doodle: 'brackets', place: { top: '3%', left: '42%' }, size: '3.25rem', motion: 'still' },
  ],
  everythingElse: [
    { doodle: 'loops', place: { top: '6%', right: '5%' }, size: '9rem', motion: 'still' },
    { doodle: 'asterisk', place: { top: '3%', left: '42%' }, size: '3rem', motion: 'turn' },
  ],
  resources: [
    { doodle: 'star13', place: { top: '4%', left: '6%' }, size: '4rem', motion: 'turn-back' },
    { doodle: 'jumps', place: { bottom: '8%', left: '8%' }, size: '9rem', motion: 'still' },
    { doodle: 'spark', place: { top: '10%', right: '3%' }, size: '3rem', motion: 'turn' },
  ],
  team: [
    { doodle: 'star4', place: { top: '8%', right: '8%' }, size: '3.5rem', motion: 'turn' },
    { doodle: 'brackets', place: { bottom: '3%', right: '40%' }, size: '3.25rem', motion: 'still' },
  ],
};
