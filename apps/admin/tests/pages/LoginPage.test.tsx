import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { checkAccess, signIn, signOut } from '../../src/lib/auth';
import { UnavailableError } from '../../src/lib/errors';
import { listEvents } from '../../src/lib/events';
import { mockAccess, SAM, SAM_ADMIN } from '../mocks/auth';
import { renderApp } from '../renderApp';

vi.mock('../../src/lib/auth');
vi.mock('../../src/lib/events');

describe('LoginPage', () => {
  it.each([
    ['Continue with Discord', 'discord'],
    ['Continue with Notion', 'notion'],
  ])('offers "%s" to a signed-out visitor', async (button, provider) => {
    mockAccess({ kind: 'signed_out' });
    renderApp('/login');

    await userEvent.click(await screen.findByRole('button', { name: button }));

    expect(signIn).toHaveBeenCalledWith(provider);
  });

  it('shows a signed-out visitor the sign-in buttons straight away, without checking a pass', async () => {
    mockAccess({ kind: 'signed_out' });
    renderApp('/login');

    // Shorter than the 500 ms a signed-in visitor's check is held for, so a held check fails this.
    expect(await screen.findByRole('button', { name: 'Continue with Discord' }, { timeout: 300 })).toBeInTheDocument();
    expect(screen.queryByText('Checking your pass…')).not.toBeInTheDocument();
  });

  it('says so when a sign-in cannot start', async () => {
    mockAccess({ kind: 'signed_out' });
    vi.mocked(signIn).mockRejectedValue(new UnavailableError('Sign-in could not be started.'));
    renderApp('/login');

    await userEvent.click(await screen.findByRole('button', { name: 'Continue with Notion' }));

    expect(await screen.findByRole('alert')).toHaveTextContent("That sign-in didn't open");
  });

  it('turns away someone outside the LCS community, naming where they need to be', async () => {
    mockAccess({ kind: 'not_member', account: { ...SAM, provider: 'notion' } });
    renderApp('/login');

    expect(await screen.findByRole('heading', { name: "Hey Sam, you're not on the list (yet)." })).toBeInTheDocument();
    expect(screen.getByText(/the LCS Notion workspace/)).toBeInTheDocument();
  });

  it('lets someone outside the community check again with the same provider, or sign out', async () => {
    mockAccess({ kind: 'not_member', account: SAM });
    renderApp('/login');

    await userEvent.click(await screen.findByRole('button', { name: 'Check again' }));
    expect(signIn).toHaveBeenCalledWith('discord');

    await userEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(await screen.findByRole('heading', { name: 'Execs only beyond this point.' })).toBeInTheDocument();
    expect(signOut).toHaveBeenCalled();
  });

  it('asks a member whose pass ran out to renew it, not that they are off the list', async () => {
    mockAccess({ kind: 'expired', account: SAM });
    renderApp('/login');

    expect(await screen.findByRole('heading', { name: 'Your pass ran out, Sam.' })).toBeInTheDocument();
    expect(screen.queryByText(/not on the list/i)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Renew with Discord' }));
    expect(signIn).toHaveBeenCalledWith('discord');
  });

  it('shows an outage as an outage, never as "not on the list", and recovers on retry', async () => {
    mockAccess(new UnavailableError('Your session could not be checked.'));
    renderApp('/login');

    // The access check retries once (about a second) before calling it an outage.
    expect(await screen.findByRole('alert', {}, { timeout: 3000 })).toHaveTextContent('Your session could not be checked.');
    expect(screen.queryByText(/not on the list/i)).not.toBeInTheDocument();

    vi.mocked(checkAccess).mockResolvedValue({ kind: 'signed_out' });
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('heading', { name: 'Execs only beyond this point.' })).toBeInTheDocument();
  });

  it('sends a verified admin straight to the dashboard', async () => {
    mockAccess(SAM_ADMIN);
    vi.mocked(listEvents).mockResolvedValue([]);
    renderApp('/login');

    expect(await screen.findByRole('heading', { name: 'Events', level: 1 })).toBeInTheDocument();
  });
});
