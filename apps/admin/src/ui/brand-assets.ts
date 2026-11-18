/**
 * The admin's brand assets, from `@lcs/brand`. Components use these names instead of paths, so a
 * new or renamed asset is a change here only.
 */
import asterisk from '@lcs/brand/assets/doodles/Asteriks.svg';
import bracket from '@lcs/brand/assets/doodles/Bracket.svg';
import iconWhite from '@lcs/brand/assets/logos/LCS_Icon_White_SVG.svg';
import logoLongWhite from '@lcs/brand/assets/logos/LCS_Logo_Long_White_SVG.svg';
import coco from '@lcs/brand/assets/mascots/Coco.svg';
import doug from '@lcs/brand/assets/mascots/Doug.svg';
import krill from '@lcs/brand/assets/mascots/Krill.svg';

export const LOGO_LONG_WHITE = logoLongWhite;
export const ICON_WHITE = iconWhite;

export const DOODLES = { asterisk, bracket } as const;

export const MASCOTS = { coco, doug, krill } as const;
export type MascotName = keyof typeof MASCOTS;

const letterFiles = import.meta.glob<string>('@lcs/brand/assets/letters/*.webp', { eager: true, import: 'default' });

/** Scrapbook letter images by upper-case letter, built from whichever letter files exist. */
export const SCRAPBOOK_LETTERS: ReadonlyMap<string, string> = new Map(
  Object.entries(letterFiles).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1, -'.webp'.length), url]),
);
