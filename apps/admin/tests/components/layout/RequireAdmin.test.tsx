import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnavailableError } from '../../../src/lib/errors';
import { listEvents } from '../../../src/lib/events';
import { mockAccess, SAM, SAM_ADMIN } from '../../mocks/auth';
import { renderApp } from '../../renderApp';

vi.mock('../../../src/lib/auth');
vi.mock('../../../src/lib/events');

describe('RequireAdmin', () => {
  it('sends a signed-out visitor to the login page', async () => {
    mockAccess({ kind: 'signed_out' });
    renderApp('/');

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('sends someone outside the LCS community to the login page', async () => {
    mockAccess({ kind: 'not_member', account: SAM });
    renderApp('/');

    expect(await screen.findByRole('heading', { name: 'Not on the list' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Events in Supabase' })).not.toBeInTheDocument();
  });

  it('fails closed during an outage', async () => {
    mockAccess(new UnavailableError('Your session could not be checked.'));
    renderApp('/');

    expect(await screen.findByRole('alert')).toHaveTextContent("Couldn't check your sign-in");
  });

  it('lets an admin in and signs them out', async () => {
    mockAccess(SAM_ADMIN);
    vi.mocked(listEvents).mockResolvedValue([]);
    renderApp('/');

    expect(await screen.findByText('Signed in as Sam Rivera')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Events in Supabase' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });
});
