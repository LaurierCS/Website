import { UnavailableError } from '../../src/lib/errors';
import { BUCKETS, removeImage, uploadImage } from '../../src/lib/storage';
import { getSupabase } from '../../src/lib/supabase';
import { createMember, deleteMember, getMember, importTeam, listTeam, setMemberPublic, updateMember } from '../../src/lib/team';
import type { MemberFields, TeamMember } from '../../src/types/team';

vi.mock('../../src/lib/supabase');
vi.mock('../../src/lib/storage', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../src/lib/storage')>()),
  removeImage: vi.fn(),
  uploadImage: vi.fn(),
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

/** Makes `from('team').select(...).eq(...).maybeSingle()` answer with `result`. Returns the `from` mock. */
function mockGet(result: { data: unknown; error: unknown }) {
  const from = vi.fn(() => ({ select: vi.fn(() => ({ eq: vi.fn(() => ({ maybeSingle: vi.fn().mockResolvedValue(result) })) })) }));
  vi.mocked(getSupabase).mockReturnValue({ from } as unknown as ReturnType<typeof getSupabase>);
  return from;
}

/** Makes `from('team').insert(...).select(...)` answer with `result`. Returns the `insert` mock. */
function mockInsert(result: { data: unknown; error: unknown }) {
  const insert = vi.fn(() => ({ select: vi.fn().mockResolvedValue(result) }));
  vi.mocked(getSupabase).mockReturnValue({ from: vi.fn(() => ({ insert })) } as unknown as ReturnType<typeof getSupabase>);
  return insert;
}

const NEW_MEMBER: MemberFields = {
  name: 'Ava Lee',
  role: null,
  department: 'Events',
  githubUrl: null,
  linkedinUrl: 'https://www.linkedin.com/in/avalee',
  isPublic: true,
};

describe('getMember', () => {
  it('turns the row into a member', async () => {
    mockGet({ data: ROW, error: null });

    expect(await getMember(ROW.id)).toEqual(SAM);
  });

  it('is null when there is no such member', async () => {
    mockGet({ data: null, error: null });

    expect(await getMember(ROW.id)).toBeNull();
  });

  it("doesn't ask Supabase about an id that isn't a uuid", async () => {
    const from = mockGet({ data: ROW, error: null });

    expect(await getMember('not-an-id')).toBeNull();
    expect(from).not.toHaveBeenCalled();
  });

  it('reports a failed read, and a row it cannot read, as unavailable rather than missing', async () => {
    mockGet(FAILED);
    await expect(getMember(ROW.id)).rejects.toBeInstanceOf(UnavailableError);

    mockGet({ data: { ...ROW, github_url: 'not a link' }, error: null });
    await expect(getMember(ROW.id)).rejects.toThrow("This member has saved data the admin can't read.");
  });
});

const NEW_PHOTO_URL = 'https://lcs.supabase.co/storage/v1/object/public/team-images/new.jpg';
const PHOTO = { file: new File(['x'], 'photo.jpg', { type: 'image/jpeg' }), extension: 'jpg' };
const KEEP = { kind: 'keep' } as const;
const REPLACE = { kind: 'replace', image: PHOTO } as const;

describe('createMember', () => {
  it('saves the member with its columns named as the table names them', async () => {
    const insert = mockInsert(SAVED);

    await createMember(NEW_MEMBER, KEEP);

    expect(insert).toHaveBeenCalledWith({
      name: 'Ava Lee',
      role: null,
      department: 'Events',
      github_url: null,
      linkedin_url: 'https://www.linkedin.com/in/avalee',
      is_public: true,
      picture_url: null,
    });
    expect(uploadImage).not.toHaveBeenCalled();
  });

  it('uploads a chosen photo to the team bucket and saves its address', async () => {
    vi.mocked(uploadImage).mockResolvedValue(NEW_PHOTO_URL);
    const insert = mockInsert(SAVED);

    await createMember(NEW_MEMBER, REPLACE);

    expect(uploadImage).toHaveBeenCalledWith(BUCKETS.team, PHOTO);
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ picture_url: NEW_PHOTO_URL }));
  });

  it.each([
    ['Supabase errors', FAILED],
    ['nothing was saved, as when row-level security refuses it', NOTHING_SAVED],
  ])('fails when %s, and deletes the photo it just uploaded', async (_, result) => {
    vi.mocked(uploadImage).mockResolvedValue(NEW_PHOTO_URL);
    mockInsert(result);

    await expect(createMember(NEW_MEMBER, REPLACE)).rejects.toThrow("Ava Lee couldn't be saved.");
    expect(removeImage).toHaveBeenCalledWith(BUCKETS.team, NEW_PHOTO_URL);
  });
});

describe('updateMember', () => {
  it('sends only the changed fields, and leaves the photo alone when it is kept', async () => {
    const { update, eq } = mockUpdate(SAVED);

    await updateMember(SAM, { role: 'Software Engineer', githubUrl: null }, KEEP);

    // Unchanged fields are undefined, which the request leaves out, so they stay as they were.
    expect(update).toHaveBeenCalledWith({ role: 'Software Engineer', github_url: null });
    expect(eq).toHaveBeenCalledWith('id', SAM.id);
    expect(removeImage).not.toHaveBeenCalled();
  });

  it('replaces the photo, then deletes the old file', async () => {
    vi.mocked(uploadImage).mockResolvedValue(NEW_PHOTO_URL);
    const { update } = mockUpdate(SAVED);

    await updateMember(SAM, {}, REPLACE);

    expect(update).toHaveBeenCalledWith({ picture_url: NEW_PHOTO_URL });
    expect(removeImage).toHaveBeenCalledWith(BUCKETS.team, SAM.pictureUrl);
  });

  it('removes the photo: the address is cleared, then the file is deleted', async () => {
    const { update } = mockUpdate(SAVED);

    await updateMember(SAM, {}, { kind: 'remove' });

    expect(update).toHaveBeenCalledWith({ picture_url: null });
    expect(removeImage).toHaveBeenCalledWith(BUCKETS.team, SAM.pictureUrl);
  });

  it.each([
    ['Supabase errors', FAILED],
    ['nothing was changed, as when row-level security refuses it', NOTHING_SAVED],
  ])('fails when %s, keeping the old photo and deleting the new one', async (_, result) => {
    vi.mocked(uploadImage).mockResolvedValue(NEW_PHOTO_URL);
    mockUpdate(result);

    await expect(updateMember(SAM, { role: 'Software Engineer' }, REPLACE)).rejects.toThrow("Your changes couldn't be saved.");
    expect(removeImage).toHaveBeenCalledWith(BUCKETS.team, NEW_PHOTO_URL);
    expect(removeImage).not.toHaveBeenCalledWith(BUCKETS.team, SAM.pictureUrl);
  });
});

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

describe('importTeam', () => {
  const FIELDS: MemberFields = {
    name: 'Alex Chen',
    role: null,
    department: 'Academics',
    githubUrl: null,
    linkedinUrl: 'https://www.linkedin.com/in/alexchen',
    isPublic: false,
  };

  /** Makes `rpc(...)` answer with `result`. Returns the `rpc` mock. */
  function mockRpc(result: { data: unknown; error: unknown }) {
    const rpc = vi.fn().mockResolvedValue(result);
    vi.mocked(getSupabase).mockReturnValue({ rpc } as unknown as ReturnType<typeof getSupabase>);
    return rpc;
  }

  it('sends the new members and every field of the changed ones as table columns, in one call', async () => {
    const rpc = mockRpc({ data: null, error: null });

    await importTeam({ added: [FIELDS], changed: [{ id: SAM.id, fields: { ...FIELDS, name: 'Sam Rivera', isPublic: true } }] });

    const columns = { name: 'Alex Chen', role: null, department: 'Academics', github_url: null, linkedin_url: FIELDS.linkedinUrl, is_public: false };
    expect(rpc).toHaveBeenCalledTimes(1);
    expect(rpc).toHaveBeenCalledWith('import_team', {
      new_rows: [columns],
      changed_rows: [{ id: SAM.id, ...columns, name: 'Sam Rivera', is_public: true }],
    });
  });

  it('says nothing was changed when the database refuses or rolls back the import', async () => {
    mockRpc({ data: null, error: { message: 'new row violates row-level security policy for table "team"' } });

    await expect(importTeam({ added: [FIELDS], changed: [] })).rejects.toThrow(new UnavailableError("The import couldn't be saved, so nothing was changed."));
  });
});
