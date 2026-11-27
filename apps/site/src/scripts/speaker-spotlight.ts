/**
 * Runs the Meet the Professionals spotlight. Picking a face in the row shows that speaker: the card turns over
 * (front, the back of the LCS set with their company's ribbon for a beat, then the new speaker's front) while
 * their event photo fades in, and the face they picked becomes their company's logo in the row. Then their photo
 * is taken through Doug's viewfinder: the card tips to an angle with the camera screen over a blurred, zoomed-in
 * picture, which drifts about the way a camera does while someone frames a shot, Doug's camera moving with it.
 * The focus box hunts round and settles on their face as the picture sharpens; then the shot is taken, the
 * picture goes black for a blink as the screen goes, and it zooms out to the whole photo as the card straightens.
 * As the shot is taken, Doug's camera flashes and a little print of them drops into the pile at his feet. The
 * first speaker gets the same as the section comes into view.
 *
 * A pick while the card is turning is ignored, so a turn is never cut off halfway. A pick while Doug is still
 * taking a shot is fine: that shot is dropped and the card turns to the next speaker. A swipe across the print on
 * a phone moves to the next or previous speaker. The row of faces scrolls when there are more than fit: drag it,
 * or use the button at its end. With reduced motion the speaker simply changes and Doug doesn't take photos.
 */
import { gsap } from 'gsap';
import { requiredData, requiredElement } from '../lib/dom';

/** How far a finger has to travel sideways across the print to count as a swipe, in pixels. */
const SWIPE_PX = 48;
/** How far a drag on the row of faces moves before it counts as a drag rather than a click, in pixels. */
const DRAG_PX = 6;
/** The card turning over: to edge-on, on round to its back, holding there, and round to the new front. */
const TURN_HALF_S = 0.13;
const BACK_HOLD_S = 0.18;
const TURN_FRONT_S = 0.28;
/**
 * Framing the shot: how far in the picture is zoomed, how many times the camera is moved while framing, how long
 * each move takes, and how far it goes (sideways, up and down, and turned).
 */
const ZOOM_IN = 1.18;
const FRAMING_MOVES = 3;
const FRAMING_S = 0.42;
const FRAMING_X_PX = 9;
const FRAMING_Y_PX = 5;
const FRAMING_DEG = 0.6;
/** How far Doug's camera moves for each pixel the picture drifts; his camera is much smaller than the card. */
const DOUG_SHARE = 0.4;
/** How far from the face the focus box strays while hunting, as a share of the viewfinder's width. */
const STRAY = 0.28;
/** The focus box snapping tight as it locks on. */
const LOCK_S = 0.18;
/** The angle the card is held at for the photo, turned towards Doug, and how long it takes to tip to it. */
const HELD_X_DEG = 6;
const HELD_Y_DEG = 12;
const TIP_S = 0.4;
/** The shot: the shutter's black blink, then the picture zooming out as the card straightens. */
const SHUTTER_S = 0.07;
const DEVELOP_S = 0.55;
/** Doug's snap: lining the camera up, the flash, and the print dropping into the pile. */
const AIM_S = 0.22;
const FLASH_S = 0.14;
const DROP_S = 0.6;
/** How many prints the pile keeps; older ones are taken off the bottom. */
const PILE_MOST = 7;

class SpeakerSpotlight extends HTMLElement {
  private readonly still = window.matchMedia('(prefers-reduced-motion: reduce)');
  /** The width from which Doug stands under the heading, left of the card, turned to face right (`xl`). */
  private readonly wide = window.matchMedia('(min-width: 80rem)');

  connectedCallback(): void {
    const speakers = [...this.querySelectorAll<HTMLElement>('[data-speaker]')];
    if (speakers.length === 0) return;
    const faces = [...this.querySelectorAll<HTMLButtonElement>('[data-face]')];
    const announce = requiredElement<HTMLElement>(this, '[data-announce]');
    let current = 0;
    let turning = false;
    let shooting: gsap.core.Timeline | null = null;

    const show = (next: number): void => {
      if (turning || next === current) return;
      const leaving = speakers[current];
      const arriving = speakers[next];
      current = next;
      faces.forEach((face, index) => face.setAttribute('aria-pressed', String(index === current)));
      faces[current]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      announce.textContent = `${requiredData(arriving, 'name')}, ${current + 1} of ${speakers.length}`;

      if (this.still.matches) {
        leaving.inert = true;
        arriving.inert = false;
        return;
      }
      // A shot still being taken is dropped; the card it was on turns away mid-shot.
      shooting?.kill();
      turning = true;
      const leavingCard = requiredElement<HTMLElement>(leaving, '[data-card-turn]');
      const leavingPose = requiredElement<HTMLElement>(leaving, '[data-card-pose]');
      const arrivingCard = requiredElement<HTMLElement>(arriving, '[data-card-turn]');
      // Lined up now, so the new card comes round already zoomed in and out of focus; it plays once it's round.
      const shot = this.takePhoto(arriving).pause();
      gsap
        .timeline({
          onComplete: () => {
            gsap.set([leavingCard, arrivingCard], { clearProps: 'transform' });
            turning = false;
            shooting = shot.play();
          },
        })
        // The old card turns until it's edge-on, and the new one takes its place there. If it was picked mid-shot,
        // it straightens as it goes.
        .to(leavingCard, { rotationY: 90, duration: TURN_HALF_S, ease: 'power2.in' })
        .to(leavingPose, { rotationX: 0, rotationY: 0, duration: TURN_HALF_S, ease: 'power2.out' }, '<')
        .call(() => {
          leaving.inert = true;
          arriving.inert = false;
        })
        .fromTo(
          arriving.querySelectorAll('[data-print]'),
          { opacity: 0 },
          { opacity: 1, duration: TURN_HALF_S + BACK_HOLD_S + TURN_FRONT_S, ease: 'power1.out' },
        )
        // Round to its back (their company's ribbon), a beat there, then round to their front.
        .fromTo(
          arrivingCard,
          { rotationY: 90 },
          { rotationY: 180, duration: TURN_HALF_S, ease: 'power2.out' },
          '<',
        )
        .to(arrivingCard, { rotationY: 360, duration: TURN_FRONT_S, ease: 'power2.inOut' }, `+=${BACK_HOLD_S}`);
    };

    faces.forEach((face, index) => face.addEventListener('click', () => show(index)));
    this.scrollableRow();
    this.swipeable((step) => show((current + step + speakers.length) % speakers.length));

    // Doug's first photo, of the first speaker, as the section comes into view.
    const observer = new IntersectionObserver(
      ([seen]) => {
        if (!seen?.isIntersecting) return;
        observer.disconnect();
        if (this.still.matches || turning || shooting) return;
        shooting = this.takePhoto(speakers[current]);
      },
      { threshold: 0.4 },
    );
    observer.observe(this);
  }

  /**
   * The speaker's photo taken through Doug's viewfinder on their card. The camera screen is over a blurred,
   * zoomed-in picture, and the card tips to an angle, turned towards Doug. The picture drifts a few times, the way
   * a camera moves while someone frames a shot, and Doug's camera moves with it. Meanwhile the focus box tries a
   * couple of places and, on the last move, settles on their face as the picture sharpens. Then the shot is taken
   * (`snap`): the shutter blinks black as the screen goes, and the picture zooms out to the whole photo as the card
   * straightens. The screen and the soft picture are set straight away, so the card comes round with them; the
   * timeline returned does the rest.
   */
  private takePhoto(speaker: HTMLElement): gsap.core.Timeline {
    const pose = requiredElement<HTMLElement>(speaker, '[data-card-pose]');
    const finder = requiredElement<HTMLElement>(speaker, '[data-viewfinder]');
    const frame = requiredElement<HTMLElement>(finder, '[data-frame]');
    const soft = requiredElement<HTMLElement>(finder, '[data-soft]');
    const screen = requiredElement<HTMLElement>(finder, '[data-camera-screen]');
    const box = requiredElement<HTMLElement>(finder, '[data-focus]');
    const shutter = requiredElement<HTMLElement>(finder, '[data-shutter]');
    const camera = requiredElement<HTMLElement>(this.photographer(), '[data-camera]');
    const reach = finder.offsetWidth * STRAY;
    const random = gsap.utils.random;
    const nearFace = (): gsap.TweenVars => ({ x: random(-reach, reach), y: random(-reach, reach) / 2 });
    // Doug is turned round on a wide screen, so his camera's sideways moves and turns are mirrored there.
    const mirror = this.wide.matches ? 1 : -1;

    finder.removeAttribute('data-locked');
    // Zoomed in on where the face usually is, so zooming out ends on the whole photo.
    gsap.set(frame, { scale: ZOOM_IN, transformOrigin: '50% 40%', x: 0, y: 0, rotation: 0 });
    gsap.set([soft, screen], { opacity: 1 });
    gsap.set(shutter, { opacity: 0 });
    gsap.set(box, nearFace());

    // Tipped towards Doug: he's left of the card on a wide screen and right of it on a phone.
    const shot = gsap
      .timeline()
      .to(pose, { rotationX: HELD_X_DEG, rotationY: -mirror * HELD_Y_DEG, duration: TIP_S, ease: 'power2.out' }, 0);
    for (let move = 1; move <= FRAMING_MOVES; move++) {
      const last = move === FRAMING_MOVES;
      // The picture drifts one way as the camera moves the other; the last move comes to rest on the face.
      const x = last ? 0 : random(-FRAMING_X_PX, FRAMING_X_PX);
      const y = last ? 0 : random(-FRAMING_Y_PX, FRAMING_Y_PX);
      const rotation = last ? 0 : random(-FRAMING_DEG, FRAMING_DEG);
      const step: gsap.TweenVars = { duration: FRAMING_S, ease: 'sine.inOut', overwrite: 'auto' };
      const dougX = -x * DOUG_SHARE * mirror;
      shot
        .to(frame, { x, y, rotation, ...step }, move === 1 ? 0 : '>')
        .to(camera, { x: dougX, y: -y * DOUG_SHARE, rotation: -rotation * mirror, ...step }, '<')
        .to(box, { ...(last ? { x: 0, y: 0 } : nearFace()), ...step }, '<');
    }
    return shot
      .to(soft, { opacity: 0, duration: FRAMING_S, ease: 'power1.out' }, '<')
      .call(() => finder.setAttribute('data-locked', ''))
      .fromTo(box, { scale: 1.2 }, { scale: 1, duration: LOCK_S, ease: 'power2.out' })
      .call(() => this.snap(speaker))
      // The shutter: black for a blink, and the camera screen is gone when it opens again.
      .set(shutter, { opacity: 1 })
      .set(screen, { opacity: 0 })
      .set(shutter, { opacity: 0 }, `+=${SHUTTER_S}`)
      .addLabel('develop')
      .to(frame, { scale: 1, duration: DEVELOP_S, ease: 'power3.out' }, 'develop')
      .to(pose, { rotationX: 0, rotationY: 0, duration: DEVELOP_S, ease: 'power2.inOut' }, 'develop');
  }

  /**
   * Doug photographs the speaker: the camera tips up to his eye, the flash goes, and a little print of the
   * speaker (their headshot in a cream frame) pops out of the camera and drops into the pile at his feet.
   */
  private snap(speaker: HTMLElement): void {
    const doug = this.photographer();
    const camera = requiredElement<HTMLElement>(doug, '[data-camera]');
    const flash = requiredElement<HTMLElement>(camera, '[data-flash]');
    const pile = requiredElement<HTMLElement>(doug, '[data-pile]');
    const headshot = requiredElement<HTMLImageElement>(speaker, '[data-headshot]');

    const print = document.createElement('span');
    print.className = 'absolute bottom-0 block w-1/2 rounded-xs bg-print p-0.5 pb-1.5 shadow-(--shadow-card)';
    const photo = document.createElement('img');
    photo.src = headshot.currentSrc || headshot.src;
    photo.alt = '';
    photo.className = 'aspect-square w-full rounded-xs object-cover object-top';
    print.append(photo);
    // Where it lands: a little to either side and turned a little, like a pile tossed together.
    print.style.left = `${gsap.utils.random(0, 45)}%`;
    pile.append(print);
    while (pile.children.length > PILE_MOST) pile.firstElementChild?.remove();

    // It comes out of the camera, on Doug's left on a phone and his right (he's turned round) on a wide screen.
    const fromCamera = this.wide.matches ? '60%' : '-60%';
    gsap
      .timeline()
      .to(camera, { rotation: -10, y: -4, duration: AIM_S, ease: 'power2.out', overwrite: 'auto' })
      .fromTo(
        flash,
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1.6, duration: FLASH_S, yoyo: true, repeat: 1 },
      )
      .fromTo(
        print,
        { opacity: 0, scale: 0.3, x: fromCamera, y: '-180%', rotation: 0 },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          rotation: gsap.utils.random(-18, 18),
          duration: DROP_S,
          ease: 'bounce.out',
        },
        '<0.05',
      )
      .to(camera, { rotation: 0, y: 0, duration: AIM_S, ease: 'power2.inOut' }, '<0.1');
  }

  /**
   * The Doug that's showing: there's one beside the card, and one under the heading on a wide screen, and only one
   * shows at a time.
   */
  private photographer(): HTMLElement {
    const dougs = [...this.querySelectorAll<HTMLElement>('[data-photographer]')];
    const doug = dougs.find((one) => one.checkVisibility());
    if (!doug) throw new Error('No Doug is showing in the Meet the Professionals spotlight.');
    return doug;
  }

  /**
   * The row of faces scrolls sideways when there are more than fit. A mouse can drag it like a finger; the button
   * at its end shows there are more and moves the row along, back to the start once it's at the end.
   */
  private scrollableRow(): void {
    const wrap = this.querySelector<HTMLElement>('[data-faces-wrap]');
    if (!wrap) return;
    const row = requiredElement<HTMLElement>(wrap, '[data-faces]');
    const more = requiredElement<HTMLButtonElement>(wrap, '[data-faces-more]');
    const measure = (): void => {
      wrap.toggleAttribute('data-overflow', row.scrollWidth > row.clientWidth + 1);
    };
    new ResizeObserver(measure).observe(row);
    more.addEventListener('click', () => {
      const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 1;
      row.scrollTo({ left: atEnd ? 0 : row.scrollLeft + row.clientWidth * 0.8 });
    });

    let lastX: number | null = null;
    let moved = 0;
    row.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse') return;
      lastX = event.clientX;
      moved = 0;
    });
    row.addEventListener('pointermove', (event) => {
      if (lastX === null) return;
      moved += Math.abs(event.clientX - lastX);
      row.scrollBy({ left: lastX - event.clientX, behavior: 'instant' });
      lastX = event.clientX;
    });
    const letGo = (): void => {
      lastX = null;
    };
    row.addEventListener('pointerup', letGo);
    row.addEventListener('pointerleave', letGo);
    // A drag that moved isn't a click on the face it started on.
    row.addEventListener(
      'click',
      (event) => {
        if (moved <= DRAG_PX) return;
        event.preventDefault();
        event.stopPropagation();
        moved = 0;
      },
      { capture: true },
    );
  }

  /**
   * A sideways swipe across the print on a touch screen moves to the next speaker (swiping left) or the previous
   * one. The print lets the browser keep vertical scrolling (`touch-pan-y`), so scrolling past still works.
   */
  private swipeable(step: (by: 1 | -1) => void): void {
    const stage = requiredElement<HTMLElement>(this, '[data-stage]');
    let start: number | null = null;
    stage.addEventListener('pointerdown', (event) => {
      start = event.pointerType === 'touch' ? event.clientX : null;
    });
    stage.addEventListener('pointerup', (event) => {
      if (start === null) return;
      const travelled = event.clientX - start;
      start = null;
      if (Math.abs(travelled) >= SWIPE_PX) step(travelled < 0 ? 1 : -1);
    });
    stage.addEventListener('pointercancel', () => {
      start = null;
    });
  }
}

customElements.define('speaker-spotlight', SpeakerSpotlight);
