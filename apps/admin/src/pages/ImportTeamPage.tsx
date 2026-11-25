/**
 * Importing team members from a CSV file, as a print order: the file is checked against the saved team, the new
 * and updated members come out of the press as the crew badges they will be, and Import saves all of them or
 * none.
 */
import { RotateCw } from 'lucide-react';
import { ImportBadge } from '../components/team/ImportBadge';
import { MEMBER_IMPORT } from '../components/team/member-import';
import { Button } from '../components/ui/Button';
import { CsvImport } from '../components/ui/CsvImport';
import { FormPageHeading } from '../components/ui/FormPageHeading';
import type { ImportView } from '../components/ui/import-view';
import { StateBlock } from '../components/ui/StateBlock';
import { useImportTeam, useTeam } from '../hooks/useTeam';
import { TEAM_CSV } from '../lib/csv/csv-formats';
import { messageFor } from '../lib/server/errors';
import { PATHS } from '../paths';
import type { MemberFields, TeamMember } from '../types/team';

const BACK = { to: PATHS.team, section: 'Team' };

const VIEW: ImportView<TeamMember, MemberFields> = { ...MEMBER_IMPORT, front: (entry) => <ImportBadge entry={entry} /> };

export function ImportTeamPage() {
  return (
    <main
      // Wider than the other pages, so there is room for the print order beside the badges.
      className="mx-auto max-w-7xl px-4 py-10 sm:px-8"
    >
      <FormPageHeading title="Import team" back={BACK} />
      <div className="mt-8">
        <TeamImport />
      </div>
    </main>
  );
}

/** The import once the saved team has loaded, since the file is checked against it. */
function TeamImport() {
  const team = useTeam();
  const saver = useImportTeam();

  switch (team.status) {
    case 'pending':
      return <div role="status" aria-label="Loading the team" className="h-48 animate-pulse rounded-card bg-card motion-reduce:animate-none" />;
    case 'error':
      return (
        <StateBlock
          tone="failed"
          mascot="doug"
          title={messageFor(team.error)}
          body="The file is checked against the saved team, so it needs to load first. Nothing was changed."
          action={
            <Button variant="primary" size="small" icon={<RotateCw aria-hidden="true" className="size-4" />} onClick={() => void team.refetch()}>
              Try again
            </Button>
          }
        />
      );
    case 'success':
      return (
        <CsvImport
          format={TEAM_CSV}
          saved={team.data}
          view={VIEW}
          saver={saver}
          back={BACK}
        />
      );
  }
}
