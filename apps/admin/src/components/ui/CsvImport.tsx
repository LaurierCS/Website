/**
 * Importing a CSV file into a list, as a print order at the LCS Print Shop: choose a file, and the order lists
 * every row it adds or updates while the items come out of the press beside it, drawn the way the list draws
 * them. Nothing is saved until Import is pressed, and a file with any problem comes back "Sent back" with the
 * problems by row. A new list to import into is a format, an `ImportView` and a page.
 */
import { Check } from 'lucide-react';
import { useState } from 'react';
import type { CsvFormat } from '../../lib/csv/csv-formats';
import { type ImportPlan, planImportFile, type ReadyImport } from '../../lib/csv/csv-import';
import { messageFor } from '../../lib/server/errors';
import { Button } from './Button';
import { ButtonLink } from './ButtonLink';
import { CsvFilePicker } from './CsvFilePicker';
import { ErrorBanner } from './ErrorBanner';
import { ImportPreview } from './ImportPreview';
import { countOf, entriesOf, importSummary, type ImportView, rowAnchor } from './import-view';
import { OrderLines } from './OrderLines';
import { OrderRule } from './OrderRule';
import { OrderTotal } from './OrderTotal';
import { PrintOrder } from './PrintOrder';
import { SentBackOrder } from './SentBackOrder';

/** Saving the import, as a TanStack Query mutation reports it. */
type ImportSaver<Item, Fields> = Readonly<{
  status: 'idle' | 'pending' | 'error' | 'success';
  error: Error | null;
  mutate: (plan: ReadyImport<Item, Fields>) => void;
  reset: () => void;
}>;

type CsvImportProps<Column extends string, Item extends Readonly<{ id: string }>, Fields extends Partial<Item>> = {
  format: CsvFormat<Column, Item, Fields>;
  /** The list as it is saved now, which the file is checked against. */
  saved: readonly Item[];
  view: ImportView<Item, Fields>;
  saver: ImportSaver<Item, Fields>;
  /** The list's page and name, for the link back once it's imported. */
  back: Readonly<{ to: string; section: string }>;
};

type Checked<Item, Fields> = Readonly<{ fileName: string; plan: ImportPlan<Item, Fields> }>;

// The order sits beside the press only on a screen wide enough to leave the tickets their wide layout;
// anything narrower stacks it on top, so a ticket beside the order is never a phone ticket.
const COUNTER = 'grid gap-8 xl:grid-cols-[22rem_minmax(0,1fr)] xl:items-start';

export function CsvImport<Column extends string, Item extends Readonly<{ id: string }>, Fields extends Partial<Item>>({
  format,
  saved,
  view,
  saver,
  back,
}: CsvImportProps<Column, Item, Fields>) {
  const [checked, setChecked] = useState<Checked<Item, Fields> | null>(null);
  const importing = saver.status === 'pending';

  async function check(file: File) {
    saver.reset();
    setChecked({ fileName: file.name, plan: await planImportFile(format, file, saved) });
  }
  const picker = (label: string, variant: 'primary' | 'ghost') => (
    // `check` turns every outcome into a plan to show, so there is nothing left to handle here.
    <CsvFilePicker label={label} variant={variant} disabled={importing} onPick={(file) => void check(file)} />
  );

  if (checked === null) {
    return (
      <div className="grid justify-items-start gap-4">
        <p className="max-w-prose text-text-2">
          Start from a file exported from this page. A row with an id updates that {view.noun.one}, and a row with an
          empty id adds a new one. Nothing is deleted, and nothing is saved until you press Import.
        </p>
        {picker('Choose a CSV file', 'primary')}
      </div>
    );
  }

  const { fileName, plan } = checked;
  if (plan.status === 'problems') {
    return (
      <div className={COUNTER}>
        <SentBackOrder fileName={fileName} problems={plan.problems} picker={picker('Choose the file again', 'primary')} />
      </div>
    );
  }

  const entries = entriesOf(plan);
  if (entries.length === 0) {
    return (
      <div className={COUNTER}>
        <PrintOrder fileName={fileName}>
          <p className="text-sm">Every row matches what's saved, so there is nothing to print.</p>
          {picker('Choose another file', 'ghost')}
        </PrintOrder>
      </div>
    );
  }

  const issued = saver.status === 'success';
  const lines = entries.map((entry) => ({
    rowNumber: entry.rowNumber,
    name: view.nameOf(entry),
    kind: entry.kind,
    items: view.orderItems(entry),
    href: `#${rowAnchor(entry.rowNumber)}`,
  }));

  return (
    <div className={`${COUNTER} max-xl:pb-24`}>
      <PrintOrder fileName={fileName}>
        <OrderLines lines={lines} unchanged={plan.unchanged} />
        <OrderRule />
        <OrderTotal label="To print" value={importSummary(plan, view.noun)} />
        {issued ? (
          <div role="status" className="grid gap-3">
            <p className="flex items-start gap-2 font-display text-lg font-extrabold">
              <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-blue-ink" strokeWidth={3} />
              Imported {importSummary(plan, view.noun)}.
            </p>
            <ButtonLink to={back.to} variant="primary" size="small">
              Back to {back.section}
            </ButtonLink>
            {picker('Import another file', 'ghost')}
          </div>
        ) : (
          <>
            {saver.status === 'error' && <ErrorBanner title={messageFor(saver.error)} body="Check your connection, then press Import again." />}
            {/* With the order on top, Import stays in reach at the bottom of the screen while the tickets scroll. */}
            <div className="grid gap-3 max-xl:fixed max-xl:inset-x-0 max-xl:bottom-0 max-xl:z-10 max-xl:grid-cols-[minmax(0,1fr)_auto] max-xl:items-center max-xl:border-t max-xl:border-line max-xl:bg-deep max-xl:px-4 max-xl:py-3">
              <p className="font-display text-white xl:hidden">
                <span className="block font-extrabold">{countOf(plan.added.length + plan.changed.length, view.noun)} to print</span>
                <span className="text-sm text-text-2">{importSummary(plan, view.noun)}</span>
              </p>
              <Button variant="primary" size="small" disabled={importing} onClick={() => saver.mutate(plan)}>
                {importing ? 'Importing…' : `Import ${countOf(plan.added.length + plan.changed.length, view.noun)}`}
              </Button>
            </div>
            {picker('Choose another file', 'ghost')}
            <p className="text-center text-xs text-ink-2">Nothing is saved until you press Import.</p>
          </>
        )}
      </PrintOrder>

      <section aria-label={`What the import ${issued ? 'issued' : 'will print'}`} className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2 font-display text-xs font-bold tracking-widest text-text-2 uppercase">
          <h2>Out of the press</h2>
          {!issued && (
            <p className="normal-case tracking-normal">Press a {view.piece} to see all of it</p>
          )}
        </div>
        <ImportPreview entries={entries} view={view} issued={issued} />
      </section>
    </div>
  );
}

