import { UnavailableError } from '../../src/lib/errors';
import { BUCKETS, publicUrl, removeImage, uploadImage } from '../../src/lib/storage';
import { getSupabase } from '../../src/lib/supabase';

vi.mock('../../src/lib/supabase');

const BUCKET_URL = 'https://lcs.supabase.co/storage/v1/object/public/event-media/';
const IMAGE = { file: new File(['x'], 'poster.png', { type: 'image/png' }), extension: 'png' };

/** Makes `storage.from(bucket)` answer uploads and removals with the given results. Returns the mocks. */
function mockBucket({ uploaded = { error: null }, removed = { error: null } }: { uploaded?: { error: unknown }; removed?: { error: unknown } } = {}) {
  const files = {
    upload: vi.fn().mockResolvedValue({ data: null, ...uploaded }),
    remove: vi.fn().mockResolvedValue({ data: null, ...removed }),
    getPublicUrl: vi.fn((path: string) => ({ data: { publicUrl: `${BUCKET_URL}${path}` } })),
  };
  const from = vi.fn(() => files);
  vi.mocked(getSupabase).mockReturnValue({ storage: { from } } as unknown as ReturnType<typeof getSupabase>);
  return { from, ...files };
}

describe('uploadImage', () => {
  it('saves the picture as <uuid>.<ext> at the bucket root and returns its path', async () => {
    const { from, upload } = mockBucket();

    const path = await uploadImage(BUCKETS.events, IMAGE);

    expect(from).toHaveBeenCalledWith('event-media');
    const [savedPath, file, options] = upload.mock.calls[0] ?? [];
    expect(savedPath).toMatch(/^[0-9a-f-]{36}\.png$/);
    expect(file).toBe(IMAGE.file);
    expect(options).toEqual({ contentType: 'image/png' });
    expect(path).toBe(savedPath);
  });

  it('puts event photos under an optional folder', async () => {
    const { upload } = mockBucket();

    const path = await uploadImage(BUCKETS.events, IMAGE, 'abc/photos');

    expect(upload.mock.calls[0]?.[0]).toMatch(/^abc\/photos\/[0-9a-f-]{36}\.png$/);
    expect(path).toBe(upload.mock.calls[0]?.[0]);
  });

  it('fails clearly when the upload is refused', async () => {
    mockBucket({ uploaded: { error: { message: 'boom' } } });

    await expect(uploadImage(BUCKETS.events, IMAGE)).rejects.toThrow(new UnavailableError("The picture couldn't be uploaded."));
  });
});

describe('publicUrl', () => {
  it('builds the public link from a bucket path', () => {
    mockBucket();
    expect(publicUrl(BUCKETS.events, 'abc/photos/x.png')).toBe(`${BUCKET_URL}abc/photos/x.png`);
  });
});

describe('removeImage', () => {
  it('deletes a file at the path given', async () => {
    const { remove } = mockBucket();

    await removeImage(BUCKETS.events, 'midterm-review.png');

    expect(remove).toHaveBeenCalledWith(['midterm-review.png']);
  });

  it('leaves a full URL alone', async () => {
    const { remove } = mockBucket();

    await removeImage(BUCKETS.events, 'https://i.imgur.com/abc123.png');

    expect(remove).not.toHaveBeenCalled();
  });

  it('logs a file it could not remove instead of failing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockBucket({ removed: { error: { message: 'boom' } } });

    await expect(removeImage(BUCKETS.events, 'a.png')).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalledWith('storage.image_not_removed', { bucket: 'event-media', path: 'a.png' });
  });
});