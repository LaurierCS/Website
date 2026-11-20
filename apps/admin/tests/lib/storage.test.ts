import { UnavailableError } from '../../src/lib/errors';
import { BUCKETS, removeImage, uploadImage } from '../../src/lib/storage';
import { getSupabase } from '../../src/lib/supabase';

vi.mock('../../src/lib/supabase');

const BUCKET_URL = 'https://lcs.supabase.co/storage/v1/object/public/events-images/';
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
  it('saves the picture as <uuid>.<ext> at the bucket root and returns its public URL', async () => {
    const { from, upload } = mockBucket();

    const url = await uploadImage(BUCKETS.events, IMAGE);

    expect(from).toHaveBeenCalledWith('events-images');
    const [path, file, options] = upload.mock.calls[0] ?? [];
    expect(path).toMatch(/^[0-9a-f-]{36}\.png$/);
    expect(file).toBe(IMAGE.file);
    expect(options).toEqual({ contentType: 'image/png' });
    expect(url).toBe(`${BUCKET_URL}${path}`);
  });

  it('fails clearly when the upload is refused', async () => {
    mockBucket({ uploaded: { error: { message: 'boom' } } });

    await expect(uploadImage(BUCKETS.events, IMAGE)).rejects.toThrow(new UnavailableError("The picture couldn't be uploaded."));
  });
});

describe('removeImage', () => {
  it('deletes a file in the bucket, by the name it was saved under', async () => {
    const { remove } = mockBucket();

    await removeImage(BUCKETS.events, `${BUCKET_URL}midterm%20review.png`);

    expect(remove).toHaveBeenCalledWith(['midterm review.png']);
  });

  it('leaves a picture linked from somewhere else alone', async () => {
    const { remove } = mockBucket();

    await removeImage(BUCKETS.events, 'https://i.imgur.com/abc123.png');

    expect(remove).not.toHaveBeenCalled();
  });

  it('logs a file it could not remove instead of failing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockBucket({ removed: { error: { message: 'boom' } } });

    await expect(removeImage(BUCKETS.events, `${BUCKET_URL}a.png`)).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalledWith('storage.image_not_removed', { bucket: 'events-images', path: 'a.png' });
  });
});
