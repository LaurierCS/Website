/**
 * Where the hero's paper plane flies. The paths are points on the screen, worked out from the screen's size so
 * the loop fits any window; the script that flies the plane turns them into moves from where the plane rests.
 */

export type Point = Readonly<{ x: number; y: number }>;
export type Size = Readonly<{ width: number; height: number }>;

/** How far past the screen's edge the plane starts and finishes, so it is fully out of sight. */
export const OFF_SCREEN = 160;

/**
 * Up off its spot at `rest`, a loop-the-loop over the headline, then out past the right edge. Each loop point is a
 * share of the screen, so the loop keeps its shape on a phone and on a wide monitor.
 */
export function loopFlight(screen: Size, rest: Point): readonly Point[] {
  const at = (x: number, y: number): Point => ({ x: x * screen.width, y: y * screen.height });
  return [
    rest,
    at(0.22, 0.32),
    at(0.38, 0.14),
    at(0.48, 0.3),
    at(0.38, 0.46),
    at(0.28, 0.3),
    at(0.6, 0.18),
    { x: screen.width + OFF_SCREEN, y: 0.3 * screen.height },
  ];
}

/** Back in from the left, high and slow, gliding down onto its spot in the clubhouse at `rest`. */
export function landingFlight(screen: Size, rest: Point): readonly Point[] {
  return [
    { x: -OFF_SCREEN, y: 0.12 * screen.height },
    // Halfway across, a little above both the entry and the landing spot, so the glide sinks onto it.
    { x: rest.x / 2, y: Math.min(rest.y, 0.12 * screen.height) - 40 },
    rest,
  ];
}

/** The same points as moves from `origin`, which is how the plane is moved from where it rests. */
export function relativeTo(points: readonly Point[], origin: Point): Point[] {
  return points.map((point) => ({ x: point.x - origin.x, y: point.y - origin.y }));
}
