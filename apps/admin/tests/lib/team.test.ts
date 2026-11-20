import { UnavailableError } from '../../src/lib/errors';
import { BUCKETS, removeImage } from '../../src/lib/storage';
import { getSupabase } from '../../src/lib/supabase';
import { deleteMember, listTeam, setMemberPublic } from '../../src/lib/team';
import type { TeamMember } from '../../src/types/team';

vi.mock('../../src/lib/supabase');
vi.mock('../../src/lib/storage', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../src/lib/storage')>()),
  removeImage: vi.fn(),
}));

const ROW = {
  id: '6f1c2b8e-2d1a-4c5e-9b7f-0a1b2c3d4e5f',
  name: 'Sam Rivera',
  role: 'VP Engineering',
  department: 'Engineering',
  is_public: true,
  picture_url: 'https://lcs.supabase.co/storage/v1/object/public/team-images/sam.jpg',
  github_url: 'https://github.com/samrivera',
  linkedin_url: '',
};

const SAM: TeamMember = {
  id: ROW.id,
  name: 'Sam Rivera',
  role: 'VP Engineering',
  department: 'Engineering',
  isPublic: true,
  pictureUrl: ROW.picture_url,
  githubUrl: 'https://github.com/samrivera',
  linkedinUrl: null,
};

const SAVED = { data: [{ id: ROW.id }], error: null };
const FAILED = { data: null, error: { message: 'boom' } };
const NOTHING_SAVED = { data: [], error: null };

/** Makes `from('team').select(...).order(...)` answer with `result`. */
function mockList(result: { data: unknown; error: unknown }) {
  const order = vi.fn().mockResolvedValue(result);
  vi.mocked(getSupabase).mockReturnValue({
    from: vi.fn(() => ({ select: vi.fn(() => ({ order })) })),
  } as unknown as ReturnType<typeof getSupabase>);
}

/** Makes `from('team').update(...).eq(...).select(...)` answer with `result`. Returns the mocks a test checks. */
function mockUpdate(result: { data: unknown; error: unknown }) {
  const eq = vi.fn(() => ({ select: vi.fn().mockResolvedValue(result) }));
  const update = vi.fn(() => ({ eq }));
  vi.mocked(getSupabase).mockReturnValue({ from: vi.fn(() => ({ update })) } as unknown as ReturnType<typeof getSupabase>);
  return { update, eq };
}

/** Makes `from('team').delete().eq(...).select(...)` answer with `result`. Returns the `eq` mock. */
function mockDelete(result: { data: unknown; error: unknown }) {
  const eq = vi.fn(() => ({ select: vi.fn().mockResolvedValue(result) }));
  vi.mocked(getSupabase).mockReturnValue({
    from: vi.fn(() => ({ delete: vi.fn(() => ({ eq })) })),
  } as unknown as ReturnType<typeof getSupabase>);
  return eq;
}

describe('listTeam', () => {
  it('turns rows into members, with empty links as none', async () => {
    mockList({ data: [ROW], error: null });

    expect(await listTeam()).toEqual([SAM]);
  });

  it('counts a member with no is_public as hidden, the way the site treats them', async () => {
    mockList({ data: [{ ...ROW, is_public: null }], error: null });

    const [member] = await listTeam();
    expect(member?.isPublic).toBe(false);
  });

  it('leaves out a malformed row instead of failing everyone', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const badRow = { ...ROW, id: '1c7a0d3f-8b52-4e6c-9f4d-3a2b1c0d9e8f', github_url: 'not a link' };
    mockList({ data: [ROW, badRow], error: null });

    expect((await listTeam()).map((member) => member.id)).toEqual([ROW.id]);
    expect(warn).toHaveBeenCalledWith('team.row_skipped', { id: badRow.id, problems: ['githubUrl'] });
  });

  it('reports a failed read as unavailable', async () => {
    mockList(FAILED);

    await expect(listTeam()).rejects.toBeInstanceOf(UnavailableError);
  });
});

describe('setMemberPublic', () => {
  it('saves is_public for that member', async () => {
    const { update, eq } = mockUpdate(SAVED);

    await setMemberPublic(SAM, false);

    expect(update).toHaveBeenCalledWith({ is_public: false });
    expect(eq).toHaveBeenCalledWith('id', SAM.id);
  });

  it.each([
    ['Supabase errors', FAILED],
    ['nothing was changed, as when row-level security refuses it', NOTHING_SAVED],
  ])('fails when %s', async (_, result) => {
    mockUpdate(result);

    await expect(setMemberPublic(SAM, false)).rejects.toThrow("Sam Rivera couldn't be hidden.");
  });
});

describe('deleteMember', () => {
  it('deletes the member, then their photo from the team bucket', async () => {
    const eq = mockDelete(SAVED);

    await deleteMember(SAM);

    expect(eq).toHaveBeenCalledWith('id', SAM.id);
    expect(removeImage).toHaveBeenCalledWith(BUCKETS.team, SAM.pictureUrl);
  });

  it('deletes a member with no photo without touching storage', async () => {
    mockDelete(SAVED);

    await deleteMember({ ...SAM, pictureUrl: null });

    expect(removeImage).not.toHaveBeenCalled();
  });

  it.each([
    ['Supabase errors', FAILED],
    ['nothing was deleted, as when row-level security refuses it', NOTHING_SAVED],
  ])('fails when %s, and keeps the photo', async (_, result) => {
    mockDelete(result);

    await expect(deleteMember(SAM)).rejects.toThrow("Sam Rivera couldn't be deleted.");
    expect(removeImage).not.toHaveBeenCalled();
  });
});
