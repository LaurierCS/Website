import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnavailableError } from '../../src/lib/errors';
import { listEvents } from '../../src/lib/events';
import type { Event } from '../../src/types/event';
import { mockAccess, SAM_ADMIN } from '../mocks/auth';
import { renderApp } from '../renderApp';

vi.mock('../../src/lib/auth');
vi.mock('../../src/lib/events');

const CP312_REVIEW: Event = {
  id: '0b6f9c2e-7a41-4d5b-8e3c-2f1a9b8c7d6e',
  title: 'CP312 Midterm Review',
  description: null,
  date: '2026-11-12',
  time: '7:30PM',
  location: 'N2085',
  pictureUrl: null,
};

describe('EventsPage', () => {
  beforeEach(() => mockAccess(SAM_ADMIN));

  it('greets the admin and says how long their pass lasts', async () => {
    vi.mocked(listEvents).mockResolvedValue([]);
    renderApp('/events');

    expect(await screen.findByRole('heading', { name: 'Hey Sam.' })).toBeInTheDocument();
    expect(screen.getByText(/good until Wednesday, November 25/)).toBeInTheDocument();
  });

  it('shows how many events there are and the latest one', async () => {
    vi.mocked(listEvents).mockResolvedValue([CP312_REVIEW, { ...CP312_REVIEW, id: '1c7a0d3f-8b52-4e6c-9f4d-3a2b1c0d9e8f', title: 'Club Fair' }]);
    renderApp('/events');

    const summary = await screen.findByRole('region', { name: 'Events in Supabase' });
    expect(await screen.findByText('2')).toBeInTheDocument();
    expect(summary).toHaveTextContent('Latest: CP312 Midterm Review on Thursday, November 12, 2026');
  });

  it('says so when there are no events', async () => {
    vi.mocked(listEvents).mockResolvedValue([]);
    renderApp('/events');

    expect(await screen.findByText(/No events yet/)).toBeInTheDocument();
  });

  it('shows a failure as a failure, never as "no events", and recovers on retry', async () => {
    vi.mocked(listEvents).mockRejectedValue(new UnavailableError('Events could not be loaded.'));
    renderApp('/events');

    expect(await screen.findByRole('alert')).toHaveTextContent('Events could not be loaded.');
    expect(screen.queryByText(/No events yet/)).not.toBeInTheDocument();

    vi.mocked(listEvents).mockResolvedValue([CP312_REVIEW]);
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText(/CP312 Midterm Review/)).toBeInTheDocument();
  });
});
