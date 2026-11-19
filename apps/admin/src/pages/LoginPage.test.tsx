import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { checkAccess, signIn, signOut } from '../lib/auth';
import { UnavailableError } from '../lib/errors';
import { listEvents } from '../lib/events';
import { mockAccess, SAM, SAM_ADMIN } from '../test/mocks/auth';
import { renderApp } from '../test/renderApp';

vi.mock('../lib/auth');
vi.mock('../lib/events');

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

    expect(await screen.findByRole('heading', { name: 'Not on the list' })).toBeInTheDocument();
    expect(screen.getByText(/the LCS Notion workspace/)).toBeInTheDocument();
  });

  it('lets someone outside the community check again with the same provider, or sign out', async () => {
    mockAccess({ kind: 'not_member', account: SAM });
    renderApp('/login');

    await userEvent.click(await screen.findByRole('button', { name: 'Check again' }));
    expect(signIn).toHaveBeenCalledWith('discord');

    await userEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(signOut).toHaveBeenCalled();
  });

  it('shows an outage as an outage, never as "not on the list", and recovers on retry', async () => {
    mockAccess(new UnavailableError('Your session could not be checked.'));
    renderApp('/login');

    expect(await screen.findByRole('alert')).toHaveTextContent('Your session could not be checked.');
    expect(screen.queryByText(/not on the list/i)).not.toBeInTheDocument();

    vi.mocked(checkAccess).mockResolvedValue({ kind: 'signed_out' });
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('sends a verified admin straight to the dashboard', async () => {
    mockAccess(SAM_ADMIN);
    vi.mocked(listEvents).mockResolvedValue([]);
    renderApp('/login');

    expect(await screen.findByRole('heading', { name: 'Events in Supabase' })).toBeInTheDocument();
  });
});
