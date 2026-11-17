import { supabase, type TeamMember } from '../supabase';

export type Department =
  | 'Admin'
  | 'Finance'
  | 'Marketing'
  | 'Outreach'
  | 'Events'
  | 'Academics'
  | 'Engineering';

export const DEPARTMENTS: Department[] = [
  'Admin',
  'Finance',
  'Marketing',
  'Outreach',
  'Events',
  'Academics',
  'Engineering',
];

// Role to Department mapping
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

// Role hierarchy: lower number = higher rank
const hierarchyMap: Record<string, number> = {
  president: 1,
  evp: 2,
  'evp external': 2,
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
  admin: 5,
  finance: 5,
  marketing: 5,
  'marketing officer': 5,
  communications: 5,
  outreach: 5,
  events: 5,
  academics: 5,
  'software engineer': 5,
  engineer: 5,
  developer: 5,
  engineering: 5,
  'first year rep': 5,
};

export function getDepartmentFromRole(role?: string): Department {
  if (!role) return 'Admin';
  return roleMap[role.toLowerCase().trim()] || 'Admin';
}

export function getRoleHierarchy(role?: string): number {
  if (!role) return 5;
  return hierarchyMap[role.toLowerCase().trim()] || 5;
}

/**
 * Fetch all public team members, grouped and sorted by department and role hierarchy
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const { data, error } = await supabase
      .from('team')
      .select('*')
      .eq('is_public', true)
      .order('name', { ascending: true });

    if (error) throw error;

    // Sort by department order, then by role hierarchy
    const members = data || [];
    return members.sort((a, b) => {
      const deptA = getDepartmentFromRole(a.role);
      const deptB = getDepartmentFromRole(b.role);
      const deptIndexA = DEPARTMENTS.indexOf(deptA);
      const deptIndexB = DEPARTMENTS.indexOf(deptB);

      if (deptIndexA !== deptIndexB) {
        return deptIndexA - deptIndexB;
      }

      // Same department: sort by hierarchy
      const hierarchyA = getRoleHierarchy(a.role);
      const hierarchyB = getRoleHierarchy(b.role);
      if (hierarchyA !== hierarchyB) {
        return hierarchyA - hierarchyB;
      }

      // Same hierarchy: sort by name
      return (a.name || '').localeCompare(b.name || '');
    });
  } catch (err) {
    console.error('Error fetching team members:', err);
    return [];
  }
}

/**
 * Fetch team members grouped by department
 */
export async function getTeamByDepartment(): Promise<
  Record<Department, TeamMember[]>
> {
  const members = await getTeamMembers();
  const grouped: Record<Department, TeamMember[]> = {
    Admin: [],
    Finance: [],
    Marketing: [],
    Outreach: [],
    Events: [],
    Academics: [],
    Engineering: [],
  };

  members.forEach((member) => {
    const dept = getDepartmentFromRole(member.role);
    grouped[dept].push(member);
  });

  return grouped;
}
