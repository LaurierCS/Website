import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { checkAccess } from '../../../src/lib/auth/auth';
import { UnavailableError } from '../../../src/lib/server/errors';
import { listEvents } from '../../../src/lib/data/events';
import { mockAccess, SAM, SAM_ADMIN } from '../../mocks/auth';
import { renderApp } from '../../renderApp';

vi.mock('../../../src/lib/auth/auth');
vi.mock('../../../src/lib/data/events');

describe('RequireAdmin', () => {
  it('sends a signed-out visitor to the login page', async () => {
    mockAccess({ kind: 'signed_out' });
    renderApp('/');

    expect(await screen.findByRole('heading', { name: 'Execs only beyond this point.' })).toBeInTheDocument();
  });

  it('sends someone outside the LCS community to the login page', async () => {
    mockAccess({ kind: 'not_member', account: SAM });
    renderApp('/');

    expect(await screen.findByRole('heading', { name: "Hey Sam, you're not on the list (yet)." })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Events', level: 1 })).not.toBeInTheDocument();
  });

  it('sends someone whose pass ran out to the login page to renew it', async () => {
    mockAccess({ kind: 'expired', account: SAM });
    renderApp('/');

    expect(await screen.findByRole('heading', { name: 'Your pass ran out, Sam.' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Events', level: 1 })).not.toBeInTheDocument();
  });

  it('checks access again when the pass runs out, without a reload', async () => {
    mockAccess({ ...SAM_ADMIN, verifiedUntil: new Date(Date.now() + 1000) });
    vi.mocked(listEvents).mockResolvedValue([]);
    renderApp('/');
    expect(await screen.findByRole('heading', { name: 'Events', level: 1 })).toBeInTheDocument();

    vi.mocked(checkAccess).mockResolvedValue({ kind: 'expired', account: SAM });

    expect(await screen.findByRole('heading', { name: 'Your pass ran out, Sam.' }, { timeout: 3000 })).toBeInTheDocument();
  });

  it('fails closed during an outage', async () => {
    mockAccess(new UnavailableError('Your session could not be checked.'));
    renderApp('/');

    // The access check retries once (about a second) before calling it an outage.
    expect(await screen.findByRole('alert', {}, { timeout: 3000 })).toHaveTextContent("The door's jammed.");
  });

  it('lets an admin in and signs them out', async () => {
    mockAccess(SAM_ADMIN);
    vi.mocked(listEvents).mockResolvedValue([]);
    renderApp('/');

    expect(await screen.findByText('Sam Rivera')).toBeInTheDocument();
    // The header shows on "/" before the redirect to /events lands, so wait for the page too.
    expect(await screen.findByRole('heading', { name: 'Events', level: 1 })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(await screen.findByRole('heading', { name: 'Execs only beyond this point.' })).toBeInTheDocument();
  });
});
