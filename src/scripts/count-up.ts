const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix ?? '';
  if (reduce || !Number.isFinite(target)) return;

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 1400);
      const eased = 1 - (1 - progress) ** 3;
      el.textContent = `${Math.round(eased * target).toLocaleString('en-US')}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { threshold: 0.5 });

  observer.observe(el);
});
