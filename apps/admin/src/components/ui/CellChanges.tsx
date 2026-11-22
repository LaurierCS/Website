/**
 * What an import changes on one saved item: each changed column, what it says now and what it will say.
 */
import type { CellChange } from '../../lib/csv-import';

export function CellChanges({ cells }: { cells: readonly CellChange[] }) {
  return (
    <dl className="mt-3 grid gap-1.5 text-sm">
      {cells.map(({ column, before, after }) => (
        <div key={column} className="flex flex-wrap gap-x-2">
          <dt className="font-display font-bold text-text-2">{column}</dt>
          <dd>
            <del className="text-text-2">{before || 'empty'}</del>
            <span aria-hidden="true"> → </span>
            <span className="sr-only"> becomes </span>
            <ins className="font-semibold no-underline">{after || 'empty'}</ins>
          </dd>
        </div>
      ))}
    </dl>
  );
}
