import { getAllByRole, getByRole, getByText, queryByRole, within } from '@testing-library/dom';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import { SPEAKER_IMAGES } from '../../src/assets/speakers';
import MtpSpotlight from '../../src/components/mtp/MtpSpotlight.astro';
import { MTP } from '../../src/content/mtp';
import { readSpeakers, type Speaker } from '../../src/lib/speakers';

// Real photos from the speakers folder, so the page renders them the way the site does.
const SPEAKERS = readSpeakers(
  [
    'name,role,company,linkedin,website,photo,event_photo',
    'Sam Lee,Software Engineer,Google,https://www.linkedin.com/in/samlee/,,alex-astrum.jpg,event-placeholder.png',
    'Ria Shah,Analyst,RBC,,https://ria.dev,mahsa-panahi.jpg,event-placeholder.png',
    'Jo Park,Product Owner,Google,,,kanwar-anand.jpg,event-placeholder.png',
  ].join('\n'),
  SPEAKER_IMAGES,
);

/** The spotlight as a visitor's browser gets it. */
async function renderSpotlight(speakers: readonly Speaker[]): Promise<HTMLElement> {
  const container = await AstroContainer.create();
  const html = await container.renderToString(MtpSpotlight, { props: { copy: MTP, speakers } });
  return new JSDOM(html).window.document.body;
}

describe('MtpSpotlight', () => {
  it('sums the speakers up: how many, and the companies they came from, each once', async () => {
    const page = await renderSpotlight(SPEAKERS);
    const chips = getAllByRole(getByRole(page, 'list', { name: 'At a glance' }), 'listitem');
    expect(chips.map((chip) => chip.textContent)).toEqual([`3 speakers in ${MTP.edition}`, 'Google · RBC']);
  });

  // Each speaker is in the page twice, as the phone's print and as the wider screen's print and card; the page's
  // styles display only one. These tests see both, since they don't load the styles.
  it('shows the first speaker, in the phone layout and the wider one', async () => {
    const page = await renderSpotlight(SPEAKERS);
    const shown = getByRole(page, 'group', { name: '1 of 3: Sam Lee' });
    expect(within(shown).getAllByRole('heading', { name: 'Sam Lee' })).toHaveLength(2);
    expect(within(shown).getAllByText('Software Engineer · Google')).toHaveLength(2);
    expect(getByRole(page, 'button', { name: 'Next speaker' })).toBeDefined();
  });

  it('keeps the other speakers out of reach until stepped to', async () => {
    const page = await renderSpotlight(SPEAKERS);
    const slides = [...page.querySelectorAll<HTMLElement>('[data-speaker]')];
    expect(slides.map((slide) => slide.hasAttribute('inert'))).toEqual([false, true, true]);
  });

  it("links each speaker's LinkedIn and website, and leaves out the ones that aren't in the sheet", async () => {
    const page = await renderSpotlight(SPEAKERS);
    const [sam, ria, jo] = [...page.querySelectorAll<HTMLElement>('[data-speaker]')];
    for (const connect of within(sam).getAllByRole('link', { name: /Connect with Sam Lee/ })) {
      expect(connect.getAttribute('href')).toBe('https://www.linkedin.com/in/samlee/');
      expect(connect.getAttribute('target')).toBe('_blank');
    }
    expect(within(ria).queryAllByRole('link', { name: /LinkedIn/ })).toEqual([]);
    for (const website of within(ria).getAllByRole('link', { name: "Ria Shah's website" })) {
      expect(website.getAttribute('href')).toBe('https://ria.dev');
    }
    expect(within(jo).queryAllByRole('link')).toEqual([]);
  });

  it('has no arrows with only one speaker', async () => {
    const page = await renderSpotlight(SPEAKERS.slice(0, 1));
    expect(queryByRole(page, 'button', { name: 'Next speaker' })).toBeNull();
    expect(getByText(page, `1 speaker in ${MTP.edition}`)).toBeDefined();
  });

  it('still asks people to speak at the next one when there are no speakers yet', async () => {
    const page = await renderSpotlight([]);
    expect(queryByRole(page, 'region', { name: 'Speakers' })).toBeNull();
    expect(getByRole(page, 'link', { name: new RegExp(MTP.pitch.action.label) }).getAttribute('href')).toBe(
      MTP.pitch.action.href,
    );
  });
});
