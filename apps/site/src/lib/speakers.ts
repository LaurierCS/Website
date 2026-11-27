/**
 * Reads the Meet the Professionals speakers out of the speakers sheet (`content/speakers.csv`). Once the speakers
 * live in the database, only this reader changes.
 */
import type { ImageMetadata } from 'astro';
import { z } from 'zod';
import { optionalLink, readSheet, requiredText, sheetImage } from './sheet';

/** One speaker, as the spotlight shows them. Their links can be missing; then the button is left out. */
export type Speaker = Readonly<{
  name: string;
  role: string;
  company: string;
  linkedin: string | null;
  website: string | null;
  photo: ImageMetadata;
  eventPhoto: ImageMetadata;
  /** Their company's logo, for the back of their card and their spot in the speaker row while they're shown. */
  logo: ImageMetadata;
  /** Their company's colour, as `#rrggbb`, for the ribbon on the back of their card. */
  colour: string;
}>;

/** One row of the sheet, with its columns exactly as the header names them. */
const SpeakerRowSchema = z
  .object({
    name: requiredText('name'),
    role: requiredText('role'),
    company: requiredText('company'),
    linkedin: optionalLink('linkedin').refine(
      (link) => link === null || new URL(link).hostname.endsWith('linkedin.com'),
      'linkedin must be a linkedin.com address.',
    ),
    website: optionalLink('website'),
    photo: requiredText('photo'),
    event_photo: requiredText('event_photo'),
    logo: requiredText('logo'),
    colour: requiredText('colour').regex(/^#[0-9a-f]{6}$/i, 'colour must be a hex colour like #4285f4.'),
  })
  .strict();

const FOLDER = 'src/assets/speakers';

/**
 * The speakers in the sheet's order, with their photos looked up by file name in `images`.
 * @throws Error naming the row and the problem when a row is incomplete, names a photo that isn't there, or
 * names a headshot that isn't square.
 */
export function readSpeakers(csv: string, images: ReadonlyMap<string, ImageMetadata>): readonly Speaker[] {
  return readSheet(csv, 'speakers.csv', SpeakerRowSchema).map(({ cells, where }) => {
    // Headshots are square, like a LinkedIn photo, so every speaker's card is the same shape. Crop before saving.
    const photo = sheetImage(images, cells.photo, where, FOLDER);
    if (photo.width !== photo.height) {
      throw new Error(`${where}: ${cells.photo} is ${photo.width}×${photo.height}; crop it square first.`);
    }
    return {
      name: cells.name,
      role: cells.role,
      company: cells.company,
      linkedin: cells.linkedin,
      website: cells.website,
      photo,
      eventPhoto: sheetImage(images, cells.event_photo, where, FOLDER),
      logo: sheetImage(images, cells.logo, where, FOLDER),
      colour: cells.colour,
    };
  });
}

/** The companies the speakers came from, each once, in the order they first appear. */
export function speakerCompanies(speakers: readonly Speaker[]): readonly string[] {
  return [...new Set(speakers.map((speaker) => speaker.company))];
}
