/**
 * The club's events, shaped like rows of the events table. Placeholders for now: the events table will feed the
 * page instead, and this file goes away.
 */
import type { ClockTime, IsoDate } from '../lib/dates';

/** One event, as the site shows it. `time` and `location` can be unknown yet ("TBA"). */
export type ClubEvent = Readonly<{
  id: string;
  title: string;
  date: IsoDate;
  time: ClockTime | null;
  location: string | null;
  photoUrl: string | null;
}>;

export const EVENTS: readonly ClubEvent[] = [
  {
    id: 'mtp-fall',
    title: 'Meet the Professionals',
    date: '2026-11-12',
    time: '19:00',
    location: 'N1001',
    photoUrl: null,
  },
  {
    id: 'study-chill',
    title: 'Study n Chill',
    date: '2026-11-26',
    time: '17:00',
    location: 'Library 3rd floor',
    photoUrl: null,
  },
  {
    id: 'game-night',
    title: 'Game Night',
    date: '2026-11-28',
    time: '18:00',
    location: 'BA201',
    photoUrl: null,
  },
  {
    id: 'cp312-final',
    title: 'CP312 Final Review',
    date: '2026-12-03',
    time: '18:30',
    location: null,
    photoUrl: null,
  },
  {
    id: 'holiday-social',
    title: 'Holiday Social',
    date: '2026-12-10',
    time: '18:00',
    location: null,
    photoUrl: null,
  },
];
