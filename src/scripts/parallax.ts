const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const nodes = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];

if (!reduce && nodes.length) {
  let frame = 0;
  const paint = () => {
    frame = 0;
    for (const el of nodes) {
      const amount = Number(el.dataset.parallax) || 12;
      const rect = el.getBoundingClientRect();
      const delta = rect.top + rect.height / 2 - window.innerHeight / 2;
      const shift = Math.max(-amount, Math.min(amount, -delta / 28));
      el.style.translate = `0px ${shift.toFixed(1)}px`;
    }
  };
  const request = () => {
    if (!frame) frame = requestAnimationFrame(paint);
  };
  paint();
  window.addEventListener('scroll', request, { passive: true });
}
