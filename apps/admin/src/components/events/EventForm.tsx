/**
 * The form for a new event and for editing one, picture included: a job sheet at the LCS Print Shop, with the
 * ticket printer beside it showing the event's ticket as it is typed. It checks the fields with
 * `EventFormSchema`, shows problems under each field, and asks before you leave with unsaved changes. Saving is
 * the page's job (`onSave`); once it works the page sets `whenStamped`, the ticket is stamped, and that runs.
 */
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useShownPicture } from '../../hooks/useShownPicture';
import { useUnsavedChangesWarning } from '../../hooks/useUnsavedChangesWarning';
import { clubToday } from '../../lib/dates';
import { type ChangedFields, EventFormSchema, type EventFormValues, ticketPreview } from '../../lib/event-form';
import type { PictureChange } from '../../lib/images';
import { PATHS } from '../../paths';
import { Button } from '../ui/Button';
import { ButtonLink } from '../ui/ButtonLink';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { ErrorBanner } from '../ui/ErrorBanner';
import { FIELD_INPUT, FIELD_INPUT_WITH_ICON } from '../ui/field-styles';
import { FormField } from '../ui/FormField';
import { PictureField } from '../ui/PictureField';
import { SignedSheet } from '../ui/SignedSheet';
import { EVENT_SHEETS, type EventSheetKind } from './event-sheets';
import { TicketPrinter } from './TicketPrinter';

type EventFormProps = {
  /** Adding an event or editing one; it picks the wording in `EVENT_SHEETS`. */
  kind: EventSheetKind;
  defaultValues: EventFormValues;
  /** The saved time when the picker can't show it (say, "TBD"); it is kept unless a new time is picked. */
  unreadableTime: string | null;
  /** The picture saved now, if any. */
  pictureUrl: string | null;
  saving: boolean;
  /** Why the last save failed. */
  error: string | null;
  onSave: (values: EventFormValues, changed: ChangedFields, picture: PictureChange) => void;
  /** Set by the page once saving has worked: the ticket is stamped, then this runs. Null until then. */
  whenStamped: (() => void) | null;
};

export function EventForm({ kind, defaultValues, unreadableTime, pictureUrl, saving, error, onSave, whenStamped }: EventFormProps) {
  const { register, handleSubmit, formState, control } = useForm({ resolver: zodResolver(EventFormSchema), defaultValues });
  // Every field the ticket is built from, kept up to date as they are typed.
  const [title, date, time, location, description] = useWatch({
    control,
    name: ['title', 'date', 'time', 'location', 'description'],
  });
  const { errors, isDirty, dirtyFields } = formState;
  // The picture is a file, not text, so it lives beside the text fields rather than in React Hook Form.
  const [picture, setPicture] = useState<PictureChange>({ kind: 'keep' });
  const shownPicture = useShownPicture(pictureUrl, picture);
  const hasChanges = isDirty || picture.kind !== 'keep';
  const leave = useUnsavedChangesWarning(hasChanges);
  const sheet = EVENT_SHEETS[kind];
  const ticket = ticketPreview({ title, date, time, location, description }, unreadableTime, shownPicture, clubToday());
  const busy = saving || whenStamped !== null;

  return (
    <form noValidate onSubmit={handleSubmit((values) => onSave(values, dirtyFields, picture))}>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <SignedSheet sign="LCS Print Shop" accent="yellow" intro={sheet.intro} status={sheet.status}>
          <div className="grid gap-6">
            {error && <ErrorBanner title={error} body="Your changes are still here, so you can try again." />}

            <FormField id="event-title" label="Title" required error={errors.title?.message}>
              {(input) => <input {...input} {...register('title')} className={FIELD_INPUT} placeholder="What is it called?" />}
            </FormField>

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField id="event-date" label="Date" required error={errors.date?.message}>
                {(input) => <input {...input} {...register('date')} type="date" className={FIELD_INPUT} />}
              </FormField>
              <FormField
                id="event-time"
                label="Time"
                hint={unreadableTime && `Saved as "${unreadableTime}". Pick a time to replace it, or leave this empty to keep it.`}
              >
                {(input) => <input {...input} {...register('time')} type="time" className={FIELD_INPUT} />}
              </FormField>
            </div>

            <FormField id="event-location" label="Location" icon={<MapPin className="size-5" />}>
              {(input) => (
                <input
                  {...input}
                  {...register('location')}
                  className={`${FIELD_INPUT} ${FIELD_INPUT_WITH_ICON}`}
                  placeholder='Empty = "Location TBA"'
                />
              )}
            </FormField>

            <FormField id="event-description" label="Description">
              {(input) => (
                <textarea {...input} {...register('description')} rows={5} className={FIELD_INPUT} placeholder="What should people know?" />
              )}
            </FormField>

            <PictureField
              id="event-picture"
              label="Cover picture"
              currentUrl={pictureUrl}
              shownUrl={shownPicture}
              value={picture}
              onChange={setPicture}
            />
          </div>
        </SignedSheet>

        {/* Stays in view beside a long form on a computer, so the ticket can be watched while typing. */}
        <div className="lg:sticky lg:top-6">
          <TicketPrinter
            face={ticket.face}
            status={ticket.status}
            stamp={whenStamped && { text: sheet.stamp, onStamped: whenStamped }}
          />
        </div>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:justify-end">
        <ButtonLink to={PATHS.events} variant="quiet" size="small">
          Cancel
        </ButtonLink>
        <Button type="submit" variant="primary" size="small" disabled={busy || !hasChanges}>
          {busy ? sheet.pendingLabel : sheet.submitLabel}
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
