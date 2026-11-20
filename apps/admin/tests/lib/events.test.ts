import { UnavailableError } from '../../src/lib/errors';
import { createEvent, deleteEvent, getEvent, listEvents, updateEvent } from '../../src/lib/events';
import type { PictureChange } from '../../src/lib/images';
import { BUCKETS, removeImage, uploadImage } from '../../src/lib/storage';
import { getSupabase } from '../../src/lib/supabase';
import type { Event } from '../../src/types/event';

vi.mock('../../src/lib/supabase');
vi.mock('../../src/lib/storage', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../src/lib/storage')>()),
  uploadImage: vi.fn(),
  removeImage: vi.fn(),
}));

const GOOD_ROW = {
  id: '0b6f9c2e-7a41-4d5b-8e3c-2f1a9b8c7d6e',
  title: 'CP312 Midterm Review',
  description: null,
  date: '2026-11-18',
  time: '5:30PM',
  location: 'BA110',
  picture_url: '',
};

const EVENT: Event = {
  id: GOOD_ROW.id,
  title: 'CP312 Midterm Review',
  description: null,
  date: '2026-11-18',
  time: '5:30PM',
  location: 'BA110',
  pictureUrl: null,
};

const OLD_PICTURE = 'https://lcs.supabase.co/storage/v1/object/public/events-images/old.png';
const NEW_PICTURE = 'https://lcs.supabase.co/storage/v1/object/public/events-images/new.png';
const NEW_IMAGE = { file: new File(['x'], 'new.png', { type: 'image/png' }), extension: 'png' };
const KEEP: PictureChange = { kind: 'keep' };
const REPLACE: PictureChange = { kind: 'replace', image: NEW_IMAGE };
const REMOVE: PictureChange = { kind: 'remove' };

const FIELDS = { title: 'Hack Night', date: '2026-12-01', time: '7:30PM', location: 'BA110', description: null };
const SAVED = { data: [{ id: EVENT.id }], error: null };
const FAILED = { data: null, error: { message: 'boom' } };
const NOTHING_SAVED = { data: [], error: null };

/** Makes `from('events').select(...).order(...)` answer with `result`, the way supabase-js does. */
function mockEventsQuery(result: { data: unknown; error: unknown }) {
  const order = vi.fn().mockResolvedValue(result);
  const query = { select: vi.fn(() => ({ order })) };
  vi.mocked(getSupabase).mockReturnValue({ from: vi.fn(() => query) } as unknown as ReturnType<typeof getSupabase>);
}

/** Makes `from('events').select(...).eq(...).maybeSingle()` answer with `result`. Returns the `select` mock. */
function mockGet(result: { data: unknown; error: unknown }) {
  const select = vi.fn(() => ({ eq: vi.fn(() => ({ maybeSingle: vi.fn().mockResolvedValue(result) })) }));
  vi.mocked(getSupabase).mockReturnValue({ from: vi.fn(() => ({ select })) } as unknown as ReturnType<typeof getSupabase>);
  return select;
}

/** Makes `from('events').insert(...).select(...)` answer with `result`. Returns the `insert` mock. */
function mockInsert(result: { data: unknown; error: unknown }) {
  const insert = vi.fn(() => ({ select: vi.fn().mockResolvedValue(result) }));
  vi.mocked(getSupabase).mockReturnValue({ from: vi.fn(() => ({ insert })) } as unknown as ReturnType<typeof getSupabase>);
  return insert;
}

/** Makes `from('events').update(...).eq(...).select(...)` answer with `result`. Returns the mocks a test checks. */
function mockUpdate(result: { data: unknown; error: unknown }) {
  const eq = vi.fn(() => ({ select: vi.fn().mockResolvedValue(result) }));
  const update = vi.fn(() => ({ eq }));
  vi.mocked(getSupabase).mockReturnValue({ from: vi.fn(() => ({ update })) } as unknown as ReturnType<typeof getSupabase>);
  return { update, eq };
}

/** Makes `from('events').delete().eq(...).select(...)` answer with `result`. Returns the `eq` mock. */
function mockDelete(result: { data: unknown; error: unknown }) {
  const eq = vi.fn(() => ({ select: vi.fn().mockResolvedValue(result) }));
  vi.mocked(getSupabase).mockReturnValue({
    from: vi.fn(() => ({ delete: vi.fn(() => ({ eq })) })),
  } as unknown as ReturnType<typeof getSupabase>);
  return eq;
}

beforeEach(() => vi.mocked(uploadImage).mockResolvedValue(NEW_PICTURE));

describe('listEvents', () => {
  it('turns rows into events, with an empty picture as no picture', async () => {
    mockEventsQuery({ data: [GOOD_ROW], error: null });

    expect(await listEvents()).toEqual([EVENT]);
  });

  it('leaves out a malformed row instead of failing every event', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const badRow = { ...GOOD_ROW, id: '1c7a0d3f-8b52-4e6c-9f4d-3a2b1c0d9e8f', picture_url: 'not a link' };
    mockEventsQuery({ data: [GOOD_ROW, badRow], error: null });

    const events = await listEvents();

    expect(events.map((event) => event.id)).toEqual([GOOD_ROW.id]);
    expect(warn).toHaveBeenCalledWith('events.row_skipped', { id: badRow.id, problems: ['pictureUrl'] });
  });

  it('reports a failed read as unavailable', async () => {
    mockEventsQuery(FAILED);

    await expect(listEvents()).rejects.toBeInstanceOf(UnavailableError);
  });
});

describe('getEvent', () => {
  it('returns the event', async () => {
    mockGet({ data: GOOD_ROW, error: null });

    expect(await getEvent(EVENT.id)).toEqual(EVENT);
  });

  it('returns null when there is no such event', async () => {
    mockGet({ data: null, error: null });

    expect(await getEvent(EVENT.id)).toBeNull();
  });

  it('returns null for an id that is not an id, without asking Supabase', async () => {
    const select = mockGet({ data: null, error: null });

    expect(await getEvent('not-an-id')).toBeNull();
    expect(select).not.toHaveBeenCalled();
  });

  it('fails, rather than saying "not found", when the read fails or the row is malformed', async () => {
    mockGet(FAILED);
    await expect(getEvent(EVENT.id)).rejects.toBeInstanceOf(UnavailableError);

    vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockGet({ data: { ...GOOD_ROW, picture_url: 'not a link' }, error: null });
    await expect(getEvent(EVENT.id)).rejects.toBeInstanceOf(UnavailableError);
  });
});

describe('createEvent', () => {
  it('saves the fields as they are, with no picture', async () => {
    const insert = mockInsert(SAVED);

    await createEvent(FIELDS, KEEP);

    expect(insert).toHaveBeenCalledWith({ ...FIELDS, picture_url: null });
    expect(uploadImage).not.toHaveBeenCalled();
  });

  it('uploads the picture first and saves its public URL', async () => {
    const insert = mockInsert(SAVED);

    await createEvent(FIELDS, REPLACE);

    expect(uploadImage).toHaveBeenCalledWith(BUCKETS.events, NEW_IMAGE);
    expect(insert).toHaveBeenCalledWith({ ...FIELDS, picture_url: NEW_PICTURE });
  });

  it.each([
    ['Supabase errors', FAILED],
    ['nothing was saved', NOTHING_SAVED],
  ])('fails when %s, and deletes the picture it uploaded', async (_, result) => {
    mockInsert(result);

    await expect(createEvent(FIELDS, REPLACE)).rejects.toThrow('"Hack Night" couldn\'t be saved.');
    expect(removeImage).toHaveBeenCalledWith(BUCKETS.events, NEW_PICTURE);
  });

  it('saves nothing when the picture cannot be uploaded', async () => {
    const insert = mockInsert(SAVED);
    vi.mocked(uploadImage).mockRejectedValue(new UnavailableError("The picture couldn't be uploaded."));

    await expect(createEvent(FIELDS, REPLACE)).rejects.toThrow("The picture couldn't be uploaded.");
    expect(insert).not.toHaveBeenCalled();
  });
});

describe('updateEvent', () => {
  const withPicture = { ...EVENT, pictureUrl: OLD_PICTURE };

  it('sends only the changed fields, for that event, and leaves the picture alone', async () => {
    const { update, eq } = mockUpdate(SAVED);

    await updateEvent(withPicture, { location: 'BA201' }, KEEP);

    expect(update).toHaveBeenCalledWith({ location: 'BA201' });
    expect(eq).toHaveBeenCalledWith('id', EVENT.id);
    expect(uploadImage).not.toHaveBeenCalled();
    expect(removeImage).not.toHaveBeenCalled();
  });

  it('replaces the picture: uploads the new one, saves its URL, then deletes the old file', async () => {
    const { update } = mockUpdate(SAVED);

    await updateEvent(withPicture, {}, REPLACE);

    expect(update).toHaveBeenCalledWith({ picture_url: NEW_PICTURE });
    expect(removeImage).toHaveBeenCalledWith(BUCKETS.events, OLD_PICTURE);
  });

  it('removes the picture: clears picture_url, then deletes the file', async () => {
    const { update } = mockUpdate(SAVED);

    await updateEvent(withPicture, {}, REMOVE);

    expect(update).toHaveBeenCalledWith({ picture_url: null });
    expect(uploadImage).not.toHaveBeenCalled();
    expect(removeImage).toHaveBeenCalledWith(BUCKETS.events, OLD_PICTURE);
  });

  it.each([
    ['Supabase errors', FAILED],
    ['nothing was changed, as when row-level security refuses it', NOTHING_SAVED],
  ])('fails when %s, keeping the old picture and deleting the new upload', async (_, result) => {
    mockUpdate(result);

    await expect(updateEvent(withPicture, {}, REPLACE)).rejects.toThrow("Your changes couldn't be saved.");
    expect(removeImage).toHaveBeenCalledWith(BUCKETS.events, NEW_PICTURE);
    expect(removeImage).not.toHaveBeenCalledWith(BUCKETS.events, OLD_PICTURE);
  });
});

describe('deleteEvent', () => {
  it('deletes the event, then its picture', async () => {
    const eq = mockDelete(SAVED);

    await deleteEvent({ ...EVENT, pictureUrl: OLD_PICTURE });

    expect(eq).toHaveBeenCalledWith('id', EVENT.id);
    expect(removeImage).toHaveBeenCalledWith(BUCKETS.events, OLD_PICTURE);
  });

  it('deletes an event with no picture without touching storage', async () => {
    mockDelete(SAVED);

    await deleteEvent(EVENT);

    expect(removeImage).not.toHaveBeenCalled();
  });

  it('fails when Supabase errors', async () => {
    mockDelete(FAILED);

    await expect(deleteEvent(EVENT)).rejects.toThrow('"CP312 Midterm Review" couldn\'t be deleted.');
  });

  it('fails when nothing was deleted, as when row-level security refuses it, and keeps the picture', async () => {
    mockDelete(NOTHING_SAVED);

    await expect(deleteEvent({ ...EVENT, pictureUrl: OLD_PICTURE })).rejects.toBeInstanceOf(UnavailableError);
    expect(removeImage).not.toHaveBeenCalled();
  });
});
