import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnavailableError } from '../../src/lib/errors';
import { createEvent, getEvent, listEvents, updateEvent } from '../../src/lib/events';
import type { Event } from '../../src/types/event';
import { mockAccess, SAM_ADMIN } from '../mocks/auth';
import { renderApp } from '../renderApp';

vi.mock('../../src/lib/auth');
vi.mock('../../src/lib/events');

const CP312_REVIEW: Event = {
  id: '0b6f9c2e-7a41-4d5b-8e3c-2f1a9b8c7d6e',
  title: 'CP312 Midterm Review',
  description: 'Bring questions.',
  date: '2026-11-12',
  time: '7:30PM',
  location: 'N2085',
  pictureUrl: null,
};

beforeEach(() => {
  mockAccess(SAM_ADMIN);
  vi.mocked(listEvents).mockResolvedValue([]);
});

describe('NewEventPage', () => {
  it("won't save without a title and a date, and says why under each", async () => {
    renderApp('/events/new');

    await userEvent.type(await screen.findByLabelText('Location'), 'BA110');
    await userEvent.click(screen.getByRole('button', { name: 'Create event' }));

    expect(await screen.findByLabelText('Title')).toHaveAccessibleDescription('Give the event a title.');
    expect(screen.getByLabelText('Date')).toHaveAccessibleDescription('Pick the day of the event.');
    expect(createEvent).not.toHaveBeenCalled();
  });

  it('saves a new event, with its time written like 7:30PM, and says so on the list', async () => {
    vi.mocked(createEvent).mockResolvedValue();
    renderApp('/events/new');

    await userEvent.type(await screen.findByLabelText('Title'), 'Hack Night');
    await userEvent.type(screen.getByLabelText('Date'), '2026-12-01');
    await userEvent.type(screen.getByLabelText('Time'), '19:30');
    await userEvent.type(screen.getByLabelText('Location'), 'BA110');
    await userEvent.click(screen.getByRole('button', { name: 'Create event' }));

    expect(createEvent).toHaveBeenCalledWith({
      title: 'Hack Night',
      date: '2026-12-01',
      time: '7:30PM',
      location: 'BA110',
      description: null,
    });
    expect(await screen.findByText('Saved "Hack Night".')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Events', level: 1 })).toBeInTheDocument();
  });

  it('keeps what was typed and says so when saving fails', async () => {
    vi.mocked(createEvent).mockRejectedValue(new UnavailableError('"Hack Night" couldn\'t be saved.'));
    renderApp('/events/new');

    await userEvent.type(await screen.findByLabelText('Title'), 'Hack Night');
    await userEvent.type(screen.getByLabelText('Date'), '2026-12-01');
    await userEvent.click(screen.getByRole('button', { name: 'Create event' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('"Hack Night" couldn\'t be saved.');
    expect(screen.getByLabelText('Title')).toHaveValue('Hack Night');
  });

  it('asks before leaving with unsaved changes, and stays when told to', async () => {
    renderApp('/events/new');
    await userEvent.type(await screen.findByLabelText('Title'), 'Hack Night');

    await userEvent.click(screen.getByRole('link', { name: 'Events' }));
    const dialog = screen.getByRole('dialog', { name: 'Leave without saving?' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(screen.getByLabelText('Title')).toHaveValue('Hack Night');

    await userEvent.click(screen.getByRole('link', { name: 'Events' }));
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Leave' }));
    expect(await screen.findByRole('heading', { name: 'Events', level: 1 })).toBeInTheDocument();
  });

  it('leaves without asking when nothing was typed', async () => {
    renderApp('/events/new');
    await screen.findByLabelText('Title');

    await userEvent.click(screen.getByRole('link', { name: 'Cancel' }));

    expect(await screen.findByRole('heading', { name: 'Events', level: 1 })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('EditEventPage', () => {
  it('fills in the event and saves only what was changed', async () => {
    vi.mocked(getEvent).mockResolvedValue(CP312_REVIEW);
    vi.mocked(updateEvent).mockResolvedValue();
    renderApp(`/events/${CP312_REVIEW.id}`);

    expect(await screen.findByLabelText('Title')).toHaveValue('CP312 Midterm Review');
    expect(screen.getByLabelText('Time')).toHaveValue('19:30');

    const location = screen.getByLabelText('Location');
    await userEvent.clear(location);
    await userEvent.type(location, 'BA201');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(updateEvent).toHaveBeenCalledWith(CP312_REVIEW.id, { location: 'BA201' });
    expect(await screen.findByText('Saved "CP312 Midterm Review".')).toBeInTheDocument();
  });

  it('shows a time it cannot read as written, and keeps it', async () => {
    vi.mocked(getEvent).mockResolvedValue({ ...CP312_REVIEW, time: 'TBD' });
    renderApp(`/events/${CP312_REVIEW.id}`);

    expect(await screen.findByLabelText('Time')).toHaveAccessibleDescription(
      'Saved as "TBD". Pick a time to replace it, or leave this empty to keep it.',
    );
  });

  it('says so when there is no such event', async () => {
    vi.mocked(getEvent).mockResolvedValue(null);
    renderApp(`/events/${CP312_REVIEW.id}`);

    expect(await screen.findByText(/There's no event at this address/)).toBeInTheDocument();
  });

  it('shows a failure to load as a failure, not as "no such event"', async () => {
    vi.mocked(getEvent).mockRejectedValue(new UnavailableError('This event could not be loaded.'));
    renderApp(`/events/${CP312_REVIEW.id}`);

    expect(await screen.findByRole('alert')).toHaveTextContent('This event could not be loaded.');
    expect(screen.queryByText(/There's no event at this address/)).not.toBeInTheDocument();
  });
});
