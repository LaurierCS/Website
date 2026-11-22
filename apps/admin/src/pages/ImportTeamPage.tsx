/**
 * Importing team members from a CSV file. The file is checked against the saved team, the new and changed
 * members show as the crew badges they will be, and Import saves all of them or none.
 */
import { RotateCw } from 'lucide-react';
import { CrewBadge } from '../components/team/CrewBadge';
import { Button } from '../components/ui/Button';
import { CsvImport } from '../components/ui/CsvImport';
import { FormPageHeading } from '../components/ui/FormPageHeading';
import { StateBlock } from '../components/ui/StateBlock';
import { useImportTeam, useTeam } from '../hooks/useTeam';
import { TEAM_CSV } from '../lib/csv-formats';
import { messageFor } from '../lib/errors';
import { PATHS } from '../paths';

const BACK = { to: PATHS.team, section: 'Team' };

export function ImportTeamPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
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
          noun={{ one: 'member', many: 'members' }}
          saver={saver}
          back={BACK}
          // A CSV has no photos, so a new member shows their initial until one is added in the team form.
          renderNew={({ fields }) => (
            <div className="max-w-xs">
              <CrewBadge face={{ ...fields, pictureUrl: null }} layout="badge" />
            </div>
          )}
          renderChanged={({ after }) => (
            <div className="max-w-xs">
              <CrewBadge face={after} layout="badge" />
            </div>
          )}
        />
      );
  }
}
