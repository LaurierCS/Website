/** Wall-clock instant in America/Toronto, independent of the viewer's zone. */
function torontoMs(iso: string, time: string): number {
  const match = time.match(/(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)?/i);
  let hour = match ? Number(match[1]) : 0;
  const minute = match ? Number(match[2] ?? 0) : 0;
  const suffix = match?.[3]?.toLowerCase().replace(/\./g, '');
  if (suffix === 'pm' && hour < 12) hour += 12;
  if (suffix === 'am' && hour === 12) hour = 0;

  const [year, month, day] = iso.split('-').map(Number);
  const asUtc = Date.UTC(year, month - 1, day, hour, minute);
  const offset = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Toronto',
    timeZoneName: 'shortOffset',
    hour: '2-digit',
  })
    .formatToParts(new Date(asUtc))
    .find((part) => part.type === 'timeZoneName')?.value;
  const parsed = offset?.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  const sign = parsed?.[1] === '-' ? -1 : 1;
  const minutes = sign * (Number(parsed?.[2] ?? 5) * 60 + Number(parsed?.[3] ?? 0));
  return asUtc - minutes * 60_000;
}

function label(target: number): string {
  const remaining = target - Date.now();
  if (remaining <= 0) return 'Happening now';
  const total = Math.floor(remaining / 1000);
  const days = Math.floor(total / 86_400);
  const hours = Math.floor((total % 86_400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (value: number) => String(value).padStart(2, '0');
  const clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return days > 0 ? `Starts in ${days}d ${clock}` : `Starts in ${clock}`;
}

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce) {
  document.querySelectorAll<HTMLElement>('[data-countdown]').forEach((el) => {
    const date = el.dataset.date;
    if (!date) return;
    const target = torontoMs(date, el.dataset.time ?? '');
    const tick = () => {
      el.textContent = label(target);
    };
    tick();
    window.setInterval(tick, 1000);
  });
}
