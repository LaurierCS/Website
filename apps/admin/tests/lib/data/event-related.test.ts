import { UnavailableError } from '../../../src/lib/server/errors';
import { addRelated, deleteRelated, listRelated, reorderRelated } from '../../../src/lib/data/event-related';
import type { EventRelated } from '../../../src/types/event-related';
import { installV2Supabase } from '../server/supabase-v2-mock';

vi.mock('../../../src/lib/server/supabase');

const EVENT_ID = '0b6f9c2e-7a41-4d5b-8e3c-2f1a9b8c7d6e';
const RELATED_ID = '1c7a0d3f-8b52-4e6c-9f4d-3a2b1c0d9e8f';

const GOOD_ROW = { event_id: EVENT_ID, related_id: RELATED_ID, sort_order: 0 };

const RELATED: EventRelated = {
  eventId: EVENT_ID,
  relatedId: RELATED_ID,
  sortOrder: 0,
};

const SAVED = { data: [{ event_id: EVENT_ID }], error: null };
const FAILED = { data: null, error: { message: 'boom' } };

describe('listRelated', () => {
  it('returns all related events for an event', async () => {
    const order = vi.fn().mockResolvedValue({ data: [GOOD_ROW], error: null });
    installV2Supabase({ event_related: { select: vi.fn(() => ({ eq: vi.fn(() => ({ order })) })) } });

    expect(await listRelated(EVENT_ID)).toEqual([RELATED]);
  });

  it('returns empty list for invalid event id', async () => {
    expect(await listRelated('not-a-uuid')).toEqual([]);
  });

  it('reports a failed read as unavailable', async () => {
    const order = vi.fn().mockResolvedValue(FAILED);
    installV2Supabase({ event_related: { select: vi.fn(() => ({ eq: vi.fn(() => ({ order })) })) } });

    await expect(listRelated(EVENT_ID)).rejects.toBeInstanceOf(UnavailableError);
  });
});

describe('addRelated', () => {
  it('adds a related event', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const select = vi.fn(() => ({ eq: vi.fn(() => ({ order: vi.fn(() => ({ limit: vi.fn().mockResolvedValue({ data: [], error: null }) })) })) }));
    installV2Supabase({ event_related: { insert, select } });

    await addRelated(EVENT_ID, RELATED_ID);

    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ event_id: EVENT_ID, related_id: RELATED_ID }));
  });

  it('fails with invalid event id', async () => {
    await expect(addRelated('not-a-uuid', RELATED_ID)).rejects.toThrow();
  });

  it('fails with invalid related id', async () => {
    await expect(addRelated(EVENT_ID, 'not-a-uuid')).rejects.toThrow();
  });
});

describe('deleteRelated', () => {
  it('deletes a related event link', async () => {
    const eq = vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) })) }));
    installV2Supabase({ event_related: { delete: vi.fn(() => eq) } });

    await deleteRelated(EVENT_ID, RELATED_ID);

    expect(eq).toHaveBeenCalledWith('event_id', EVENT_ID);
  });

  it('fails when delete fails', async () => {
    installV2Supabase({ event_related: { delete: vi.fn(() => ({ eq: vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn().mockResolvedValue(FAILED) })) })) })) } });

    await expect(deleteRelated(EVENT_ID, RELATED_ID)).rejects.toBeInstanceOf(UnavailableError);
  });
});

describe('reorderRelated', () => {
  it('updates sort orders', async () => {
    const related: EventRelated[] = [
      { ...RELATED, sortOrder: 0 },
      { ...RELATED, relatedId: '2d8b1e4f-9c6a-4f7d-8e5b-0c1d2e3f4g5h', sortOrder: 1 },
    ];
    const update = vi.fn(() => ({ eq: vi.fn(() => ({}) ) }));
    installV2Supabase({ event_related: { update } });

    await reorderRelated(related);

    expect(update).toHaveBeenCalledTimes(2);
  });

  it('handles empty list', async () => {
    await reorderRelated([]);
    // Should not throw
  });
});
