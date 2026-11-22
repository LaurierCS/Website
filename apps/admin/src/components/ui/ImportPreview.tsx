/**
 * What a CSV import will do, drawn the way the list draws its items: the new ones, then the changed ones with
 * each changed cell under them. Rows that stay the same aren't shown.
 */
import type { ReactNode } from 'react';
import type { ChangedItem, NewItem, ReadyImport } from '../../lib/csv-import';
import { CellChanges } from './CellChanges';

type ImportPreviewProps<Item, Fields> = {
  plan: ReadyImport<Item, Fields>;
  /** What the list holds, plural, e.g. "events", for naming the two groups. */
  many: string;
  renderNew: (item: NewItem<Fields>) => ReactNode;
  renderChanged: (item: ChangedItem<Item, Fields>) => ReactNode;
};

const GROUP_HEADING = 'font-display text-xs font-bold tracking-widest text-text-2 uppercase';

export function ImportPreview<Item, Fields>({ plan, many, renderNew, renderChanged }: ImportPreviewProps<Item, Fields>) {
  return (
    <>
      {plan.added.length > 0 && (
        <section aria-label={`New ${many}`}>
          <h2 className={GROUP_HEADING}>New · {plan.added.length}</h2>
          <ul className="mt-4 grid gap-4">
            {plan.added.map((item) => (
              <li key={item.rowNumber}>{renderNew(item)}</li>
            ))}
          </ul>
        </section>
      )}

      {plan.changed.length > 0 && (
        <section aria-label={`Changed ${many}`}>
          <h2 className={GROUP_HEADING}>Changed · {plan.changed.length}</h2>
          <ul className="mt-4 grid gap-6">
            {plan.changed.map((item) => (
              <li key={item.rowNumber}>
                {renderChanged(item)}
                <CellChanges cells={item.cells} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
