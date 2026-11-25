import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnavailableError } from '../../src/lib/server/errors';
import { createEvent, getEvent, listEvents, updateEvent } from '../../src/lib/data/events';
import { mockAccess, SAM_ADMIN } from '../mocks/auth';
import { renderApp } from '../renderApp';

vi.mock('../../src/lib/auth/auth');
vi.mock('../../src/lib/data/events');

import { sampleEvent } from '../fixtures/events';

const CP312_REVIEW = sampleEvent({
  id: '0b6f9c2e-7a41-4d5b-8e3c-2f1a9b8c7d6e',
  title: 'CP312 Midterm Review',
  description: 'Bring questions.',
  date: '2026-11-12',
  startTime: '19:30:00',
  location: 'N2085',
  category: 'review',
});

const PICTURE_URL = 'https://lcs.supabase.co/storage/v1/object/public/event-media/cp312.png';
const POSTER = new File(['x'], 'poster.png', { type: 'image/png' });
// The poster's one byte, "x", read back as a data URL.
const POSTER_PREVIEW = 'data:image/png;base64,eA==';

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

    expect(createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Hack Night',
        date: '2026-12-01',
        startTime: '19:30:00',
        location: 'BA110',
        description: null,
        category: 'social',
      }),
      { kind: 'keep' },
    );
    expect(await screen.findByText('Saved "Hack Night".')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Events', level: 1 })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByText('Saved "Hack Night".')).not.toBeInTheDocument();
  });

  it('previews a chosen picture and saves it with the new event', async () => {
    vi.mocked(createEvent).mockResolvedValue();
    renderApp('/events/new');

    await userEvent.type(await screen.findByLabelText('Title'), 'Hack Night');
    await userEvent.type(screen.getByLabelText('Date'), '2026-12-01');
    await userEvent.upload(screen.getByLabelText(/Choose a picture/), POSTER);

    expect(await screen.findByRole('img', { name: 'The new picture' })).toHaveAttribute('src', POSTER_PREVIEW);
    await userEvent.click(screen.getByRole('button', { name: 'Create event' }));

    expect(createEvent).toHaveBeenCalledWith(expect.objectContaining({ title: 'Hack Night' }), {
      kind: 'replace',
      image: { file: POSTER, extension: 'png' },
    });
  });

  it('takes a picture dragged onto the field', async () => {
    renderApp('/events/new');

    fireEvent.drop(await screen.findByText(/Choose a picture/), { dataTransfer: { files: [POSTER] } });

    expect(await screen.findByRole('img', { name: 'The new picture' })).toHaveAttribute('src', POSTER_PREVIEW);
  });

  it('turns away a file that is not a picture or is too big, and says why', async () => {
    const user = userEvent.setup({ applyAccept: false });
    renderApp('/events/new');
    const picker = await screen.findByLabelText(/Choose a picture/);

    await user.upload(picker, new File(['<svg/>'], 'logo.svg', { type: 'image/svg+xml' }));
    expect(picker).toHaveAccessibleDescription(/That file isn't a picture we can use/);

    const huge = new File(['x'], 'huge.png', { type: 'image/png' });
    Object.defineProperty(huge, 'size', { value: 8 * 1024 * 1024 });
    await user.upload(picker, huge);
    expect(picker).toHaveAccessibleDescription(/That picture is 8.0 MB. Pictures can be up to 5 MB./);
    expect(screen.queryByRole('img', { name: 'The new picture' })).not.toBeInTheDocument();
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

  it('prints the ticket as you type, so it can be checked before saving', async () => {
    renderApp('/events/new');
    // The printed ticket repeats the form for the eyes only, so it is hidden from screen readers.
    const printed = (title: string) => screen.queryByRole('heading', { name: title, hidden: true });

    expect(await screen.findByLabelText('Title')).toBeInTheDocument();
    expect(printed('Untitled event')).toBeInTheDocument();
    expect(screen.getByText('Day not set')).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('Title'), 'Hack Night');
    await userEvent.type(screen.getByLabelText('Date'), '2026-12-01');

    expect(printed('Hack Night')).toBeInTheDocument();
    expect(screen.getByText('Tuesday, December 1, 2026')).toBeInTheDocument();
  });

  it('marks the title and date as required', async () => {
    renderApp('/events/new');

    expect(await screen.findByLabelText('Title')).toBeRequired();
    expect(screen.getByLabelText('Date')).toBeRequired();
    expect(screen.getByLabelText('Location')).not.toBeRequired();
  });

  it('moves focus to the save failure, so it is not missed', async () => {
    vi.mocked(createEvent).mockRejectedValue(new UnavailableError('"Hack Night" couldn\'t be saved.'));
    renderApp('/events/new');

    await userEvent.type(await screen.findByLabelText('Title'), 'Hack Night');
    await userEvent.type(screen.getByLabelText('Date'), '2026-12-01');
    await userEvent.click(screen.getByRole('button', { name: 'Create event' }));

    expect(await screen.findByRole('alert')).toHaveFocus();
  });

  it("names a chosen picture and says it isn't saved yet", async () => {
    renderApp('/events/new');

    await userEvent.upload(await screen.findByLabelText(/Choose a picture/), POSTER);

    expect(await screen.findByText('poster.png')).toBeInTheDocument();
    expect(screen.getByText('1 KB · not saved yet')).toBeInTheDocument();
  });

  it('asks before leaving with unsaved changes, and stays when told to', async () => {
    renderApp('/events/new');
    await userEvent.type(await screen.findByLabelText('Title'), 'Hack Night');

    await userEvent.click(screen.getByRole('link', { name: 'Events' }));
    const dialog = screen.getByRole('dialog', { name: 'Leave without saving?' });
    expect(dialog).toHaveAccessibleDescription("Your changes haven't been saved.");
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

    expect(updateEvent).toHaveBeenCalledWith(CP312_REVIEW, { location: 'BA201' }, { kind: 'keep' });
    expect(await screen.findByText('Saved "CP312 Midterm Review".')).toBeInTheDocument();
  });

  it('shows the current picture and replaces it with a new one', async () => {
    const event = { ...CP312_REVIEW, pictureUrl: PICTURE_URL };
    vi.mocked(getEvent).mockResolvedValue(event);
    vi.mocked(updateEvent).mockResolvedValue();
    renderApp(`/events/${CP312_REVIEW.id}`);

    expect(await screen.findByRole('img', { name: 'The current picture' })).toHaveAttribute('src', PICTURE_URL);
    await userEvent.upload(screen.getByLabelText(/Choose a different picture/), POSTER);
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(updateEvent).toHaveBeenCalledWith(event, {}, { kind: 'replace', image: { file: POSTER, extension: 'png' } });
  });

  it('goes back to the current picture after choosing a new one', async () => {
    vi.mocked(getEvent).mockResolvedValue({ ...CP312_REVIEW, pictureUrl: PICTURE_URL });
    renderApp(`/events/${CP312_REVIEW.id}`);

    expect(await screen.findByText('Current picture')).toBeInTheDocument();
    await userEvent.upload(screen.getByLabelText(/Choose a different picture/), POSTER);
    await screen.findByRole('img', { name: 'The new picture' });

    await userEvent.click(screen.getByRole('button', { name: 'Keep the current picture' }));

    expect(screen.getByRole('img', { name: 'The current picture' })).toHaveAttribute('src', PICTURE_URL);
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();
  });

  it('removes the picture, and can be talked out of it', async () => {
    const event = { ...CP312_REVIEW, pictureUrl: PICTURE_URL };
    vi.mocked(getEvent).mockResolvedValue(event);
    vi.mocked(updateEvent).mockResolvedValue();
    renderApp(`/events/${CP312_REVIEW.id}`);
    await screen.findByRole('img', { name: 'The current picture' });

    await userEvent.click(screen.getByRole('button', { name: 'Remove picture' }));
    expect(screen.getByText('The picture will be removed when you save.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Keep the current picture' }));
    expect(screen.getByRole('img', { name: 'The current picture' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Remove picture' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(updateEvent).toHaveBeenCalledWith(event, {}, { kind: 'remove' });
  });

  it('asks before leaving when only the picture changed', async () => {
    vi.mocked(getEvent).mockResolvedValue(CP312_REVIEW);
    renderApp(`/events/${CP312_REVIEW.id}`);

    await userEvent.upload(await screen.findByLabelText(/Choose a picture/), POSTER);
    await userEvent.click(screen.getByRole('link', { name: 'Events' }));

    expect(screen.getByRole('dialog', { name: 'Leave without saving?' })).toBeInTheDocument();
  });

  it('shows a time it cannot read as written, and keeps it', async () => {
    vi.mocked(getEvent).mockResolvedValue({ ...CP312_REVIEW, startTime: '25:99:00' });
    renderApp(`/events/${CP312_REVIEW.id}`);

    expect(await screen.findByLabelText('Time')).toHaveAccessibleDescription(
      'Saved as "25:99:00". Pick a time to replace it, or leave this empty to keep it.',
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
