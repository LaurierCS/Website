import { parseClock } from './dates';
import type { EventRecord } from './queries/events';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function escapeText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

function plusOneHour(h: number, m: number): { h: number; m: number; extraDay: boolean } {
  const total = h * 60 + m + 60;
  return { h: Math.floor(total / 60) % 24, m: total % 60, extraDay: total >= 24 * 60 };
}

function nextDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d + 1);
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
}

/** Floating local time. Avoids formatting through the server's timezone. */
export function buildIcs(event: EventRecord): string {
  const clock = parseClock(event.time);
  const day = event.date.replace(/-/g, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Laurier Computing Society//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@lauriercs.org`,
    `SUMMARY:${escapeText(event.title)}`,
    `LOCATION:${escapeText(event.location?.trim() || 'Wilfrid Laurier University')}`,
    `DESCRIPTION:${escapeText(event.description?.trim() || event.title)}`,
  ];

  if (!clock) {
    lines.push(`DTSTART;VALUE=DATE:${day}`, `DTEND;VALUE=DATE:${nextDate(event.date)}`);
  } else {
    const end = plusOneHour(clock.h, clock.m);
    const endDay = end.extraDay ? nextDate(event.date) : day;
    lines.push(
      `DTSTART:${day}T${pad(clock.h)}${pad(clock.m)}00`,
      `DTEND:${endDay}T${pad(end.h)}${pad(end.m)}00`,
    );
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\r\n');
}

export function icsHref(event: EventRecord): string {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(buildIcs(event))}`;
}
