import { UnavailableError } from '../../../src/lib/server/errors';
import { createGuest, deleteGuest, getGuest, listGuests, updateGuest } from '../../../src/lib/data/guests';
import type { PictureChange } from '../../../src/lib/ui/images';
import { BUCKETS, removeImage, uploadImage } from '../../../src/lib/server/storage';
import type { Guest } from '../../../src/types/guest';
import { installV2Supabase, STORAGE_BASE } from '../server/supabase-v2-mock';

vi.mock('../../../src/lib/server/supabase');
vi.mock('../../../src/lib/server/storage', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../src/lib/server/storage')>()),
  uploadImage: vi.fn(),
  removeImage: vi.fn(),
}));

const GOOD_ROW = {
  id: '1b7a2c3d-4e5f-6789-0abc-def012345678',
  name: 'Jordan Smith',
  title: 'Guest Speaker',
  picture_path: 'jordan.jpg',
  link_url: 'https://example.com/jordan',
};

const GUEST: Guest = {
  id: GOOD_ROW.id,
  name: 'Jordan Smith',
  title: 'Guest Speaker',
  picturePath: GOOD_ROW.picture_path,
  pictureUrl: `${STORAGE_BASE}/${BUCKETS.team}/${GOOD_ROW.picture_path}`,
  linkUrl: 'https://example.com/jordan',
};

const NEW_PHOTO = { file: new File(['x'], 'photo.jpg', { type: 'image/jpeg' }), extension: 'jpg' };
const NEW_PATH = 'jordan-new.jpg';
const KEEP: PictureChange = { kind: 'keep' };
const REPLACE: PictureChange = { kind: 'replace', image: NEW_PHOTO };
const REMOVE: PictureChange = { kind: 'remove' };

const SAVED = { data: [{ id: GUEST.id }], error: null };
const FAILED = { data: null, error: { message: 'boom' } };

beforeEach(() => {
  vi.mocked(uploadImage).mockResolvedValue(NEW_PATH);
});

describe('listGuests', () => {
  it('turns rows into guests, sorted by name', async () => {
    const order = vi.fn().mockResolvedValue({ data: [GOOD_ROW], error: null });
    installV2Supabase({ guests: { select: vi.fn(() => ({ order })) } });

    expect(await listGuests()).toEqual([GUEST]);
  });

  it('leaves out a malformed row', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const badRow = { ...GOOD_ROW, id: 'not-a-uuid' };
    const order = vi.fn().mockResolvedValue({ data: [GOOD_ROW, badRow], error: null });
    installV2Supabase({ guests: { select: vi.fn(() => ({ order })) } });

    expect((await listGuests()).map((guest) => guest.id)).toEqual([GOOD_ROW.id]);
    expect(warn).toHaveBeenCalledWith('guests.row_skipped', expect.any(Object));
  });

  it('reports a failed read as unavailable', async () => {
    const order = vi.fn().mockResolvedValue(FAILED);
    installV2Supabase({ guests: { select: vi.fn(() => ({ order })) } });

    await expect(listGuests()).rejects.toBeInstanceOf(UnavailableError);
  });
});

describe('getGuest', () => {
  it('returns the guest', async () => {
    installV2Supabase({
      guests: {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({ maybeSingle: vi.fn().mockResolvedValue({ data: GOOD_ROW, error: null }) })),
        })),
      },
    });

    expect(await getGuest(GUEST.id)).toEqual(GUEST);
  });

  it('returns null when there is no such guest', async () => {
    installV2Supabase({
      guests: { select: vi.fn(() => ({ eq: vi.fn(() => ({ maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }) })) })) },
    });

    expect(await getGuest(GUEST.id)).toBeNull();
  });

  it('returns null for an invalid id without asking Supabase', async () => {
    const from = installV2Supabase({ guests: { select: vi.fn() } });

    expect(await getGuest('not-an-id')).toBeNull();
    expect(from).not.toHaveBeenCalled();
  });
});

describe('createGuest', () => {
  it('saves the guest fields with no picture', async () => {
    const insert = vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) }));
    installV2Supabase({ guests: { insert } });

    await createGuest({ name: GUEST.name, title: GUEST.title, linkUrl: GUEST.linkUrl }, KEEP);

    expect(insert).toHaveBeenCalledWith({
      name: GUEST.name,
      title: GUEST.title,
      link_url: GUEST.linkUrl,
      picture_path: null,
    });
    expect(uploadImage).not.toHaveBeenCalled();
  });

  it('saves the guest and uploads a photo', async () => {
    const insert = vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) }));
    installV2Supabase({ guests: { insert } });

    await createGuest({ name: GUEST.name, title: GUEST.title, linkUrl: GUEST.linkUrl }, REPLACE);

    expect(uploadImage).toHaveBeenCalledWith(BUCKETS.team, NEW_PHOTO);
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ picture_path: NEW_PATH }));
  });

  it('fails when the insert fails', async () => {
    installV2Supabase({ guests: { insert: vi.fn(() => ({ select: vi.fn().mockResolvedValue(FAILED) })) } });

    await expect(createGuest({ name: GUEST.name, title: GUEST.title, linkUrl: GUEST.linkUrl }, KEEP)).rejects.toThrow(
      "Jordan Smith couldn't be saved."
    );
  });

  it('removes uploaded photo if the insert fails', async () => {
    installV2Supabase({ guests: { insert: vi.fn(() => ({ select: vi.fn().mockResolvedValue(FAILED) })) } });

    await expect(createGuest({ name: GUEST.name, title: GUEST.title, linkUrl: GUEST.linkUrl }, REPLACE)).rejects.toThrow();
    expect(removeImage).toHaveBeenCalledWith(BUCKETS.team, NEW_PATH);
  });
});

describe('updateGuest', () => {
  it('saves only the changed fields and keeps the picture', async () => {
    const update = vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) })) }));
    installV2Supabase({ guests: { update } });

    await updateGuest(GUEST, { title: 'New Title' }, KEEP);

    expect(update).toHaveBeenCalledWith({ name: undefined, title: 'New Title', link_url: undefined });
    expect(uploadImage).not.toHaveBeenCalled();
  });

  it('replaces the photo and deletes the old one', async () => {
    const update = vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) })) }));
    installV2Supabase({ guests: { update } });

    await updateGuest(GUEST, {}, REPLACE);

    expect(uploadImage).toHaveBeenCalledWith(BUCKETS.team, NEW_PHOTO);
    expect(removeImage).toHaveBeenCalledWith(BUCKETS.team, GUEST.picturePath);
  });

  it('removes the photo', async () => {
    const update = vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) })) }));
    installV2Supabase({ guests: { update } });

    await updateGuest(GUEST, {}, REMOVE);

    expect(update).toHaveBeenCalledWith(expect.objectContaining({ picture_path: null }));
    expect(removeImage).toHaveBeenCalledWith(BUCKETS.team, GUEST.picturePath);
  });
});

describe('deleteGuest', () => {
  it('deletes the guest and their photo', async () => {
    const eq = vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) }));
    installV2Supabase({ guests: { delete: vi.fn(() => ({ eq })) } });

    await deleteGuest(GUEST);

    expect(removeImage).toHaveBeenCalledWith(BUCKETS.team, GUEST.picturePath);
  });

  it('deletes a guest with no photo', async () => {
    const eq = vi.fn(() => ({ select: vi.fn().mockResolvedValue(SAVED) }));
    installV2Supabase({ guests: { delete: vi.fn(() => ({ eq })) } });

    await deleteGuest({ ...GUEST, picturePath: null });

    expect(removeImage).not.toHaveBeenCalled();
  });

  it('fails when the delete fails', async () => {
    installV2Supabase({ guests: { delete: vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn().mockResolvedValue(FAILED) })) })) } });

    await expect(deleteGuest(GUEST)).rejects.toThrow("Jordan Smith couldn't be deleted.");
  });
});
