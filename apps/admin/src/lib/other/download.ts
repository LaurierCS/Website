/**
 * Saving a file the admin made, like a CSV export, to the person's computer.
 */
import type { CsvFile } from '../csv/csv-formats';

/** Saves the file through the browser's normal download, under its name. */
export function downloadFile(file: CsvFile): void {
  const url = URL.createObjectURL(new Blob([file.text], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  // The browser has started the download by the next tick, so the file's temporary address can be freed then.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
