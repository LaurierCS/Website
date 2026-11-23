import { getByRole, getAllByRole } from '@testing-library/dom';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { JSDOM } from 'jsdom';
import { beforeAll, describe, expect, it } from 'vitest';
import SiteNav from '../../src/components/layout/SiteNav.astro';
import { PAGE_LINKS, SOCIAL_LINKS } from '../../src/lib/site';

/** The header the server sends, loaded into a document the way a visitor's browser would. */
async function renderHeader(): Promise<Document> {
  const container = await AstroContainer.create();
  return new JSDOM(await container.renderToString(SiteNav)).window.document;
}

describe('SiteNav', () => {
  let document: Document;
  let page: HTMLElement;

  beforeAll(async () => {
    document = await renderHeader();
    page = document.body;
  });

  it('links home from the logo, in the header and in the phone menu', () => {
    const logos = getAllByRole(page, 'link', { name: 'Laurier Computing Society home', hidden: true });
    expect(logos.map((logo) => logo.getAttribute('href'))).toEqual(['/', '/']);
  });

  it.each(PAGE_LINKS)('links to the $label section', ({ label, href }) => {
    const header = getByRole(page, 'navigation', { name: 'Main' });
    expect(getByRole(header, 'link', { name: label }).getAttribute('href')).toBe(href);
  });

  it.each(SOCIAL_LINKS)('names the icon-only $label link for screen readers', ({ description, href }) => {
    const header = getByRole(page, 'navigation', { name: 'Main' });
    expect(getByRole(header, 'link', { name: description }).getAttribute('href')).toBe(href);
  });

  it('offers a Menu button that opens the phone menu', () => {
    const button = getByRole(page, 'button', { name: 'Menu' });
    expect(button.getAttribute('aria-controls')).toBe('site-menu');
    expect(document.getElementById('site-menu')?.tagName).toBe('DIALOG');
  });

  it('puts every page and account in the phone menu', () => {
    const menu = document.getElementById('site-menu');
    if (!menu) throw new Error('The phone menu is missing.');
    const names = getAllByRole(menu, 'link', { hidden: true }).map((link) => link.getAttribute('href'));
    expect(names).toEqual(['/', ...PAGE_LINKS.map((page) => page.href), ...SOCIAL_LINKS.map((link) => link.href)]);
  });
});
