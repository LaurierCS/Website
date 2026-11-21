import type { TeamMember } from './queries/team';

/** Display order. Every name is spellable with the scrapbook letter set. */
export const DEPARTMENTS = ['Admin', 'Finance', 'Marketing', 'Outreach', 'Events', 'Academics', 'Engineering'] as const;

export type Department = (typeof DEPARTMENTS)[number];

function isDepartment(value: string | null): value is Department {
  return DEPARTMENTS.some((department) => department === value);
}

/** Lower number renders first inside a department. */
const hierarchyMap: Record<string, number> = {
  president: 1,
  evp: 2,
  'evp external': 2,
  'evp swe': 2,
  'vp of internal affairs': 3,
  'vp of finance': 3,
  'vp of marketing': 3,
  'vp of communications': 3,
  'vp of outreach': 3,
  'vp of events': 3,
  'vp of academics': 3,
  'vp of engineering': 3,
  'director of finance': 4,
  'director of marketing': 4,
  'director of communications': 4,
  'director of content creation': 4,
  'director of graphic design': 4,
  'director of outreach': 4,
  'director of events': 4,
  'director of academics': 4,
};

export function getRoleHierarchy(role?: string | null): number {
  if (!role) return 5;
  return hierarchyMap[role.toLowerCase().trim()] ?? 5;
}

/**
 * Public members grouped under their `department`, in display order; inside a department, by rank (VP before
 * director), then by name. The database only accepts the seven departments, so a member with any other value
 * means a broken row: it is left out and logged, so one bad row can't break the whole team section.
 */
export function groupByDepartment(members: TeamMember[]): { department: Department; members: TeamMember[] }[] {
  const grouped = new Map<Department, TeamMember[]>(DEPARTMENTS.map((department) => [department, []]));

  for (const member of members) {
    if (!isDepartment(member.department)) {
      console.warn('team.member_skipped', { id: member.id, reason: 'unknown department' });
      continue;
    }
    grouped.get(member.department)?.push(member);
  }

  return DEPARTMENTS.flatMap((department) => {
    const list = (grouped.get(department) ?? []).sort(
      (a, b) => getRoleHierarchy(a.role) - getRoleHierarchy(b.role) || a.name.localeCompare(b.name),
    );
    return list.length ? [{ department, members: list }] : [];
  });
}
