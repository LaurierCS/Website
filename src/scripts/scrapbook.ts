const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll<HTMLElement>('[data-scrapbook]').forEach((root) => {
  root.querySelectorAll<HTMLImageElement>('[data-letter]').forEach((img, index) => {
    const rotation = Math.random() * 6 - 3;
    const offsetY = Math.random() * 2 - 1;
    const scale = Math.random() * 0.04 + 0.98;
    img.style.transform = `rotate(${rotation}deg) translateY(${offsetY}px) scale(${scale})`;
    if (!reduce) {
      img.style.animation = `scrapbook-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 60}ms both`;
    }
  });
});
