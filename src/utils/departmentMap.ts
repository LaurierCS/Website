/**
 * Department Mapping Utility
 * Maps team member roles to their respective departments
 * Defines the order and structure of all departments
 */

export type Department = 'Admin' | 'Finance' | 'Marketing' | 'Outreach' | 'Events' | 'Academics' | 'Engineering';

// Ordered list of departments as they should appear on the page
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
    // Admin Department - Leadership and Executive roles
    'admin': 'Admin',
    'president': 'Admin',
    'vp of internal affairs': 'Admin',
    'evp': 'Admin',
    'evp external': 'Admin',

    // Finance Department - Financial roles
    'vp of finance': 'Finance',
    'director of finance': 'Finance',
    'finance': 'Finance',

    // Marketing Department - Marketing and Communications roles
    'vp of marketing': 'Marketing',
    'director of marketing': 'Marketing',
    'marketing': 'Marketing',
    'marketing officer': 'Marketing',
    'vp of communications': 'Marketing',
    'director of communications': 'Marketing',
    'director of content creation': 'Marketing',
    'director of graphic design': 'Marketing',
    'communications': 'Marketing',

    // Outreach Department - Outreach roles
    'vp of outreach': 'Outreach',
    'director of outreach': 'Outreach',
    'outreach': 'Outreach',
    'first year rep': 'Outreach',

    // Events Department - Events and logistics
    'vp of events': 'Events',
    'director of events': 'Events',
    'events': 'Events',

    // Academics Department - Academic and educational roles
    'vp of academics': 'Academics',
    'director of academics': 'Academics',
    'academics': 'Academics',

    // Engineering Department - Software and technical roles
    'vp of engineering': 'Engineering',
    'software engineer': 'Engineering',
    'engineer': 'Engineering',
    'developer': 'Engineering',
    'engineering': 'Engineering',
};

// Role hierarchy mapping - determines display order within departments
const hierarchyMap: Record<string, number> = {
    // Level 1 - Presidents (highest rank)
    'president': 1,

    // Level 2 - Executive Vice Presidents (EVPs)
    'evp': 2,
    'evp external': 2,
    'evp swe': 2,

    // Level 3 - Vice Presidents (VPs)
    'vp of internal affairs': 3,
    'vp of finance': 3,
    'vp of marketing': 3,
    'vp of communications': 3,
    'vp of outreach': 3,
    'vp of events': 3,
    'vp of academics': 3,
    'vp of engineering': 3,

    // Level 4 - Directors (lower rank)
    'director of finance': 4,
    'director of marketing': 4,
    'director of communications': 4,
    'director of content creation': 4,
    'director of graphic design': 4,
    'director of outreach': 4,
    'director of events': 4,
    'director of academics': 4,

    // Level 5 - Other roles
    'admin': 5,
    'finance': 5,
    'marketing': 5,
    'marketing officer': 5,
    'communications': 5,
    'outreach': 5,
    'events': 5,
    'academics': 5,
    'software engineer': 5,
    'engineer': 5,
    'developer': 5,
    'engineering': 5,
    'first year rep': 5,
};

/**
 * Determines which department a team member belongs to based on their role
 * @param role - The team member's role (case-insensitive)
 * @returns The department name, or 'Admin' as fallback
 */
export function getDepartmentFromRole(role?: string): Department {
    if (!role) return 'Admin'; // Default to Admin if no role specified

    const normalizedRole = role.toLowerCase().trim();
    return roleMap[normalizedRole] || 'Admin'; // Default to Admin if role not found
}

/**
 * Gets the hierarchy level of a role for proper ordering within departments
 * Lower numbers = higher rank (displayed first)
 * @param role - The team member's role (case-insensitive)
 * @returns Hierarchy level (1-5), with 5 as default for unknown roles
 */
export function getRoleHierarchy(role?: string): number {
    if (!role) return 5; // Default to lowest hierarchy

    const normalizedRole = role.toLowerCase().trim();
    return hierarchyMap[normalizedRole] || 5;
}
