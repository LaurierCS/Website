import type { Event } from '../../src/types/event';

/** A minimal v2-shaped event for tests; pass only what differs. */
export function sampleEvent(overrides: Partial<Event> & Pick<Event, 'id' | 'title' | 'date'>): Event {
  return {
    description: null,
    category: 'social',
    startTime: null,
    endTime: null,
    location: null,
    willStream: false,
    streamUrl: null,
    coverPath: null,
    coverPhotoId: null,
    pictureUrl: null,
    ...overrides,
  };
}