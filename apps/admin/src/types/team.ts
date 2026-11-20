/**
 * An LCS team member as the admin works with them, matching today's `team` table.
 */
import { z } from 'zod';

/** The club's departments, in the order the site lists them. The team form offers exactly these. */
export const DEPARTMENTS = ['Admin', 'Finance', 'Marketing', 'Outreach', 'Events', 'Academics', 'Engineering'] as const;

export const TeamMemberSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1, 'Give their name.'),
  role: z.string().nullable(),
  /** Free text in the table today, so a spelling outside `DEPARTMENTS` is kept rather than rejected. */
  department: z.string().nullable(),
  /** Shown on the public site. */
  isPublic: z.boolean(),
  pictureUrl: z.url().nullable(),
  githubUrl: z.url().nullable(),
  linkedinUrl: z.url().nullable(),
});
export type TeamMember = Readonly<z.infer<typeof TeamMemberSchema>>;

/** One department's heading and its members. `department` is null for members with none. */
export type DepartmentGroup = Readonly<{ department: string | null; members: readonly TeamMember[] }>;

/**
 * Members grouped by department: the known departments first in their usual order, then any other spelling
 * found in the table, then members with no department. Empty departments are left out.
 */
export function groupByDepartment(members: readonly TeamMember[]): readonly DepartmentGroup[] {
  const byDepartment = new Map<string | null, TeamMember[]>();
  for (const member of members) {
    const department = member.department?.trim() || null;
    byDepartment.set(department, [...(byDepartment.get(department) ?? []), member]);
  }
  const known: readonly (string | null)[] = DEPARTMENTS;
  const others = [...byDepartment.keys()].filter((department) => department !== null && !known.includes(department));
  return [...DEPARTMENTS, ...others.sort(), null].flatMap((department) => {
    const group = byDepartment.get(department);
    return group ? [{ department, members: group }] : [];
  });
}
