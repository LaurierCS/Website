/**
 * Where everything sits in the hero's clubhouse, as percentages of the room, measured from the Figma design (a
 * 600 × 640 room). Moving, resizing or adding a piece is a change here only. A piece can sit somewhere else on a
 * phone (`phoneSpot`), where the room is pulled up under the chat and its empty sky is used.
 */
import type { ImageMetadata } from 'astro';
import { MASCOTS, OBJECTS } from '../../assets/brand';
import type { Typist } from '../../content/home';

/** A spot in the room: its left and top edges and its width, each a percentage of the room's width or height. */
export type RoomSpot = Readonly<{ left: number; top: number; width: number }>;

/** A point in the room, as percentages of its width and height. */
export type RoomPoint = Readonly<{ left: number; top: number }>;

/**
 * A picture in the room. A piece with a `typist` is that mascot, and taps away while it is their turn to type;
 * `'anyone'` is the laptop they share, which looks busy whenever anyone is typing.
 */
export type RoomPiece = Readonly<{
  name: string;
  image: ImageMetadata;
  spot: RoomSpot;
  phoneSpot?: RoomSpot;
  typist?: Typist | 'anyone';
}>;

/** The floor's spot. It is a drawing, not a picture, so it sits apart from the pieces. */
export const FLOOR_SPOT: RoomSpot = { left: 0, top: 34.4, width: 100 };

/** Back to front: later pieces are drawn over earlier ones. */
export const ROOM_PIECES: readonly RoomPiece[] = [
  {
    name: 'Plus block',
    image: OBJECTS.plusBlock,
    spot: { left: 6.7, top: 18.8, width: 13.3 },
    // On a phone it sits on the floor's left corner instead of floating in the sky.
    phoneSpot: { left: 1, top: 50, width: 13.3 },
  },
  // The trio, laid out as in the Figma "Mascot trio with Krill" picture, at 60% of the room's width.
  { name: 'Coco', image: MASCOTS.coco, spot: { left: 17.2, top: 32, width: 36.1 }, typist: 'coco' },
  { name: 'Doug', image: MASCOTS.doug, spot: { left: 22.3, top: 36.4, width: 46.3 }, typist: 'doug' },
  // Its own piece, in front of Doug, so it stays put while he types.
  { name: 'Laptop', image: OBJECTS.sharedLaptop, spot: { left: 23.7, top: 54.7, width: 26.1 }, typist: 'anyone' },
  { name: 'Krill', image: MASCOTS.krill, spot: { left: 49, top: 41, width: 28.2 }, typist: 'krill' },
];

/** Where the paper plane rests between flights. */
export const PLANE_SPOT: RoomSpot = { left: 78.3, top: 17.2, width: 18.3 };

/** On a phone, lower, so it straddles the chat window's bottom-right corner, clear of the messages. */
export const PLANE_PHONE_SPOT: RoomSpot = { left: 76, top: 12, width: 18.3 };

/**
 * Positions a piece from the custom properties `spotStyle` sets: its phone spot by default, its own spot from the
 * `nav` width up.
 */
export const SPOT_CLASSES =
  'left-(--phone-left) top-(--phone-top) w-(--phone-width) nav:left-(--left) nav:top-(--top) nav:w-(--width)';

/** Just above each mascot's head in the trio: the bottom middle of their "…" bubble while they type. */
export const TYPING_BUBBLE_POINTS: Readonly<Record<Typist, RoomPoint>> = {
  coco: { left: 32.2, top: 33.4 },
  doug: { left: 48.4, top: 35.2 },
  krill: { left: 63.4, top: 43.4 },
};

/** A spot, and where it moves to on a phone, as the custom properties `SPOT_CLASSES` reads. */
export function spotStyle(spot: RoomSpot, phoneSpot: RoomSpot = spot): Record<string, string> {
  return {
    '--left': `${spot.left}%`,
    '--top': `${spot.top}%`,
    '--width': `${spot.width}%`,
    '--phone-left': `${phoneSpot.left}%`,
    '--phone-top': `${phoneSpot.top}%`,
    '--phone-width': `${phoneSpot.width}%`,
  };
}

/** A point as inline position styles. */
export function pointStyle(point: RoomPoint): Record<'left' | 'top', string> {
  return { left: `${point.left}%`, top: `${point.top}%` };
}
