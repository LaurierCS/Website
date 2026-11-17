import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduce) {
  // Native scrolling already respects the nav offset via scroll-margin.
} else {
  const lenis = new Lenis({ autoRaf: true, anchors: { offset: -84 } });

  document.addEventListener('click', (event) => {
    const link = (event.target as Element | null)?.closest('a');
    if (!link) return;
    const url = new URL(link.href, location.href);
    const samePage = url.origin === location.origin && url.pathname === location.pathname && url.hash;
    if (!samePage) return;
    const target = document.querySelector(url.hash);
    if (!target) return;
    event.preventDefault();
    lenis.scrollTo(target as HTMLElement, { offset: -84 });
  });
}
