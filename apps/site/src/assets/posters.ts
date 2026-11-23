/**
 * The event posters by file name, as `content/event-posters.csv` names them. Adding a poster is dropping the file
 * into `posters/` and writing a row in the sheet.
 */
import type { ImageMetadata } from 'astro';
import { byFileName } from '../lib/sheet';

export const POSTER_IMAGES = byFileName(
  import.meta.glob<ImageMetadata>('./posters/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' }),
);
