import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnavailableError } from '../../src/lib/errors';
import { deleteEvent, listEvents } from '../../src/lib/events';
import type { Event } from '../../src/types/event';
import { mockAccess, SAM_ADMIN } from '../mocks/auth';
import { renderApp } from '../renderApp';

vi.mock('../../src/lib/auth');
vi.mock('../../src/lib/events');

const HACK_NIGHT: Event = {
  id: '1c7a0d3f-8b52-4e6c-9f4d-3a2b1c0d9e8f',
  title: 'Hack Night',
  description: null,
  date: '2026-11-20',
  time: null,
  location: null,
  pictureUrl: null,
};

const CP312_REVIEW: Event = {
  id: '0b6f9c2e-7a41-4d5b-8e3c-2f1a9b8c7d6e',
  title: 'CP312 Midterm Review',
  description: null,
  date: '2026-11-12',
  time: '7:30PM',
  location: 'N2085',
  pictureUrl: 'https://lcs.supabase.co/storage/v1/object/public/events-images/cp312.png',
};

/** The list item for an event, found by its title. */
function rowFor(title: string) {
  const row = screen.getByRole('heading', { name: title }).closest('li');
  if (!row) throw new Error(`No row for ${title}`);
  return within(row);
}

describe('EventsPage', () => {
  beforeEach(() => {
    mockAccess(SAM_ADMIN);
    // Only the clock's date is faked, so "upcoming" is stable and user events still run in real time.
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-15T17:00:00Z'));
  });

  afterEach(() => vi.useRealTimers());

  it('lists every event in the order loaded, with when, where and whether it is coming up', async () => {
    vi.mocked(listEvents).mockResolvedValue([HACK_NIGHT, CP312_REVIEW]);
    renderApp('/events');

    const titles = await screen.findAllByRole('heading', { level: 2 });
    expect(titles.map((title) => title.textContent)).toEqual(['Hack Night', 'CP312 Midterm Review']);

    const review = rowFor('CP312 Midterm Review');
    expect(review.getByText(/Thursday, November 12, 2026/)).toHaveTextContent('7:30PM');
    expect(review.getByText('N2085')).toBeInTheDocument();
    expect(review.getByText('Past')).toBeInTheDocument();
    expect(rowFor('Hack Night').getByText('Upcoming')).toBeInTheDocument();
  });

  it('shows an event with no picture, time or location without breaking', async () => {
    vi.mocked(listEvents).mockResolvedValue([HACK_NIGHT]);
    renderApp('/events');

    await screen.findByRole('heading', { name: 'Hack Night' });
    const row = rowFor('Hack Night');
    expect(row.getByText('No photo')).toBeInTheDocument();
    expect(row.getByText(/Time TBA/)).toBeInTheDocument();
    expect(row.getByText('Location TBA')).toBeInTheDocument();
  });

  it('links to a new event and to editing each event', async () => {
    vi.mocked(listEvents).mockResolvedValue([CP312_REVIEW]);
    renderApp('/events');

    await screen.findByRole('heading', { name: 'CP312 Midterm Review' });
    expect(screen.getByRole('link', { name: 'New event' })).toHaveAttribute('href', '/events/new');
    expect(screen.getByRole('link', { name: 'Edit CP312 Midterm Review' })).toHaveAttribute('href', `/events/${CP312_REVIEW.id}`);
  });

  it('filters by title, ignoring case, and says when nothing matches', async () => {
    vi.mocked(listEvents).mockResolvedValue([HACK_NIGHT, CP312_REVIEW]);
    renderApp('/events');
    await screen.findByRole('heading', { name: 'Hack Night' });

    await userEvent.type(screen.getByRole('searchbox', { name: 'Search by title' }), 'cp312');
    expect(screen.getByRole('heading', { name: 'CP312 Midterm Review' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Hack Night' })).not.toBeInTheDocument();

    await userEvent.type(screen.getByRole('searchbox', { name: 'Search by title' }), ' final');
    expect(screen.getByText('No events match "cp312 final".')).toBeInTheDocument();
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
    expect(await screen.findByRole('heading', { name: 'CP312 Midterm Review' })).toBeInTheDocument();
  });

  it('asks before deleting, naming the event, then removes it from the list', async () => {
    vi.mocked(listEvents).mockResolvedValue([HACK_NIGHT, CP312_REVIEW]);
    vi.mocked(deleteEvent).mockResolvedValue();
    renderApp('/events');
    await screen.findByRole('heading', { name: 'CP312 Midterm Review' });

    await userEvent.click(screen.getByRole('button', { name: 'Delete CP312 Midterm Review' }));
    const dialog = screen.getByRole('dialog', { name: 'Delete CP312 Midterm Review?' });
    expect(dialog).toHaveAccessibleDescription("This can't be undone.");

    vi.mocked(listEvents).mockResolvedValue([HACK_NIGHT]);
    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete' }));

    expect(deleteEvent).toHaveBeenCalledWith(CP312_REVIEW);
    expect(await screen.findByRole('heading', { name: 'Hack Night' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'CP312 Midterm Review' })).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('deletes nothing when the confirm is cancelled', async () => {
    vi.mocked(listEvents).mockResolvedValue([CP312_REVIEW]);
    renderApp('/events');
    await screen.findByRole('heading', { name: 'CP312 Midterm Review' });

    await userEvent.click(screen.getByRole('button', { name: 'Delete CP312 Midterm Review' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(deleteEvent).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'CP312 Midterm Review' })).toBeInTheDocument();
  });

  it('keeps the event and says so when the delete fails', async () => {
    vi.mocked(listEvents).mockResolvedValue([CP312_REVIEW]);
    vi.mocked(deleteEvent).mockRejectedValue(new UnavailableError('"CP312 Midterm Review" couldn\'t be deleted.'));
    renderApp('/events');
    await screen.findByRole('heading', { name: 'CP312 Midterm Review' });

    await userEvent.click(screen.getByRole('button', { name: 'Delete CP312 Midterm Review' }));
    const dialog = screen.getByRole('dialog', { name: 'Delete CP312 Midterm Review?' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete' }));

    expect(await within(dialog).findByRole('alert')).toHaveTextContent('"CP312 Midterm Review" couldn\'t be deleted.');
    expect(screen.getByRole('heading', { name: 'CP312 Midterm Review' })).toBeInTheDocument();
  });
});
