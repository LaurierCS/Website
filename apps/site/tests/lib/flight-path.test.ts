import { describe, expect, it } from 'vitest';
import { landingFlight, loopFlight, OFF_SCREEN, relativeTo } from '../../src/lib/flight-path';

const desktop = { width: 1280, height: 800 };
const phone = { width: 375, height: 667 };

describe('loopFlight', () => {
  const rest = { x: 300, y: 400 };

  it.each([desktop, phone])('takes off from its spot and leaves past the right edge ($width px)', (screen) => {
    const path = loopFlight(screen, rest);
    expect(path.at(0)).toEqual(rest);
    expect(path.at(-1)?.x).toBe(screen.width + OFF_SCREEN);
  });

  it.each([desktop, phone])('stays between the top and bottom of the screen ($width px)', (screen) => {
    for (const point of loopFlight(screen, rest)) {
      expect(point.y).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeLessThanOrEqual(screen.height);
    }
  });
});

describe('landingFlight', () => {
  it('comes in from past the left edge and ends exactly on the resting spot', () => {
    const rest = { x: 1100, y: 260 };
    const path = landingFlight(desktop, rest);
    expect(path.at(0)?.x).toBe(-OFF_SCREEN);
    expect(path.at(-1)).toEqual(rest);
  });
});

describe('relativeTo', () => {
  it('turns screen points into moves from the origin, so the origin itself is no move at all', () => {
    expect(relativeTo([{ x: 100, y: 50 }, { x: 10, y: 20 }], { x: 10, y: 20 })).toEqual([
      { x: 90, y: 30 },
      { x: 0, y: 0 },
    ]);
  });
});
