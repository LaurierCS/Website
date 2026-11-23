// Shows the page only once it can be shown in its final place: with the brand fonts loaded (so no text jumps when
// they arrive), the page's own scripts set up (so nothing they switch on, like the calendar's month arrows, pops
// in and shifts things) and scrolled to where it belongs (back where you were on a refresh, or the section in the
// address, like #events). Otherwise the browser draws the top of the page first and jumps a moment later.
//
// Runs inline at the end of the page (BaseLayout), right as the page finishes being read. The page was hidden at
// the start of <head> (`data-arriving`); without JavaScript it is never hidden.
(() => {
  const page = document.documentElement;
  const key = `scroll:${location.pathname}${location.hash}`;
  const reload = performance.getEntriesByType('navigation')[0]?.type === 'reload';

  // Remember where you were, for a refresh. Storage can be blocked (private windows); then a refresh starts at
  // the top or the section in the address, which is fine.
  addEventListener('pagehide', () => {
    try {
      sessionStorage.setItem(key, String(scrollY));
    } catch {}
  });

  const savedScroll = () => {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  };

  // The section named in the address. A hand-typed address can hold a broken escape (`/#%`) that cannot be
  // decoded; that names no section, rather than leaving the page hidden.
  const sectionInAddress = () => {
    try {
      return document.getElementById(decodeURIComponent(location.hash.slice(1)));
    } catch {
      return null;
    }
  };

  const arrive = () => {
    const saved = reload ? savedScroll() : null;
    if (saved !== null) scrollTo(0, Number(saved));
    else sectionInAddress()?.scrollIntoView();
    page.removeAttribute('data-arriving');
  };

  // The fonts are preloaded, so this is quick, and cached after the first visit. The page's scripts have all run
  // by DOMContentLoaded. Never wait more than a moment, whatever happens.
  const ready = Promise.all([
    document.fonts.load('1em "Dosis Variable"'),
    document.fonts.load('1em "Montserrat Variable"'),
    new Promise((resolve) => addEventListener('DOMContentLoaded', resolve, { once: true })),
  ]);
  Promise.race([ready, new Promise((resolve) => setTimeout(resolve, 700))]).then(arrive, arrive);
})();
