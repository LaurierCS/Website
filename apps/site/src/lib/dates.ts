const ZONE = 'America/Toronto';

export function todayIso(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export function dateParts(iso: string) {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return {
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: String(date.getDate()),
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
    long: date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    monthName: date.toLocaleDateString('en-US', { month: 'long' }),
    year,
    monthIndex: month - 1,
  };
}

export function monthLabel(year: number, monthIndex: number): string {
  return new Date(year, monthIndex, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export type MonthCell = { day: number; inMonth: boolean; iso: string };

function isoFrom(year: number, monthIndex: number, day: number): string {
  const date = new Date(year, monthIndex, day);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

/** Sunday-first grid, including the leading and trailing days from neighbour months. */
export function monthCells(year: number, monthIndex: number): MonthCell[] {
  const lead = new Date(year, monthIndex, 1).getDay();
  const count = new Date(year, monthIndex + 1, 0).getDate();
  const prevCount = new Date(year, monthIndex, 0).getDate();
  const cells: MonthCell[] = [];

  for (let i = 0; i < lead; i++) {
    const day = prevCount - lead + 1 + i;
    cells.push({ day, inMonth: false, iso: isoFrom(year, monthIndex - 1, day) });
  }
  for (let day = 1; day <= count; day++) {
    cells.push({ day, inMonth: true, iso: isoFrom(year, monthIndex, day) });
  }
  let next = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: next, inMonth: false, iso: isoFrom(year, monthIndex + 1, next) });
    next += 1;
  }
  return cells;
}

/** Sep–Dec Fall, Jan–Apr Winter, May–Aug Spring. `sort` is newest-last so callers can reverse it. */
export function termOf(iso: string): { label: string; sort: number } {
  const [year, month] = iso.split('-').map(Number);
  const season = month >= 9 ? 'Fall' : month <= 4 ? 'Winter' : 'Spring';
  const order = season === 'Winter' ? 1 : season === 'Spring' ? 2 : 3;
  return { label: `${season} ${year}`, sort: year * 10 + order };
}

export function daysUntil(iso: string, today = todayIso()): number {
  const [y, m, d] = iso.split('-').map(Number);
  const [ty, tm, td] = today.split('-').map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(ty, tm - 1, td)) / 86_400_000);
}

export function startsInLabel(iso: string, today = todayIso()): string {
  const days = daysUntil(iso, today);
  if (days < 0) return 'Already happened';
  if (days === 0) return 'Happening today';
  if (days === 1) return 'Starts in 1 day';
  return `Starts in ${days} days`;
}

export type Clock = { h: number; m: number };

/** Pulls the first clock time out of free-text like "7:00 PM" or "7:00 – 9:00 PM". */
export function parseClock(time: string | null | undefined): Clock | null {
  if (!time) return null;
  const match = time.match(/(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)?/i);
  if (!match) return null;
  let h = Number(match[1]);
  const m = Number(match[2] ?? 0);
  if (h > 23 || m > 59) return null;
  const ap = match[3]?.toLowerCase().replace(/\./g, '');
  if (ap === 'pm' && h < 12) h += 12;
  if (ap === 'am' && h === 12) h = 0;
  if (!ap && h > 23) return null;
  return { h, m };
}

export function whenWhere(time: string | null, location: string | null): string {
  return `${time?.trim() || 'Time TBA'} · ${location?.trim() || 'Location TBA'}`;
}
