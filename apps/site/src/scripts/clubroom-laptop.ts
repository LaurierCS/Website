/**
 * Runs the clubroom laptop in "Missed it? It's all here.". Its tabs work like any tab list: click one, or move
 * along them with the arrow keys. While the laptop is on screen, a cursor goes round the tabs on its own: it
 * stays on each for a while, then moves over and clicks the next. It waits while you point at or focus the
 * laptop or scroll it out of view, and leaves for good the moment you use a tab yourself. With reduced motion
 * there is no cursor. "Show solution" on the practice tab opens the solution, and hides it again.
 *
 * The first time the laptop comes into view after the page loads, Krill pops up from behind it, waddles over to
 * its camera and slaps a piece of see-through tape over it (nobody wants to be watched), then stays up there
 * beside it. With reduced motion the tape is simply on and Krill is already beside it.
 */
import { gsap } from 'gsap';
import { requiredData, requiredElement } from '../lib/dom';

/** How long the cursor stays on each tab, how long it takes to reach the next, and the click's flash. */
const DWELL_S = 8;
const MOVE_S = 0.7;
const CLICK_S = 0.35;
/** Krill's walk to the camera: popping up over the lid's corner, a look around, waddling along it, the slap. */
const POP_S = 0.5;
const LOOK_S = 0.4;
const WADDLE_S = 2.8;
const SLAP_S = 0.3;
/** How far Krill rocks from side to side as he waddles, in degrees, and how long each rock takes. */
const WADDLE_DEG = 7;
const ROCK_S = 0.2;
/**
 * How far Krill stands down into the lid's top edge, in pixels, so he sits on it rather than hovering: his picture
 * has some empty space under his feet.
 */
const KRILL_SINK_PX = 14;

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
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!still) this.startTourWhenSeen();
    this.tapeTheCamera(still);
  }

  /**
   * Krill's walk. He waits hidden behind the laptop; the first time it's well in view he pops up over the lid's
   * top right corner, waddles along the top to beside the camera, and slaps the tape on, then stays there. He's
   * drawn behind the laptop, so only the part of him above the lid shows. With reduced motion he's simply up
   * there beside the taped camera.
   */
  private tapeTheCamera(still: boolean): void {
    const krill = requiredElement<HTMLElement>(this, '[data-krill]');
    const camera = requiredElement<HTMLElement>(this, '[data-camera]');
    const tape = requiredElement<HTMLElement>(this, '[data-camera-tape]');
    const lid = requiredElement<HTMLElement>(this, '[data-lid]');
    // Where Krill goes, as moves from where the page puts him: hidden behind the lid's right corner, standing on
    // the lid's top edge at that corner, and standing beside the camera.
    const placeFor = () => {
      const from = krill.getBoundingClientRect();
      const homeLeft = from.left - Number(gsap.getProperty(krill, 'x'));
      const homeBottom = from.bottom - Number(gsap.getProperty(krill, 'y'));
      const lidBox = lid.getBoundingClientRect();
      const standing = lidBox.top - homeBottom + KRILL_SINK_PX;
      const across = (centreX: number) => centreX - (homeLeft + from.width / 2);
      const corner = across(lidBox.right - from.width / 2);
      return {
        hidden: { x: corner, y: standing + from.height },
        corner: { x: corner, y: standing },
        camera: { x: across(camera.getBoundingClientRect().right + from.width * 0.45), y: standing },
      };
    };
    if (still) {
      gsap.set(krill, placeFor().camera);
      gsap.set(tape, { opacity: 1 });
      return;
    }
    let stage: 'hidden' | 'walking' | 'done' = 'hidden';
    gsap.set(krill, placeFor().hidden);
    new IntersectionObserver(
      ([seen], observer) => {
        if (!seen?.isIntersecting) return;
        observer.disconnect();
        stage = 'walking';
        const place = placeFor();
        gsap
          .timeline({
            onComplete: () => {
              stage = 'done';
            },
          })
          .to(krill, { ...place.corner, duration: POP_S, ease: 'back.out(1.6)' })
          .to(krill, { ...place.camera, duration: WADDLE_S, ease: 'none' }, `+=${LOOK_S}`)
          .fromTo(
            krill,
            { rotation: -WADDLE_DEG },
            {
              rotation: WADDLE_DEG,
              duration: ROCK_S,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: Math.round(WADDLE_S / ROCK_S) - 1,
            },
            '<',
          )
          .set(krill, { rotation: 0 })
          // The slap: the tape lands hard and Krill squashes down with it.
          .fromTo(
            tape,
            { opacity: 0, scale: 1.8 },
            { opacity: 1, scale: 1, duration: SLAP_S, ease: 'back.out(3)' },
          )
          .to(
            krill,
            { scaleY: 0.88, duration: SLAP_S / 2, yoyo: true, repeat: 1, transformOrigin: '50% 100%' },
            '<',
          );
      },
      { threshold: 0.6 },
    ).observe(lid);
    // The laptop changes size with the screen; keep him hidden, or beside the camera once he's there.
    window.addEventListener('resize', () => {
      if (stage === 'hidden') gsap.set(krill, placeFor().hidden);
      if (stage === 'done') gsap.set(krill, placeFor().camera);
    });
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
