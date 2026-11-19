import { UnavailableError } from '../../src/lib/errors';
import { listEvents } from '../../src/lib/events';
import { getSupabase } from '../../src/lib/supabase';

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

/** Makes `from('events').select(...).order(...)` answer with `result`, the way supabase-js does. */
function mockEventsQuery(result: { data: unknown; error: unknown }) {
  const order = vi.fn().mockResolvedValue(result);
  const query = { select: vi.fn(() => ({ order })) };
  vi.mocked(getSupabase).mockReturnValue({ from: vi.fn(() => query) } as unknown as ReturnType<typeof getSupabase>);
}

describe('listEvents', () => {
  it('turns rows into events, with an empty picture as no picture', async () => {
    mockEventsQuery({ data: [GOOD_ROW], error: null });

    expect(await listEvents()).toEqual([
      { id: GOOD_ROW.id, title: 'CP312 Midterm Review', description: null, date: '2026-11-18', time: '5:30PM', location: 'BA110', pictureUrl: null },
    ]);
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
