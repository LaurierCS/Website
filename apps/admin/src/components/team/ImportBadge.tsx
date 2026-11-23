/**
 * A team member in a CSV import, drawn as the crew badge they will have, labelled new or updated. Photos aren't
 * in a CSV, so a new member shows their initial until one is added in the team form.
 */
import type { MemberFields, TeamMember } from '../../types/team';
import type { ImportEntry } from '../ui/import-view';
import { CrewBadge } from './CrewBadge';
import { importedMember } from './member-import';

export function ImportBadge({ entry }: { entry: ImportEntry<TeamMember, MemberFields> }) {
  const member = importedMember(entry);
  const face = { ...member, pictureUrl: entry.kind === 'updated' ? entry.item.after.pictureUrl : null };
  return <CrewBadge face={face} layout="badge" importKind={entry.kind} />;
}
