import { changedEventFields, formValuesFor, toEventFields, unreadableTime } from '../../src/lib/event-form';
import type { Event } from '../../src/types/event';

const EVENT: Event = {
  id: '0b6f9c2e-7a41-4d5b-8e3c-2f1a9b8c7d6e',
  title: 'CP312 Midterm Review',
  description: null,
  date: '2026-11-12',
  time: '7:30PM',
  location: 'N2085',
  pictureUrl: null,
};

describe('the event form', () => {
  it('fills in from a saved event, with the time as the picker shows it', () => {
    expect(formValuesFor(EVENT)).toEqual({
      title: 'CP312 Midterm Review',
      date: '2026-11-12',
      time: '19:30',
      location: 'N2085',
      description: '',
    });
  });

  it('leaves a time it cannot read out of the picker and reports it as written', () => {
    const tbd = { ...EVENT, time: 'TBD' };

    expect(formValuesFor(tbd).time).toBe('');
    expect(unreadableTime(tbd)).toBe('TBD');
    expect(unreadableTime(EVENT)).toBeNull();
  });

  it('saves times like 7:30PM and empty text as no value', () => {
    expect(toEventFields({ title: ' Hack Night ', date: '2026-12-01', time: '', location: ' ', description: '' })).toEqual({
      title: 'Hack Night',
      date: '2026-12-01',
      time: null,
      location: null,
      description: null,
    });
  });

  it('keeps only the fields that were changed', () => {
    const values = { ...formValuesFor(EVENT), location: 'BA201' };

    expect(changedEventFields(values, { location: true })).toEqual({ location: 'BA201' });
    expect(changedEventFields(values, {})).toEqual({});
  });
});
