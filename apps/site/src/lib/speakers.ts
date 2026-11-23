/**
 * Reads the Meet the Professionals speakers out of the speakers sheet (`content/speakers.csv`). The site is built
 * from it, so a mistake in the sheet stops the build with the row and what to fix, instead of going live as a
 * broken card. Once the speakers live in the database, only this reader changes.
 */
import type { ImageMetadata } from 'astro';
import Papa from 'papaparse';
import { z } from 'zod';

/** One speaker, as the spotlight shows them. Their links can be missing; then the button is left out. */
export type Speaker = Readonly<{
  name: string;
  role: string;
  company: string;
  linkedin: string | null;
  website: string | null;
  photo: ImageMetadata;
  eventPhoto: ImageMetadata;
}>;

const missing = (column: string) => ({ error: `the ${column} column is missing.` });

const text = (column: string) =>
  z.string(missing(column)).trim().min(1, `${column} is empty; every speaker needs one.`);

// An empty cell means "no link"; anything else must be a full web address.
const optionalLink = (column: string) =>
  z
    .string(missing(column))
    .trim()
    .transform((value) => value || null)
    .pipe(z.url({ protocol: /^https$/, error: `${column} must be a full https:// address.` }).nullable());

/** One row of the sheet, with its columns exactly as the header names them. */
const SpeakerRowSchema = z
  .object({
    name: text('name'),
    role: text('role'),
    company: text('company'),
    linkedin: optionalLink('linkedin').refine(
      (link) => link === null || new URL(link).hostname.endsWith('linkedin.com'),
      'linkedin must be a linkedin.com address.',
    ),
    website: optionalLink('website'),
    photo: text('photo'),
    event_photo: text('event_photo'),
  })
  .strict();

/**
 * The speakers in the sheet's order, with their photos looked up by file name in `images`.
 * @throws Error naming the row and the problem when a row is incomplete, names a photo that isn't there, or
 * names a headshot that isn't square.
 */
export function readSpeakers(csv: string, images: ReadonlyMap<string, ImageMetadata>): readonly Speaker[] {
  const sheet = Papa.parse<unknown>(csv, { header: true, skipEmptyLines: true, transformHeader: (h) => h.trim() });
  if (sheet.errors.length > 0) {
    const [first] = sheet.errors;
    throw new Error(`speakers.csv can't be read near row ${(first.row ?? 0) + 2}: ${first.message}.`);
  }

  return sheet.data.map((cells, index) => {
    // Row 1 is the header, so the first speaker is row 2, as a spreadsheet numbers it.
    const where = `speakers.csv row ${index + 2}`;
    const parsed = SpeakerRowSchema.safeParse(cells);
    if (!parsed.success) {
      const problems = parsed.error.issues.map((issue) =>
        issue.code === 'unrecognized_keys' ? `unknown column ${issue.keys.join(', ')}` : issue.message,
      );
      throw new Error(`${where}: ${problems.join(' ')}`);
    }

    const row = parsed.data;
    const image = (file: string): ImageMetadata => {
      const found = images.get(file);
      if (!found) throw new Error(`${where}: there is no photo called ${file} in src/assets/speakers.`);
      return found;
    };
    // Headshots are square, like a LinkedIn photo, so every speaker's card is the same shape. Crop before saving.
    const photo = image(row.photo);
    if (photo.width !== photo.height) {
      throw new Error(`${where}: ${row.photo} is ${photo.width}×${photo.height}; crop it square first.`);
    }
    return {
      name: row.name,
      role: row.role,
      company: row.company,
      linkedin: row.linkedin,
      website: row.website,
      photo,
      eventPhoto: image(row.event_photo),
    };
  });
}

/** The companies the speakers came from, each once, in the order they first appear. */
export function speakerCompanies(speakers: readonly Speaker[]): readonly string[] {
  return [...new Set(speakers.map((speaker) => speaker.company))];
}
