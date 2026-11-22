import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnavailableError } from '../../src/lib/errors';
import { importEvents, listEvents } from '../../src/lib/events';
import { importTeam, listTeam } from '../../src/lib/team';
import type { Event } from '../../src/types/event';
import type { TeamMember } from '../../src/types/team';
import { mockAccess, SAM_ADMIN } from '../mocks/auth';
import { renderApp } from '../renderApp';

vi.mock('../../src/lib/auth');
vi.mock('../../src/lib/events');
vi.mock('../../src/lib/team');

const HACK_NIGHT: Event = {
  id: '1c7a0d3f-8b52-4e6c-9f4d-3a2b1c0d9e8f',
  title: 'Hack Night',
  description: null,
  date: '2026-11-20',
  time: '7:30PM',
  location: 'BA201',
  pictureUrl: null,
};

const SAM: TeamMember = {
  id: '6f1c2b8e-2d1a-4c5e-9b7f-0a1b2c3d4e5f',
  name: 'Sam Rivera',
  role: 'VP Engineering',
  department: 'Engineering',
  isPublic: true,
  pictureUrl: null,
  githubUrl: null,
  linkedinUrl: null,
};

const EVENTS_HEADER = 'id,title,date,time,location,description';

/** Chooses a CSV file with these lines through the page's file button. */
async function chooseFile(label: string, lines: readonly string[]) {
  const file = new File([lines.join('\r\n')], 'events.csv', { type: 'text/csv' });
  await userEvent.upload(await screen.findByLabelText(label), file);
}

beforeEach(() => {
  mockAccess(SAM_ADMIN);
  // Only the clock's date is faked, so "upcoming" is stable and user events still run in real time.
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-11-15T17:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('ImportEventsPage', () => {
  const FILE = [EVENTS_HEADER, `${HACK_NIGHT.id},Hack Night,2026-11-21,7:30PM,BA201,`, ',CP312 Review,2026-12-01,,N2085,'];

  it('is linked from the Events page', async () => {
    vi.mocked(listEvents).mockResolvedValue([HACK_NIGHT]);
    renderApp('/events');

    expect(await screen.findByRole('link', { name: 'Import CSV' })).toHaveAttribute('href', '/events/import');
  });

  it('shows new and changed events as tickets before saving, then imports them all at once', async () => {
    vi.mocked(listEvents).mockResolvedValue([HACK_NIGHT]);
    vi.mocked(importEvents).mockResolvedValue();
    renderApp('/events/import');

    await chooseFile('Choose a CSV file', FILE);

    const added = await screen.findByRole('region', { name: 'New events' });
    expect(within(added).getByRole('heading', { name: 'CP312 Review' })).toBeInTheDocument();
    const changed = screen.getByRole('region', { name: 'Changed events' });
    expect(within(changed).getByRole('heading', { name: 'Hack Night' })).toBeInTheDocument();
    expect(within(changed).getByText('date')).toBeInTheDocument();
    expect(within(changed).getByText('2026-11-20')).toBeInTheDocument();
    expect(within(changed).getByText('2026-11-21')).toBeInTheDocument();
    expect(importEvents).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: 'Import 2 events' }));

    expect(importEvents).toHaveBeenCalledWith({
      added: [{ title: 'CP312 Review', date: '2026-12-01', time: null, location: 'N2085', description: null }],
      changed: [{ id: HACK_NIGHT.id, fields: { title: 'Hack Night', date: '2026-11-21', time: '7:30PM', location: 'BA201', description: null } }],
    });
    const done = await screen.findByRole('status');
    expect(done).toHaveTextContent('Imported 1 new event and 1 changed event.');
    expect(within(done).getByRole('link', { name: 'Back to Events' })).toHaveAttribute('href', '/events');
  });

  it('lists every problem by row and offers no way to import', async () => {
    vi.mocked(listEvents).mockResolvedValue([HACK_NIGHT]);
    renderApp('/events/import');

    await chooseFile('Choose a CSV file', [EVENTS_HEADER, ',,2026-12-01,,,', '00000000-0000-0000-0000-000000000000,Gone,2026-12-01,,,']);

    const problems = await screen.findByRole('alert');
    expect(problems).toHaveTextContent("events.csv can't be imported yet.");
    expect(problems).toHaveTextContent('Row 2 Give the event a title.');
    expect(problems).toHaveTextContent('Row 3 Nothing saved has this id.');
    expect(screen.queryByRole('button', { name: /^Import/ })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Choose the file again')).toBeInTheDocument();
  });

  it('says so when the file matches what is saved', async () => {
    vi.mocked(listEvents).mockResolvedValue([HACK_NIGHT]);
    renderApp('/events/import');

    await chooseFile('Choose a CSV file', [EVENTS_HEADER, `${HACK_NIGHT.id},Hack Night,2026-11-20,7:30PM,BA201,`]);

    expect(await screen.findByText("Nothing to import. Every row in events.csv matches what's saved.")).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Import/ })).not.toBeInTheDocument();
  });

  it('keeps the preview and says nothing was changed when the import fails', async () => {
    vi.mocked(listEvents).mockResolvedValue([HACK_NIGHT]);
    vi.mocked(importEvents).mockRejectedValue(new UnavailableError("The import couldn't be saved, so nothing was changed."));
    renderApp('/events/import');
    await chooseFile('Choose a CSV file', FILE);

    await userEvent.click(await screen.findByRole('button', { name: 'Import 2 events' }));

    expect(await screen.findByRole('alert')).toHaveTextContent("The import couldn't be saved, so nothing was changed.");
    expect(screen.getByRole('button', { name: 'Import 2 events' })).toBeEnabled();
    expect(screen.getByRole('region', { name: 'New events' })).toBeInTheDocument();
  });

  it("can't check a file until the saved events have loaded", async () => {
    vi.mocked(listEvents).mockRejectedValue(new UnavailableError('Events could not be loaded.'));
    renderApp('/events/import');

    expect(await screen.findByRole('alert')).toHaveTextContent('Events could not be loaded.');
    expect(screen.queryByLabelText('Choose a CSV file')).not.toBeInTheDocument();
  });
});

describe('ImportTeamPage', () => {
  it('is linked from the Team page', async () => {
    vi.mocked(listTeam).mockResolvedValue([SAM]);
    renderApp('/team');

    expect(await screen.findByRole('link', { name: 'Import CSV' })).toHaveAttribute('href', '/team/import');
  });

  it('shows new and changed members as crew badges, then imports them', async () => {
    vi.mocked(listTeam).mockResolvedValue([SAM]);
    vi.mocked(importTeam).mockResolvedValue();
    renderApp('/team/import');

    await chooseFile('Choose a CSV file', [
      'id,name,role,department,is_public,github_url,linkedin_url',
      `${SAM.id},Sam Rivera,VP Engineering,Engineering,FALSE,,`,
      ',Alex Chen,,Academics,TRUE,,',
    ]);

    const added = await screen.findByRole('region', { name: 'New members' });
    expect(within(added).getByRole('heading', { name: 'Alex Chen' })).toBeInTheDocument();
    const changed = screen.getByRole('region', { name: 'Changed members' });
    expect(within(changed).getByRole('heading', { name: 'Sam Rivera' })).toBeInTheDocument();
    expect(within(changed).getByText('is_public')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Import 2 members' }));

    expect(importTeam).toHaveBeenCalledWith({
      added: [{ name: 'Alex Chen', role: null, department: 'Academics', githubUrl: null, linkedinUrl: null, isPublic: true }],
      changed: [
        { id: SAM.id, fields: { name: 'Sam Rivera', role: 'VP Engineering', department: 'Engineering', githubUrl: null, linkedinUrl: null, isPublic: false } },
      ],
    });
    expect(await screen.findByRole('status')).toHaveTextContent('Imported 1 new member and 1 changed member.');
  });

  it('refuses a department the team form refuses', async () => {
    vi.mocked(listTeam).mockResolvedValue([SAM]);
    renderApp('/team/import');

    await chooseFile('Choose a CSV file', ['id,name,role,department,is_public,github_url,linkedin_url', ',Alex Chen,,Science,true,,']);

    expect(await screen.findByRole('alert')).toHaveTextContent('Row 2 Use one of the departments:');
  });
});
