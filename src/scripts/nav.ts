const nav = document.querySelector<HTMLElement>('[data-nav]');

if (nav) {
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const burger = nav.querySelector<HTMLButtonElement>('[data-burger]');
burger?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    burger?.setAttribute('aria-expanded', 'false');
  });
});

const accents = ['#FF9FC4', '#FF9770', '#FFD670', '#268AF9', '#B1E0FF'];
nav.querySelectorAll<HTMLAnchorElement>('[data-nav-link]').forEach((link) => {
  let last = '';
  link.addEventListener('mouseenter', () => {
    const pool = accents.filter((color) => color !== last);
    const next = pool[Math.floor(Math.random() * pool.length)] ?? accents[0];
    last = next;
    link.style.color = next;
    link.style.setProperty('--underline', next);
    link.classList.add('is-hot');
  });
  link.addEventListener('mouseleave', () => {
    link.style.color = '';
    link.classList.remove('is-hot');
  });
});
}

export {};
