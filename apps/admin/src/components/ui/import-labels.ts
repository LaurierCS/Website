/**
 * How an item in a CSV import is marked: new to the list, or an update to one already there. One look per kind,
 * shared by the tickets, the crew badges and the print order, so they always agree.
 */
import type { TagTone } from './Tag';

export type ImportKind = 'new' | 'updated';

type ImportLabel = Readonly<{
  /** The word, said out loud by screen readers even where only the colour shows. */
  text: string;
  /** Background and text colour classes for the label. */
  fill: string;
  /** The `Tag` tone for the word on the print order. */
  tag: TagTone;
}>;

export const IMPORT_LABELS: Readonly<Record<ImportKind, ImportLabel>> = {
  new: { text: 'New', fill: 'bg-pink text-ink', tag: 'added' },
  updated: { text: 'Updated', fill: 'bg-yellow text-ink', tag: 'highlight' },
};
