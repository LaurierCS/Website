/**
 * The speakers' photos by file name, as `content/speakers.csv` names them. Adding a speaker's photo is dropping
 * the file into `speakers/` and writing its name in the sheet.
 */
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<ImageMetadata>('./speakers/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

export const SPEAKER_IMAGES: ReadonlyMap<string, ImageMetadata> = new Map(
  Object.entries(files).map(([path, image]) => [path.slice(path.lastIndexOf('/') + 1), image]),
);
