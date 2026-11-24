/**
 * Brings "Everything else we do" to life. Each row of posters drifts sideways for ever, every other row the other
 * way. A row slows to a stop while you point at it or tab through it, and while one of its posters is open big,
 * and gets going again once you're done. The rows only move while the section is on screen. Clicking any poster
 * opens it big. With reduced motion the rows stay still and scroll by hand (the page shows them that way until
 * this script says otherwise).
 */
import { gsap } from 'gsap';
import { requiredData, requiredElement } from '../lib/dom';

/** How fast a row drifts, in pixels a second, and how long it takes to slow to a stop or get going again. */
const DRIFT_PX_PER_S = 28;
const EASE_S = 0.8;

/** A row, the tween drifting it (replaced when the row is measured again) and whether the pointer is on it. */
type Drifting = { row: HTMLElement; drift: gsap.core.Tween; pointedAt: boolean };

class PosterRows extends HTMLElement {
  connectedCallback(): void {
    this.openPostersBig();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.toggleAttribute('data-drifting', true);
    const viewer = requiredElement<HTMLDialogElement>(this, '[data-poster-viewer]');
    let onScreen = false;
    // The row whose poster is open big, if one is.
    let viewing: HTMLElement | null = null;
    const rows: Drifting[] = [...this.querySelectorAll<HTMLElement>('[data-poster-row]')].map((row) => ({
      row,
      drift: this.drift(row).pause(),
      pointedAt: false,
    }));

    /**
     * Stops a row, smoothly, while someone is looking at it: pointing at it, tabbing through it with the keyboard,
     * or viewing one of its posters. Otherwise it drifts at full speed. A click leaves focus on the poster, so only
     * keyboard focus counts, or a row would stay stopped after its poster was closed.
     */
    const settle = (entry: Drifting): void => {
      const looking = entry.pointedAt || entry.row === viewing || entry.row.matches(':has(:focus-visible)');
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
    }
    viewer.addEventListener('close', () => {
      viewing = null;
      for (const entry of rows) settle(entry);
    });

    // A lap is measured in pixels, and the tiles change size at the wide-screen width; measure again then.
    window.matchMedia('(min-width: 64rem)').addEventListener('change', () => {
      for (const entry of rows) {
        entry.drift.kill();
        entry.drift = this.drift(entry.row).paused(!onScreen);
        settle(entry);
      }
    });

    new IntersectionObserver(([seen]) => {
      onScreen = seen?.isIntersecting === true;
      for (const entry of rows) entry.drift.paused(!onScreen);
    }).observe(this);
  }

  /**
   * Moves the row's track along by exactly one lap of posters, over and over. The track holds two laps, so when
   * it jumps back to the start the same posters are in the same places and the jump can't be seen.
   */
  private drift(row: HTMLElement): gsap.core.Tween {
    const track = requiredElement<HTMLElement>(row, '[data-track]');
    const tiles = [...track.querySelectorAll<HTMLElement>('[data-tile]')];
    const lapTiles = Number(requiredData(row, 'lap'));
    const lap = tiles[lapTiles].offsetLeft - tiles[0].offsetLeft;
    const [from, to] = requiredData(row, 'drift') === 'right' ? [-lap, 0] : [0, -lap];
    return gsap.fromTo(track, { x: from }, { x: to, duration: lap / DRIFT_PX_PER_S, ease: 'none', repeat: -1 });
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
