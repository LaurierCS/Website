/**
 * The form for adding a team member and for editing one: name, role, department, GitHub and LinkedIn links,
 * and whether they show on the site. It checks the fields with `MemberFormSchema`, shows problems under each
 * field, and asks before you leave with unsaved changes. Saving is the page's job (`onSave`). The photo comes
 * with its own upload later.
 */
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useUnsavedChangesWarning } from '../../hooks/useUnsavedChangesWarning';
import {
  type ChangedMemberFields,
  type CheckedMemberForm,
  MemberFormSchema,
  type MemberFormValues,
} from '../../lib/member-form';
import { PATHS } from '../../paths';
import { DEPARTMENTS } from '../../types/team';
import { Button } from '../ui/Button';
import { ButtonLink } from '../ui/ButtonLink';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { ErrorBanner } from '../ui/ErrorBanner';
import { FIELD_INPUT, FIELD_INPUT_WITH_ICON } from '../ui/field-styles';
import { FormField } from '../ui/FormField';
import { ProfileIcon } from '../ui/ProfileIcon';
import { Switch } from '../ui/Switch';

/** The save button's words for adding a member and for editing one. */
const SUBMIT = {
  new: { label: 'Add member', pending: 'Adding…' },
  edit: { label: 'Save changes', pending: 'Saving…' },
} as const;

type MemberFormProps = {
  kind: keyof typeof SUBMIT;
  defaultValues: MemberFormValues;
  saving: boolean;
  /** Why the last save failed. */
  error: string | null;
  onSave: (values: CheckedMemberForm, changed: ChangedMemberFields) => void;
};

export function MemberForm({ kind, defaultValues, saving, error, onSave }: MemberFormProps) {
  const { register, handleSubmit, control, formState } = useForm({ resolver: zodResolver(MemberFormSchema), defaultValues });
  const { errors, isDirty, dirtyFields } = formState;
  const leave = useUnsavedChangesWarning(isDirty);
  const submit = SUBMIT[kind];

  return (
    <form noValidate onSubmit={handleSubmit((values) => onSave(values, dirtyFields))}>
      <div className="grid gap-6 rounded-card border border-line bg-slate px-5 py-6 sm:px-8 sm:py-8">
        {error && <ErrorBanner title={error} body="Your changes are still here, so you can try again." />}

        <FormField id="member-name" label="Name" required error={errors.name?.message}>
          {(input) => <input {...input} {...register('name')} autoComplete="off" className={FIELD_INPUT} placeholder="Sam Rivera" />}
        </FormField>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField id="member-role" label="Role">
            {(input) => <input {...input} {...register('role')} className={FIELD_INPUT} placeholder="VP of Engineering" />}
          </FormField>
          <FormField id="member-department" label="Department" required error={errors.department?.message}>
            {(input) => (
              <select {...input} {...register('department')} className={FIELD_INPUT}>
                <option value="" disabled>
                  Pick a department…
                </option>
                {DEPARTMENTS.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            )}
          </FormField>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField id="member-github" label="GitHub" icon={<ProfileIcon site="github" />} error={errors.githubUrl?.message}>
            {(input) => (
              <input
                {...input}
                {...register('githubUrl')}
                type="url"
                inputMode="url"
                className={`${FIELD_INPUT} ${FIELD_INPUT_WITH_ICON}`}
                placeholder="https://github.com/…"
              />
            )}
          </FormField>
          <FormField id="member-linkedin" label="LinkedIn" icon={<ProfileIcon site="linkedin" />} error={errors.linkedinUrl?.message}>
            {(input) => (
              <input
                {...input}
                {...register('linkedinUrl')}
                type="url"
                inputMode="url"
                className={`${FIELD_INPUT} ${FIELD_INPUT_WITH_ICON}`}
                placeholder="https://www.linkedin.com/in/…"
              />
            )}
          </FormField>
        </div>

        <Controller
          control={control}
          name="isPublic"
          render={({ field }) => (
            <Switch
              checked={field.value}
              saving={false}
              label="Show them on the site"
              stateText={field.value ? 'On the site' : 'Hidden'}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:justify-end">
        <ButtonLink to={PATHS.team} variant="quiet" size="small">
          Cancel
        </ButtonLink>
        <Button type="submit" variant="primary" size="small" disabled={saving || !isDirty}>
          {saving ? submit.pending : submit.label}
        </Button>
      </div>

      {leave.state === 'blocked' && (
        <ConfirmDialog
          kind="leave"
          question="Leave without saving?"
          confirmLabel="Leave"
          pendingLabel="Leaving…"
          pending={false}
          error={null}
          onConfirm={() => leave.proceed()}
          onCancel={() => leave.reset()}
        />
      )}
    </form>
  );
}
