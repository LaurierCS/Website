/**
 * Typed stubs for data that is not in Supabase yet.
 * Leave arrays empty. The pages then show a coming-soon line.
 * A row with `placeholder: true` must be labelled preview in the UI
 * and must never be presented as a real event, video, or file.
 */

// TODO(db): needs events.type — review | mtp | workshop | hackathon | other
export type EventType = 'review' | 'mtp' | 'workshop' | 'hackathon' | 'other';

// TODO(db): needs events.series, events.is_streamed, events.youtube_url
export type EventStub = {
  eventId: string;
  placeholder: boolean;
  type?: EventType;
  series?: string;
  seriesBlurb?: string;
  streamed?: boolean;
  youtubeUrl?: string | null;
  host?: string;
};

export const eventStubs: EventStub[] = [];

// TODO(db): needs event_resources (event_id, title, kind, url, note)
export type ResourceStub = {
  eventId: string;
  title: string;
  kind: string;
  url: string;
  note: string;
  placeholder: boolean;
};

export const resourceStubs: ResourceStub[] = [];

// TODO(db): needs events.series plus resources on the earlier events in that series
export const seriesDocStubs: ResourceStub[] = [];

// TODO(db): needs event_links (event_id, related_event_id, sort)
export type RelatedStub = {
  eventId: string;
  relatedId: string;
  sort: number;
  placeholder: boolean;
};

export const relatedStubs: RelatedStub[] = [];

// TODO(db): needs videos (title, url, published_at, thumb_url) or the YouTube API
export type VideoStub = {
  title: string;
  url: string;
  date: string;
  thumb: string;
  placeholder: boolean;
};

export const videoStubs: VideoStub[] = [];

// TODO(db): needs event_photos (event_id, url, alt)
export type PhotoStub = {
  eventId: string;
  url: string;
  alt: string;
  placeholder: boolean;
};

export const photoStubs: PhotoStub[] = [];

export function stubFor(eventId: string): EventStub | undefined {
  return eventStubs.find((row) => row.eventId === eventId);
}

export function resourcesFor(eventId: string): ResourceStub[] {
  return resourceStubs.filter((row) => row.eventId === eventId);
}

export function seriesDocsFor(eventId: string): ResourceStub[] {
  return seriesDocStubs.filter((row) => row.eventId === eventId);
}

export function relatedFor(eventId: string): RelatedStub[] {
  return relatedStubs.filter((row) => row.eventId === eventId).sort((a, b) => a.sort - b.sort);
}

export function photosFor(eventId: string): PhotoStub[] {
  return photoStubs.filter((row) => row.eventId === eventId);
}

export const TYPE_LABEL: Record<EventType, { label: string; pill: string; sticker: string }> = {
  review: { label: 'Midterm Review', pill: 'yellow', sticker: '' },
  mtp: { label: 'Industry Night', pill: 'pink', sticker: 'pink' },
  workshop: { label: 'Workshop', pill: 'orange', sticker: 'orange' },
  hackathon: { label: 'Hackathon', pill: '', sticker: 'blue' },
  other: { label: 'Event', pill: '', sticker: 'blue' },
};
