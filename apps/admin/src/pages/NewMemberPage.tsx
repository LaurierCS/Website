/**
 * Adding a team member. Once they are saved their badge drops onto its lanyard, then it goes back to Team, which
 * says who was saved.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MemberForm } from '../components/team/MemberForm';
import { FormPageHeading } from '../components/ui/FormPageHeading';
import { useCreateMember } from '../hooks/useTeam';
import { messageFor } from '../lib/server/errors';
import { EMPTY_MEMBER_FORM, toMemberFields } from '../lib/form/member-form';
import { savedNotice } from '../lib/ui/saved-notice';
import { PATHS } from '../paths';

export function NewMemberPage() {
  const navigate = useNavigate();
  const create = useCreateMember();
  // The saved name, once saving has worked, for Team's "Saved" notice.
  const [savedName, setSavedName] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <FormPageHeading title="Add member" back={{ to: PATHS.team, section: 'Team' }} />
      <div className="mt-8">
        <MemberForm
          kind="new"
          defaultValues={EMPTY_MEMBER_FORM}
          photoUrl={null}
          saving={create.isPending}
          error={create.isError ? messageFor(create.error) : null}
          onSave={(values, _changed, photo) => {
            const fields = toMemberFields(values);
            create.mutate({ fields, photo }, { onSuccess: () => setSavedName(fields.name) });
          }}
          whenSaved={savedName === null ? null : () => navigate(PATHS.team, { state: savedNotice(savedName) })}
        />
      </div>
    </main>
  );
}
