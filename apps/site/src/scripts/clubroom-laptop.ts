/**
 * Runs the clubroom laptop in "Missed it? It's all here.". Its tabs work like any tab list: click one, or move
 * along them with the arrow keys. While the laptop is on screen, a cursor goes round the tabs on its own: it
 * stays on each for a while, then moves over and clicks the next. It waits while you point at or focus the
 * laptop or scroll it out of view, and leaves for good the moment you use a tab yourself. With reduced motion
 * there is no cursor. "Show solution" on the practice tab opens the solution, and hides it again.
 */
import { gsap } from 'gsap';
import { requiredData, requiredElement } from '../lib/dom';

/** How long the cursor stays on each tab, how long it takes to reach the next, and the click's flash. */
const DWELL_S = 8;
const MOVE_S = 0.7;
const CLICK_S = 0.35;

class ClubroomLaptop extends HTMLElement {
  private tabs: HTMLButtonElement[] = [];
  /** The cursor's current step: waiting on a tab, then moving to the next and clicking it. */
  private step: gsap.core.Timeline | null = null;
  /** Set once the visitor uses the tabs: from then on the cursor is gone. */
  private handedOver = false;
  private onScreen = false;
  /** Pointed at or focused, so the cursor waits. */
  private held = false;

  connectedCallback(): void {
    this.tabs = [...this.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    this.wireTabs();
    this.wireSolution();
    this.toggleAttribute('data-live', true);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) this.startTourWhenSeen();
  }

  /** Shows the tab's panel and hides the others. */
  private select(tab: HTMLButtonElement): void {
    for (const other of this.tabs) {
      const selected = other === tab;
      other.setAttribute('aria-selected', String(selected));
      other.tabIndex = selected ? 0 : -1;
      requiredElement<HTMLElement>(this, `#laptop-panel-${requiredData(other, 'tab')}`).inert = !selected;
    }
  }

  /** Clicks and arrow keys, as a tab list does them. Using the tabs yourself ends the tour. */
  private wireTabs(): void {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', (event) => {
        // A click the tour makes is not the visitor's.
        if (event.isTrusted) this.endTour();
        this.select(tab);
      });
      tab.addEventListener('keydown', (event) => {
        const last = this.tabs.length - 1;
        // Which tab each key moves to; other keys do nothing here.
        const moves: Readonly<Partial<Record<string, number>>> = {
          ArrowRight: index === last ? 0 : index + 1,
          ArrowLeft: index === 0 ? last : index - 1,
          Home: 0,
          End: last,
        };
        const to = moves[event.key];
        if (to === undefined) return;
        event.preventDefault();
        this.endTour();
        this.tabs[to].focus();
        this.select(this.tabs[to]);
      });
    });
  }

  /** "Show solution" hides the solution until it's asked for. */
  private wireSolution(): void {
    const toggle = requiredElement<HTMLButtonElement>(this, '[data-solution-toggle]');
    const solution = requiredElement<HTMLElement>(this, '[data-solution]');
    const label = requiredElement<HTMLElement>(toggle, '[data-solution-label]');
    solution.hidden = true;
    toggle.addEventListener('click', () => {
      solution.hidden = !solution.hidden;
      toggle.setAttribute('aria-expanded', String(!solution.hidden));
      label.textContent = solution.hidden ? 'Show solution' : 'Hide solution';
    });
  }

  /** Starts the cursor the first time the laptop is properly in view, and holds it while it's away or in use. */
  private startTourWhenSeen(): void {
    const screen = requiredElement<HTMLElement>(this, '[data-screen]');
    const cursor = requiredElement<HTMLElement>(screen, '[data-cursor]');
    // The cursor starts in the middle of the screen, out of sight; its first move brings it in.
    gsap.set(cursor, { x: screen.clientWidth / 2, y: screen.clientHeight / 2 });

    new IntersectionObserver(
      ([entry]) => {
        this.onScreen = entry?.isIntersecting === true;
        if (this.onScreen && !this.step && !this.handedOver) this.stepTo(1, screen);
        this.holdOrGo();
      },
      { threshold: 0.5 },
    ).observe(screen);

    const hold = (held: boolean) => () => {
      this.held = held;
      this.holdOrGo();
    };
    screen.addEventListener('pointerenter', hold(true));
    screen.addEventListener('pointerleave', hold(false));
    screen.addEventListener('focusin', hold(true));
    screen.addEventListener('focusout', hold(false));
  }

  /** The cursor moves only while the laptop is on screen and nobody is using it. */
  private holdOrGo(): void {
    this.step?.paused(!this.onScreen || this.held);
  }

  /**
   * One step of the round: stay a while, then move to the tab at `index`, click it, and set off for the one after.
   * Each step starts from wherever the cursor is, so the round can go on for as long as the laptop is watched.
   */
  private stepTo(index: number, screen: HTMLElement): void {
    const tab = this.tabs[index];
    const cursor = requiredElement<HTMLElement>(screen, '[data-cursor]');
    const ring = requiredElement<HTMLElement>(screen, '[data-click-ring]');
    // The tab's middle, inside the screen, measured as the cursor sets off (the layout may have changed since).
    const middle = () => {
      const box = tab.getBoundingClientRect();
      const origin = screen.getBoundingClientRect();
      return { x: box.left - origin.left + box.width / 2, y: box.top - origin.top + box.height / 2 };
    };

    this.step = gsap
      .timeline({ delay: DWELL_S, onComplete: () => this.stepTo((index + 1) % this.tabs.length, screen) })
      .to(cursor, { opacity: 1, duration: 0.2 })
      .to(cursor, { x: () => middle().x, y: () => middle().y, duration: MOVE_S, ease: 'power2.inOut' }, '<')
      .fromTo(ring, { scale: 0.4, opacity: 1 }, { scale: 1.6, opacity: 0, duration: CLICK_S })
      .call(() => tab.click(), [], '<');
    this.holdOrGo();
  }

  /** Stops the cursor for good, where it is, and takes it away: the visitor has the laptop now. */
  private endTour(): void {
    this.handedOver = true;
    this.step?.kill();
    this.step = null;
    gsap.to(requiredElement(this, '[data-cursor]'), { opacity: 0, duration: 0.2 });
  }
}

customElements.define('clubroom-laptop', ClubroomLaptop);
