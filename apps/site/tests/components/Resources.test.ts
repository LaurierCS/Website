import { getAllByRole, getByRole, within } from '@testing-library/dom';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import Resources from '../../src/components/resources/Resources.astro';
import { RESOURCES } from '../../src/content/resources';

/** The section as a visitor's browser gets it. */
async function renderSection(): Promise<HTMLElement> {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Resources, { props: { content: RESOURCES } });
  return new JSDOM(html).window.document.body;
}

describe('Resources', () => {
  it("has a tab for each kind on the laptop, the recording's selected and showing", async () => {
    const page = await renderSection();
    const tabs = getAllByRole(getByRole(page, 'tablist', { name: 'On the clubroom laptop' }), 'tab');
    expect(tabs.map((tab) => tab.textContent?.trim())).toEqual(['Recording', 'Practice', 'GitHub']);
    expect(tabs.map((tab) => tab.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false']);
    const panels = [...page.querySelectorAll('[role="tabpanel"]')];
    expect(panels.map((panel) => panel.hasAttribute('inert'))).toEqual([false, true, true]);
  });

  it('opens the newest recording on YouTube, in a new tab', async () => {
    const page = await renderSection();
    const recording = getByRole(page, 'link', { name: new RegExp(RESOURCES.recording.title) });
    expect(recording.getAttribute('href')).toBe(`https://www.youtube.com/watch?v=${RESOURCES.recording.videoId}`);
    expect(recording.getAttribute('target')).toBe('_blank');
  });

  it('links each kind beside the laptop to where all of it lives', async () => {
    const page = await renderSection();
    for (const { label, href } of Object.values(RESOURCES.kinds)) {
      expect(getByRole(page, 'link', { name: label }).getAttribute('href')).toBe(href);
    }
  });

  it('keeps the practice solution in the page, for when it is shown', async () => {
    const page = await renderSection();
    const practice = page.querySelector<HTMLElement>('#laptop-panel-practice');
    if (!practice) throw new Error('The practice panel is missing.');
    expect(within(practice).getByText(RESOURCES.practice.solution)).toBeDefined();
  });
});
