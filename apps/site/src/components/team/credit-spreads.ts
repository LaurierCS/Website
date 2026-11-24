/**
 * How the prints of the lit group are laid out around the credits: each person's print goes to the left or right
 * of the credits, hangs at its own tilt, and (on the widest layout, where there's room) is nudged a little
 * sideways, so a group looks hand-pinned rather than lined up. The sides themselves are columns beside the
 * credits, so a print can never land on a name, at any width. Spreads are used in turn, so each group lands a
 * little differently; a new spread is one more entry.
 */
export type PrintSlot = Readonly<{ side: 'left' | 'right'; tilt: number; nudge: number }>;

/** Values: which side, the tilt in degrees, and the sideways nudge in rem. */
export const CREDIT_SPREADS: readonly (readonly PrintSlot[])[] = [
  [
    { side: 'right', tilt: 4, nudge: 0.5 },
    { side: 'left', tilt: -4, nudge: -0.5 },
    { side: 'right', tilt: -3, nudge: -1 },
    { side: 'left', tilt: 5, nudge: 0.75 },
    { side: 'right', tilt: 3, nudge: 1 },
  ],
  [
    { side: 'right', tilt: -5, nudge: -0.75 },
    { side: 'left', tilt: 3, nudge: 0.5 },
    { side: 'right', tilt: 4, nudge: 1 },
    { side: 'left', tilt: -3, nudge: -1 },
    { side: 'right', tilt: -4, nudge: 0 },
  ],
];
