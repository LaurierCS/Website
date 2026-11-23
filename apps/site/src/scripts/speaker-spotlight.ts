/**
 * Steps through the Meet the Professionals speakers, with the arrows or, on a phone, a swipe across the print.
 * Each step deals the next speaker onto the table: their print slides in from the side you stepped towards, and
 * a moment later their card lands on it, turning straight as it settles (on a phone, their headshot sticker is
 * slapped onto the photo instead).
 * The steps go round, so after the last speaker comes the first. With reduced motion the speaker simply changes.
 */
import { gsap } from 'gsap';
import { requiredElement } from '../lib/dom';

/** How far a finger has to travel sideways across the print to count as a swipe, in pixels. */
const SWIPE_PX = 48;

class SpeakerSpotlight extends HTMLElement {
  connectedCallback(): void {
    const speakers = [...this.querySelectorAll<HTMLElement>('[data-speaker]')];
    // One speaker (or none) has nothing to step to.
    if (speakers.length < 2) return;

    const stage = requiredElement<HTMLElement>(this, '[data-stage]');
    const count = requiredElement<HTMLElement>(this, '[data-count]');
    const announce = requiredElement<HTMLElement>(this, '[data-announce]');
    const dots = [...this.querySelectorAll<HTMLElement>('[data-dot]')];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let current = 0;

    const show = (step: number): void => {
      const leaving = speakers[current];
      current = (current + step + speakers.length) % speakers.length;
      const arriving = speakers[current];

      // All the speakers stay stacked in the same spot; `inert` hides the ones not showing.
      leaving.inert = true;
      arriving.inert = false;
      dots.forEach((dot, index) => dot.toggleAttribute('data-current', index === current));
      count.textContent = `${current + 1} of ${speakers.length}`;
      announce.textContent = `${arriving.dataset.name}, ${current + 1} of ${speakers.length}`;

      if (reduceMotion.matches) return;
      // Both layouts (phone and wider) are in the page and only one is displayed; animating both is harmless.
      gsap.fromTo(
        arriving.querySelectorAll('[data-print]'),
        { x: 48 * step, rotation: 1.5 * step, opacity: 0 },
        { x: 0, rotation: 0, opacity: 1, duration: 0.35, ease: 'power3.out', overwrite: true, clearProps: 'all' },
      );
      gsap.fromTo(
        arriving.querySelectorAll('[data-card]'),
        { x: 72 * step, y: 16, rotation: 6 * step, opacity: 0 },
        {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: 0.45,
          delay: 0.08,
          ease: 'back.out(1.6)',
          overwrite: true,
          clearProps: 'all',
        },
      );
      // The phone's headshot sticker is slapped on: in big, then pressed down. Its angle is left alone, so it
      // keeps the tilt its classes give it.
      gsap.fromTo(
        arriving.querySelectorAll('[data-sticker]'),
        { scale: 1.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, delay: 0.15, ease: 'back.out(2)', overwrite: true, clearProps: 'all' },
      );
    };

    for (const button of this.querySelectorAll<HTMLButtonElement>('[data-speaker-step]')) {
      const step = Number(button.dataset.speakerStep);
      button.addEventListener('click', () => show(step));
    }

    // A sideways swipe steps like the arrows: swiping left brings the next speaker in from the right.
    // The stage lets the browser keep vertical scrolling (`touch-pan-y`), so scrolling past still works.
    let swipeStart: number | null = null;
    stage.addEventListener('pointerdown', (event) => {
      swipeStart = event.pointerType === 'touch' ? event.clientX : null;
    });
    stage.addEventListener('pointerup', (event) => {
      if (swipeStart === null) return;
      const travelled = event.clientX - swipeStart;
      swipeStart = null;
      if (Math.abs(travelled) >= SWIPE_PX) show(travelled < 0 ? 1 : -1);
    });
    stage.addEventListener('pointercancel', () => {
      swipeStart = null;
    });

    // The arrows only work with this script, so they show only once it runs.
    this.toggleAttribute('data-live', true);
  }
}

customElements.define('speaker-spotlight', SpeakerSpotlight);
