/**
 * The hero's signature moment: click the clubhouse's paper plane and it takes off, loops over the headline, leaves
 * on the right, then glides back in from the left and lands where it sat. People who ask for reduced motion get a
 * fade instead of a flight.
 */
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { requiredElement } from '../lib/dom';
import { landingFlight, loopFlight, relativeTo, type Point } from '../lib/flight-path';

gsap.registerPlugin(MotionPathPlugin);

/**
 * The picture's nose points up and to the right, about this many degrees above level. Turning the plane by it
 * keeps the nose along the path instead of the picture's flat edge.
 */
const NOSE_ANGLE = 25;

/** Builds the whole flight from where the plane rests right now, so it stays right after a resize or a scroll. */
function flight(plane: HTMLElement): gsap.core.Timeline {
  gsap.set(plane, { clearProps: 'transform' });
  const box = plane.getBoundingClientRect();
  const rest: Point = { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  const screen = { width: window.innerWidth, height: window.innerHeight };
  const path = (points: readonly Point[]): Point[] => relativeTo(points, rest);

  return gsap
    .timeline()
    .to(plane, {
      motionPath: { path: path(loopFlight(screen, rest)), curviness: 1.25, autoRotate: NOSE_ANGLE },
      duration: 2.6,
      ease: 'power1.inOut',
    })
    .to(
      plane,
      {
        motionPath: { path: path(landingFlight(screen, rest)), curviness: 1, autoRotate: NOSE_ANGLE },
        duration: 1.6,
        ease: 'power2.out',
      },
      '+=0.6',
    )
    // Level out on landing, with a little settle, like it slid to a stop on the floor.
    .to(plane, { rotation: 0, duration: 0.35, ease: 'back.out(2)' }, '-=0.25');
}

class PaperPlane extends HTMLElement {
  connectedCallback(): void {
    const plane = requiredElement<HTMLButtonElement>(this, 'button');

    const motion = gsap.matchMedia();

    motion.add('(prefers-reduced-motion: no-preference)', () => {
      let current: gsap.core.Timeline | undefined;
      // One flight at a time: clicks while it is in the air do nothing.
      const throwPlane = (): void => {
        if (!current?.isActive()) current = flight(plane);
      };
      plane.addEventListener('click', throwPlane);

      // If someone turns on reduced motion mid-flight, put the plane back and stop listening.
      return () => {
        current?.kill();
        plane.removeEventListener('click', throwPlane);
        gsap.set(plane, { clearProps: 'transform' });
      };
    });

    // Without movement, a click still answers: the plane fades out and back in where it is.
    motion.add('(prefers-reduced-motion: reduce)', () => {
      const blink = (): void => {
        gsap.fromTo(plane, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      };
      plane.addEventListener('click', blink);
      return () => plane.removeEventListener('click', blink);
    });
  }
}

customElements.define('paper-plane', PaperPlane);
