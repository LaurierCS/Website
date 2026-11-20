import { checkImage } from '../../src/lib/images';

/** A file of a given type and size, without allocating the bytes. */
function fileOf(type: string, sizeMb = 1, name = 'poster') {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: sizeMb * 1024 * 1024 });
  return file;
}

describe('checkImage', () => {
  it.each([
    ['image/jpeg', 'jpg'],
    ['image/png', 'png'],
    ['image/webp', 'webp'],
    ['image/gif', 'gif'],
  ])('accepts %s and names it .%s', (type, extension) => {
    const file = fileOf(type);

    expect(checkImage(file)).toEqual({ kind: 'accepted', image: { file, extension } });
  });

  it.each(['image/svg+xml', 'application/pdf', 'text/plain', ''])('turns away %j, saying which pictures work', (type) => {
    expect(checkImage(fileOf(type))).toEqual({
      kind: 'rejected',
      reason: "That file isn't a picture we can use. Choose a JPG, PNG, WebP or GIF.",
    });
  });

  it('turns away a picture over 5 MB, saying how big it is', () => {
    expect(checkImage(fileOf('image/png', 7.24))).toEqual({
      kind: 'rejected',
      reason: 'That picture is 7.2 MB. Pictures can be up to 5 MB.',
    });
  });

  it('accepts a picture of exactly 5 MB', () => {
    expect(checkImage(fileOf('image/png', 5)).kind).toBe('accepted');
  });
});
