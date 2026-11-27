/**
 * Stand-in pictures, used until the final art replaces them: the birds on the couch who watch the team credits
 * roll, the couch itself and their popcorn. They're kept apart from the brand images in `brand.ts`, so it's clear
 * they aren't part of the brand set yet. Replacing one is swapping its file.
 */
import couchCushion from './placeholders/couch-cushion.png';
import couchFrame from './placeholders/couch-frame.png';
import eagle from './placeholders/eagle.png';
import goose from './placeholders/goose.png';
import popcorn from './placeholders/popcorn.png';
import robin from './placeholders/robin.png';

/**
 * The couch, in two layers drawn on the same canvas: the seat cushions, which the birds sit on, and the frame
 * (its back and arms), drawn over them so they sink in behind its back.
 */
export const COUCH = { cushion: couchCushion, frame: couchFrame } as const;

/** The birds on the couch, each drawn from behind, looking away to the left. */
export const COUCH_BIRDS = { goose, eagle, robin } as const;
export type CouchBirdName = keyof typeof COUCH_BIRDS;

/** The bucket of popcorn on the couch's arm. */
export const POPCORN = popcorn;
