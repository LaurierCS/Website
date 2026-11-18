/**
 * A typed fake of `EventReader`. Tests set the events or the failure they need.
 */
import type { Event } from '../domain/event';
import type { AppError } from '../domain/errors';
import type { EventReader } from '../domain/ports';

export const CP312_REVIEW: Event = {
  id: '0b6f9c2e-7a41-4d5b-8e3c-2f1a9b8c7d6e',
  title: 'CP312 Midterm Review',
  description: null,
  date: '2026-11-12',
  time: '7:30PM',
  location: 'N2085',
  pictureUrl: null,
};

export class FakeEventReader implements EventReader {
  events: readonly Event[] = [];
  /** When set, `listEvents` throws this instead. */
  failWith: AppError | null = null;

  async listEvents(): Promise<readonly Event[]> {
    if (this.failWith) throw this.failWith;
    return this.events;
  }
}
