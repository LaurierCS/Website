import { termOf, todayIso } from './dates';
import type { EventRecord } from './queries/events';

export function splitEvents(events: EventRecord[], today = todayIso()) {
  const upcoming = events
    .filter((event) => event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
  const past = events
    .filter((event) => event.date < today)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
  return { upcoming, past, next: upcoming[0] ?? null };
}

export function groupByTerm(events: EventRecord[]) {
  const buckets = new Map<string, { label: string; sort: number; events: EventRecord[] }>();
  for (const event of events) {
    const term = termOf(event.date);
    const bucket = buckets.get(term.label) ?? { label: term.label, sort: term.sort, events: [] };
    bucket.events.push(event);
    buckets.set(term.label, bucket);
  }
  return [...buckets.values()].sort((a, b) => b.sort - a.sort);
}
