import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnavailableError } from '../domain/errors';
import { adminAccess, FakeAuthGateway, SAM } from '../test/fake-auth-gateway';
import { renderApp } from '../test/render-app';

describe('RequireAdmin', () => {
  it('sends a signed-out visitor to the login', async () => {
    renderApp({ at: '/' });

    expect(await screen.findByRole('heading', { name: 'Execs only beyond this point.' })).toBeInTheDocument();
  });

  it('sends someone outside the LCS community to the login', async () => {
    const auth = new FakeAuthGateway();
    auth.access = { kind: 'not_member', account: SAM };
    renderApp({ at: '/', auth });

    expect(await screen.findByRole('heading', { name: /not on the list/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Hey Sam.' })).not.toBeInTheDocument();
  });

  it('fails closed during an outage', async () => {
    const auth = new FakeAuthGateway();
    auth.checkFailsWith = new UnavailableError('Your session could not be checked.');
    renderApp({ at: '/', auth });

    expect(await screen.findByRole('alert')).toHaveTextContent("The door's jammed.");
  });

  it('lets a member in, shows how long their pass lasts, and signs them out', async () => {
    const auth = new FakeAuthGateway();
    auth.access = adminAccess();
    renderApp({ at: '/', auth });

    expect(await screen.findByRole('heading', { name: 'Hey Sam.' })).toBeInTheDocument();
    expect(screen.getByText(/good until Wednesday, November 25/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(await screen.findByRole('heading', { name: 'Execs only beyond this point.' })).toBeInTheDocument();
  });
});
