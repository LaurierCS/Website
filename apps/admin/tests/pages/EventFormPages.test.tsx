import { fireEvent, screen, within } from '@testing-library/react';
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

const PICTURE_URL = 'https://lcs.supabase.co/storage/v1/object/public/events-images/cp312.png';
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
      { title: 'Hack Night', date: '2026-12-01', time: '7:30PM', location: 'BA110', description: null },
      { kind: 'keep' },
    );
    expect(await screen.findByText('Saved "Hack Night".')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Events', level: 1 })).toBeInTheDocument();
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
