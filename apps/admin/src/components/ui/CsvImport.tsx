/**
 * Importing a CSV file into a list: choose a file, see what it would add and change, then import all of it or
 * none. Nothing is saved until Import is pressed, and a file with any problem can't be imported. `renderNew` and
 * `renderChanged` draw each row the way its list does (a ticket, a crew badge), so the preview looks like the
 * result. A new list to import into is a format, two render functions and a page.
 */
import { Check } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import type { CsvFormat } from '../../lib/csv-formats';
import { type ChangedItem, type ImportPlan, type NewItem, planImportFile, type ReadyImport } from '../../lib/csv-import';
import { messageFor } from '../../lib/errors';
import { Button } from './Button';
import { ButtonLink } from './ButtonLink';
import { CsvFilePicker } from './CsvFilePicker';
import { ErrorBanner } from './ErrorBanner';
import { ImportPreview } from './ImportPreview';
import { ImportProblems } from './ImportProblems';

/** Saving the import, as a TanStack Query mutation reports it. */
type ImportSaver<Item, Fields> = Readonly<{
  status: 'idle' | 'pending' | 'error' | 'success';
  error: Error | null;
  mutate: (plan: ReadyImport<Item, Fields>) => void;
  reset: () => void;
}>;

/** What the list holds, for counts: "1 event", "3 events". */
type Noun = Readonly<{ one: string; many: string }>;

type CsvImportProps<Column extends string, Item extends Readonly<{ id: string }>, Fields extends Partial<Item>> = {
  format: CsvFormat<Column, Item, Fields>;
  /** The list as it is saved now, which the file is checked against. */
  saved: readonly Item[];
  noun: Noun;
  saver: ImportSaver<Item, Fields>;
  /** The list's page and name, for the link back once it's imported. */
  back: Readonly<{ to: string; section: string }>;
  renderNew: (item: NewItem<Fields>) => ReactNode;
  renderChanged: (item: ChangedItem<Item, Fields>) => ReactNode;
};

type Checked<Item, Fields> = Readonly<{ fileName: string; plan: ImportPlan<Item, Fields> }>;

export function CsvImport<Column extends string, Item extends Readonly<{ id: string }>, Fields extends Partial<Item>>({
  format,
  saved,
  noun,
  saver,
  back,
  renderNew,
  renderChanged,
}: CsvImportProps<Column, Item, Fields>) {
  const [checked, setChecked] = useState<Checked<Item, Fields> | null>(null);
  const importing = saver.status === 'pending';

  async function check(file: File) {
    saver.reset();
    setChecked({ fileName: file.name, plan: await planImportFile(format, file, saved) });
  }
  const picker = (label: string) => (
    // `check` turns every outcome into a plan to show, so there is nothing left to handle here.
    <CsvFilePicker label={label} variant={checked ? 'quiet' : 'primary'} disabled={importing} onPick={(file) => void check(file)} />
  );

  if (checked === null) {
    return (
      <div className="grid justify-items-start gap-4">
        <p className="max-w-prose text-text-2">
          Start from a file exported from this page. A row with an id changes that {noun.one}, and a row with an empty
          id adds a new one. Nothing is deleted, and nothing is saved until you press Import.
        </p>
        {picker('Choose a CSV file')}
      </div>
    );
  }

  const { fileName, plan } = checked;
  if (plan.status === 'problems') {
    return (
      <div className="grid justify-items-start gap-4">
        <ImportProblems fileName={fileName} problems={plan.problems} />
        {picker('Choose the file again')}
      </div>
    );
  }

  const changes = summary(plan, noun);
  if (changes === null) {
    return (
      <div className="grid justify-items-start gap-4">
        <p className="text-xl font-bold">Nothing to import. Every row in {fileName} matches what's saved.</p>
        {picker('Choose another file')}
      </div>
    );
  }

  if (saver.status === 'success') {
    return (
      <div role="status" className="grid justify-items-start gap-4">
        <p className="flex items-center gap-2 text-2xl font-extrabold">
          <Check aria-hidden="true" className="size-6 text-sky" strokeWidth={3} />
          Imported {changes}.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to={back.to} variant="primary" size="small">
            Back to {back.section}
          </ButtonLink>
          {picker('Import another file')}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <div className="grid justify-items-start gap-4">
        <p className="text-xl font-bold">
          {fileName}: {changes}.{plan.unchanged > 0 && ` ${count(plan.unchanged, noun)} stay as they are.`}
        </p>
        {saver.status === 'error' && <ErrorBanner title={messageFor(saver.error)} body="Check your connection, then press Import again." />}
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="small" disabled={importing} onClick={() => saver.mutate(plan)}>
            {importing ? 'Importing…' : `Import ${count(plan.added.length + plan.changed.length, noun)}`}
          </Button>
          {picker('Choose another file')}
        </div>
      </div>
      <ImportPreview plan={plan} many={noun.many} renderNew={renderNew} renderChanged={renderChanged} />
    </div>
  );
}

/** "1 event", "3 events". */
function count(howMany: number, noun: Noun): string {
  return `${howMany} ${howMany === 1 ? noun.one : noun.many}`;
}

/** "2 new events and 1 changed event", or null when the file changes nothing. */
function summary(plan: ReadyImport<unknown, unknown>, noun: Noun): string | null {
  const parts = [
    ...(plan.added.length > 0 ? [`${plan.added.length} new ${plan.added.length === 1 ? noun.one : noun.many}`] : []),
    ...(plan.changed.length > 0 ? [`${plan.changed.length} changed ${plan.changed.length === 1 ? noun.one : noun.many}`] : []),
  ];
  return parts.length > 0 ? parts.join(' and ') : null;
}
