/**
 * Checking a CSV file against what is saved, before anything is saved: which rows are new, which change a saved
 * item and how, and which are the same. A row with an empty id is new, a known id changes that item, and an id
 * nothing saved has is a problem. Items missing from the file are left alone. Any problem means nothing is
 * imported, so the plan is either the problems or the changes, never both.
 */
import { readCsv } from './csv';
import type { CsvFormat } from './csv-formats';

/** Something wrong with the file. `rowNumber` is the row as a spreadsheet numbers it; null for the whole file. */
export type ImportProblem = Readonly<{ rowNumber: number | null; message: string }>;

/** A cell that will change, as it is written in the file now and after the import. */
export type CellChange = Readonly<{ column: string; before: string; after: string }>;

export type NewItem<Fields> = Readonly<{ rowNumber: number; fields: Fields }>;

export type ChangedItem<Item, Fields> = Readonly<{
  rowNumber: number;
  before: Item;
  after: Item;
  /** Every field, as the import saves them. */
  fields: Fields;
  cells: readonly CellChange[];
}>;

/** A file with no problems: what importing it would add and change. */
export type ReadyImport<Item, Fields> = Readonly<{
  status: 'ready';
  added: readonly NewItem<Fields>[];
  changed: readonly ChangedItem<Item, Fields>[];
  /** Rows that match what is saved, so the import leaves them as they are. */
  unchanged: number;
}>;

export type ImportPlan<Item, Fields> =
  | Readonly<{ status: 'problems'; problems: readonly ImportProblem[] }>
  | ReadyImport<Item, Fields>;

/** What the database saves for an import: the new rows, and every field of each changed one with its id. */
export type ImportRows<Fields> = Readonly<{
  added: readonly Fields[];
  changed: readonly Readonly<{ id: string; fields: Fields }>[];
}>;

/** Club lists are a few hundred rows at most; a bigger file is the wrong file. */
const MAX_FILE_BYTES = 1_000_000;

/** What importing `file` would do to `saved`, the items as they are now. */
export async function planImportFile<Column extends string, Item extends Readonly<{ id: string }>, Fields extends Partial<Item>>(
  format: CsvFormat<Column, Item, Fields>,
  file: File,
  saved: readonly Item[],
): Promise<ImportPlan<Item, Fields>> {
  if (file.size > MAX_FILE_BYTES) {
    return problemsOnly([{ rowNumber: null, message: 'This file is over 1 MB, which is far bigger than a club list. Check it is the right file.' }]);
  }
  let text: string;
  try {
    text = await file.text();
  } catch {
    // The browser couldn't read the file, e.g. it was moved or deleted after it was chosen.
    return problemsOnly([{ rowNumber: null, message: "This file couldn't be opened. Choose it again." }]);
  }
  return planImport(format, text, saved);
}

/** The rows a ready import saves. */
export function rowsToSave<Item extends Readonly<{ id: string }>, Fields>(plan: ReadyImport<Item, Fields>): ImportRows<Fields> {
  return {
    added: plan.added.map(({ fields }) => fields),
    changed: plan.changed.map(({ before, fields }) => ({ id: before.id, fields })),
  };
}

/** What importing `text` would do to `saved`, the items as they are now. */
export function planImport<Column extends string, Item extends Readonly<{ id: string }>, Fields extends Partial<Item>>(
  format: CsvFormat<Column, Item, Fields>,
  text: string,
  saved: readonly Item[],
): ImportPlan<Item, Fields> {
  const file = readCsv(text);
  if (file.status === 'unreadable') {
    return problemsOnly([{ rowNumber: file.rowNumber, message: 'A quote (") in this row is never closed, so the file can\'t be read.' }]);
  }
  const headerProblems = checkHeader(file.header, format.columns);
  if (headerProblems.length > 0) return problemsOnly(headerProblems);

  const savedById = new Map(saved.map((item) => [item.id, item]));
  const firstRowWithId = new Map<string, number>();
  const problems: ImportProblem[] = [];
  const added: NewItem<Fields>[] = [];
  const changed: ChangedItem<Item, Fields>[] = [];
  let unchanged = 0;

  for (const { number: rowNumber, cells } of file.rows) {
    const problem = (message: string) => {
      problems.push({ rowNumber, message });
    };
    if (cells.length > file.header.length && cells.slice(file.header.length).some((cell) => cell.trim() !== '')) {
      problem('This row has more cells than the file has columns.');
      continue;
    }
    // The header was checked to have every column, so each one has a place; a short row reads as empty there.
    const cell = (column: string) => cells[file.header.indexOf(column)] ?? '';

    const id = cell('id').trim();
    const before = id === '' ? null : (savedById.get(id) ?? null);
    if (id !== '' && before === null) {
      problem('Nothing saved has this id. Leave the id empty to add it as new.');
      continue;
    }
    const sameId = firstRowWithId.get(id);
    if (id !== '' && sameId !== undefined) {
      problem(`Row ${sameId} has the same id. Each saved item can only be in the file once.`);
      continue;
    }
    if (id !== '') firstRowWithId.set(id, rowNumber);

    const result = format.fromRow(cell, before);
    if (!result.ok) {
      for (const message of result.problems) problem(message);
      continue;
    }
    if (before === null) {
      added.push({ rowNumber, fields: result.fields });
      continue;
    }
    const after: Item = { ...before, ...result.fields };
    const cellChanges = changedCells(format, before, after);
    if (cellChanges.length === 0) unchanged += 1;
    else changed.push({ rowNumber, before, after, fields: result.fields, cells: cellChanges });
  }

  return problems.length > 0 ? problemsOnly(problems) : { status: 'ready', added, changed, unchanged };
}

function problemsOnly(problems: readonly ImportProblem[]): ImportPlan<never, never> {
  return { status: 'problems', problems };
}

/** The file must have exactly the export's columns, in any order, each once. */
function checkHeader(header: readonly string[], columns: readonly string[]): ImportProblem[] {
  const missing = columns.filter((column) => !header.includes(column));
  const unknown = header.filter((column) => column !== '' && !columns.includes(column));
  const twice = columns.filter((column) => header.indexOf(column) !== header.lastIndexOf(column));
  return [
    ...(missing.length > 0 ? [`The file is missing the columns: ${missing.join(', ')}. Start from an exported file.`] : []),
    ...(unknown.length > 0 ? [`The file has columns the import doesn't use: ${unknown.join(', ')}. Remove them or start from an exported file.`] : []),
    ...twice.map((column) => `The column ${column} appears more than once.`),
  ].map((message) => ({ rowNumber: null, message }));
}

/** The cells that differ between an item now and after the import, written as the export writes them. */
function changedCells<Column extends string, Item>(format: CsvFormat<Column, Item, unknown>, before: Item, after: Item): CellChange[] {
  const was = format.toRow(before);
  const will = format.toRow(after);
  return format.columns.filter((column) => was[column] !== will[column]).map((column) => ({ column, before: was[column], after: will[column] }));
}
