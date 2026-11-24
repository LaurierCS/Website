import { getByRole, getByText } from '@testing-library/dom';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import SiteFooter from '../../src/components/layout/SiteFooter.astro';
import { FOOTER } from '../../src/content/footer';
import { clubToday } from '../../src/lib/dates';

/** The footer as a visitor's browser gets it. */
async function renderFooter(): Promise<HTMLElement> {
  const container = await AstroContainer.create();
  return new JSDOM(await container.renderToString(SiteFooter)).window.document.body;
}

describe('SiteFooter', () => {
  it('says who made the site, linking the engineering team to the club GitHub in a new tab', async () => {
    const team = getByRole(await renderFooter(), 'link', { name: FOOTER.team.label });
    expect(team.getAttribute('href')).toBe(FOOTER.team.href);
    expect(team.getAttribute('target')).toBe('_blank');
  });

  it("gives the copyright with this year in Toronto", async () => {
    expect(getByText(await renderFooter(), FOOTER.copyright(clubToday().slice(0, 4)))).toBeDefined();
  });
});
