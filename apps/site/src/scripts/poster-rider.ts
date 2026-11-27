/**
 * Coco rides the poster rows like a carousel: she sits on top of a poster, in any row, and goes round with it.
 * She stays ducked down behind it while any of it is near either edge of the row (under the row's label and
 * fades), popping up only once it's wholly in view, so she never slides in or out half-shown. When her poster has gone past the far
 * edge she waits, ducked, on the next poster coming in. Point at her, or tap her, and she ducks and pops up on a
 * poster in another row. She's drawn above every row, so the row above never covers her.
 */
import { gsap } from 'gsap';
import { requiredElement } from '../lib/dom';

/** A drifting row as Coco needs it: which way it goes, how many posters a lap is, and how many laps it's done. */
export type RiderRow = Readonly<{ row: HTMLElement; right: boolean; lapTiles: number; wraps: number }>;

/** How far into a poster her feet sit, and how far in from the row's edges she waits to pop up, in pixels. */
const SEAT_OVERLAP_PX = 6;
const EDGE_PX = 24;
/** How long she stays ducked when she hops to another row, before and after moving, in seconds. */
const HOP_PAUSE_S = 0.4;

/** Where a row's posters are properly in view, across the screen: between its label's fade and its end fade. */
function viewOf(row: HTMLElement): Readonly<{ left: number; right: number }> {
  const labelFade = requiredElement(row, '[data-label-fade]').getBoundingClientRect();
  const endFade = requiredElement(row, '[data-end-fade]').getBoundingClientRect();
  // On a phone the label sits above the row and has no fade; the row starts at the screen's edge.
  const start = labelFade.width > 0 ? labelFade : requiredElement(row, '[data-viewport]').getBoundingClientRect();
  const left = labelFade.width > 0 ? start.right : start.left;
  return { left: left + EDGE_PX, right: endFade.left + endFade.width / 2 - EDGE_PX };
}

const middleOf = (tile: HTMLElement): number => {
  const box = tile.getBoundingClientRect();
  return box.left + box.width / 2;
};

/** Seats Coco (`[data-rider]` in `host`) on a poster in view, in any of the rows. */
export function rideAlong(host: HTMLElement, rows: readonly RiderRow[]): void {
  const rider = requiredElement<HTMLElement>(host, '[data-rider]');
  if (rows.length === 0) return;
  const tilesOf = new Map(rows.map((each) => [each, [...each.row.querySelectorAll<HTMLElement>('[data-tile]')]]));
  const posters = (each: RiderRow): HTMLElement[] => tilesOf.get(each) ?? [];

  const anyOf = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

  let row = rows[0];
  let seat = 0;
  let seenWraps = row.wraps;
  let hopping = false;

  /** Seats her on a poster that's wholly in view in `next`, any of them. */
  const seatInView = (next: RiderRow): void => {
    row = next;
    seenWraps = next.wraps;
    const view = viewOf(next.row);
    const inView = posters(next)
      .map((tile, index) => ({ index, box: tile.getBoundingClientRect() }))
      .filter(({ box }) => box.left > view.left && box.right < view.right);
    seat = inView.length > 0 ? anyOf(inView).index : 0;
  };

  /** Seats her, ducked, on the poster that will come into view next in her row. */
  const waitForNext = (): void => {
    const view = viewOf(row.row);
    const waiting = posters(row)
      .map((tile, index) => ({ index, x: middleOf(tile) }))
      .filter(({ x }) => (row.right ? x < view.left : x > view.right));
    if (waiting.length === 0) return;
    const next = waiting.reduce((best, each) => ((row.right ? each.x > best.x : each.x < best.x) ? each : best));
    seat = next.index;
  };

  const frame = (): void => {
    // A row going round a lap jumps its track back a lap; the same poster on screen is then a lap along the list.
    if (row.wraps !== seenWraps) {
      seat += (row.wraps - seenWraps) * (row.right ? row.lapTiles : -row.lapTiles);
      seenWraps = row.wraps;
    }
    const tile = posters(row)[seat];
    if (!tile) {
      waitForNext();
      return;
    }
    const box = host.getBoundingClientRect();
    const at = tile.getBoundingClientRect();
    gsap.set(rider, {
      x: at.left - box.left + at.width / 2 - rider.offsetWidth / 2,
      y: at.top - box.top - rider.offsetHeight + SEAT_OVERLAP_PX,
    });
    // Up only while the whole poster is clear of the label and the fades; ducked as it nears either edge.
    const view = viewOf(row.row);
    const inView = at.left > view.left && at.right < view.right;
    rider.toggleAttribute('data-up', inView && !hopping);
    // Carried past the far edge: wait on the next poster coming in.
    const x = at.left + at.width / 2;
    if (row.right ? x > view.right : x < view.left) waitForNext();
  };
  // Somewhere you can see her straight away, on any row.
  seatInView(anyOf(rows));
  gsap.ticker.add(frame);

  // Pointed at with a mouse, or tapped on a touch screen.
  const hop = (): void => {
    if (hopping || rows.length < 2) return;
    hopping = true;
    rider.toggleAttribute('data-up', false);
    gsap.delayedCall(HOP_PAUSE_S, () => {
      seatInView(anyOf(rows.filter((each) => each !== row)));
      gsap.delayedCall(HOP_PAUSE_S, () => {
        hopping = false;
      });
    });
  };
  rider.addEventListener('pointerenter', hop);
  rider.addEventListener('pointerdown', hop);
}
