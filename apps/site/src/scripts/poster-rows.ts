/**
 * Brings "Everything else we do" to life. Each row of posters drifts sideways for ever, every other row the other
 * way, and eases almost to a stop while you point at it or tab into it, so you can see what each one was. The
 * rows only move while the section is on screen. Clicking any poster opens it big. With reduced motion the rows
 * stay still and scroll by hand (the page shows them that way until this script says otherwise).
 */
import { gsap } from 'gsap';
import { requiredData, requiredElement } from '../lib/dom';

/** How fast a row drifts, in pixels a second, how much it slows while pointed at, and how quickly it eases. */
const DRIFT_PX_PER_S = 28;
const SLOWED = 0.12;
const EASE_S = 0.5;

/** A row and the tween drifting it (replaced when the row is measured again). */
type Drifting = { row: HTMLElement; drift: gsap.core.Tween };

class PosterRows extends HTMLElement {
  connectedCallback(): void {
    this.openPostersBig();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.toggleAttribute('data-drifting', true);
    let onScreen = false;
    const rows: Drifting[] = [...this.querySelectorAll<HTMLElement>('[data-poster-row]')].map((row) => ({
      row,
      drift: this.drift(row).pause(),
    }));

    for (const entry of rows) {
      const slowTo = (timeScale: number) => () =>
        gsap.to(entry.drift, { timeScale, duration: EASE_S, overwrite: true });
      entry.row.addEventListener('pointerenter', slowTo(SLOWED));
      entry.row.addEventListener('pointerleave', slowTo(1));
      entry.row.addEventListener('focusin', slowTo(SLOWED));
      entry.row.addEventListener('focusout', slowTo(1));
    }

    // A lap is measured in pixels, and the tiles change size at the wide-screen width; measure again then.
    window.matchMedia('(min-width: 64rem)').addEventListener('change', () => {
      for (const entry of rows) {
        entry.drift.kill();
        entry.drift = this.drift(entry.row).paused(!onScreen);
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

    this.addEventListener('click', (event) => {
      const tile = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-tile]') : null;
      if (!tile) return;
      const name = requiredData(tile, 'event');
      image.src = requiredData(tile, 'large');
      image.alt = `${name} poster`;
      title.textContent = name;
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
