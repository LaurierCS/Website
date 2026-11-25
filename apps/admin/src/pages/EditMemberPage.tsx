/**
 * Editing a team member. It loads them from the URL's id, then saves only the fields the exec changed. Once
 * saved, their badge drops onto its lanyard and it goes back to Team, which says who was saved.
 */
import { RotateCw } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { MemberForm } from '../components/team/MemberForm';
import { Button } from '../components/ui/Button';
import { ButtonLink } from '../components/ui/ButtonLink';
import { FormPageHeading } from '../components/ui/FormPageHeading';
import { StateBlock } from '../components/ui/StateBlock';
import { useMember, useUpdateMember } from '../hooks/useTeam';
import { messageFor } from '../lib/server/errors';
import { changedMemberFields, formValuesFor } from '../lib/form/member-form';
import { savedNotice } from '../lib/ui/saved-notice';
import { PATHS } from '../paths';
import type { TeamMember } from '../types/team';

export function EditMemberPage() {
  // The route is `/team/:id`, so the id is always there.
  const { id = '' } = useParams();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <FormPageHeading title="Edit member" back={{ to: PATHS.team, section: 'Team' }} />
      <div className="mt-8">
        <MemberToEdit id={id} />
      </div>
    </main>
  );
}

/** The form once the member has loaded, or why there isn't one: still loading, failed, or no such member. */
function MemberToEdit({ id }: { id: string }) {
  const member = useMember(id);

  switch (member.status) {
    case 'pending':
      return <div role="status" aria-label="Loading the member" className="h-96 animate-pulse rounded-card bg-card motion-reduce:animate-none" />;
    case 'error':
      return (
        <StateBlock
          tone="failed"
          mascot="doug"
          title={messageFor(member.error)}
          body="Check your connection, then try again. Nothing was changed."
          action={
            <Button variant="primary" size="small" icon={<RotateCw aria-hidden="true" className="size-4" />} onClick={() => void member.refetch()}>
              Try again
            </Button>
          }
        />
      );
    case 'success':
      return member.data ? (
        <EditForm member={member.data} />
      ) : (
        <StateBlock
          tone="calm"
          mascot="coco"
          title="There's no one at this address."
          body="They may have been deleted from the team."
          action={
            <ButtonLink to={PATHS.team} variant="quiet" size="small">
              See the whole team
            </ButtonLink>
          }
        />
      );
  }
}

function EditForm({ member }: { member: TeamMember }) {
  const navigate = useNavigate();
  const update = useUpdateMember(member);
  // The saved name, once saving has worked, for Team's "Saved" notice.
  const [savedName, setSavedName] = useState<string | null>(null);

  return (
    <MemberForm
      kind="edit"
      defaultValues={formValuesFor(member)}
      photoUrl={member.pictureUrl}
      saving={update.isPending}
      error={update.isError ? messageFor(update.error) : null}
      onSave={(values, changed, photo) =>
        update.mutate(
          { changes: changedMemberFields(values, changed), photo },
          { onSuccess: () => setSavedName(values.name.trim()) },
        )
      }
      whenSaved={savedName === null ? null : () => navigate(PATHS.team, { state: savedNotice(savedName) })}
    />
  );
}
