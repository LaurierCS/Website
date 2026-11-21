/**
 * The team form's wording for adding a member and for editing one: the line under the LCS Crew Office sign, the
 * tag saying where they stand, the save button, and what is announced once the badge has been hung on the board.
 * Changing the copy is a change here only.
 */
import type { TagTone } from '../ui/Tag';

type SheetWording = {
  intro: string;
  status: { label: string; tone: TagTone };
  submitLabel: string;
  pendingLabel: string;
  /** Read out while the badge drops onto its lanyard, before Team opens. */
  savedLabel: string;
};

export const MEMBER_SHEETS = {
  new: {
    intro: 'Fill in what you know. Only their name and department are needed.',
    status: { label: 'New crew', tone: 'pending' },
    submitLabel: 'Add member',
    pendingLabel: 'Adding…',
    savedLabel: 'Added to the crew',
  },
  edit: {
    intro: 'Changes go live on lauriercs.org when you save.',
    status: { label: 'On the board', tone: 'info' },
    submitLabel: 'Save changes',
    pendingLabel: 'Saving…',
    savedLabel: 'Saved',
  },
} as const satisfies Record<string, SheetWording>;

export type MemberSheetKind = keyof typeof MEMBER_SHEETS;
