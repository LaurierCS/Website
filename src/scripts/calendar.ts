import { monthCells, monthLabel } from '../lib/dates';

type CalEvent = { id: string; title: string; date: string };

function paint(root: HTMLElement) {
  const year = Number(root.dataset.year);
  const month = Number(root.dataset.month);
  const today = root.dataset.today ?? '';
  const events = JSON.parse(root.dataset.events || '[]') as CalEvent[];
  const label = root.querySelector('[data-cal-label]');
  if (label) label.textContent = monthLabel(year, month);

  const grid = root.querySelector('[data-cal-grid]');
  if (!grid) return;
  grid.querySelectorAll('.cal-day').forEach((node) => node.remove());

  for (const cell of monthCells(year, month)) {
    const day = document.createElement('div');
    day.className = `cal-day${cell.inMonth ? '' : ' out'}${cell.iso === today ? ' today' : ''}`;
    day.append(document.createTextNode(String(cell.day)));
    for (const event of events) {
      if (event.date !== cell.iso) continue;
      const link = document.createElement('a');
      link.className = 'ev';
      link.href = `/events/${event.id}`;
      link.textContent = event.title;
      day.append(link);
    }
    grid.append(day);
  }
}

document.querySelectorAll<HTMLElement>('[data-calendar]').forEach((root) => {
  root.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-cal]');
    if (!button) return;
    let year = Number(root.dataset.year);
    let month = Number(root.dataset.month) + (button.dataset.cal === 'next' ? 1 : -1);
    if (month < 0) {
      month = 11;
      year -= 1;
    }
    if (month > 11) {
      month = 0;
      year += 1;
    }
    root.dataset.year = String(year);
    root.dataset.month = String(month);
    paint(root);
  });
});
