/**
 * The admin's brand images. Components use these names instead of file paths, so a new or renamed image is a
 * change here only.
 */
import asterisk from './doodles/Asteriks.svg';
import bracket from './doodles/Bracket.svg';
import brackets from './doodles/Brackets.svg';
import iconWhite from './logos/LCS_Icon_White_SVG.svg';
import logoLongWhite from './logos/LCS_Logo_Long_White_SVG.svg';
import coco from './mascots/Coco.svg';
import doug from './mascots/Doug.svg';
import krill from './mascots/Krill.svg';

export const LOGO_LONG_WHITE = logoLongWhite;
export const ICON_WHITE = iconWhite;

export const DOODLES = { asterisk, bracket, brackets } as const;

export const MASCOTS = { coco, doug, krill } as const;
export type MascotName = keyof typeof MASCOTS;

const letterFiles = import.meta.glob<string>('./letters/*.webp', { eager: true, import: 'default' });

/** Scrapbook letter images by upper-case letter. Adding a letter is dropping its `.webp` into `letters/`. */
export const SCRAPBOOK_LETTERS: ReadonlyMap<string, string> = new Map(
  Object.entries(letterFiles).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1, -'.webp'.length), url]),
);
