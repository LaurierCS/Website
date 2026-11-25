/**
 * The club's team as the home page shows it: who's on it, grouped into departments in credit order, and cut into
 * groups of a few people for the rolling credits. Rows from the team table are checked here, once.
 */
import { z } from 'zod';

/** The club's departments as the team table spells them, in the order the credits roll. */
export const DEPARTMENTS = ['Admin', 'Engineering', 'Marketing', 'Events', 'Academics', 'Outreach', 'Finance'] as const;
export type Department = (typeof DEPARTMENTS)[number];

/** One person on the public team. Their role, photo and links can be missing; then those are left out. */
export type TeamMember = Readonly<{
  id: string;
  name: string;
  role: string | null;
  department: string | null;
  pictureUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
}>;

/**
 * One department's people. `department` is one of `DEPARTMENTS`, another spelling found in the table, or null
 * for people with none.
 */
export type Crew = Readonly<{ department: string | null; members: readonly TeamMember[] }>;

/** A few people from one crew, lit together on the rolling credits. `start` is where they begin in their crew. */
export type CreditGroup = Readonly<{ crew: number; start: number; members: readonly TeamMember[] }>;

// A broken link only costs that link, never the person.
const optionalUrl = z.url().nullable().catch(null);
const optionalText = z
  .string()
  .trim()
  .nullable()
  .transform((value) => value || null);

const TeamRowSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1),
  role: optionalText,
  department: optionalText,
  // Where their photo is in the team bucket, not its address.
  picture_path: optionalText,
  linkedin_url: optionalUrl,
  github_url: optionalUrl,
});

/**
 * A team table row as a `TeamMember`, or null when the row can't be one (a missing name, a bad id).
 * `pictureUrl` turns the photo's path in the team bucket into its address.
 */
export function toTeamMember(row: unknown, pictureUrl: (path: string) => string): TeamMember | null {
  const parsed = TeamRowSchema.safeParse(row);
  if (!parsed.success) return null;
  const { picture_path, linkedin_url, github_url, ...rest } = parsed.data;
  return {
    ...rest,
    pictureUrl: picture_path ? pictureUrl(picture_path) : null,
    linkedinUrl: linkedin_url,
    githubUrl: github_url,
  };
}

/**
 * The words in a role that put someone ahead in their department, most senior first: presidents (and
 * co-presidents), then EVPs, then VPs, then directors. Anyone else comes after, and so does a missing role.
 */
const SENIORITY = ['president', 'evp', 'vp', 'director'] as const;

/** How senior a role is: its place in `SENIORITY`, or after all of them. "VP" is 2. */
export function seniority(role: string | null): number {
  const words = new Set((role ?? '').toLowerCase().split(/[^a-z]+/));
  const rank = SENIORITY.findIndex((word) => words.has(word));
  return rank === -1 ? SENIORITY.length : rank;
}

/**
 * The team by department: the known departments first in credit order, then any other spelling in the table,
 * then people with no department. In each, the most senior come first (`seniority`), keeping the order they came
 * in (by name) among equals. Departments with nobody in them are left out.
 */
export function crews(members: readonly TeamMember[]): readonly Crew[] {
  const known: readonly (string | null)[] = DEPARTMENTS;
  const others = [...new Set(members.map((member) => member.department))].filter(
    (department): department is string => department !== null && !known.includes(department),
  );
  return [...DEPARTMENTS, ...others.sort(), null]
    .map((department) => ({
      department,
      members: members
        .filter((member) => member.department === department)
        .toSorted((a, b) => seniority(a.role) - seniority(b.role)),
    }))
    .filter((crew) => crew.members.length > 0);
}

/**
 * Every crew cut into groups for the credits to light one at a time, in order: the fewest groups of at most
 * `most` people, shared out as evenly as possible (the bigger groups first), so nobody is left on their own at
 * the end. With `most` at 5: six people are 3 and 3, seven are 4 and 3, eleven are 4, 4 and 3. A crew of one or
 * two is one group.
 */
export function creditGroups(teamCrews: readonly Crew[], most: number): readonly CreditGroup[] {
  return teamCrews.flatMap((crew, index) => {
    const count = Math.ceil(crew.members.length / most);
    const size = Math.floor(crew.members.length / count);
    const bigger = crew.members.length % count;
    let start = 0;
    return Array.from({ length: count }, (_, group) => {
      const members = crew.members.slice(start, start + size + (group < bigger ? 1 : 0));
      const groupStart = start;
      start += members.length;
      return { crew: index, start: groupStart, members };
    });
  });
}

/** Someone's main link, for their name in the credits: their LinkedIn, else their GitHub, else none. */
export function mainLink(member: TeamMember): Readonly<{ href: string; site: 'LinkedIn' | 'GitHub' }> | null {
  if (member.linkedinUrl) return { href: member.linkedinUrl, site: 'LinkedIn' };
  if (member.githubUrl) return { href: member.githubUrl, site: 'GitHub' };
  return null;
}

/** Someone's initials, for their print when there's no photo of them: "Sam Lee" is "SL". */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? (words.at(-1)?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}
