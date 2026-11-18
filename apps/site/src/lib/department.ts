import type { TeamMember } from './queries/team';

export type Department = 'Admin' | 'Finance' | 'Marketing' | 'Outreach' | 'Events' | 'Academics' | 'Engineering';

/** Display order. Every name is spellable with the scrapbook letter set. */
export const DEPARTMENTS: Department[] = [
  'Admin',
  'Finance',
  'Marketing',
  'Outreach',
  'Events',
  'Academics',
  'Engineering',
];

const roleMap: Record<string, Department> = {
  admin: 'Admin',
  president: 'Admin',
  'vp of internal affairs': 'Admin',
  evp: 'Admin',
  'evp external': 'Admin',
  'vp of finance': 'Finance',
  'director of finance': 'Finance',
  finance: 'Finance',
  'vp of marketing': 'Marketing',
  'director of marketing': 'Marketing',
  marketing: 'Marketing',
  'marketing officer': 'Marketing',
  'vp of communications': 'Marketing',
  'director of communications': 'Marketing',
  'director of content creation': 'Marketing',
  'director of graphic design': 'Marketing',
  communications: 'Marketing',
  'vp of outreach': 'Outreach',
  'director of outreach': 'Outreach',
  outreach: 'Outreach',
  'first year rep': 'Outreach',
  'vp of events': 'Events',
  'director of events': 'Events',
  events: 'Events',
  'vp of academics': 'Academics',
  'director of academics': 'Academics',
  academics: 'Academics',
  'vp of engineering': 'Engineering',
  'software engineer': 'Engineering',
  engineer: 'Engineering',
  developer: 'Engineering',
  engineering: 'Engineering',
};

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

export function getDepartmentFromRole(role?: string | null): Department {
  if (!role) return 'Admin';
  return roleMap[role.toLowerCase().trim()] ?? 'Admin';
}

export function getRoleHierarchy(role?: string | null): number {
  if (!role) return 5;
  return hierarchyMap[role.toLowerCase().trim()] ?? 5;
}

export function groupByDepartment(members: TeamMember[]): { department: Department; members: TeamMember[] }[] {
  const grouped = Object.fromEntries(DEPARTMENTS.map((dept) => [dept, [] as TeamMember[]])) as Record<
    Department,
    TeamMember[]
  >;

  for (const member of members) {
    // Role map is the source of order. The department column is not.
    grouped[getDepartmentFromRole(member.role)].push(member);
  }

  return DEPARTMENTS.flatMap((department) => {
    const list = grouped[department].sort(
      (a, b) => getRoleHierarchy(a.role) - getRoleHierarchy(b.role) || a.name.localeCompare(b.name),
    );
    return list.length ? [{ department, members: list }] : [];
  });
}
