import { describe, expect, it } from 'vitest';
import { formatCount } from '../../src/lib/count';

describe('formatCount', () => {
  it.each([
    [0, '+', '0+'],
    [44, '+', '44+'],
    [4000, '+', '4,000+'],
    [1250000, '', '1,250,000'],
  ])('writes %d with "%s" as %s', (value, suffix, written) => {
    expect(formatCount(value, suffix)).toBe(written);
  });
});
