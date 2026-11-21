import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { cropToSquare } from '../../src/lib/crop-image';
import { UnavailableError } from '../../src/lib/errors';
import { createMember, getMember, listTeam, updateMember } from '../../src/lib/team';
import type { TeamMember } from '../../src/types/team';
import { mockAccess, SAM_ADMIN } from '../mocks/auth';
import { renderApp } from '../renderApp';

vi.mock('../../src/lib/auth');
vi.mock('../../src/lib/team');
// The test browser can't draw on a canvas, so the crop's export is faked here.
vi.mock('../../src/lib/crop-image');
// Nor can it load and measure a real image, which is how the cropper works out the square. This stand-in
// reports a fixed square when its button is pressed, the way the real one does once the photo has loaded.
// The square is written out here because a mock can't use the test file's constants; it matches `SQUARE`.
vi.mock('react-easy-crop', async () => {
  const { createElement } = await import('react');
  return {
    default: ({ onCropComplete }: { onCropComplete: (area: unknown, pixels: unknown) => void }) =>
      createElement(
        'button',
        { type: 'button', onClick: () => onCropComplete({}, { x: 10, y: 20, width: 300, height: 300 }) },
        'Pick this square',
      ),
  };
});

const SQUARE = { x: 10, y: 20, width: 300, height: 300 };
const PHOTO = new File(['x'], 'ava.png', { type: 'image/png' });
const CROPPED = { file: new File(['y'], 'ava.jpg', { type: 'image/jpeg' }), extension: 'jpg' };
const PHOTO_URL = 'https://lcs.supabase.co/storage/v1/object/public/team-images/sam.jpg';

const SAM: TeamMember = {
  id: '6f1c2b8e-2d1a-4c5e-9b7f-0a1b2c3d4e5f',
  name: 'Sam Rivera',
  role: 'VP Engineering',
  department: 'Engineering',
  isPublic: true,
  pictureUrl: null,
  githubUrl: 'https://github.com/samrivera',
  linkedinUrl: null,
};

beforeEach(() => {
  mockAccess(SAM_ADMIN);
  vi.mocked(listTeam).mockResolvedValue([]);
});

describe('NewMemberPage', () => {
  it("won't save without a name and a department, and says why under each", async () => {
    renderApp('/team/new');

    await userEvent.type(await screen.findByLabelText('Role'), 'VP Events');
    await userEvent.click(screen.getByRole('button', { name: 'Add member' }));

    expect(await screen.findByLabelText('Name')).toHaveAccessibleDescription('Give their name.');
    expect(screen.getByLabelText('Department')).toHaveAccessibleDescription('Pick their department.');
    expect(createMember).not.toHaveBeenCalled();
  });

  it("turns away a link that isn't GitHub, and says what to paste", async () => {
    renderApp('/team/new');

    await userEvent.type(await screen.findByLabelText('Name'), 'Ava Lee');
    await userEvent.selectOptions(screen.getByLabelText('Department'), 'Events');
    await userEvent.type(screen.getByLabelText('GitHub'), 'github.com/avalee');
    await userEvent.click(screen.getByRole('button', { name: 'Add member' }));

    expect(await screen.findByLabelText('GitHub')).toHaveAccessibleDescription(/isn't a GitHub link/);
    expect(createMember).not.toHaveBeenCalled();
  });

  it('saves a new member on the site, with empty links as none, and says so on Team', async () => {
    vi.mocked(createMember).mockResolvedValue();
    renderApp('/team/new');

    expect(await screen.findByRole('switch', { name: 'Show them on the site' })).toBeChecked();
    await userEvent.type(screen.getByLabelText('Name'), 'Ava Lee');
    await userEvent.selectOptions(screen.getByLabelText('Department'), 'Events');
    await userEvent.type(screen.getByLabelText('LinkedIn'), 'https://www.linkedin.com/in/avalee');
    await userEvent.click(screen.getByRole('button', { name: 'Add member' }));

    expect(createMember).toHaveBeenCalledWith(
      {
        name: 'Ava Lee',
        role: null,
        department: 'Events',
        githubUrl: null,
        linkedinUrl: 'https://www.linkedin.com/in/avalee',
        isPublic: true,
      },
      { kind: 'keep' },
    );
    expect(await screen.findByText('Saved "Ava Lee".')).toBeInTheDocument();
  });

  it('crops a chosen photo to a square and saves the cropped one', async () => {
    vi.mocked(cropToSquare).mockResolvedValue(CROPPED);
    vi.mocked(createMember).mockResolvedValue();
    renderApp('/team/new');

    await userEvent.type(await screen.findByLabelText('Name'), 'Ava Lee');
    await userEvent.selectOptions(screen.getByLabelText('Department'), 'Events');
    await userEvent.upload(screen.getByLabelText(/Choose a picture/), PHOTO);

    const dialog = await screen.findByRole('dialog', { name: 'Crop the photo' });
    const keepCrop = within(dialog).getByRole('button', { name: 'Use this photo' });
    // Off until the cropper has reported the square to keep.
    expect(keepCrop).toBeDisabled();
    await userEvent.click(await within(dialog).findByRole('button', { name: 'Pick this square' }));
    await userEvent.click(keepCrop);

    expect(cropToSquare).toHaveBeenCalledWith({ file: PHOTO, extension: 'png' }, SQUARE);
    expect(await screen.findByRole('img', { name: 'The new picture' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Add member' }));
    expect(createMember).toHaveBeenCalledWith(expect.objectContaining({ name: 'Ava Lee' }), { kind: 'replace', image: CROPPED });
  });

  it('keeps no photo when the crop is cancelled', async () => {
    renderApp('/team/new');

    await userEvent.upload(await screen.findByLabelText(/Choose a picture/), PHOTO);
    const dialog = await screen.findByRole('dialog', { name: 'Crop the photo' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'The new picture' })).not.toBeInTheDocument();
    expect(cropToSquare).not.toHaveBeenCalled();
  });

  it("says so when the photo can't be cropped", async () => {
    vi.mocked(cropToSquare).mockRejectedValue(new Error('no canvas'));
    renderApp('/team/new');

    const picker = await screen.findByLabelText(/Choose a picture/);
    await userEvent.upload(picker, PHOTO);
    const dialog = await screen.findByRole('dialog', { name: 'Crop the photo' });
    await userEvent.click(await within(dialog).findByRole('button', { name: 'Pick this square' }));
    await userEvent.click(within(dialog).getByRole('button', { name: 'Use this photo' }));

    expect(await screen.findByLabelText(/Choose a picture/)).toHaveAccessibleDescription(/couldn't be cropped/);
  });

  it('can add someone hidden from the site', async () => {
    vi.mocked(createMember).mockResolvedValue();
    renderApp('/team/new');

    await userEvent.type(await screen.findByLabelText('Name'), 'Ava Lee');
    await userEvent.selectOptions(screen.getByLabelText('Department'), 'Events');
    await userEvent.click(screen.getByRole('switch', { name: 'Show them on the site' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add member' }));

    expect(createMember).toHaveBeenCalledWith(expect.objectContaining({ isPublic: false }), { kind: 'keep' });
  });

  it('keeps what was typed and says so when saving fails', async () => {
    vi.mocked(createMember).mockRejectedValue(new UnavailableError("Ava Lee couldn't be saved."));
    renderApp('/team/new');

    await userEvent.type(await screen.findByLabelText('Name'), 'Ava Lee');
    await userEvent.selectOptions(screen.getByLabelText('Department'), 'Events');
    await userEvent.click(screen.getByRole('button', { name: 'Add member' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent("Ava Lee couldn't be saved.");
    expect(alert).toHaveFocus();
    expect(screen.getByLabelText('Name')).toHaveValue('Ava Lee');
  });

  it('asks before leaving with unsaved changes', async () => {
    renderApp('/team/new');
    await userEvent.type(await screen.findByLabelText('Name'), 'Ava Lee');

    await userEvent.click(screen.getByRole('link', { name: 'Cancel' }));

    expect(screen.getByRole('dialog', { name: 'Leave without saving?' })).toBeInTheDocument();
  });
});

describe('EditMemberPage', () => {
  it('fills in the member and saves only what was changed', async () => {
    vi.mocked(getMember).mockResolvedValue(SAM);
    vi.mocked(updateMember).mockResolvedValue();
    renderApp(`/team/${SAM.id}`);

    expect(await screen.findByLabelText('Name')).toHaveValue('Sam Rivera');
    expect(screen.getByLabelText('Department')).toHaveValue('Engineering');
    expect(screen.getByLabelText('GitHub')).toHaveValue(SAM.githubUrl);

    const role = screen.getByLabelText('Role');
    await userEvent.clear(role);
    await userEvent.type(role, 'Software Engineer');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(updateMember).toHaveBeenCalledWith(SAM, { role: 'Software Engineer' }, { kind: 'keep' });
    expect(await screen.findByText('Saved "Sam Rivera".')).toBeInTheDocument();
  });

  it('clears a link by saving it empty', async () => {
    vi.mocked(getMember).mockResolvedValue(SAM);
    vi.mocked(updateMember).mockResolvedValue();
    renderApp(`/team/${SAM.id}`);

    await userEvent.clear(await screen.findByLabelText('GitHub'));
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(updateMember).toHaveBeenCalledWith(SAM, { githubUrl: null }, { kind: 'keep' });
  });

  it('shows the current photo, and removes it', async () => {
    const withPhoto = { ...SAM, pictureUrl: PHOTO_URL };
    vi.mocked(getMember).mockResolvedValue(withPhoto);
    vi.mocked(updateMember).mockResolvedValue();
    renderApp(`/team/${SAM.id}`);

    expect(await screen.findByRole('img', { name: 'The current picture' })).toHaveAttribute('src', PHOTO_URL);
    await userEvent.click(screen.getByRole('button', { name: 'Remove picture' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(updateMember).toHaveBeenCalledWith(withPhoto, {}, { kind: 'remove' });
  });

  it('says so when there is no such member', async () => {
    vi.mocked(getMember).mockResolvedValue(null);
    renderApp(`/team/${SAM.id}`);

    expect(await screen.findByText("There's no one at this address.")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See the whole team' })).toHaveAttribute('href', '/team');
  });

  it('shows a failure to load as a failure, not as "no such member", and recovers on retry', async () => {
    vi.mocked(getMember).mockRejectedValue(new UnavailableError('This team member could not be loaded.'));
    renderApp(`/team/${SAM.id}`);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('This team member could not be loaded.');
    expect(screen.queryByText("There's no one at this address.")).not.toBeInTheDocument();

    vi.mocked(getMember).mockResolvedValue(SAM);
    await userEvent.click(within(alert).getByRole('button', { name: 'Try again' }));
    expect(await screen.findByLabelText('Name')).toHaveValue('Sam Rivera');
  });
});
