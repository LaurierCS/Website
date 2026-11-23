/**
 * The rows on a print order, itemised like a till receipt: each new or updated item by its row in the file, with
 * what changes on it branching off underneath. Each row links down to its ticket or badge.
 */
import { IMPORT_LABELS, type ImportKind } from './import-labels';
import type { OrderItem } from './import-view';
import { Tag } from './Tag';

export type OrderLine = Readonly<{
  rowNumber: number;
  name: string;
  kind: ImportKind;
  items: readonly OrderItem[];
  /** Where the item's ticket or badge is on the page. */
  href: string;
}>;

// The tree is drawn with borders rather than "├" and "╰", which the brand fonts don't have: a branch for each
// item and a rounded elbow for the last one.
const BRANCH =
  'relative pl-5 before:absolute before:inset-y-0 before:left-1 before:border-l-2 before:border-ink-2 after:absolute after:top-1/2 after:left-1 after:w-2.5 after:border-t-2 after:border-ink-2';
const LAST_BRANCH =
  'relative pl-5 before:absolute before:top-0 before:left-1 before:h-1/2 before:w-2.5 before:rounded-bl-md before:border-b-2 before:border-l-2 before:border-ink-2';

type OrderLinesProps = {
  lines: readonly OrderLine[];
  /** How many rows in the file match what's saved. */
  unchanged: number;
};

export function OrderLines({ lines, unchanged }: OrderLinesProps) {
  return (
    <ul className="grid gap-2.5">
      {lines.map((line) => (
        <li key={line.rowNumber}>
          <a
            href={line.href}
            className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-2 rounded-sm transition-colors duration-150 hover:bg-ink/5"
          >
            {/* Spaces between the parts, so a screen reader says "Row 2 Hack Night Updated". */}
            <span className="font-display text-sm font-bold text-ink-2">Row {line.rowNumber}</span>{' '}
            <span className="truncate text-sm">{line.name}</span>{' '}
            <Tag tone={IMPORT_LABELS[line.kind].tag}>{IMPORT_LABELS[line.kind].text}</Tag>
          </a>
          {line.items.length > 0 && (
            <ul className="mt-1 ml-16 text-xs text-ink-2">
              {line.items.map((item, index) => (
                <li key={item.label} className={`py-0.5 ${index === line.items.length - 1 ? LAST_BRANCH : BRANCH}`}>
                  {item.label} {item.value && <span className="font-display font-bold text-ink">{item.value}</span>}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
      {unchanged > 0 && (
        <li className="text-sm text-ink-2">
          {unchanged} {unchanged === 1 ? 'row matches' : 'rows match'} what's saved
        </li>
      )}
    </ul>
  );
}
