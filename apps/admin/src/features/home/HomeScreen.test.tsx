import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnavailableError } from '../../domain/errors';
import { adminAccess, FakeAuthGateway } from '../../test/fake-auth-gateway';
import { CP312_REVIEW, FakeEventReader } from '../../test/fake-event-reader';
import { renderApp } from '../../test/render-app';

function signedInAdmin(): FakeAuthGateway {
  const auth = new FakeAuthGateway();
  auth.access = adminAccess();
  return auth;
}

describe('HomeScreen events summary', () => {
  it('shows how many events are in Supabase and the latest one', async () => {
    const events = new FakeEventReader();
    events.events = [CP312_REVIEW, { ...CP312_REVIEW, id: '1c7e0d3f-8b52-4e6c-9f4d-3a2b0c9d8e7f', title: 'Older social' }];
    renderApp({ at: '/', auth: signedInAdmin(), events });

    const summary = await screen.findByRole('region', { name: 'Events in Supabase' });
    expect(await screen.findByText('2')).toBeInTheDocument();
    expect(summary).toHaveTextContent('Latest: CP312 Midterm Review on Thursday, November 12, 2026');
  });

  it('says there are none yet when the table is empty', async () => {
    renderApp({ at: '/', auth: signedInAdmin() });

    expect(await screen.findByText(/No events yet/)).toBeInTheDocument();
  });

  it('shows a failed read as a failure, not as "no events", and retries', async () => {
    const events = new FakeEventReader();
    events.failWith = new UnavailableError('Events could not be loaded.');
    renderApp({ at: '/', auth: signedInAdmin(), events });

    expect(await screen.findByRole('alert')).toHaveTextContent('Events could not be loaded.');
    expect(screen.queryByText(/No events yet/)).not.toBeInTheDocument();

    events.failWith = null;
    events.events = [CP312_REVIEW];
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText(/CP312 Midterm Review/)).toBeInTheDocument();
  });
});
