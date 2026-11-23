import { getByRole, getByText, within } from '@testing-library/dom';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { JSDOM } from 'jsdom';
import { beforeAll, describe, expect, it } from 'vitest';
import Hero from '../../src/components/hero/Hero.astro';
import { HERO } from '../../src/content/home';
import { POSTED_AT_START } from '../../src/lib/chat';
import { formatCount } from '../../src/lib/count';

describe('Hero', () => {
  let page: HTMLElement;

  beforeAll(async () => {
    const container = await AstroContainer.create();
    page = new JSDOM(await container.renderToString(Hero)).window.document.body;
  });

  it('says the club name in the heading, even though it is drawn in scrapbook letters', () => {
    expect(getByRole(page, 'heading', { level: 1, name: 'Welcome to Laurier Computing Society' })).toBeDefined();
  });

  it.each(HERO.stats)('sends the final $count with its label, $label, before any counting starts', (stat) => {
    const term = getByText(page, stat.label);
    expect(term.tagName).toBe('DT');
    expect(term.nextElementSibling?.textContent).toContain(formatCount(stat.count, stat.suffix));
  });

  it.each(Object.values(HERO.actions))('links "$label" to $href', ({ label, href }) => {
    expect(getByRole(page, 'link', { name: label }).getAttribute('href')).toBe(href);
  });

  it('links the next event from its card', () => {
    const card = getByRole(page, 'link', { name: new RegExp(HERO.nextEvent.title) });
    expect(card.getAttribute('href')).toBe(HERO.nextEvent.href);
    expect(within(card).getByText(HERO.nextEvent.details)).toBeDefined();
  });

  it('gives screen readers the whole description at once, not the chat messages', () => {
    expect(getByText(page, HERO.about.summary).closest('[aria-hidden="true"]')).toBeNull();
  });

  it('sends the chat with its opening messages already posted, so it is never empty', () => {
    const message = (text: string) => getByText(page, text).closest('li');
    const posted = HERO.about.lines.map((line) => message(line.text)?.hasAttribute('data-posted'));
    expect(posted).toEqual(HERO.about.lines.map((_, index) => index < POSTED_AT_START));
  });

  it('offers a button to pause the chat', () => {
    const pause = getByRole(page, 'button', { name: 'Pause the chat', hidden: true });
    expect(pause.getAttribute('aria-pressed')).toBe('false');
  });

  it('lets people throw the paper plane', () => {
    expect(getByRole(page, 'button', { name: 'Throw the paper plane' })).toBeDefined();
  });

  it('describes the clubhouse picture for screen readers', () => {
    expect(getByRole(page, 'img', { name: /LCS clubhouse/ })).toBeDefined();
  });
});
