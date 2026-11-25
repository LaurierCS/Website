import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { downloadFile } from '../../src/lib/other/download';
import { UnavailableError } from '../../src/lib/server/errors';
import { deleteMember, listTeam, setMemberPublic } from '../../src/lib/data/team';
import type { TeamMember } from '../../src/types/team';
import { mockAccess, SAM_ADMIN } from '../mocks/auth';
import { renderApp } from '../renderApp';

vi.mock('../../src/lib/auth/auth');
vi.mock('../../src/lib/data/team');
vi.mock('../../src/lib/other/download');

const SAM: TeamMember = {
  id: '6f1c2b8e-2d1a-4c5e-9b7f-0a1b2c3d4e5f',
  name: 'Sam Rivera',
  role: 'VP Engineering',
  department: 'Engineering',
  isPublic: true,
  photoPath: 'sam.jpg',
  pictureUrl: 'https://lcs.supabase.co/storage/v1/object/public/team-images/sam.jpg',
  githubUrl: 'https://github.com/samrivera',
  linkedinUrl: 'https://www.linkedin.com/in/samrivera',
};

const ALEX: TeamMember = {
  id: '1c7a0d3f-8b52-4e6c-9f4d-3a2b1c0d9e8f',
  name: 'Alex Chen',
  role: null,
  department: 'Academics',
  isPublic: false,
  photoPath: null,
  pictureUrl: null,
  githubUrl: null,
  linkedinUrl: null,
};

/** The list item for a member, found by their name. */
function cardFor(name: string) {
  const card = screen.getByRole('heading', { name }).closest('li');
  if (!card) throw new Error(`No card for ${name}`);
  return within(card);
}

beforeEach(() => mockAccess(SAM_ADMIN));

describe('TeamPage', () => {
  it('lists everyone under their department, hidden members included', async () => {
    vi.mocked(listTeam).mockResolvedValue([SAM, ALEX]);
    renderApp('/team');

    const academics = await screen.findByRole('region', { name: 'Academics' });
    expect(within(academics).getByRole('heading', { name: 'Alex Chen' })).toBeInTheDocument();
    const engineering = screen.getByRole('region', { name: 'Engineering' });
    expect(within(engineering).getByRole('heading', { name: 'Sam Rivera' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
      'Academics',
      'Engineering',
    ]);
  });

  it("lists departments in the site's order and counts the crew", async () => {
    const president: TeamMember = { ...ALEX, id: '9d8c7b6a-5f4e-4d3c-8b2a-1f0e9d8c7b6a', name: 'Amara Okonkwo', department: 'Admin', isPublic: true };
    vi.mocked(listTeam).mockResolvedValue([SAM, ALEX, president]);
    renderApp('/team');

    await screen.findByRole('heading', { name: 'Sam Rivera' });
    expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
      'Admin',
      'Academics',
      'Engineering',
    ]);
    expect(screen.getByText('3 crew · 3 departments · 1 hidden from the site')).toBeInTheDocument();
  });

  it('marks a hidden member in words, not just colour', async () => {
    vi.mocked(listTeam).mockResolvedValue([SAM, ALEX]);
    renderApp('/team');
    await screen.findByRole('heading', { name: 'Alex Chen' });

    expect(cardFor('Alex Chen').getByRole('switch', { name: 'Show Alex Chen on the site' })).toHaveTextContent('Hidden');
    expect(cardFor('Sam Rivera').getByRole('switch', { name: 'Show Sam Rivera on the site' })).toHaveTextContent('On the site');
    expect(screen.getByText('1 crew · 1 hidden')).toBeInTheDocument();
    expect(cardFor('Alex Chen').getByText('No role yet')).toBeInTheDocument();
  });

  it('says "Saving…" and waits while the switch saves', async () => {
    vi.mocked(listTeam).mockResolvedValue([SAM]);
    // Never settles, so the switch stays mid-save for the test.
    vi.mocked(setMemberPublic).mockReturnValue(new Promise(() => {}));
    renderApp('/team');

    const samSwitch = await screen.findByRole('switch', { name: 'Show Sam Rivera on the site' });
    await userEvent.click(samSwitch);

    expect(samSwitch).toHaveTextContent('Saving…');
    expect(samSwitch).toBeDisabled();
    expect(samSwitch).not.toBeChecked();
  });

  it('shows photo, role and profile links when a member has them, and still works without', async () => {
    vi.mocked(listTeam).mockResolvedValue([SAM, ALEX]);
    renderApp('/team');
    await screen.findByRole('heading', { name: 'Sam Rivera' });

    const sam = cardFor('Sam Rivera');
    expect(sam.getByText('VP Engineering')).toBeInTheDocument();
    expect(sam.getByRole('link', { name: 'Sam Rivera on GitHub' })).toHaveAttribute('href', SAM.githubUrl);
    expect(sam.getByRole('link', { name: 'Sam Rivera on LinkedIn' })).toHaveAttribute('href', SAM.linkedinUrl);

    const alex = cardFor('Alex Chen');
    expect(alex.getByText('A')).toBeInTheDocument();
    expect(alex.queryByRole('link', { name: /on GitHub|on LinkedIn/ })).not.toBeInTheDocument();
  });

  it('links to adding a member and to editing each one', async () => {
    vi.mocked(listTeam).mockResolvedValue([SAM]);
    renderApp('/team');
    await screen.findByRole('heading', { name: 'Sam Rivera' });

    expect(screen.getByRole('link', { name: 'Add member' })).toHaveAttribute('href', '/team/new');
    expect(screen.getByRole('link', { name: 'Edit Sam Rivera' })).toHaveAttribute('href', `/team/${SAM.id}`);
  });

  it('shows or hides a member on the site straight away', async () => {
    vi.mocked(listTeam).mockResolvedValue([SAM, ALEX]);
    vi.mocked(setMemberPublic).mockResolvedValue();
    renderApp('/team');

    const samSwitch = await screen.findByRole('switch', { name: 'Show Sam Rivera on the site' });
    expect(samSwitch).toBeChecked();
    expect(screen.getByRole('switch', { name: 'Show Alex Chen on the site' })).not.toBeChecked();

    vi.mocked(listTeam).mockResolvedValue([{ ...SAM, isPublic: false }, ALEX]);
    await userEvent.click(samSwitch);

    expect(setMemberPublic).toHaveBeenCalledWith(SAM, false);
    expect(await screen.findByRole('switch', { name: 'Show Sam Rivera on the site', checked: false })).toBeInTheDocument();
  });

  it('puts the switch back and says so when saving fails', async () => {
    vi.mocked(listTeam).mockResolvedValue([SAM]);
    vi.mocked(setMemberPublic).mockRejectedValue(new UnavailableError("Sam Rivera couldn't be hidden."));
    renderApp('/team');

    await userEvent.click(await screen.findByRole('switch', { name: 'Show Sam Rivera on the site' }));

    expect(await screen.findByRole('alert')).toHaveTextContent("Sam Rivera couldn't be hidden.");
    expect(screen.getByRole('switch', { name: 'Show Sam Rivera on the site' })).toBeChecked();
  });

  it('asks before deleting, naming the member, then removes them', async () => {
    vi.mocked(listTeam).mockResolvedValue([SAM, ALEX]);
    vi.mocked(deleteMember).mockResolvedValue();
    renderApp('/team');
    await userEvent.click(await screen.findByRole('button', { name: 'Delete Sam Rivera' }));

    const dialog = screen.getByRole('dialog', { name: 'Delete Sam Rivera?' });
    vi.mocked(listTeam).mockResolvedValue([ALEX]);
    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete' }));

    expect(deleteMember).toHaveBeenCalledWith(SAM);
    expect(await screen.findByRole('heading', { name: 'Alex Chen' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Sam Rivera' })).not.toBeInTheDocument();
  });

  it('deletes nothing when the confirm is cancelled', async () => {
    vi.mocked(listTeam).mockResolvedValue([SAM]);
    renderApp('/team');
    await userEvent.click(await screen.findByRole('button', { name: 'Delete Sam Rivera' }));

    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancel' }));

    expect(deleteMember).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'Sam Rivera' })).toBeInTheDocument();
  });

  it('keeps the member and says so when the delete fails', async () => {
    vi.mocked(listTeam).mockResolvedValue([SAM]);
    vi.mocked(deleteMember).mockRejectedValue(new UnavailableError("Sam Rivera couldn't be deleted."));
    renderApp('/team');
    await userEvent.click(await screen.findByRole('button', { name: 'Delete Sam Rivera' }));

    const dialog = screen.getByRole('dialog', { name: 'Delete Sam Rivera?' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete' }));

    expect(await within(dialog).findByRole('alert')).toHaveTextContent("Sam Rivera couldn't be deleted.");
    expect(screen.getByRole('heading', { name: 'Sam Rivera' })).toBeInTheDocument();
  });

  it('says so when there is nobody yet', async () => {
    vi.mocked(listTeam).mockResolvedValue([]);
    renderApp('/team');

    expect(await screen.findByText(/No team members yet/)).toBeInTheDocument();
  });

  it('shows a failure as a failure, never as "nobody yet", and recovers on retry', async () => {
    vi.mocked(listTeam).mockRejectedValue(new UnavailableError('The team could not be loaded.'));
    renderApp('/team');

    expect(await screen.findByRole('alert')).toHaveTextContent('The team could not be loaded.');
    expect(screen.queryByText(/No team members yet/)).not.toBeInTheDocument();

    vi.mocked(listTeam).mockResolvedValue([SAM]);
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('heading', { name: 'Sam Rivera' })).toBeInTheDocument();
  });

  it('exports the whole team as CSV, hidden members included', async () => {
    vi.mocked(listTeam).mockResolvedValue([SAM, ALEX]);
    renderApp('/team');
    await screen.findByRole('heading', { name: 'Sam Rivera' });

    await userEvent.click(screen.getByRole('button', { name: 'Export CSV' }));

    expect(downloadFile).toHaveBeenCalledWith({
      name: expect.stringMatching(/^lcs-team-\d{4}-\d{2}-\d{2}\.csv$/),
      text: expect.stringContaining('id,name,role,department,is_public,github_url,linkedin_url'),
    });
    expect(downloadFile).toHaveBeenCalledWith(
      expect.objectContaining({ text: expect.stringContaining(`${ALEX.id},Alex Chen,,Academics,false,,`) }),
    );
    expect(downloadFile).toHaveBeenCalledWith(
      expect.objectContaining({ text: expect.stringContaining(`${SAM.id},Sam Rivera,VP Engineering,Engineering,true,`) }),
    );
  });

  it("can't export while the team is loading or after it failed", async () => {
    vi.mocked(listTeam).mockRejectedValue(new UnavailableError('The team could not be loaded.'));
    renderApp('/team');

    expect(await screen.findByRole('button', { name: 'Export CSV' })).toBeDisabled();
    await screen.findByRole('alert');
    expect(screen.getByRole('button', { name: 'Export CSV' })).toBeDisabled();
  });
});
