/**
 * Writing CSV files that open cleanly in Excel and Google Sheets.
 */
import Papa from 'papaparse';

// Excel reads a CSV in the computer's local encoding unless the file starts with this mark, which garbles names
// with accents.
const UTF8_MARK = '﻿';

/**
 * CSV text with a header row. A cell that starts like a formula (`=`, `+`, `-`, `@`) is escaped, so a spreadsheet
 * shows it as text instead of running it.
 */
export function toCsv(columns: readonly string[], rows: readonly (readonly string[])[]): string {
  const text = Papa.unparse({ fields: [...columns], data: rows.map((row) => [...row]) }, { escapeFormulae: true, newline: '\r\n' });
  return UTF8_MARK + text;
}
