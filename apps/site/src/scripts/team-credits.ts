/**
 * Runs the team credits. Wherever there's room and motion is allowed, the credits roll up slowly and without
 * stopping, like a film's end credits; whichever group is passing the middle is lit, and its prints drop
 * in either side of the credits, fading away as the next group reaches the middle. Once the last group has
 * passed, they rewind quickly to the first and roll again.
 *
 * With the pointer on the credits, the wheel (or a finger, dragging) moves them up and down, gently, so nobody
 * flies past; at either end the wheel scrolls the page again. Pointing at the names (not the roles beside them)
 * or at a print stops them, so a name can be read or its LinkedIn clicked. They also wait while off screen, while
 * paused, and while you're on another tab or in another app, so coming back from a LinkedIn finds them where they
 * were. Pointing at a name lifts that person's print, and the other way round.
 *
 * Where the credits can't roll, the contact sheet shows, and its jump bar lights the department you're looking at.
 */
import { gsap } from 'gsap';
import { requiredData, requiredElement } from '../lib/dom';

/** How fast the credits roll, in pixels a second, and how long they take to slow to a stop or get going again. */
const ROLL_PX_PER_S = 34;
const EASE_S = 0.9;
/** How long the rewind back to the first group takes, in seconds. */
const REWIND_S = 2.4;
/**
 * The wheel: how much of a wheel step moves the credits, the most one step can move them (in pixels), and how
 * much of what's left to move is moved each frame, so wheeling glides rather than jumps.
 */
const WHEEL_SHARE = 0.35;
const WHEEL_STEP_MAX_PX = 40;
const GLIDE_PER_FRAME = 0.15;

class TeamCredits extends HTMLElement {
  connectedCallback(): void {
    this.lightJumpBar();
    this.linkNamesAndPrints();
    this.rollCredits();
  }

  /** The credits roll where there's room and motion is allowed; anywhere else the contact sheet shows. */
  private rollCredits(): void {
    const credits = requiredElement<HTMLElement>(this, '[data-credits]');
    const track = requiredElement<HTMLElement>(credits, '[data-credits-track]');
    const pause = requiredElement<HTMLButtonElement>(this, '[data-pause]');
    const lines = [...this.querySelectorAll<HTMLElement>('[data-line]')];
    // Each group's prints, on its left and its right.
    const sides = [...this.querySelectorAll<HTMLElement>('[data-group]')];
    const roomy = window.matchMedia('(min-width: 48rem)');
    const widest = window.matchMedia('(min-width: 80rem)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Each group's lines, by group: lit together, and their middle tells when the group is passing the middle.
    const groupLines: HTMLElement[][] = [];
    for (const line of lines) (groupLines[Number(requiredData(line, 'inGroup'))] ??= []).push(line);
    const middleOf = (index: number): number => {
      const ofGroup = groupLines[index];
      const last = ofGroup[ofGroup.length - 1];
      return (ofGroup[0].offsetTop + last.offsetTop + last.offsetHeight) / 2;
    };

    /**
     * Where the credits are (`reel.y`, how far the list is moved up or down), and how fast they roll on their own
     * (`motor.speed`, 1 at full speed, 0 stopped). `first` and `last` are where the list sits with the first, or
     * the last, group in the middle: as far as rolling and wheeling go either way.
     */
    const reel = { y: 0 };
    const motor = { speed: 1 };
    let ends = { first: 0, last: 0 };
    let toMove = 0;
    let rewind: gsap.core.Tween | null = null;
    let running = false;

    let current = -1;
    let paused = false;
    let onNames = false;
    let onPrint = false;
    let onScreen = false;
    // On another tab (like the LinkedIn a name just opened), or in another app, like Discord. The window counts as
    // left once it loses focus, not before, so a page that opens without focus still rolls.
    let unfocused = false;
    const rolling = (): boolean => roomy.matches && !still.matches && groupLines.length > 0;
    const away = (): boolean => document.hidden || unfocused;
    const within = (y: number): number => Math.min(ends.first, Math.max(ends.last, y));

    /** Lights group `index`: its lines on the credits, and its prints either side. */
    const light = (index: number): void => {
      current = index;
      for (const side of sides) {
        const on = Number(requiredData(side, 'group')) === index;
        side.toggleAttribute('data-current', on);
        side.inert = !on;
      }
      groupLines.forEach((ofGroup, at) => {
        for (const line of ofGroup) line.toggleAttribute('data-lit', at === index);
      });
    };

    /** Lights whichever group is passing the middle of the credits. */
    const follow = (): void => {
      const middle = credits.clientHeight / 2 - reel.y;
      let nearest = 0;
      groupLines.forEach((_, index) => {
        if (Math.abs(middleOf(index) - middle) < Math.abs(middleOf(nearest) - middle)) nearest = index;
      });
      if (nearest !== current) light(nearest);
    };

    /** Back to the first group, quickly, like rewinding a reel, then on rolling from there. */
    const rewindToFirst = (): void => {
      toMove = 0;
      rewind = gsap.to(reel, {
        y: ends.first,
        duration: REWIND_S,
        ease: 'power2.inOut',
        onComplete: () => {
          rewind = null;
        },
      });
    };

    /** Each frame: roll on at the motor's speed, glide some of the way the wheel asked for, and draw. */
    const frame = (_time: number, deltaMs: number): void => {
      if (!rewind) {
        const glide = toMove * GLIDE_PER_FRAME;
        toMove -= glide;
        reel.y = within(reel.y - ROLL_PX_PER_S * motor.speed * (deltaMs / 1000) + glide);
        // Rolling on its own past the last group: rewind. Not while someone is wheeling through.
        if (reel.y <= ends.last && motor.speed > 0 && Math.abs(toMove) < 1) rewindToFirst();
      }
      gsap.set(track, { y: reel.y });
      follow();
    };

    /**
     * The credits roll on their own only while they're on screen, and nobody is reading or has paused them. They
     * never stop dead: they slow down to a stop, and pick up speed again, like a reel winding down and up.
     */
    const go = (): void => {
      const moving = rolling() && !paused && !onNames && !onPrint && onScreen && !away();
      gsap.to(motor, { speed: moving ? 1 : 0, duration: EASE_S, ease: 'power2.out', overwrite: true });
    };

    /** Measures the credits and starts from the first group in the middle, so there's something to read at once. */
    const startRolling = (): void => {
      const height = credits.clientHeight;
      ends = { first: height / 2 - middleOf(0), last: height / 2 - middleOf(groupLines.length - 1) };
      rewind?.kill();
      rewind = null;
      toMove = 0;
      reel.y = ends.first;
      if (!running) gsap.ticker.add(frame);
      running = true;
      go();
    };

    /** Rolling or the contact sheet, by screen width and the motion setting; measured again when either changes. */
    const apply = (): void => {
      this.toggleAttribute('data-rolling', rolling());
      if (rolling()) startRolling();
      else if (running) {
        gsap.ticker.remove(frame);
        running = false;
      }
    };

    pause.addEventListener('click', () => {
      paused = !paused;
      requiredElement(pause, '[data-pause-label]').textContent = requiredData(
        pause,
        paused ? 'playText' : 'pauseText',
      );
      requiredElement(pause, '[data-playing-icon]').classList.toggle('hidden', paused);
      requiredElement(pause, '[data-paused-icon]').classList.toggle('hidden', !paused);
      go();
    });

    // The wheel, with the pointer on the credits, moves them a little way up or down. At either end it's left to
    // scroll the page, so nobody gets stuck on the credits.
    credits.addEventListener(
      'wheel',
      (event) => {
        if (!running) return;
        const step = Math.max(-WHEEL_STEP_MAX_PX, Math.min(WHEEL_STEP_MAX_PX, event.deltaY * WHEEL_SHARE));
        const heading = reel.y + toMove - step;
        if ((step > 0 && heading < ends.last) || (step < 0 && heading > ends.first)) return;
        event.preventDefault();
        rewind?.kill();
        rewind = null;
        toMove -= step;
      },
      { passive: false },
    );

    // A finger dragging on the credits moves them the same way (the credits take the touch, not the page).
    let dragFrom: number | null = null;
    credits.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse') dragFrom = event.clientY;
    });
    credits.addEventListener('pointermove', (event) => {
      if (dragFrom === null) return;
      rewind?.kill();
      rewind = null;
      toMove += event.clientY - dragFrom;
      dragFrom = event.clientY;
    });
    const drop = (): void => {
      dragFrom = null;
    };
    credits.addEventListener('pointerup', drop);
    credits.addEventListener('pointercancel', drop);

    // The names column: from where the names start to the right edge of the credits, top to bottom. The roles
    // to its left don't stop the credits.
    const namesStart = (): number => requiredElement(track, '[data-name]').getBoundingClientRect().left;
    credits.addEventListener('pointermove', (event) => {
      const now = event.clientX >= namesStart();
      if (now === onNames) return;
      onNames = now;
      go();
    });
    credits.addEventListener('pointerleave', () => {
      onNames = false;
      go();
    });
    for (const print of this.querySelectorAll<HTMLElement>('[data-group] [data-person]')) {
      print.addEventListener('pointerenter', () => {
        onPrint = true;
        go();
      });
      print.addEventListener('pointerleave', () => {
        onPrint = false;
        go();
      });
    }

    new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting === true;
      go();
    }).observe(credits);
    // Leaving the page stops the credits at once, so they're where they were when you come back.
    const leaveOrReturn = (): void => {
      if (away()) {
        gsap.killTweensOf(motor);
        motor.speed = 0;
      }
      go();
    };
    document.addEventListener('visibilitychange', leaveOrReturn);
    window.addEventListener('blur', () => {
      unfocused = true;
      leaveOrReturn();
    });
    window.addEventListener('focus', () => {
      unfocused = false;
      leaveOrReturn();
    });
    // The layout (and the names' size) changes at these widths, so the credits are measured again.
    roomy.addEventListener('change', apply);
    widest.addEventListener('change', apply);
    still.addEventListener('change', apply);
    apply();
  }

  /** Pointing at (or focusing) someone's name lifts their print, and the other way round. */
  private linkNamesAndPrints(): void {
    const people = [...this.querySelectorAll<HTMLElement>('[data-line], [data-group] [data-person]')];
    const link = (id: string, on: boolean): void => {
      for (const element of people) {
        if (requiredData(element, 'person') === id) element.toggleAttribute('data-linked', on);
      }
    };
    for (const element of people) {
      const id = requiredData(element, 'person');
      element.addEventListener('pointerenter', () => link(id, true));
      element.addEventListener('pointerleave', () => link(id, false));
      element.addEventListener('focusin', () => link(id, true));
      element.addEventListener('focusout', () => link(id, false));
    }
  }

  /** Lights the department you're looking at on the contact sheet's jump bar, keeping it in view on the bar. */
  private lightJumpBar(): void {
    const jumps = [...this.querySelectorAll<HTMLElement>('[data-jump]')];
    const light = (crew: string): void => {
      for (const jump of jumps) {
        const on = requiredData(jump, 'jump') === crew;
        jump.toggleAttribute('data-current', on);
        if (on) jump.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    };
    // A department counts as the one you're looking at once it crosses the middle of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const { isIntersecting, target } of entries) {
          if (isIntersecting && target instanceof HTMLElement) light(requiredData(target, 'crew'));
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    for (const crew of this.querySelectorAll<HTMLElement>('section[data-crew]')) observer.observe(crew);
  }
}

customElements.define('team-credits', TeamCredits);
