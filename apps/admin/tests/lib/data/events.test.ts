import { UnavailableError } from '../../../src/lib/server/errors';
import { createEvent, deleteEvent, getEvent, importEvents, listEvents, updateEvent } from '../../../src/lib/data/events';
import type { PictureChange } from '../../../src/lib/ui/images';
import { BUCKETS, removeImage, uploadImage } from '../../../src/lib/server/storage';
import type { Event } from '../../../src/types/event';
import { installV2Supabase, STORAGE_BASE } from '../server/supabase-v2-mock';

vi.mock('../../../src/lib/server/supabase');
vi.mock('../../../src/lib/server/storage', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../src/lib/server/storage')>()),
  uploadImage: vi.fn(),
  removeImage: vi.fn(),
}));

const GOOD_ROW = {
  id: '0b6f9c2e-7a41-4d5b-8e3c-2f1a9b8c7d6e',
  title: 'CP312 Midterm Review',
  description: null,
  date: '2026-11-18',
  start_time: '17:30:00',
  end_time: null,
  location: 'BA110',
  category: 'review',
  will_stream: false,
  stream_url: null,
  event_photos: [] as const,
};

const EVENT: Event = {
  id: GOOD_ROW.id,
  title: 'CP312 Midterm Review',
  description: null,
  date: '2026-11-18',
  category: 'review',
  startTime: '17:30:00',
  endTime: null,
  location: 'BA110',
  willStream: false,
  streamUrl: null,
  coverPath: null,
  coverPhotoId: null,
  pictureUrl: null,
};

const OLD_PATH = `${EVENT.id}/photos/old.png`;
const NEW_PATH = `${EVENT.id}/photos/new.png`;
const OLD_PICTURE = `${STORAGE_BASE}/${BUCKETS.events}/${OLD_PATH}`;
const NEW_IMAGE = { file: new File(['x'], 'new.png', { type: 'image/png' }), extension: 'png' };
const KEEP: PictureChange = { kind: 'keep' };
const REPLACE: PictureChange = { kind: 'replace', image: NEW_IMAGE };
const REMOVE: PictureChange = { kind: 'remove' };

const FIELDS = {
  title: 'Hack Night',
  date: '2026-12-01',
  category: 'social' as const,
  startTime: '19:30:00',
  endTime: null,
  location: 'BA110',
  description: null,
  willStream: false,
  streamUrl: null,
};

const SAVED = { data: [{ id: EVENT.id }], error: null };
const FAILED = { data: null, error: { message: 'boom' } };
const NOTHING_SAVED = { data: [], error: null };

function eventsTable(overrides: Record<string, unknown> = {}) {
  return {
    select: vi.fn(() => ({
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      eq: vi.fn(() => ({ maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }) })),
    })),
    insert: vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) })),
    update: vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) })) })),
    delete: vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) })) })),
    ...overrides,
  };
}

function photosTable(overrides: Record<string, unknown> = {}) {
  return {
    insert: vi.fn().mockResolvedValue({ error: null }),
    update: vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) })),
    delete: vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) })),
    ...overrides,
  };
}

beforeEach(() => {
  vi.mocked(uploadImage).mockResolvedValue(NEW_PATH);
});

describe('listEvents', () => {
  it('turns rows into events', async () => {
    const order = vi.fn().mockResolvedValue({ data: [GOOD_ROW], error: null });
    installV2Supabase({ events: { select: vi.fn(() => ({ order })) } });

    expect(await listEvents()).toEqual([EVENT]);
  });

  it('leaves out a malformed row instead of failing every event', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const badRow = { ...GOOD_ROW, id: '1c7a0d3f-8b52-4e6c-9f4d-3a2b1c0d9e8f', category: 'not-a-category' };
    const order = vi.fn().mockResolvedValue({ data: [GOOD_ROW, badRow], error: null });
    installV2Supabase({ events: { select: vi.fn(() => ({ order })) } });

    expect((await listEvents()).map((event) => event.id)).toEqual([GOOD_ROW.id]);
    expect(warn).toHaveBeenCalledWith('events.row_skipped', { id: badRow.id, problems: ['category'] });
  });

  it('reports a failed read as unavailable', async () => {
    const order = vi.fn().mockResolvedValue(FAILED);
    installV2Supabase({ events: { select: vi.fn(() => ({ order })) } });

    await expect(listEvents()).rejects.toBeInstanceOf(UnavailableError);
  });
});

describe('getEvent', () => {
  it('returns the event', async () => {
    installV2Supabase({
      events: {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({ maybeSingle: vi.fn().mockResolvedValue({ data: GOOD_ROW, error: null }) })),
        })),
      },
    });

    expect(await getEvent(EVENT.id)).toEqual(EVENT);
  });

  it('returns null when there is no such event', async () => {
    installV2Supabase({
      events: { select: vi.fn(() => ({ eq: vi.fn(() => ({ maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }) })) })) },
    });

    expect(await getEvent(EVENT.id)).toBeNull();
  });

  it('returns null for an id that is not an id, without asking Supabase', async () => {
    const from = installV2Supabase({ events: eventsTable() });

    expect(await getEvent('not-an-id')).toBeNull();
    expect(from).not.toHaveBeenCalled();
  });

  it('fails, rather than saying "not found", when the read fails or the row is malformed', async () => {
    installV2Supabase({
      events: {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({ maybeSingle: vi.fn().mockResolvedValue(FAILED) })),
        })),
      },
    });
    await expect(getEvent(EVENT.id)).rejects.toBeInstanceOf(UnavailableError);

    vi.spyOn(console, 'warn').mockImplementation(() => {});
    installV2Supabase({
      events: {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: { ...GOOD_ROW, stream_url: 'not a url' }, error: null }),
          })),
        })),
      },
    });
    await expect(getEvent(EVENT.id)).rejects.toBeInstanceOf(UnavailableError);
  });
});

describe('createEvent', () => {
  it('saves the fields as v2 columns, with no picture', async () => {
    const insert = vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) }));
    installV2Supabase({ events: { insert }, event_photos: photosTable() });

    await createEvent(FIELDS, KEEP);

    expect(insert).toHaveBeenCalledWith({
      title: FIELDS.title,
      date: FIELDS.date,
      description: FIELDS.description,
      location: FIELDS.location,
      category: FIELDS.category,
      start_time: FIELDS.startTime,
      end_time: FIELDS.endTime,
      will_stream: FIELDS.willStream,
      stream_url: FIELDS.streamUrl,
    });
    expect(uploadImage).not.toHaveBeenCalled();
  });

  it('saves the event, then uploads a cover photo under its id', async () => {
    const insert = vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) }));
    const photoInsert = vi.fn().mockResolvedValue({ error: null });
    installV2Supabase({ events: { insert }, event_photos: { insert: photoInsert } });

    await createEvent(FIELDS, REPLACE);

    expect(uploadImage).toHaveBeenCalledWith(BUCKETS.events, NEW_IMAGE, `${EVENT.id}/photos`);
    expect(photoInsert).toHaveBeenCalledWith({ event_id: EVENT.id, path: NEW_PATH, is_cover: true, sort_order: 0 });
  });

  it.each([
    ['Supabase errors', FAILED],
    ['nothing was saved', NOTHING_SAVED],
  ])('fails when %s on insert', async (_, result) => {
    installV2Supabase({ events: { insert: vi.fn(() => ({ select: vi.fn().mockResolvedValue(result) })) } });

    await expect(createEvent(FIELDS, KEEP)).rejects.toThrow('"Hack Night" couldn\'t be saved.');
  });

  it('rolls the event back when the cover photo cannot be saved', async () => {
    const eventDelete = vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) }));
    installV2Supabase({
      events: { insert: vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) })), delete: eventDelete },
      event_photos: { insert: vi.fn().mockResolvedValue({ error: { message: 'nope' } }) },
    });

    await expect(createEvent(FIELDS, REPLACE)).rejects.toThrow("The picture couldn't be saved.");
    expect(removeImage).toHaveBeenCalledWith(BUCKETS.events, NEW_PATH);
    expect(eventDelete).toHaveBeenCalled();
  });
});

describe('updateEvent', () => {
  const withPicture: Event = { ...EVENT, coverPath: OLD_PATH, coverPhotoId: '9a0b1c2d-3e4f-5678-9abc-def012345678', pictureUrl: OLD_PICTURE };

  it('sends only the changed fields and leaves the picture alone', async () => {
    const update = vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) })) }));
    installV2Supabase({ events: { update } });

    await updateEvent(withPicture, { location: 'BA201' }, KEEP);

    expect(update).toHaveBeenCalledWith({ location: 'BA201' });
    expect(uploadImage).not.toHaveBeenCalled();
  });

  it('replaces the cover photo and deletes the old file', async () => {
    const photoUpdate = vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) }));
    installV2Supabase({ events: eventsTable(), event_photos: { update: photoUpdate } });

    await updateEvent(withPicture, {}, REPLACE);

    expect(uploadImage).toHaveBeenCalledWith(BUCKETS.events, NEW_IMAGE, `${EVENT.id}/photos`);
    expect(photoUpdate).toHaveBeenCalled();
    expect(removeImage).toHaveBeenCalledWith(BUCKETS.events, OLD_PATH);
  });

  it('removes the cover photo row and deletes the file', async () => {
    const photoDelete = vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) }));
    installV2Supabase({ events: eventsTable(), event_photos: { delete: photoDelete } });

    await updateEvent(withPicture, {}, REMOVE);

    expect(photoDelete).toHaveBeenCalled();
    expect(removeImage).toHaveBeenCalledWith(BUCKETS.events, OLD_PATH);
  });
});

describe('deleteEvent', () => {
  it('deletes the event, then its cover file', async () => {
    const eq = vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) }));
    installV2Supabase({ events: { delete: vi.fn(() => ({ eq })) } });

    await deleteEvent({ ...EVENT, coverPath: OLD_PATH, pictureUrl: OLD_PICTURE });

    expect(eq).toHaveBeenCalledWith('id', EVENT.id);
    expect(removeImage).toHaveBeenCalledWith(BUCKETS.events, OLD_PATH);
  });

  it('deletes an event with no picture without touching storage', async () => {
    installV2Supabase({ events: eventsTable() });

    await deleteEvent(EVENT);

    expect(removeImage).not.toHaveBeenCalled();
  });
});

describe('importEvents', () => {
  it('inserts new rows and updates changed ones in v2', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) })) }));
    installV2Supabase({ events: { insert, update } });

    await importEvents({ added: [FIELDS], changed: [{ id: EVENT.id, fields: { ...FIELDS, title: 'Hack Night 2' } }] });

    expect(insert).toHaveBeenCalled();
    expect(update).toHaveBeenCalled();
  });

  it('says nothing was changed when a changed row is gone', async () => {
    installV2Supabase({
      events: { update: vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn().mockResolvedValue(NOTHING_SAVED) })) })) },
    });

    await expect(importEvents({ added: [], changed: [{ id: EVENT.id, fields: FIELDS }] })).rejects.toThrow(
      new UnavailableError("The import couldn't be saved, so nothing was changed."),
    );
  });
});