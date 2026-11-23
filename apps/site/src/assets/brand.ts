/**
 * The site's brand images by name. Components use these names instead of file paths, so a new or replaced image
 * is a file in this folder plus, at most, one entry here.
 */
import type { ImageMetadata } from 'astro';
import coco from './mascots/coco.png';
import doug from './mascots/doug.png';
import krill from './mascots/krill.png';
import owl from './mascots/owl.png';
import cocoFace from './mascots/faces/coco.png';
import dougFace from './mascots/faces/doug.png';
import krillFace from './mascots/faces/krill.png';
import paperPlane from './objects/paper-plane.png';
import sharedLaptop from './objects/shared-laptop.png';
import plusBlock from './objects/plus-block.png';
import roomFloor from './objects/room-floor.svg';

/**
 * Doug, Coco and Krill crowded around the laptop, as in the "Mascot trio with Krill" picture, each on their own
 * so each can move by themselves. The laptop they share is its own picture (`OBJECTS.sharedLaptop`).
 */
export const MASCOTS = { coco, doug, krill } as const;
export type MascotName = keyof typeof MASCOTS;

/** The owl who runs the LCS ticket booth in "Coming up", peeking out from behind it. */
export const BOOTH_OWL = owl;

/** Each mascot on their own, small: their avatar in the about window's group chat, and stickers on event days. */
export const MASCOT_FACES = { doug: dougFace, coco: cocoFace, krill: krillFace } as const;

export const OBJECTS = { paperPlane, plusBlock, sharedLaptop } as const;
export type ObjectName = keyof typeof OBJECTS;

/** The clubhouse's isometric floor, drawn as an inline SVG so it stays sharp at any size. */
export const ROOM_FLOOR = roomFloor;

const letterFiles = import.meta.glob<ImageMetadata>('./letters/*.png', { eager: true, import: 'default' });

/** Scrapbook letter images by upper-case letter. Adding a letter is dropping its `.png` into `letters/`. */
export const SCRAPBOOK_LETTERS: ReadonlyMap<string, ImageMetadata> = new Map(
  Object.entries(letterFiles).map(([path, image]) => {
    const letter = path.slice(path.lastIndexOf('/') + 1, -'.png'.length);
    return [letter, image];
  }),
);
