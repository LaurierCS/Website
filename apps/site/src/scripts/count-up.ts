/**
 * Counts the hero's numbers up from 0 the first time they come into view. They all start together, but the bigger
 * the number, the longer it runs, so 20 lands first, then 44, and 4,000 keeps climbing after both. Each lands with
 * a small pop. With reduced motion the final numbers the page was sent with just stay.
 */
import { gsap } from 'gsap';
import { formatCount } from '../lib/count';

/** Seconds a number takes to count up: longer for bigger numbers, so the biggest finishes last and feels big. */
function countDuration(target: number): number {
  return 0.6 + Math.log10(Math.max(target, 1)) * 0.5;
}

function countUp(counters: readonly HTMLElement[]): void {
  const timeline = gsap.timeline();
  for (const counter of counters) {
    const target = Number(counter.dataset.countTo);
    const suffix = counter.dataset.suffix ?? '';
    const shown = { value: 0 };

    const duration = countDuration(target);

    // Every count starts at 0 on the timeline; each pop starts when its own count lands.
    timeline
      .to(
        shown,
        {
          value: target,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            counter.textContent = formatCount(Math.round(shown.value), suffix);
          },
        },
        0,
      )
      .fromTo(counter, { scale: 1.15 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' }, duration);
  }
}

const lists = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ? []
  : document.querySelectorAll<HTMLElement>('[data-count-up]');

for (const list of lists) {
  const counters = [...list.querySelectorAll<HTMLElement>('[data-count-to]')];

  // Start at 0 straight away, so the numbers don't flash their final value before counting.
  for (const counter of counters) counter.textContent = formatCount(0, counter.dataset.suffix ?? '');

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      countUp(counters);
    },
    { threshold: 0.6 },
  );
  observer.observe(list);
}
