import { describe, expect, it } from 'vitest';
import { linkTarget } from '../../src/lib/links';

describe('linkTarget', () => {
  it('opens a link off the site in a new tab, without giving that page a handle on ours', () => {
    expect(linkTarget('https://www.linkedin.com/in/samlee/')).toEqual({
      target: '_blank',
      rel: 'noopener noreferrer',
    });
  });

  it.each(['#events', '/', '/about'])('opens %s in place', (href) => {
    expect(linkTarget(href)).toEqual({});
  });
});
