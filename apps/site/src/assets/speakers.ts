/**
 * The speakers' photos by file name, as `content/speakers.csv` names them. Adding a speaker's photo is dropping
 * the file into `speakers/` and writing its name in the sheet.
 */
import type { ImageMetadata } from 'astro';
import { byFileName } from '../lib/sheet';

export const SPEAKER_IMAGES = byFileName(
  import.meta.glob<ImageMetadata>('./speakers/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' }),
);
