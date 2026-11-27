/**
 * Brings "Everything else we do" to life. Each row of posters drifts sideways for ever, every other row the other
 * way. A row slows to a stop while you point at it, tab through it, or view one of its posters big, and gets going
 * again once you're done. On a touch screen a row can be swiped along by hand. The rows only move while the
 * section is on screen, and Coco rides along on them (`scripts/poster-rider.ts`). Clicking any poster opens it
 * big. With reduced motion the rows stay still and scroll by hand (the page shows them that way until this script
 * says otherwise).
 */
import { gsap } from 'gsap';
import { requiredData, requiredElement } from '../lib/dom';
import { rideAlong } from './poster-rider';

/** How fast a row drifts, in pixels a second, and how long it takes to slow to a stop or get going again. */
const DRIFT_PX_PER_S = 28;
const EASE_S = 0.8;
/** How far a finger moves before it counts as a swipe rather than a tap on a poster, in pixels. */
const SWIPE_PX = 8;

/**
 * A row and the tween drifting it (replaced when the row is measured again). `span` is how far the track moves in
 * one lap, signed by direction; `wraps` counts laps gone round (back by one when swiped back past the start), so
 * Coco can keep to the same poster when the track jumps back a lap.
 */
type Drifting = {
  row: HTMLElement;
  drift: gsap.core.Tween;
  span: number;
  right: boolean;
  lapTiles: number;
  wraps: number;
  pointedAt: boolean;
  swiping: boolean;
};

class PosterRows extends HTMLElement {
  connectedCallback(): void {
    this.openPostersBig();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.toggleAttribute('data-drifting', true);
    const viewer = requiredElement<HTMLDialogElement>(this, '[data-poster-viewer]');
    let onScreen = false;
    // The row whose poster is open big, if one is.
    let viewing: HTMLElement | null = null;
    const rows: Drifting[] = [...this.querySelectorAll<HTMLElement>('[data-poster-row]')].map((row) => {
      const right = requiredData(row, 'drift') === 'right';
      const lapTiles = Number(requiredData(row, 'lap'));
      const entry: Drifting = {
        row,
        right,
        lapTiles,
        wraps: 0,
        pointedAt: false,
        swiping: false,
        ...this.drift(row, right, lapTiles, () => {
          entry.wraps += 1;
        }),
      };
      entry.drift.pause();
      return entry;
    });

    /**
     * Stops a row, smoothly, while someone is looking at it: pointing at it, swiping it, tabbing through it with
     * the keyboard, or viewing one of its posters. Otherwise it drifts at full speed. A click leaves focus on the
     * poster, so only keyboard focus counts, or a row would stay stopped after its poster was closed.
     */
    const settle = (entry: Drifting): void => {
      const looking =
        entry.pointedAt || entry.swiping || entry.row === viewing || entry.row.matches(':has(:focus-visible)');
      gsap.to(entry.drift, { timeScale: looking ? 0 : 1, duration: EASE_S, ease: 'power2.out', overwrite: true });
    };

    for (const entry of rows) {
      const pointing = (on: boolean) => () => {
        entry.pointedAt = on;
        settle(entry);
      };
      entry.row.addEventListener('pointerenter', pointing(true));
      entry.row.addEventListener('pointerleave', pointing(false));
      entry.row.addEventListener('focusin', () => settle(entry));
      entry.row.addEventListener('focusout', () => settle(entry));
      entry.row.addEventListener('click', (event) => {
        if (!(event.target instanceof Element) || !event.target.closest('[data-tile]')) return;
        viewing = entry.row;
        settle(entry);
      });
      this.swipeable(entry, settle);
    }
    viewer.addEventListener('close', () => {
      viewing = null;
      for (const entry of rows) settle(entry);
    });

    // A lap is measured in pixels, and the tiles change size at the wide-screen width; measure again then.
    window.matchMedia('(min-width: 64rem)').addEventListener('change', () => {
      for (const entry of rows) {
        entry.drift.kill();
        Object.assign(
          entry,
          this.drift(entry.row, entry.right, entry.lapTiles, () => {
            entry.wraps += 1;
          }),
        );
        entry.drift.paused(!onScreen);
        settle(entry);
      }
    });

    new IntersectionObserver(([seen]) => {
      onScreen = seen?.isIntersecting === true;
      for (const entry of rows) entry.drift.paused(!onScreen);
    }).observe(this);

    rideAlong(this, rows);
  }

  /**
   * Moves the row's track along by exactly one lap of posters, over and over. The track holds two laps, so when
   * it jumps back to the start the same posters are in the same places and the jump can't be seen. `onLap` runs
   * each time it goes round.
   */
  private drift(
    row: HTMLElement,
    right: boolean,
    lapTiles: number,
    onLap: () => void,
  ): Pick<Drifting, 'drift' | 'span'> {
    const track = requiredElement<HTMLElement>(row, '[data-track]');
    const tiles = [...track.querySelectorAll<HTMLElement>('[data-tile]')];
    const lap = tiles[lapTiles].offsetLeft - tiles[0].offsetLeft;
    const [from, to] = right ? [-lap, 0] : [0, -lap];
    const drift = gsap.fromTo(
      track,
      { x: from },
      { x: to, duration: lap / DRIFT_PX_PER_S, ease: 'none', repeat: -1, onRepeat: onLap },
    );
    return { drift, span: to - from };
  }

  /**
   * A finger dragged sideways on a row moves it along with the finger; the row waits while it's held and drifts
   * on once it's let go. Vertical drags still scroll the page. A drag that moved is a swipe, so it doesn't open
   * the poster it started on.
   */
  private swipeable(entry: Drifting, settle: (entry: Drifting) => void): void {
    const viewport = requiredElement<HTMLElement>(entry.row, '[data-viewport]');
    let lastX: number | null = null;
    let moved = 0;
    viewport.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse') return;
      lastX = event.clientX;
      moved = 0;
      entry.swiping = true;
      settle(entry);
    });
    viewport.addEventListener('pointermove', (event) => {
      if (lastX === null) return;
      const dx = event.clientX - lastX;
      lastX = event.clientX;
      moved += Math.abs(dx);
      // Along the lap by the distance moved; past either end of the lap is the same place one lap on, or back.
      let progress = entry.drift.progress() + dx / entry.span;
      while (progress >= 1) {
        progress -= 1;
        entry.wraps += 1;
      }
      while (progress < 0) {
        progress += 1;
        entry.wraps -= 1;
      }
      entry.drift.progress(progress);
    });
    const letGo = (): void => {
      if (lastX === null) return;
      lastX = null;
      entry.swiping = false;
      settle(entry);
    };
    viewport.addEventListener('pointerup', letGo);
    viewport.addEventListener('pointercancel', letGo);
    viewport.addEventListener(
      'click',
      (event) => {
        if (moved <= SWIPE_PX) return;
        event.preventDefault();
        event.stopPropagation();
      },
      { capture: true },
    );
  }

  /** Any poster, original or copy, opens big in the viewer. */
  private openPostersBig(): void {
    const viewer = requiredElement<HTMLDialogElement>(this, '[data-poster-viewer]');
    const image = requiredElement<HTMLImageElement>(viewer, '[data-viewer-image]');
    const title = requiredElement<HTMLElement>(viewer, '[data-viewer-title]');

    this.addEventListener('click', async (event) => {
      const tile = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-tile]') : null;
      if (!tile) return;
      const name = requiredData(tile, 'event');
      const src = requiredData(tile, 'large');
      image.src = src;
      image.alt = `${name} poster`;
      title.textContent = name;
      // Open once the new poster is ready, so the last one opened never flashes up first. A poster that fails to
      // load still opens, showing its name.
      await image.decode().catch(() => undefined);
      // Another poster was clicked while this one loaded: that one opens instead.
      if (image.getAttribute('src') !== src) return;
      viewer.showModal();
    });
    requiredElement(viewer, '[data-viewer-close]').addEventListener('click', () => viewer.close());
    // A click on the dimmed page around the poster lands on the dialog itself.
    viewer.addEventListener('click', (event) => {
      if (event.target === viewer) viewer.close();
    });
  }
}

customElements.define('poster-rows', PosterRows);
