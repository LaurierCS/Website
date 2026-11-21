import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnavailableError } from '../../src/lib/errors';
import { createMember, getMember, listTeam, updateMember } from '../../src/lib/team';
import type { TeamMember } from '../../src/types/team';
import { mockAccess, SAM_ADMIN } from '../mocks/auth';
import { renderApp } from '../renderApp';

vi.mock('../../src/lib/auth');
vi.mock('../../src/lib/team');

const SAM: TeamMember = {
  id: '6f1c2b8e-2d1a-4c5e-9b7f-0a1b2c3d4e5f',
  name: 'Sam Rivera',
  role: 'VP Engineering',
  department: 'Engineering',
  isPublic: true,
  pictureUrl: null,
  githubUrl: 'https://github.com/samrivera',
  linkedinUrl: null,
};

beforeEach(() => {
  mockAccess(SAM_ADMIN);
  vi.mocked(listTeam).mockResolvedValue([]);
});

describe('NewMemberPage', () => {
  it("won't save without a name and a department, and says why under each", async () => {
    renderApp('/team/new');

    await userEvent.type(await screen.findByLabelText('Role'), 'VP Events');
    await userEvent.click(screen.getByRole('button', { name: 'Add member' }));

    expect(await screen.findByLabelText('Name')).toHaveAccessibleDescription('Give their name.');
    expect(screen.getByLabelText('Department')).toHaveAccessibleDescription('Pick their department.');
    expect(createMember).not.toHaveBeenCalled();
  });

  it("turns away a link that isn't GitHub, and says what to paste", async () => {
    renderApp('/team/new');

    await userEvent.type(await screen.findByLabelText('Name'), 'Ava Lee');
    await userEvent.selectOptions(screen.getByLabelText('Department'), 'Events');
    await userEvent.type(screen.getByLabelText('GitHub'), 'github.com/avalee');
    await userEvent.click(screen.getByRole('button', { name: 'Add member' }));

    expect(await screen.findByLabelText('GitHub')).toHaveAccessibleDescription(/isn't a GitHub link/);
    expect(createMember).not.toHaveBeenCalled();
  });

  it('saves a new member on the site, with empty links as none, and says so on Team', async () => {
    vi.mocked(createMember).mockResolvedValue();
    renderApp('/team/new');

    expect(await screen.findByRole('switch', { name: 'Show them on the site' })).toBeChecked();
    await userEvent.type(screen.getByLabelText('Name'), 'Ava Lee');
    await userEvent.selectOptions(screen.getByLabelText('Department'), 'Events');
    await userEvent.type(screen.getByLabelText('LinkedIn'), 'https://www.linkedin.com/in/avalee');
    await userEvent.click(screen.getByRole('button', { name: 'Add member' }));

    expect(createMember).toHaveBeenCalledWith({
      name: 'Ava Lee',
      role: null,
      department: 'Events',
      githubUrl: null,
      linkedinUrl: 'https://www.linkedin.com/in/avalee',
      isPublic: true,
    });
    expect(await screen.findByText('Saved "Ava Lee".')).toBeInTheDocument();
  });

  it('can add someone hidden from the site', async () => {
    vi.mocked(createMember).mockResolvedValue();
    renderApp('/team/new');

    await userEvent.type(await screen.findByLabelText('Name'), 'Ava Lee');
    await userEvent.selectOptions(screen.getByLabelText('Department'), 'Events');
    await userEvent.click(screen.getByRole('switch', { name: 'Show them on the site' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add member' }));

    expect(createMember).toHaveBeenCalledWith(expect.objectContaining({ isPublic: false }));
  });

  it('keeps what was typed and says so when saving fails', async () => {
    vi.mocked(createMember).mockRejectedValue(new UnavailableError("Ava Lee couldn't be saved."));
    renderApp('/team/new');

    await userEvent.type(await screen.findByLabelText('Name'), 'Ava Lee');
    await userEvent.selectOptions(screen.getByLabelText('Department'), 'Events');
    await userEvent.click(screen.getByRole('button', { name: 'Add member' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent("Ava Lee couldn't be saved.");
    expect(alert).toHaveFocus();
    expect(screen.getByLabelText('Name')).toHaveValue('Ava Lee');
  });

  it('asks before leaving with unsaved changes', async () => {
    renderApp('/team/new');
    await userEvent.type(await screen.findByLabelText('Name'), 'Ava Lee');

    await userEvent.click(screen.getByRole('link', { name: 'Cancel' }));

    expect(screen.getByRole('dialog', { name: 'Leave without saving?' })).toBeInTheDocument();
  });
});

describe('EditMemberPage', () => {
  it('fills in the member and saves only what was changed', async () => {
    vi.mocked(getMember).mockResolvedValue(SAM);
    vi.mocked(updateMember).mockResolvedValue();
    renderApp(`/team/${SAM.id}`);

    expect(await screen.findByLabelText('Name')).toHaveValue('Sam Rivera');
    expect(screen.getByLabelText('Department')).toHaveValue('Engineering');
    expect(screen.getByLabelText('GitHub')).toHaveValue(SAM.githubUrl);

    const role = screen.getByLabelText('Role');
    await userEvent.clear(role);
    await userEvent.type(role, 'Software Engineer');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(updateMember).toHaveBeenCalledWith(SAM, { role: 'Software Engineer' });
    expect(await screen.findByText('Saved "Sam Rivera".')).toBeInTheDocument();
  });

  it('clears a link by saving it empty', async () => {
    vi.mocked(getMember).mockResolvedValue(SAM);
    vi.mocked(updateMember).mockResolvedValue();
    renderApp(`/team/${SAM.id}`);

    await userEvent.clear(await screen.findByLabelText('GitHub'));
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(updateMember).toHaveBeenCalledWith(SAM, { githubUrl: null });
  });

  it('says so when there is no such member', async () => {
    vi.mocked(getMember).mockResolvedValue(null);
    renderApp(`/team/${SAM.id}`);

    expect(await screen.findByText("There's no one at this address.")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See the whole team' })).toHaveAttribute('href', '/team');
  });

  it('shows a failure to load as a failure, not as "no such member", and recovers on retry', async () => {
    vi.mocked(getMember).mockRejectedValue(new UnavailableError('This team member could not be loaded.'));
    renderApp(`/team/${SAM.id}`);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('This team member could not be loaded.');
    expect(screen.queryByText("There's no one at this address.")).not.toBeInTheDocument();

    vi.mocked(getMember).mockResolvedValue(SAM);
    await userEvent.click(within(alert).getByRole('button', { name: 'Try again' }));
    expect(await screen.findByLabelText('Name')).toHaveValue('Sam Rivera');
  });
});
