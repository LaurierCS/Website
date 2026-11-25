import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { downloadFile } from '../../src/lib/download';
import { UnavailableError } from '../../src/lib/errors';
import { deleteEvent, listEvents } from '../../src/lib/events';
import { mockAccess, SAM_ADMIN } from '../mocks/auth';
import { renderApp } from '../renderApp';

vi.mock('../../src/lib/auth');
vi.mock('../../src/lib/events');
vi.mock('../../src/lib/download');

import { sampleEvent } from '../fixtures/events';

const HACK_NIGHT = sampleEvent({
  id: '1c7a0d3f-8b52-4e6c-9f4d-3a2b1c0d9e8f',
  title: 'Hack Night',
  date: '2026-11-20',
});

const CP312_REVIEW = sampleEvent({
  id: '0b6f9c2e-7a41-4d5b-8e3c-2f1a9b8c7d6e',
  title: 'CP312 Midterm Review',
  date: '2026-11-12',
  startTime: '19:30:00',
  location: 'N2085',
  category: 'review',
  pictureUrl: 'https://lcs.supabase.co/storage/v1/object/public/event-media/cp312.png',
});

const FINAL_REVIEW = sampleEvent({
  id: '5d2e8a1b-3c4f-4a6b-9d7e-1f2a3b4c5d6e',
  title: 'CP312 Final Review',
  date: '2026-12-03',
});

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

  it('lists every event in the order loaded, with when, where and whether it is next, coming up or past', async () => {
    vi.mocked(listEvents).mockResolvedValue([FINAL_REVIEW, HACK_NIGHT, CP312_REVIEW]);
    renderApp('/events');

    const titles = await screen.findAllByRole('heading', { level: 2 });
    expect(titles.map((title) => title.textContent)).toEqual(['CP312 Final Review', 'Hack Night', 'CP312 Midterm Review']);
    expect(screen.getByText('3 events · newest first')).toBeInTheDocument();

    const review = rowFor('CP312 Midterm Review');
    expect(review.getByText('Thursday, November 12, 2026')).toBeInTheDocument();
    expect(review.getByText('7:30PM')).toBeInTheDocument();
    expect(review.getByText('N2085')).toBeInTheDocument();
    expect(review.getByText('Past')).toBeInTheDocument();
    expect(rowFor('Hack Night').getByText('Next up')).toBeInTheDocument();
    expect(rowFor('CP312 Final Review').getByText('Upcoming')).toBeInTheDocument();
  });

  it('keeps "next up" on the soonest event while searching, and counts what matches', async () => {
    vi.mocked(listEvents).mockResolvedValue([FINAL_REVIEW, HACK_NIGHT, CP312_REVIEW]);
    renderApp('/events');
    await screen.findByRole('heading', { name: 'Hack Night' });

    await userEvent.type(screen.getByRole('searchbox', { name: 'Search by title' }), 'final');

    expect(rowFor('CP312 Final Review').getByText('Upcoming')).toBeInTheDocument();
    expect(screen.getByText('1 of 3 events')).toBeInTheDocument();
  });

  it('clears the search with the clear button, and from the no-matches message', async () => {
    vi.mocked(listEvents).mockResolvedValue([HACK_NIGHT, CP312_REVIEW]);
    renderApp('/events');
    await screen.findByRole('heading', { name: 'Hack Night' });
    const search = screen.getByRole('searchbox', { name: 'Search by title' });

    await userEvent.type(search, 'cp312');
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(search).toHaveValue('');
    expect(search).toHaveFocus();
    expect(screen.getByRole('heading', { name: 'Hack Night' })).toBeInTheDocument();

    await userEvent.type(search, 'nothing like this');
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(search).toHaveValue('');
    expect(screen.getByRole('heading', { name: 'CP312 Midterm Review' })).toBeInTheDocument();
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

  it("exports the loaded events as a CSV file named for the club's day", async () => {
    vi.mocked(listEvents).mockResolvedValue([HACK_NIGHT, CP312_REVIEW]);
    renderApp('/events');
    await screen.findByRole('heading', { name: 'Hack Night' });

    await userEvent.click(screen.getByRole('button', { name: 'Export CSV' }));

    expect(downloadFile).toHaveBeenCalledTimes(1);
    expect(downloadFile).toHaveBeenCalledWith({
      name: 'lcs-events-2026-11-15.csv',
      text: expect.stringContaining('id,title,date,time,location,description'),
    });
    expect(downloadFile).toHaveBeenCalledWith(
      expect.objectContaining({ text: expect.stringContaining(`${CP312_REVIEW.id},CP312 Midterm Review,2026-11-12,7:30PM,N2085,`) }),
    );
  });

  it("can't export while the events are loading or after they failed", async () => {
    vi.mocked(listEvents).mockRejectedValue(new UnavailableError('Events could not be loaded.'));
    renderApp('/events');

    expect(await screen.findByRole('button', { name: 'Export CSV' })).toBeDisabled();
    await screen.findByRole('alert');
    expect(screen.getByRole('button', { name: 'Export CSV' })).toBeDisabled();
  });
});
