/**
 * The icon for each kind of resource, on the laptop's tabs and the list beside it. They draw in `currentColor`.
 */
import github from '../../assets/icons/github.svg';
import notes from '../../assets/icons/notes.svg';
import youtube from '../../assets/icons/youtube.svg';
import type { ResourceKind } from '../../content/resources';

export const RESOURCE_ICONS = { recording: youtube, practice: notes, starter: github } as const satisfies Record<
  ResourceKind,
  unknown
>;

/** Each kind's colour beside the laptop, so the list reads like the tabs. */
export const RESOURCE_TINT: Readonly<Record<ResourceKind, string>> = {
  recording: 'text-pink',
  practice: 'text-sky',
  starter: 'text-white',
};
