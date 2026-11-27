/**
 * How the lit group's pictures land beside the credits. The group's still from an event goes in the space on the
 * left (under the heading on a wide screen, the only side with room to show it big), at the top, middle or bottom
 * of that space and tilted one way or the other, so it doesn't land in the same spot every time. The prints go
 * down the right, all the same size, each at its own tilt and (on the widest layout) nudged a little sideways, so
 * a group looks hand-pinned rather than lined up. Spreads are used in turn; a new spread is one more entry.
 */

/** A print: its tilt in degrees and its sideways nudge in rem. */
export type PrintSlot = Readonly<{ tilt: number; nudge: number }>;

/** The still: where it lands in its space, and its tilt in degrees. */
export type StillSpot = Readonly<{ at: 'top' | 'middle' | 'bottom'; tilt: number }>;

/** One way for a group to land: up to three prints, and the still. */
export type Spread = Readonly<{ prints: readonly PrintSlot[]; still: StillSpot }>;

export const CREDIT_SPREADS: readonly Spread[] = [
  {
    prints: [
      { tilt: 4, nudge: 0.5 },
      { tilt: -3, nudge: -1 },
      { tilt: 3, nudge: 0.75 },
    ],
    still: { at: 'top', tilt: -2 },
  },
  {
    prints: [
      { tilt: -5, nudge: -0.75 },
      { tilt: 4, nudge: 1 },
      { tilt: -3, nudge: -0.5 },
    ],
    still: { at: 'bottom', tilt: 2 },
  },
  {
    prints: [
      { tilt: 3, nudge: -0.5 },
      { tilt: -4, nudge: 0.75 },
      { tilt: 5, nudge: -1 },
    ],
    still: { at: 'middle', tilt: -1 },
  },
];
