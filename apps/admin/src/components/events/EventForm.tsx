/**
 * The form for a new event and for editing one. It checks the fields with `EventFormSchema`, shows problems
 * under each field, and asks before you leave with unsaved changes. Saving is the page's job (`onSave`).
 */
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { useUnsavedChangesWarning } from '../../hooks/useUnsavedChangesWarning';
import { type ChangedFields, EventFormSchema, type EventFormValues } from '../../lib/event-form';
import { PATHS } from '../../paths';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { FormField } from '../ui/FormField';

type EventFormProps = {
  defaultValues: EventFormValues;
  /** The saved time when the picker can't show it (say, "TBD"); it is kept unless a new time is picked. */
  unreadableTime: string | null;
  pictureUrl: string | null;
  submitLabel: string;
  saving: boolean;
  /** Why the last save failed. */
  error: string | null;
  onSave: (values: EventFormValues, changed: ChangedFields) => void;
};

const INPUT =
  'mt-2 block w-full rounded-xl border-2 border-line bg-deep px-4 py-2.5 text-white placeholder:text-muted focus:border-sky aria-invalid:border-orange';

export function EventForm({ defaultValues, unreadableTime, pictureUrl, submitLabel, saving, error, onSave }: EventFormProps) {
  const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(EventFormSchema), defaultValues });
  const { errors, isDirty, dirtyFields } = formState;
  const leave = useUnsavedChangesWarning(isDirty);

  return (
    <form noValidate onSubmit={handleSubmit((values) => onSave(values, dirtyFields))} className="mt-8 grid gap-6">
      <FormField id="event-title" label="Title" error={errors.title?.message}>
        {(input) => <input {...input} {...register('title')} className={INPUT} placeholder="CP312 Midterm Review" />}
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField id="event-date" label="Date" error={errors.date?.message}>
          {(input) => <input {...input} {...register('date')} type="date" className={INPUT} />}
        </FormField>
        <FormField
          id="event-time"
          label="Time"
          hint={unreadableTime && `Saved as "${unreadableTime}". Pick a time to replace it, or leave this empty to keep it.`}
        >
          {(input) => <input {...input} {...register('time')} type="time" className={INPUT} />}
        </FormField>
      </div>

      <FormField id="event-location" label="Location">
        {(input) => <input {...input} {...register('location')} className={INPUT} placeholder="BA110" />}
      </FormField>

      <FormField id="event-description" label="Description">
        {(input) => <textarea {...input} {...register('description')} rows={5} className={INPUT} />}
      </FormField>

      <div>
        <p className="font-display text-lg font-bold">Picture</p>
        {pictureUrl ? (
          <img src={pictureUrl} alt="The event's current picture" className="mt-2 h-32 w-auto rounded-xl object-cover" />
        ) : (
          <p className="mt-2 text-text-2">No picture yet.</p>
        )}
        <p className="mt-1 text-sm text-text-2">Adding and changing pictures comes in a later update.</p>
      </div>

      {error && (
        <p role="alert" className="font-medium text-orange">
          {error} Your changes are still here, so you can try again.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary" disabled={saving || !isDirty}>
          {saving ? 'Saving…' : submitLabel}
        </Button>
        <Link
          to={PATHS.events}
          className="inline-flex min-h-11 items-center rounded-full border-2 border-line px-6 font-display text-lg font-bold text-text-2 hover:border-sky hover:text-sky"
        >
          Cancel
        </Link>
      </div>

      {leave.state === 'blocked' && (
        <ConfirmDialog
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
