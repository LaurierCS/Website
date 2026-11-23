/**
 * How team members read in a CSV import: a member's name, every field in their details, and their lines on the
 * print order. The badge itself is `ImportBadge`.
 */
import type { MemberFields, TeamMember } from '../../types/team';
import type { FieldChange } from '../ui/FieldChanges';
import type { ImportEntry, ImportView, OrderItem } from '../ui/import-view';

type MemberEntry = ImportEntry<TeamMember, MemberFields>;

/** The member as they will be once imported. */
export function importedMember(entry: MemberEntry): MemberFields | TeamMember {
  return entry.kind === 'new' ? entry.item.fields : entry.item.after;
}

const shownOrHidden = (isPublic: boolean) => (isPublic ? 'Shown' : 'Hidden');

// What each column is called on the print order, and how its new value reads there.
const ORDER_LINES: Readonly<Record<string, (after: string) => OrderItem>> = {
  name: (after) => ({ label: 'name', value: `→ ${after}` }),
  role: (after) => ({ label: 'role', value: `→ ${after || 'none'}` }),
  department: (after) => ({ label: 'department', value: `→ ${after}` }),
  is_public: (after) => ({ label: 'on the site', value: `→ ${after === 'true' ? 'shown' : 'hidden'}` }),
  github_url: (after) => ({ label: 'GitHub', value: after ? 'new link' : 'removed' }),
  linkedin_url: (after) => ({ label: 'LinkedIn', value: after ? 'new link' : 'removed' }),
};

/** A field as the details show it. `before` is left out for a new member, who has nothing to compare. */
function field(label: string, before: string | undefined, after: string): FieldChange {
  return { label, before: before ?? null, after };
}

export const MEMBER_IMPORT = {
  noun: { one: 'member', many: 'members' },
  piece: 'badge',
  arrangement: 'cards',
  nameOf: (entry) => importedMember(entry).name,
  fields: (entry) => {
    const was = entry.kind === 'updated' ? entry.item.before : undefined;
    const will = importedMember(entry);
    return {
      short: [
        field('Name', was?.name, will.name),
        field('Role', was && (was.role ?? 'None'), will.role ?? 'None'),
        field('Department', was && (was.department ?? 'None'), will.department ?? 'None'),
        field('On the site', was && shownOrHidden(was.isPublic), shownOrHidden(will.isPublic)),
        field('GitHub', was && (was.githubUrl ?? 'None'), will.githubUrl ?? 'None'),
        field('LinkedIn', was && (was.linkedinUrl ?? 'None'), will.linkedinUrl ?? 'None'),
      ],
    };
  },
  orderItems: (entry) => {
    if (entry.kind === 'updated') {
      return entry.item.cells.flatMap(({ column, after }) => {
        const line = ORDER_LINES[column];
        return line ? [line(after)] : [];
      });
    }
    const member = entry.item.fields;
    return [{ label: [member.department, member.role, member.isPublic ? null : 'hidden'].filter(Boolean).join(' · '), value: '' }];
  },
} satisfies Omit<ImportView<TeamMember, MemberFields>, 'front'>;
