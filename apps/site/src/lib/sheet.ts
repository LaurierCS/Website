/**
 * Reading a content sheet: a CSV file in `src/content/` that the site is built from, like the speakers. A mistake
 * in a sheet stops the build with the sheet's name, the row (numbered the way a spreadsheet numbers it) and what
 * to fix, instead of going live as a broken page.
 */
import type { ImageMetadata } from 'astro';
import Papa from 'papaparse';
import { z } from 'zod';

const missing = (column: string) => ({ error: `the ${column} column is missing.` });

/** A column every row must fill in. */
export const requiredText = (column: string) =>
  z.string(missing(column)).trim().min(1, `${column} is empty; every row needs one.`);

/** A column that holds a full https:// address, or nothing (then it is null). */
export const optionalLink = (column: string) =>
  z
    .string(missing(column))
    .trim()
    .transform((value) => value || null)
    .pipe(z.url({ protocol: /^https$/, error: `${column} must be a full https:// address.` }).nullable());

/** One row of a sheet, checked: its cells as the schema reads them, and where it is, for messages. */
export type SheetRow<Cells> = Readonly<{ cells: Cells; where: string }>;

/**
 * Every row of the sheet called `name`, checked against `schema`, in the sheet's order.
 * @throws Error naming the sheet, the row and the problem when the sheet can't be read or a row doesn't fit.
 */
export function readSheet<Schema extends z.ZodType>(
  csv: string,
  name: string,
  schema: Schema,
): ReadonlyArray<SheetRow<z.infer<Schema>>> {
  const sheet = Papa.parse<unknown>(csv, { header: true, skipEmptyLines: true, transformHeader: (h) => h.trim() });
  if (sheet.errors.length > 0) {
    const [first] = sheet.errors;
    throw new Error(`${name} can't be read near row ${(first.row ?? 0) + 2}: ${first.message}.`);
  }

  return sheet.data.map((cells, index) => {
    // Row 1 is the header, so the first entry is row 2, as a spreadsheet numbers it.
    const where = `${name} row ${index + 2}`;
    const parsed = schema.safeParse(cells);
    if (!parsed.success) {
      const problems = parsed.error.issues.map((issue) =>
        issue.code === 'unrecognized_keys' ? `unknown column ${issue.keys.join(', ')}` : issue.message,
      );
      throw new Error(`${where}: ${problems.join(' ')}`);
    }
    return { cells: parsed.data, where };
  });
}

/** A folder's pictures (from `import.meta.glob`, keyed by path) by file name, the way a sheet names them. */
export function byFileName(files: Readonly<Record<string, ImageMetadata>>): ReadonlyMap<string, ImageMetadata> {
  return new Map(Object.entries(files).map(([path, image]) => [path.slice(path.lastIndexOf('/') + 1), image]));
}

/**
 * The picture a sheet's row names, from `images` (by file name).
 * @throws Error naming the row when there is no picture by that name in `folder`.
 */
export function sheetImage(
  images: ReadonlyMap<string, ImageMetadata>,
  file: string,
  where: string,
  folder: string,
): ImageMetadata {
  const found = images.get(file);
  if (!found) throw new Error(`${where}: there is no picture called ${file} in ${folder}.`);
  return found;
}
