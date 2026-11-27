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
    'name,role,company,linkedin,website,photo,event_photo,logo,colour',
    'Sam Lee,Software Engineer,Google,https://www.linkedin.com/in/samlee/,,alex-astrum.jpg,event-placeholder.png,' +
      'logo-google.png,#4285f4',
    'Ria Shah,Analyst,RBC,,https://ria.dev,mahsa-panahi.jpg,event-placeholder.png,logo-rbc.png,#005daa',
    'Jo Park,Product Owner,Google,,,kanwar-anand.jpg,event-placeholder.png,logo-google.png,#4285f4',
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

  it('shows the first speaker, and a face for each speaker to pick from, the first one picked', async () => {
    const page = await renderSpotlight(SPEAKERS);
    const shown = getByRole(page, 'group', { name: '1 of 3: Sam Lee' });
    expect(within(shown).getByRole('heading', { name: 'Sam Lee' })).toBeDefined();
    expect(within(shown).getByText('Software Engineer · Google')).toBeDefined();
    const faces = within(getByRole(page, 'list', { name: 'Pick a speaker' })).getAllByRole('button');
    expect(faces.map((face) => [face.getAttribute('aria-label'), face.getAttribute('aria-pressed')])).toEqual([
      ['Show Sam Lee, Google', 'true'],
      ['Show Ria Shah, RBC', 'false'],
      ['Show Jo Park, Google', 'false'],
    ]);
  });

  it('keeps the other speakers out of reach until stepped to', async () => {
    const page = await renderSpotlight(SPEAKERS);
    const slides = [...page.querySelectorAll<HTMLElement>('[data-speaker]')];
    expect(slides.map((slide) => slide.hasAttribute('inert'))).toEqual([false, true, true]);
  });

  it("counts each speaker's shot in the viewfinder by their place in the list", async () => {
    const page = await renderSpotlight(SPEAKERS);
    const slides = [...page.querySelectorAll<HTMLElement>('[data-speaker]')];
    expect(slides.map((slide) => within(slide).queryByText(/^\d+\/3$/)?.textContent?.trim())).toEqual([
      '1/3',
      '2/3',
      '3/3',
    ]);
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

  it('has no faces to pick from with only one speaker', async () => {
    const page = await renderSpotlight(SPEAKERS.slice(0, 1));
    expect(queryByRole(page, 'list', { name: 'Pick a speaker' })).toBeNull();
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
