/**
 * The words on the home page's team section, and the credit each department gets, the way a film's end credits
 * name a crew. Marketing and the execs change these, so they live here rather than in the markup. The people
 * come from the team table (public members only), edited in the admin.
 */
import { socialLink } from '../lib/site';
import { DEPARTMENTS, type Department } from '../lib/team';

export const TEAM = {
  label: 'Behind the scenes',
  title: 'The Team',
  summary:
    'Every review, social and late-night hack session was run by these students. Hover a name to see who they are.',
  /** The two chips under the summary, with the counts from the team table. */
  people: (count: number) => `${count} ${count === 1 ? 'student' : 'students'}`,
  departments: (count: number) => `${count} ${count === 1 ? 'department' : 'departments'}`,
  /** The button that stops the credits rolling, and starts them again. */
  pause: 'Pause the credits',
  play: 'Play the credits',
  /** The bar for jumping between departments on a phone. */
  jumpLabel: 'Jump to a department',
  /** The card at the end of the credits. */
  join: {
    title: 'Want your name up here?',
    text: 'We take new members every September and January.',
    action: { label: 'Join the team', href: socialLink('discord').href },
  },
} as const;

/** What a department is credited as, and its name in plain words under that. */
export type Credit = Readonly<{ title: string; department: string }>;

export const CREDITS: Readonly<Record<Department, Credit>> = {
  Admin: { title: 'Directed by', department: 'Admin' },
  Engineering: { title: 'Special effects', department: 'Engineering' },
  Marketing: { title: 'Costumes & posters', department: 'Marketing' },
  Events: { title: 'Produced by', department: 'Events' },
  Academics: { title: 'Script supervisors', department: 'Academics' },
  Outreach: { title: 'Location scouting', department: 'Outreach' },
  Finance: { title: 'Accounting', department: 'Finance' },
};

/** A department's credit; one the list above doesn't know yet, or no department, is "Additional crew". */
export function creditFor(department: string | null): Credit {
  const known = DEPARTMENTS.find((name) => name === department);
  return known ? CREDITS[known] : { title: 'Additional crew', department: department ?? 'LCS' };
}
