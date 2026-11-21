/** Adding a team member. After saving it goes back to Team, which says who was saved. */
import { useNavigate } from 'react-router';
import { MemberForm } from '../components/team/MemberForm';
import { FormPageHeading } from '../components/ui/FormPageHeading';
import { useCreateMember } from '../hooks/useTeam';
import { messageFor } from '../lib/errors';
import { EMPTY_MEMBER_FORM, toMemberFields } from '../lib/member-form';
import { savedNotice } from '../lib/saved-notice';
import { PATHS } from '../paths';

export function NewMemberPage() {
  const navigate = useNavigate();
  const create = useCreateMember();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <FormPageHeading title="Add member" back={{ to: PATHS.team, section: 'Team' }} />
      <div className="mt-8">
        <MemberForm
          kind="new"
          defaultValues={EMPTY_MEMBER_FORM}
          saving={create.isPending}
          error={create.isError ? messageFor(create.error) : null}
          onSave={(values) => {
            const fields = toMemberFields(values);
            create.mutate(fields, { onSuccess: () => navigate(PATHS.team, { state: savedNotice(fields.name) }) });
          }}
        />
      </div>
    </main>
  );
}
