/**
 * Writing CSV files that open cleanly in Excel and Google Sheets, and reading them back in.
 */
import Papa from 'papaparse';

// Excel reads a CSV in the computer's local encoding unless the file starts with this mark, which garbles names
// with accents.
const UTF8_MARK = '\uFEFF';

/**
 * CSV text with a header row. A cell that starts like a formula (`=`, `+`, `-`, `@`) is escaped, so a spreadsheet
 * shows it as text instead of running it.
 */
export function toCsv(columns: readonly string[], rows: readonly (readonly string[])[]): string {
  const text = Papa.unparse({ fields: [...columns], data: rows.map((row) => [...row]) }, { escapeFormulae: true, newline: '\r\n' });
  return UTF8_MARK + text;
}

/** One row of a CSV file. `number` is the row's number in a spreadsheet, where the header is row 1. */
export type CsvRow = Readonly<{ number: number; cells: readonly string[] }>;

/** A CSV file read into text cells, or the row where its quotes don't close, so it can't be read. */
export type ReadCsv =
  | Readonly<{ status: 'read'; header: readonly string[]; rows: readonly CsvRow[] }>
  | Readonly<{ status: 'unreadable'; rowNumber: number | null }>;

// The characters `toCsv` (Papa Parse's `escapeFormulae`) puts a `'` in front of.
const FORMULA_STARTS = ['=', '+', '-', '@', '\t', '\r'];

/**
 * Reads CSV text, such as a file `toCsv` wrote and someone edited in a spreadsheet. The `'` that `toCsv` adds in
 * front of formula-like cells is taken off again, so a cell reads back exactly as it was written. Blank rows are
 * left out but still counted, so every row keeps the number a spreadsheet shows for it.
 */
export function readCsv(text: string): ReadCsv {
  // Papa Parse removes the UTF-8 mark at the start itself.
  const { data, errors } = Papa.parse<string[]>(text);
  // A delimiter it can't detect (a one-column file) or a short row is fine here; the import checks the columns.
  const quoteError = errors.find((error) => error.type === 'Quotes');
  if (quoteError) return { status: 'unreadable', rowNumber: quoteError.row === undefined ? null : quoteError.row + 1 };

  const [header = [], ...rest] = data;
  const rows = rest
    .map((cells, index) => ({ number: index + 2, cells: cells.map(unescapeFormula) }))
    .filter((row) => row.cells.some((cell) => cell.trim() !== ''));
  return { status: 'read', header: header.map((cell) => cell.trim()), rows };
}

function unescapeFormula(cell: string): string {
  return cell.startsWith("'") && FORMULA_STARTS.includes(cell.charAt(1)) ? cell.slice(1) : cell;
}
