/**
 * An LCS team member as the admin works with them, matching the v2 `team` table.
 */
import { z } from 'zod';

/** The club's departments, in the order the site lists them. The team form offers exactly these. */
export const DEPARTMENTS = ['Admin', 'Finance', 'Marketing', 'Outreach', 'Events', 'Academics', 'Engineering'] as const;
export type Department = (typeof DEPARTMENTS)[number];

export const TeamMemberSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1, 'Give their name.'),
  role: z.string().nullable(),
  department: z.enum(DEPARTMENTS),
  /** Shown on the public site. */
  isPublic: z.boolean(),
  /** Path in the `team-images` bucket, when there is a photo. */
  photoPath: z.string().nullable(),
  pictureUrl: z.url().nullable(),
  githubUrl: z.url().nullable(),
  linkedinUrl: z.url().nullable(),
});
export type TeamMember = Readonly<z.infer<typeof TeamMemberSchema>>;

/** What an exec fills in for a member. The database only accepts the seven departments, so it is one of them. */
export type MemberFields = Readonly<
  Pick<TeamMember, 'name' | 'role' | 'githubUrl' | 'linkedinUrl' | 'isPublic'> & { department: Department }
>;

/** What a crew badge shows: a saved member on the Team board, or the team form as it is filled in. */
export type BadgeFace = Readonly<Pick<TeamMember, 'name' | 'role' | 'pictureUrl' | 'githubUrl' | 'linkedinUrl' | 'isPublic'>>;

/** One department's heading and its members. */
export type DepartmentGroup = Readonly<{ department: string; members: readonly TeamMember[] }>;

/**
 * Members grouped by department: the known departments first in their usual order, then any other spelling
 * found in the table. Empty departments are left out.
 */
export function groupByDepartment(members: readonly TeamMember[]): readonly DepartmentGroup[] {
  const byDepartment = new Map<string, TeamMember[]>();
  for (const member of members) {
    byDepartment.set(member.department, [...(byDepartment.get(member.department) ?? []), member]);
  }
  return DEPARTMENTS.flatMap((department) => {
    const group = byDepartment.get(department);
    return group ? [{ department, members: group }] : [];
  });
}