import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnavailableError } from '../lib/errors';
import { listEvents } from '../lib/events';
import type { Event } from '../types/event';
import { HomePage } from './HomePage';

vi.mock('../lib/events');

const CP312_REVIEW: Event = {
  id: '0b6f9c2e-7a41-4d5b-8e3c-2f1a9b8c7d6e',
  title: 'CP312 Midterm Review',
  description: null,
  date: '2026-11-12',
  time: '7:30PM',
  location: 'N2085',
  pictureUrl: null,
};

function renderHomePage() {
  // No retries, so a failure shows its error straight away.
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <HomePage />
    </QueryClientProvider>,
  );
}

describe('HomePage', () => {
  it('shows how many events there are and the latest one', async () => {
    vi.mocked(listEvents).mockResolvedValue([CP312_REVIEW, { ...CP312_REVIEW, id: '1c7a0d3f-8b52-4e6c-9f4d-3a2b1c0d9e8f', title: 'Club Fair' }]);
    renderHomePage();

    expect(await screen.findByText('2 events. Latest: CP312 Midterm Review (2026-11-12)')).toBeInTheDocument();
  });

  it('says so when there are no events', async () => {
    vi.mocked(listEvents).mockResolvedValue([]);
    renderHomePage();

    expect(await screen.findByText('No events yet.')).toBeInTheDocument();
  });

  it('shows a failure as a failure, never as "no events", and recovers on retry', async () => {
    vi.mocked(listEvents).mockRejectedValue(new UnavailableError('Events could not be loaded.'));
    renderHomePage();

    expect(await screen.findByRole('alert')).toHaveTextContent('Events could not be loaded.');
    expect(screen.queryByText('No events yet.')).not.toBeInTheDocument();

    vi.mocked(listEvents).mockResolvedValue([CP312_REVIEW]);
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('1 event. Latest: CP312 Midterm Review (2026-11-12)')).toBeInTheDocument();
  });
});
