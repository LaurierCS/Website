import { UnavailableError } from '../../src/lib/errors';
import { createEvent, deleteEvent, getEvent, listEvents, updateEvent } from '../../src/lib/events';
import { getSupabase } from '../../src/lib/supabase';
import type { Event } from '../../src/types/event';

vi.mock('../../src/lib/supabase');

const GOOD_ROW = {
  id: '0b6f9c2e-7a41-4d5b-8e3c-2f1a9b8c7d6e',
  title: 'CP312 Midterm Review',
  description: null,
  date: '2026-11-18',
  time: '5:30PM',
  location: 'BA110',
  picture_url: '',
};

const BUCKET_URL = 'https://lcs.supabase.co/storage/v1/object/public/events-images/';

const EVENT: Event = {
  id: GOOD_ROW.id,
  title: 'CP312 Midterm Review',
  description: null,
  date: '2026-11-18',
  time: '5:30PM',
  location: 'BA110',
  pictureUrl: null,
};

/** Makes `from('events').select(...).order(...)` answer with `result`, the way supabase-js does. */
function mockEventsQuery(result: { data: unknown; error: unknown }) {
  const order = vi.fn().mockResolvedValue(result);
  const query = { select: vi.fn(() => ({ order })) };
  vi.mocked(getSupabase).mockReturnValue({ from: vi.fn(() => query) } as unknown as ReturnType<typeof getSupabase>);
}

/**
 * Makes `from('events').delete().eq(...).select(...)` answer with `deleted`, and storage `remove` with `removed`.
 * Returns the mocks a test checks.
 */
function mockDelete(deleted: { data: unknown; error: unknown }, removed: { error: unknown } = { error: null }) {
  const eq = vi.fn(() => ({ select: vi.fn().mockResolvedValue(deleted) }));
  const remove = vi.fn().mockResolvedValue({ data: null, ...removed });
  const bucket = { remove, getPublicUrl: vi.fn(() => ({ data: { publicUrl: BUCKET_URL } })) };
  vi.mocked(getSupabase).mockReturnValue({
    from: vi.fn(() => ({ delete: vi.fn(() => ({ eq })) })),
    storage: { from: vi.fn(() => bucket) },
  } as unknown as ReturnType<typeof getSupabase>);
  return { eq, remove };
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

const FIELDS = { title: 'Hack Night', date: '2026-12-01', time: '7:30PM', location: 'BA110', description: null };

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
    mockGet({ data: null, error: { message: 'boom' } });
    await expect(getEvent(EVENT.id)).rejects.toBeInstanceOf(UnavailableError);

    vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockGet({ data: { ...GOOD_ROW, picture_url: 'not a link' }, error: null });
    await expect(getEvent(EVENT.id)).rejects.toBeInstanceOf(UnavailableError);
  });
});

describe('createEvent', () => {
  it('saves the fields as they are', async () => {
    const insert = mockInsert({ data: [{ id: EVENT.id }], error: null });

    await createEvent(FIELDS);

    expect(insert).toHaveBeenCalledWith(FIELDS);
  });

  it.each([
    ['Supabase errors', { data: null, error: { message: 'boom' } }],
    ['nothing was saved', { data: [], error: null }],
  ])('fails when %s', async (_, result) => {
    mockInsert(result);

    await expect(createEvent(FIELDS)).rejects.toThrow('"Hack Night" couldn\'t be saved.');
  });
});

describe('updateEvent', () => {
  it('sends only the changed fields, for that event', async () => {
    const { update, eq } = mockUpdate({ data: [{ id: EVENT.id }], error: null });

    await updateEvent(EVENT.id, { location: 'BA201' });

    expect(update).toHaveBeenCalledWith({ location: 'BA201' });
    expect(eq).toHaveBeenCalledWith('id', EVENT.id);
  });

  it.each([
    ['Supabase errors', { data: null, error: { message: 'boom' } }],
    ['nothing was changed, as when row-level security refuses it', { data: [], error: null }],
  ])('fails when %s', async (_, result) => {
    mockUpdate(result);

    await expect(updateEvent(EVENT.id, { location: 'BA201' })).rejects.toThrow("Your changes couldn't be saved.");
  });
});

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
    mockEventsQuery({ data: null, error: { message: 'boom' } });

    await expect(listEvents()).rejects.toBeInstanceOf(UnavailableError);
  });
});

describe('deleteEvent', () => {
  it('deletes the event and its picture from our bucket', async () => {
    const { eq, remove } = mockDelete({ data: [{ id: EVENT.id }], error: null });

    await deleteEvent({ ...EVENT, pictureUrl: `${BUCKET_URL}midterm%20review.png` });

    expect(eq).toHaveBeenCalledWith('id', EVENT.id);
    expect(remove).toHaveBeenCalledWith(['midterm review.png']);
  });

  it('leaves a picture linked from somewhere else alone', async () => {
    const { remove } = mockDelete({ data: [{ id: EVENT.id }], error: null });

    await deleteEvent({ ...EVENT, pictureUrl: 'https://i.imgur.com/abc123.png' });

    expect(remove).not.toHaveBeenCalled();
  });

  it('deletes an event with no picture without touching storage', async () => {
    const { remove } = mockDelete({ data: [{ id: EVENT.id }], error: null });

    await deleteEvent(EVENT);

    expect(remove).not.toHaveBeenCalled();
  });

  it('fails when Supabase errors', async () => {
    mockDelete({ data: null, error: { message: 'boom' } });

    await expect(deleteEvent(EVENT)).rejects.toThrow('"CP312 Midterm Review" couldn\'t be deleted.');
  });

  it('fails when nothing was deleted, as when row-level security refuses it', async () => {
    const { remove } = mockDelete({ data: [], error: null });

    await expect(deleteEvent({ ...EVENT, pictureUrl: `${BUCKET_URL}a.png` })).rejects.toBeInstanceOf(UnavailableError);
    expect(remove).not.toHaveBeenCalled();
  });

  it('still counts as deleted when the picture cannot be removed, and logs the leftover file', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockDelete({ data: [{ id: EVENT.id }], error: null }, { error: { message: 'boom' } });

    await expect(deleteEvent({ ...EVENT, pictureUrl: `${BUCKET_URL}a.png` })).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalledWith('events.image_not_removed', { id: EVENT.id, path: 'a.png' });
  });
});
