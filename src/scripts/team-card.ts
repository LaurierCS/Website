const accents = ['#FF9FC4', '#FF9770', '#FFD670', '#268AF9', '#B1E0FF'];

document.querySelectorAll<HTMLElement>('[data-team-card]').forEach((card) => {
  const avatar = card.querySelector<HTMLElement>('.avatar');
  if (!avatar) return;
  const base = getComputedStyle(avatar).borderColor;
  card.addEventListener('mouseenter', () => {
    const pool = accents.filter((color) => color !== card.dataset.last);
    const next = pool[Math.floor(Math.random() * pool.length)] ?? accents[0];
    card.dataset.last = next;
    avatar.style.borderColor = next;
  });
  card.addEventListener('mouseleave', () => {
    avatar.style.borderColor = base;
  });
});

export {};
