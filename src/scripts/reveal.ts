const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (!reduce && nodes.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );
  nodes.forEach((node) => observer.observe(node));
}
