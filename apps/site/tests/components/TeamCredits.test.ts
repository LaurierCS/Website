import { getAllByRole, getByRole, getByText, within } from '@testing-library/dom';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import TeamCredits from '../../src/components/team/TeamCredits.astro';
import { CREDITS, TEAM } from '../../src/content/team';
import { crews, type TeamMember } from '../../src/lib/team';

const member = (id: string, name: string, department: string, fields: Partial<TeamMember> = {}): TeamMember => ({
  id,
  name,
  role: 'Director',
  department,
  pictureUrl: null,
  linkedinUrl: null,
  githubUrl: null,
  ...fields,
});

// Ana is in two departments: one person, credited twice.
const CREWS = crews([
  member('ana', 'Ana Park', 'Admin', { role: 'President', linkedinUrl: 'https://www.linkedin.com/in/anapark/' }),
  member('bo', 'Bo Chen', 'Engineering', { role: 'Software Engineer' }),
  member('ana', 'Ana Park', 'Engineering', { role: 'Software Engineer' }),
]);

/** The section as a visitor's browser gets it. */
async function renderSection(): Promise<HTMLElement> {
  const container = await AstroContainer.create();
  const html = await container.renderToString(TeamCredits, { props: { copy: TEAM, crews: CREWS } });
  return new JSDOM(html).window.document.body;
}

describe('TeamCredits', () => {
  it('keeps "The Team" and counts people once even when they are in two departments', async () => {
    const page = await renderSection();
    expect(getByRole(page, 'heading', { level: 2, name: TEAM.title })).toBeDefined();
    expect(getByText(page, TEAM.people(2))).toBeDefined();
    expect(getByText(page, TEAM.departments(2))).toBeDefined();
  });

  it('credits each department under its title on the contact sheet, with everyone in it', async () => {
    const page = await renderSection();
    const titles = getAllByRole(page, 'heading', { level: 3 }).map((heading) => heading.textContent?.trim());
    expect(titles).toEqual([CREDITS.Admin.title, CREDITS.Engineering.title]);
    const engineering = getByRole(page, 'list', { name: `${CREDITS.Engineering.department} team` });
    expect(within(engineering).getAllByRole('listitem')).toHaveLength(2);
  });

  it('cuts the rolling credits into groups of up to five per department, each with a print per person', async () => {
    const page = await renderSection();
    const lines = [...page.querySelectorAll<HTMLElement>('[data-line]')];
    expect(lines.map((line) => line.dataset.inGroup)).toEqual(['0', '1', '1']);
    // A group's prints are split between its left and right side.
    const printsOf = (group: number) => page.querySelectorAll(`[data-group="${group}"] [data-person]`).length;
    expect([printsOf(0), printsOf(1)]).toEqual([1, 2]);
  });

  it('ends with the card for joining the team', async () => {
    const page = await renderSection();
    const join = getByRole(page, 'link', { name: new RegExp(TEAM.join.action.label) });
    expect(join.getAttribute('href')).toBe(TEAM.join.action.href);
  });

  it('links someone only to the profiles they have, in a new tab', async () => {
    const page = await renderSection();
    // On the contact sheet, and her name in the rolling credits.
    const linkedin = getAllByRole(page, 'link', { name: 'Ana Park on LinkedIn' });
    expect(linkedin).toHaveLength(2);
    for (const link of linkedin) {
      expect(link.getAttribute('href')).toBe('https://www.linkedin.com/in/anapark/');
      expect(link.getAttribute('target')).toBe('_blank');
    }
    expect(within(page).queryByRole('link', { name: /GitHub/ })).toBeNull();
    // Bo has no links, so his name is plain text.
    expect(within(page).queryByRole('link', { name: /Bo Chen/ })).toBeNull();
  });

  it("shows someone's initials when there's no photo of them", async () => {
    const page = await renderSection();
    expect(getAllByRole(page, 'list', { name: /team$/ })[0]?.textContent).toContain('AP');
  });
});
