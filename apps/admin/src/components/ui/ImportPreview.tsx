/**
 * What a CSV import will print, coming out of the press: every new and updated item drawn the way its list draws
 * it. Pressing one opens all its fields in a sheet, showing what the import changes. Once imported, every item
 * gets the "Issued" stamp.
 */
import { useState } from 'react';
import { FieldChanges } from './FieldChanges';
import { IMPORT_LABELS } from './import-labels';
import { type ImportEntry, type ImportView, rowAnchor } from './import-view';
import { Sheet } from './Sheet';
import { Stamp } from './Stamp';
import { Tag } from './Tag';

const ARRANGEMENTS = {
  rows: { list: 'grid gap-5', stamp: 'top-1/2 right-6 -translate-y-1/2' },
  cards: { list: 'grid gap-5 sm:grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]', stamp: 'top-14 right-3' },
} as const;

type ImportPreviewProps<Item, Fields> = {
  entries: readonly ImportEntry<Item, Fields>[];
  view: ImportView<Item, Fields>;
  /** Once the import is saved: just the items with their stamp, nothing to open. */
  issued: boolean;
};

export function ImportPreview<Item, Fields>({ entries, view, issued }: ImportPreviewProps<Item, Fields>) {
  const [open, setOpen] = useState<ImportEntry<Item, Fields> | null>(null);
  const arrangement = ARRANGEMENTS[view.arrangement];

  return (
    <>
      <ul className={arrangement.list}>
        {entries.map((entry) => (
          <li key={entry.rowNumber} id={rowAnchor(entry.rowNumber)} className="relative scroll-mt-6">
            {view.front(entry)}
            {issued ? (
              <div className={`absolute ${arrangement.stamp}`}>
                <Stamp text="Issued" tone="issued" />
              </div>
            ) : (
              // Covers the whole item, so anywhere on it works, while its own headings stay headings.
              <button
                type="button"
                aria-label={`${view.nameOf(entry)}: show the details`}
                onClick={() => setOpen(entry)}
                className="absolute inset-0 cursor-pointer rounded-card transition-colors duration-150 hover:bg-white/5"
              />
            )}
          </li>
        ))}
      </ul>
      {open && (
        <Sheet
          kicker={<Kicker entry={open} />}
          title={view.nameOf(open)}
          closeLabel={`Back to the ${view.noun.many}`}
          onClose={() => setOpen(null)}
        >
          <FieldChanges {...view.fields(open)} />
        </Sheet>
      )}
    </>
  );
}

/** "UPDATED · Row 3" above the details. */
function Kicker<Item, Fields>({ entry }: { entry: ImportEntry<Item, Fields> }) {
  const label = IMPORT_LABELS[entry.kind];
  return (
    <>
      <Tag tone={label.tag}>{label.text}</Tag> Row {entry.rowNumber}
    </>
  );
}
