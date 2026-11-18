import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnavailableError } from '../../domain/errors';
import { adminAccess, FakeAuthGateway, SAM } from '../../test/fake-auth-gateway';
import { renderApp } from '../../test/render-app';

describe('LoginScreen', () => {
  it.each([
    ['Continue with Discord', 'discord'],
    ['Continue with Notion', 'notion'],
  ])('offers "%s" to a signed-out visitor', async (button, provider) => {
    const { auth } = renderApp({ at: '/login' });

    expect(await screen.findByRole('heading', { name: 'Execs only beyond this point.' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: button }));

    expect(auth.signIns).toEqual([provider]);
  });

  it('shows a signed-out visitor the sign-in buttons straight away, without checking a pass', async () => {
    renderApp({ at: '/login' });

    // Shorter than the 500 ms a signed-in visitor's check is held for, so a held check fails this.
    expect(await screen.findByRole('button', { name: 'Continue with Discord' }, { timeout: 300 })).toBeInTheDocument();
    expect(screen.queryByText('Checking your pass…')).not.toBeInTheDocument();
  });

  it('says so when a sign-in cannot start', async () => {
    const auth = new FakeAuthGateway();
    auth.signInFailsWith = new UnavailableError('Sign-in could not be started.');
    renderApp({ at: '/login', auth });

    await userEvent.click(await screen.findByRole('button', { name: 'Continue with Notion' }));

    expect(await screen.findByRole('alert')).toHaveTextContent("That sign-in didn't open");
  });

  it('turns away someone outside the LCS community, naming where they need to be', async () => {
    const auth = new FakeAuthGateway();
    auth.access = { kind: 'not_member', account: { ...SAM, provider: 'notion' } };
    renderApp({ at: '/login', auth });

    expect(await screen.findByRole('heading', { name: "Hey Sam, you're not on the list (yet)." })).toBeInTheDocument();
    expect(screen.getByText(/the LCS Notion workspace/)).toBeInTheDocument();
  });

  it('lets someone outside the community check again with the same provider, or sign out', async () => {
    const auth = new FakeAuthGateway();
    auth.access = { kind: 'not_member', account: SAM };
    renderApp({ at: '/login', auth });

    await userEvent.click(await screen.findByRole('button', { name: 'Check again' }));
    expect(auth.signIns).toEqual(['discord']);

    await userEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(await screen.findByRole('heading', { name: 'Execs only beyond this point.' })).toBeInTheDocument();
    expect(auth.signOutCount).toBe(1);
  });

  it('shows an outage as an outage, never as "not on the list", and recovers on retry', async () => {
    const auth = new FakeAuthGateway();
    auth.checkFailsWith = new UnavailableError('Your session could not be checked.');
    renderApp({ at: '/login', auth });

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent("The door's jammed.");
    expect(alert).toHaveTextContent('Your session could not be checked.');
    expect(screen.queryByText(/not on the list/i)).not.toBeInTheDocument();

    auth.checkFailsWith = null;
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('heading', { name: 'Execs only beyond this point.' })).toBeInTheDocument();
  });

  it('lets someone stuck on an outage sign out and start over', async () => {
    const auth = new FakeAuthGateway();
    auth.checkFailsWith = new UnavailableError('Your membership could not be checked.');
    renderApp({ at: '/login', auth });

    await screen.findByRole('alert');
    auth.checkFailsWith = null;
    await userEvent.click(screen.getByRole('button', { name: 'Sign out' }));

    expect(await screen.findByRole('heading', { name: 'Execs only beyond this point.' })).toBeInTheDocument();
    expect(auth.signOutCount).toBe(1);
  });

  it('stamps a member through to the dashboard', async () => {
    const auth = new FakeAuthGateway();
    auth.access = adminAccess();
    renderApp({ at: '/login', auth });

    expect(await screen.findByRole('heading', { name: 'Hey Sam.' })).toBeInTheDocument();
  });
});
