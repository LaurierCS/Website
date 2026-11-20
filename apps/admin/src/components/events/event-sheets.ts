/**
 * The event form's wording for adding an event and for editing one: the line under the LCS Print Shop sign, the
 * tag saying whether it is on the site, the save button, and what the stamp says once saving has worked.
 * Changing the copy is a change here only.
 */
import type { TagTone } from '../ui/Tag';

type SheetWording = {
  intro: string;
  status: { label: string; tone: TagTone };
  submitLabel: string;
  pendingLabel: string;
  stamp: string;
};

export const EVENT_SHEETS = {
  new: {
    intro: 'Fill in what you know. Only the title and day are needed.',
    status: { label: 'Not on the site yet', tone: 'pending' },
    submitLabel: 'Create event',
    pendingLabel: 'Creating…',
    stamp: 'Issued',
  },
  edit: {
    intro: 'Changes go live on lauriercs.org when you save.',
    status: { label: 'On the site', tone: 'info' },
    submitLabel: 'Save changes',
    pendingLabel: 'Saving…',
    stamp: 'Reissued',
  },
} as const satisfies Record<string, SheetWording>;

export type EventSheetKind = keyof typeof EVENT_SHEETS;
