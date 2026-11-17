function apply(root: HTMLElement) {
  const type = root.querySelector<HTMLButtonElement>('.chip.on')?.dataset.f ?? 'all';
  const query = root.querySelector<HTMLInputElement>('[data-search-input]')?.value.trim().toLowerCase() ?? '';

  const match = (item: HTMLElement, useType: boolean) => {
    const typeOk = !useType || type === 'all' || item.dataset.type === type;
    const textOk = !query || (item.dataset.search ?? '').includes(query);
    item.hidden = !(typeOk && textOk);
  };

  root.querySelectorAll<HTMLElement>('[data-upcoming] [data-item]').forEach((item) => match(item, false));
  root.querySelectorAll<HTMLElement>('[data-archive] [data-item]').forEach((item) => match(item, true));

  root.querySelectorAll<HTMLElement>('[data-term]').forEach((block) => {
    const visible = block.querySelectorAll('[data-item]:not([hidden])').length;
    block.hidden = visible === 0;
  });

  const empty = root.querySelector<HTMLElement>('[data-empty]');
  const archiveVisible = root.querySelectorAll('[data-archive] [data-item]:not([hidden])').length;
  if (!empty) return;
  const showEmpty = archiveVisible === 0 && (type !== 'all' || query.length > 0);
  empty.hidden = !showEmpty;
  if (showEmpty) {
    empty.textContent = type !== 'all' && !query
      ? 'Event types are not in the database yet, so this filter has nothing to show.'
      : 'No past events match that search.';
  }
}

document.querySelectorAll<HTMLElement>('[data-browser]').forEach((root) => {
  const initial = root.dataset.initial || 'all';
  root.querySelectorAll<HTMLButtonElement>('[data-f]').forEach((chip) => {
    chip.classList.toggle('on', chip.dataset.f === initial);
    chip.addEventListener('click', () => {
      root.querySelectorAll('[data-f]').forEach((node) => node.classList.remove('on'));
      chip.classList.add('on');
      const url = new URL(window.location.href);
      if (chip.dataset.f && chip.dataset.f !== 'all') url.searchParams.set('type', chip.dataset.f);
      else url.searchParams.delete('type');
      history.replaceState(null, '', url);
      apply(root);
    });
  });
  root.querySelector('[data-search-input]')?.addEventListener('input', () => apply(root));
  apply(root);
});

export {};
