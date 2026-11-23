/**
 * Every field of an item in a CSV import, showing what the import does to each: a value that stays is grey, an
 * old value is struck through and the new one highlighted, and everything on a new item is plain white. The
 * long field, when the item has one (an event's description), shows its change word by word.
 */
import { TextDiff } from './TextDiff';

/** One field: what it says now (null on a new item, which has nothing to compare) and after the import. */
export type FieldChange = Readonly<{ label: string; before: string | null; after: string }>;

const LABEL = 'font-display text-xs font-extrabold tracking-widest text-muted uppercase';

type FieldChangesProps = {
  short: readonly FieldChange[];
  long?: FieldChange;
};

export function FieldChanges({ short, long }: FieldChangesProps) {
  return (
    <div className="grid gap-4">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        {short.map((field) => (
          <div key={field.label} className="grid gap-0.5">
            <dt className={LABEL}>{field.label}</dt>
            <dd className="font-display text-base font-bold break-words">
              <ShortValue field={field} />
            </dd>
          </div>
        ))}
      </dl>
      {long && (
        <div className="grid gap-1">
          <p className={LABEL}>{long.label}</p>
          <p className="text-sm leading-relaxed text-muted">
            {long.before === null ? <span className="text-white">{long.after}</span> : <TextDiff before={long.before} after={long.after} />}
          </p>
        </div>
      )}
    </div>
  );
}

function ShortValue({ field }: { field: FieldChange }) {
  if (field.before === null) return <span className="text-white">{field.after}</span>;
  if (field.before === field.after) return <span className="text-muted">{field.after}</span>;
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <del className="text-muted">{field.before}</del>
      <ins className="rounded-sm bg-yellow px-1.5 font-extrabold text-ink no-underline">{field.after}</ins>
    </span>
  );
}
