/**
 * The site's brand assets, from `@lcs/brand`. Components use these names instead of hard-coded paths,
 * so a new or renamed asset is a change here only.
 */
import logoLongWhite from '@lcs/brand/assets/logos/LCS_Logo_Long_White_SVG.svg';
import coco from '@lcs/brand/assets/mascots/Coco.svg';
import doug from '@lcs/brand/assets/mascots/Doug.svg';
import krill from '@lcs/brand/assets/mascots/Krill.svg';

export const LOGO_LONG_WHITE = logoLongWhite.src;

export const MASCOTS = {
  coco: coco.src,
  doug: doug.src,
  krill: krill.src,
} as const;

const letterFiles = import.meta.glob<ImageMetadata>('@lcs/brand/assets/letters/*.webp', {
  eager: true,
  import: 'default',
});

/** Scrapbook letter images by upper-case letter, built from whichever letter files exist. */
export const SCRAPBOOK_LETTERS: ReadonlyMap<string, string> = new Map(
  Object.entries(letterFiles).map(([path, image]) => [path.slice(path.lastIndexOf('/') + 1, -'.webp'.length), image.src]),
);
