/**
 * What a list hands the CSV import so it can show the list's own items: their names, how each one looks, the
 * fields in its details and the lines on the print order. Events give tickets and the team gives crew badges;
 * a new list to import into gives one more of these.
 */
import type { ReactNode } from 'react';
import type { ChangedItem, NewItem, ReadyImport } from '../../lib/csv/csv-import';
import type { FieldChange } from './FieldChanges';

/** One item the import adds or updates. Its `kind` is an `ImportKind`, so it picks the item's label. */
export type ImportEntry<Item, Fields> =
  | Readonly<{ kind: 'new'; rowNumber: number; item: NewItem<Fields> }>
  | Readonly<{ kind: 'updated'; rowNumber: number; item: ChangedItem<Item, Fields> }>;

/** A line under an item on the print order, like "date → Sat, Nov 21". */
export type OrderItem = Readonly<{ label: string; value: string }>;

/** What a list holds, for counts: "1 event", "3 events". */
export type Noun = Readonly<{ one: string; many: string }>;

export type ImportView<Item, Fields> = Readonly<{
  noun: Noun;
  /** What one item is drawn as, for "Press a ticket to see all of it". */
  piece: string;
  /** `rows` for wide items like tickets, `cards` for a grid like the crew board. */
  arrangement: 'rows' | 'cards';
  /** The item's name, like an event's title. */
  nameOf: (entry: ImportEntry<Item, Fields>) => string;
  /** The item as its list draws it, with its new or updated label. */
  front: (entry: ImportEntry<Item, Fields>) => ReactNode;
  /** Every field for its details; `long` is a field with a lot of text, like a description. */
  fields: (entry: ImportEntry<Item, Fields>) => Readonly<{ short: readonly FieldChange[]; long?: FieldChange }>;
  /** The lines under it on the print order. */
  orderItems: (entry: ImportEntry<Item, Fields>) => readonly OrderItem[];
}>;

/** The items a ready import adds and updates, in the file's order. */
export function entriesOf<Item, Fields>(plan: ReadyImport<Item, Fields>): readonly ImportEntry<Item, Fields>[] {
  const entries: ImportEntry<Item, Fields>[] = [
    ...plan.added.map((item) => ({ kind: 'new' as const, rowNumber: item.rowNumber, item })),
    ...plan.changed.map((item) => ({ kind: 'updated' as const, rowNumber: item.rowNumber, item })),
  ];
  return entries.sort((a, b) => a.rowNumber - b.rowNumber);
}

/** The id of an item's place on the page, so its line on the print order can link to it. */
export function rowAnchor(rowNumber: number): string {
  return `import-row-${rowNumber}`;
}

/** "1 event", "3 events". */
export function countOf(howMany: number, noun: Noun): string {
  return `${howMany} ${howMany === 1 ? noun.one : noun.many}`;
}

/** What an import does, e.g. "2 new events and 1 updated event". */
export function importSummary(plan: ReadyImport<unknown, unknown>, noun: Noun): string {
  const parts = [
    ...(plan.added.length > 0 ? [`${plan.added.length} new ${plan.added.length === 1 ? noun.one : noun.many}`] : []),
    ...(plan.changed.length > 0 ? [`${plan.changed.length} updated ${plan.changed.length === 1 ? noun.one : noun.many}`] : []),
  ];
  return parts.join(' and ');
}
