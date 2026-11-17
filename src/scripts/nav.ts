const nav = document.querySelector<HTMLElement>('[data-nav]');

if (nav) {
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Desktop dropdown menu
  const toggle = nav.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const dropdown = nav.querySelector<HTMLElement>('[data-nav-dropdown]');

  if (toggle && dropdown) {
    // Open/close dropdown on click
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = toggle.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close dropdown when clicking a link
    dropdown.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target as Node) && !dropdown.contains(e.target as Node)) {
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Mobile menu
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
