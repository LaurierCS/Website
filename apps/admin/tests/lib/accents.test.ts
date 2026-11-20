import { ACCENTS, accentAt, accentFor } from '../../src/lib/accents';

describe('accentAt', () => {
  it('goes round the five accents in order', () => {
    expect([0, 1, 2, 3, 4, 5, 6].map(accentAt)).toEqual(['pink', 'yellow', 'blue', 'sky', 'orange', 'pink', 'yellow']);
  });
});

describe('accentFor', () => {
  it('gives a name the same accent every time', () => {
    expect(accentFor('Sam Rivera')).toBe(accentFor('Sam Rivera'));
  });

  it('always picks one of the five accents', () => {
    for (const name of ['', 'A', 'Amara Okonkwo', 'Zoë Campbell', '李华']) {
      expect(ACCENTS).toContain(accentFor(name));
    }
  });
});
