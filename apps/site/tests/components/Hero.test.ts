import { getByRole, getByText, queryByText, within } from '@testing-library/dom';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { JSDOM } from 'jsdom';
import { beforeAll, describe, expect, it } from 'vitest';
import Hero from '../../src/components/hero/Hero.astro';
import type { ClubEvent } from '../../src/content/events';
import { HERO } from '../../src/content/home';
import { POSTED_AT_START } from '../../src/lib/chat';
import { formatCount } from '../../src/lib/count';

const NEXT: ClubEvent = {
  id: 'study-chill',
  title: 'Study n Chill',
  date: '2026-11-26',
  time: '17:00',
  location: 'Library 3rd floor',
  photoUrl: null,
};

/** The hero as a visitor's browser gets it, with `nextEvent` as the soonest event. */
async function renderHero(nextEvent: ClubEvent | undefined): Promise<HTMLElement> {
  const container = await AstroContainer.create();
  return new JSDOM(await container.renderToString(Hero, { props: { nextEvent } })).window.document.body;
}

describe('Hero', () => {
  let page: HTMLElement;

  beforeAll(async () => {
    page = await renderHero(NEXT);
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

  it("shows the soonest event's day, time and room, and jumps to its ticket", () => {
    const card = getByRole(page, 'link', { name: /Study n Chill/ });
    expect(card.getAttribute('href')).toBe('#event-study-chill');
    expect(within(card).getByText('Thu 5:00PM · Library 3rd floor')).toBeDefined();
  });

  it('leaves the "Next up" card out when nothing is coming up', async () => {
    expect(queryByText(await renderHero(undefined), 'Next up')).toBeNull();
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
