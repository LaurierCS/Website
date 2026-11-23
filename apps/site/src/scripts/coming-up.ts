/**
 * Brings "Coming up" to life. The first time it comes into view, the event days light up (CSS, staggered from
 * `components/events/print-timing.ts`) and the ticket booth prints the tickets: the booth judders and its slot
 * glows, each ticket feeds out of the slot in little jerks and drops onto the pile, and once they are all down
 * the "Next up" stamp slams onto the first. Pointing at, or focusing, a ticket or its day lifts the other one
 * too. The arrows step between months. With reduced motion everything is simply there.
 */
import { gsap } from 'gsap';
import { DROP_S, FEED_S, FEED_STEPS, PRINT_START_S } from '../components/events/print-timing';
import { requiredElement } from '../lib/dom';

/** How far the booth judders sideways while it prints, and how fast. */
const JUDDER_PX = 1.5;
const JUDDER_S = 0.05;
const JUDDERS = Math.round(FEED_S / JUDDER_S) - 1;

class ComingUp extends HTMLElement {
  connectedCallback(): void {
    this.stepMonths();
    this.linkTicketsAndDays();
    this.playEntrance();
  }

  /** Shows one month at a time; each month's arrows move to the month before or after. */
  private stepMonths(): void {
    const months = [...this.querySelectorAll<HTMLElement>('[data-month]')];
    let current = 0;
    for (const button of this.querySelectorAll<HTMLButtonElement>('[data-month-step]')) {
      const step = Number(button.dataset.monthStep);
      // The arrows are disabled at the first and last month, so a step always lands on a month.
      button.addEventListener('click', () => {
        months[current].classList.add('hidden');
        current += step;
        const month = months[current];
        month.classList.remove('hidden');
        // The pressed arrow was hidden with its month; keep keyboard focus on the same arrow in the new one.
        requiredElement<HTMLButtonElement>(month, `[data-month-step="${step}"]`).focus();
      });
    }
    // The arrows only work with this script, so they show only once it runs.
    this.toggleAttribute('data-live', true);
  }

  /** Pointing at (or focusing) a ticket lifts its day on the calendar, and the other way round. */
  private linkTicketsAndDays(): void {
    const linked = [...this.querySelectorAll<HTMLElement>('[data-event], [data-event-day]')];
    const idOf = (element: HTMLElement): string | undefined => element.dataset.event ?? element.dataset.eventDay;
    const setLinked = (id: string | undefined, on: boolean): void => {
      for (const element of linked) if (idOf(element) === id) element.toggleAttribute('data-linked', on);
    };
    for (const element of linked) {
      element.addEventListener('pointerenter', () => setLinked(idOf(element), true));
      element.addEventListener('pointerleave', () => setLinked(idOf(element), false));
      element.addEventListener('focusin', () => setLinked(idOf(element), true));
      element.addEventListener('focusout', () => setLinked(idOf(element), false));
    }
  }

  /** Lights the days and prints the tickets the first time the section is seen. */
  private playEntrance(): void {
    const tickets = [...this.querySelectorAll<HTMLElement>('[data-printed-tickets] [data-event]')];

    // Without motion there is nothing to play: start in the finished state.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || tickets.length === 0) {
      for (const flag of ['data-ready', 'data-shown', 'data-settled']) this.toggleAttribute(flag, true);
      return;
    }

    // Each ticket waits up inside the slot (above the list's clipped top edge), straight, and the stamp waits
    // unseen; only then are the tickets shown, so none flashes in its final place first.
    for (const ticket of tickets) gsap.set(ticket, { y: -(ticket.offsetTop + ticket.offsetHeight), rotation: 0 });
    const stamp = this.querySelector<HTMLElement>('[data-stamp]');
    if (stamp) gsap.set(stamp, { opacity: 0 });
    this.toggleAttribute('data-ready', true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        this.toggleAttribute('data-shown', true);
        this.print(tickets, stamp);
      },
      { threshold: 0.3 },
    );
    observer.observe(this);
  }

  /** The booth prints each ticket in turn, then stamps the first. */
  private print(tickets: readonly HTMLElement[], stamp: HTMLElement | null): void {
    const booth = requiredElement<HTMLElement>(this, '[data-booth]');
    const timeline = gsap.timeline({
      delay: PRINT_START_S,
      // The tickets keep the angle they landed at; hovering grows them where they lie (an inner layer does it).
      onComplete: () => this.toggleAttribute('data-settled', true),
    });

    for (const ticket of tickets) {
      timeline
        .call(() => this.toggleAttribute('data-printing', true))
        // Out of the slot until its top edge is just clear of it, in jerks, while the booth judders.
        .to(ticket, { y: -ticket.offsetTop, duration: FEED_S, ease: `steps(${FEED_STEPS})` })
        .to(booth, { x: JUDDER_PX, duration: JUDDER_S, repeat: JUDDERS, yoyo: true }, '<')
        .set(booth, { x: 0 })
        .call(() => this.toggleAttribute('data-printing', false))
        // Then it drops onto the pile, turning to its resting angle as it falls, and bounces to a stop.
        .to(ticket, { y: 0, rotation: Number(ticket.dataset.tilt), duration: DROP_S, ease: 'bounce.out' });
    }

    if (stamp) {
      // Like the admin's stamps: in big and tilted, a little too small on impact, a bounce, then settled at the
      // same 11° its CSS gives it without motion (GSAP takes over the CSS angle, so it is set here in full). The
      // ticket under it gives a little as it lands.
      timeline
        .fromTo(
          stamp,
          { opacity: 0, scale: 2.6, rotation: 28 },
          {
            keyframes: [
              { opacity: 0.65, scale: 0.9, rotation: 9, duration: 0.24, ease: 'power2.in' },
              { scale: 1.05, rotation: 12, duration: 0.09 },
              { scale: 1, rotation: 11, duration: 0.08 },
            ],
          },
          '+=0.15',
        )
        .to(tickets[0], { y: 3, duration: 0.06, yoyo: true, repeat: 1 }, '<0.22');
    }
  }
}

customElements.define('coming-up', ComingUp);
