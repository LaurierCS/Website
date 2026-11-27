/**
 * The birds on the couch beside the team credits. Each time the credits light a new group of names (`GROUP_LIT`),
 * one bird reacts a moment later, never the same one twice in a row: a heart floats up over their head, they dip
 * into the popcorn and kernels fly out of the bucket, or they hop in their seat. With reduced motion they just
 * watch.
 */
import { gsap } from 'gsap';
import { requiredElement } from '../lib/dom';
import { GROUP_LIT } from './credits-events';

const REACTIONS = ['heart', 'popcorn', 'hop'] as const;
type Reaction = (typeof REACTIONS)[number];

/** How long after a group lights up the bird reacts, in seconds: somewhere in between, so it isn't mechanical. */
const REACT_AFTER_S = { least: 0.2, most: 0.5 } as const;
/** The heart: how far it floats up, in pixels, and how long it takes. */
const HEART_RISE_PX = 36;
const HEART_S = 1.2;
/** The dip into the popcorn: how far the bird leans towards it, and how long the lean takes each way. */
const DIP_DEG = -12;
const DIP_S = 0.25;
/** The kernels: how many fly out, how high and how far to either side they go (in pixels), and their flight. */
const KERNELS = 5;
const KERNEL_RISE_PX = 30;
const KERNEL_SPREAD_PX = 26;
const KERNEL_S = 0.7;
/** The hop: how high, in pixels, and how long the way up takes. */
const HOP_PX = 10;
const HOP_S = 0.16;

class CouchCrew extends HTMLElement {
  private readonly still = window.matchMedia('(prefers-reduced-motion: reduce)');

  connectedCallback(): void {
    const birds = [...this.querySelectorAll<HTMLElement>('[data-bird]')];
    const credits = this.closest('team-credits');
    if (!credits) throw new Error('The couch crew has to sit inside the team credits.');
    let last: HTMLElement | null = null;
    credits.addEventListener(GROUP_LIT, () => {
      if (this.still.matches) return;
      const others = birds.filter((bird) => bird !== last);
      const bird = gsap.utils.random(others);
      last = bird;
      // A beat after the names light up, the way someone takes a moment to react to what they've just read.
      gsap.delayedCall(gsap.utils.random(REACT_AFTER_S.least, REACT_AFTER_S.most), () =>
        this.react(bird, gsap.utils.random([...REACTIONS])),
      );
    });
  }

  private react(bird: HTMLElement, reaction: Reaction): void {
    const body = requiredElement<HTMLElement>(bird, '[data-body]');
    switch (reaction) {
      case 'heart': {
        const heart = requiredElement<SVGElement>(bird, '[data-heart]');
        gsap.fromTo(
          heart,
          { y: 0, scale: 0.4, opacity: 1 },
          { y: -HEART_RISE_PX, scale: 1, opacity: 0, duration: HEART_S, ease: 'power1.out' },
        );
        return;
      }
      case 'popcorn':
        gsap
          .timeline()
          .to(body, { rotation: DIP_DEG, duration: DIP_S, ease: 'power2.out' })
          .call(() => this.kernelsFly())
          .to(body, { rotation: 0, duration: DIP_S, ease: 'power2.inOut' }, `+=${DIP_S}`);
        return;
      case 'hop':
        gsap.fromTo(body, { y: 0 }, { y: -HOP_PX, duration: HOP_S, ease: 'power2.out', yoyo: true, repeat: 1 });
        return;
    }
  }

  /** A few kernels pop out of the bucket, arc up and drop away, and are taken off again once they've landed. */
  private kernelsFly(): void {
    const from = requiredElement<HTMLElement>(this, '[data-kernels]');
    for (let count = 0; count < KERNELS; count++) {
      const kernel = document.createElement('span');
      kernel.className = `absolute block size-1.5 ${count % 2 ? 'bg-yellow' : 'bg-print'}`;
      from.append(kernel);
      gsap
        .timeline({ onComplete: () => kernel.remove() })
        .to(kernel, {
          x: gsap.utils.random(-KERNEL_SPREAD_PX, KERNEL_SPREAD_PX),
          rotation: gsap.utils.random(-180, 180),
          duration: KERNEL_S,
          ease: 'none',
        })
        .to(kernel, { y: -gsap.utils.random(KERNEL_RISE_PX / 2, KERNEL_RISE_PX), duration: KERNEL_S / 2 }, 0)
        .to(kernel, { y: 0, opacity: 0, duration: KERNEL_S / 2, ease: 'power2.in' }, KERNEL_S / 2);
    }
  }
}

customElements.define('couch-crew', CouchCrew);
