import { UnavailableError } from '../../../src/lib/server/errors';
import { addGuestHost, addTeamHost, deleteHost, getHost, listHosts, reorderHosts, updateHost } from '../../../src/lib/data/event-hosts';
import type { EventHost } from '../../../src/types/event-host';
import { installV2Supabase } from '../server/supabase-v2-mock';

vi.mock('../../../src/lib/server/supabase');

const EVENT_ID = '0b6f9c2e-7a41-4d5b-8e3c-2f1a9b8c7d6e';
const HOST_ID = '1c7a0d3f-8b52-4e6c-9f4d-3a2b1c0d9e8f';
const TEAM_ID = '2d8b1e4f-9c6a-4f7d-8e5b-0c1d2e3f4g5h';
const GUEST_ID = '3e9c2f5g-0d7b-4e8c-9f6d-1a2b3c4d5e6f';

const TEAM_HOST_ROW = { id: HOST_ID, event_id: EVENT_ID, team_id: TEAM_ID, guest_id: null, sort_order: 0 };
const GUEST_HOST_ROW = { id: HOST_ID, event_id: EVENT_ID, team_id: null, guest_id: GUEST_ID, sort_order: 0 };

const TEAM_HOST: EventHost = {
  id: HOST_ID,
  eventId: EVENT_ID,
  kind: 'team' as const,
  teamId: TEAM_ID,
  guestId: null,
  sortOrder: 0,
};

const GUEST_HOST: EventHost = {
  id: HOST_ID,
  eventId: EVENT_ID,
  kind: 'guest' as const,
  teamId: null,
  guestId: GUEST_ID,
  sortOrder: 0,
};

const SAVED = { data: [{ id: HOST_ID }], error: null };
const FAILED = { data: null, error: { message: 'boom' } };

describe('listHosts', () => {
  it('returns all hosts for an event', async () => {
    const order = vi.fn().mockResolvedValue({ data: [TEAM_HOST_ROW], error: null });
    installV2Supabase({ event_hosts: { select: vi.fn(() => ({ eq: vi.fn(() => ({ order })) })) } });

    const hosts = await listHosts(EVENT_ID);
    expect(hosts).toHaveLength(1);
    expect(hosts[0]?.kind).toBe('team');
  });

  it('returns empty list for invalid event id', async () => {
    expect(await listHosts('not-a-uuid')).toEqual([]);
  });
});

describe('getHost', () => {
  it('returns a team host by id', async () => {
    installV2Supabase({
      event_hosts: {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({ maybeSingle: vi.fn().mockResolvedValue({ data: TEAM_HOST_ROW, error: null }) })),
        })),
      },
    });

    const host = await getHost(HOST_ID);
    expect(host?.kind).toBe('team');
    expect(host?.teamId).toBe(TEAM_ID);
  });

  it('returns a guest host by id', async () => {
    installV2Supabase({
      event_hosts: {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({ maybeSingle: vi.fn().mockResolvedValue({ data: GUEST_HOST_ROW, error: null }) })),
        })),
      },
    });

    const host = await getHost(HOST_ID);
    expect(host?.kind).toBe('guest');
    expect(host?.guestId).toBe(GUEST_ID);
  });
});

describe('addTeamHost', () => {
  it('adds a team member as a host', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const select = vi.fn(() => ({ eq: vi.fn(() => ({ order: vi.fn(() => ({ limit: vi.fn().mockResolvedValue({ data: [], error: null }) })) })) }));
    installV2Supabase({ event_hosts: { insert, select } });

    await addTeamHost(EVENT_ID, TEAM_ID);

    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ event_id: EVENT_ID, team_id: TEAM_ID, guest_id: null }));
  });
});

describe('addGuestHost', () => {
  it('adds a guest as a host', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const select = vi.fn(() => ({ eq: vi.fn(() => ({ order: vi.fn(() => ({ limit: vi.fn().mockResolvedValue({ data: [], error: null }) })) })) }));
    installV2Supabase({ event_hosts: { insert, select } });

    await addGuestHost(EVENT_ID, GUEST_ID);

    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ event_id: EVENT_ID, guest_id: GUEST_ID, team_id: null }));
  });
});

describe('updateHost', () => {
  it('changes a team host to a guest host', async () => {
    const update = vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) })) }));
    installV2Supabase({ event_hosts: { update } });

    await updateHost(TEAM_HOST, { kind: 'guest', guestId: GUEST_ID });

    expect(update).toHaveBeenCalledWith(expect.objectContaining({ guest_id: GUEST_ID, team_id: null }));
  });
});

describe('deleteHost', () => {
  it('deletes a host', async () => {
    const eq = vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) }));
    installV2Supabase({ event_hosts: { delete: vi.fn(() => ({ eq })) } });

    await deleteHost(TEAM_HOST);

    expect(eq).toHaveBeenCalledWith('id', HOST_ID);
  });

  it('fails when delete fails', async () => {
    installV2Supabase({ event_hosts: { delete: vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn().mockResolvedValue(FAILED) })) })) } });

    await expect(deleteHost(TEAM_HOST)).rejects.toBeInstanceOf(UnavailableError);
  });
});

describe('reorderHosts', () => {
  it('updates sort orders', async () => {
    const hosts: EventHost[] = [
      { ...TEAM_HOST, sortOrder: 0 },
      { ...GUEST_HOST, id: '4f0d3g6h-1e8c-5f9d-0g7e-2b3c4d5e6f7g', sortOrder: 1 },
    ];
    const update = vi.fn(() => ({ eq: vi.fn(() => ({}) ) }));
    installV2Supabase({ event_hosts: { update } });

    await reorderHosts(hosts);

    expect(update).toHaveBeenCalledTimes(2);
  });
});
