/**
 * Why a CSV file can't be imported, printed on the order that was sent back: every problem by the row a
 * spreadsheet shows, so they can all be fixed in one go.
 */
import type { ImportProblem } from '../../lib/csv/csv-import';

export function ImportProblems({ problems }: { problems: readonly ImportProblem[] }) {
  return (
    <ul className="grid gap-2.5 text-sm">
      {problems.map(({ rowNumber, message }, index) => (
        // Problems have no id of their own, and one row can have several.
        <li key={index} className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-2">
          <span className="font-display font-bold text-danger-ink">{rowNumber === null ? 'File' : `Row ${rowNumber}`}</span>
          {/* A space between the two, so a screen reader says "Row 4, Give the event a title." */}{' '}
          <span>{message}</span>
        </li>
      ))}
    </ul>
  );
}
