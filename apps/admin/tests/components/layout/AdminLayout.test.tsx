import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { listEvents } from '../../../src/lib/data/events';
import { listTeam } from '../../../src/lib/data/team';
import { mockAccess, SAM_ADMIN } from '../../mocks/auth';
import { renderApp } from '../../renderApp';

vi.mock('../../../src/lib/auth');
vi.mock('../../../src/lib/events');
vi.mock('../../../src/lib/team');

function sectionLink(name: 'Events' | 'Team') {
  return screen.getByRole('link', { name });
}

describe('AdminLayout', () => {
  beforeEach(() => {
    mockAccess(SAM_ADMIN);
    vi.mocked(listEvents).mockResolvedValue([]);
    vi.mocked(listTeam).mockResolvedValue([]);
  });

  it('sends / to the Events section', async () => {
    renderApp('/');

    expect(await screen.findByRole('heading', { name: 'Events', level: 1 })).toBeInTheDocument();
    expect(sectionLink('Events')).toHaveAttribute('aria-current', 'page');
  });

  it('switches between Events and Team and marks the current section', async () => {
    renderApp('/events');
    await screen.findByRole('heading', { name: 'Events', level: 1 });

    await userEvent.click(sectionLink('Team'));
    expect(await screen.findByRole('heading', { name: 'Team' })).toBeInTheDocument();
    expect(sectionLink('Team')).toHaveAttribute('aria-current', 'page');
    expect(sectionLink('Events')).not.toHaveAttribute('aria-current');

    await userEvent.click(sectionLink('Events'));
    expect(await screen.findByRole('heading', { name: 'Events', level: 1 })).toBeInTheDocument();
    expect(sectionLink('Events')).toHaveAttribute('aria-current', 'page');
  });

  it('opens Team directly from its URL, as a refresh on /team does', async () => {
    renderApp('/team');

    expect(await screen.findByRole('heading', { name: 'Team' })).toBeInTheDocument();
    expect(sectionLink('Team')).toHaveAttribute('aria-current', 'page');
  });

  it('links to the how-to guide for execs, in a new tab', async () => {
    renderApp('/events');

    const guide = await screen.findByRole('link', { name: 'Guide (opens in a new tab)' });
    expect(guide).toHaveAttribute('href', 'https://github.com/LaurierCS/Website/blob/main/docs/admin-guide.md');
    expect(guide).toHaveAttribute('target', '_blank');
  });

  it('shows a not-found page at an unknown URL, with a way back to Events', async () => {
    renderApp('/sponsors');

    expect(await screen.findByRole('heading', { name: 'Wrong door.' })).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('link', { name: 'Back to Events' }));
    expect(await screen.findByRole('heading', { name: 'Events', level: 1 })).toBeInTheDocument();
  });

  it('sends a signed-out visitor at an unknown URL to the login page', async () => {
    mockAccess({ kind: 'signed_out' });
    renderApp('/sponsors');

    expect(await screen.findByRole('heading', { name: 'Execs only beyond this point.' })).toBeInTheDocument();
  });
});
