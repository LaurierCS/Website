import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnavailableError } from '../../src/lib/errors';
import { importEvents, listEvents } from '../../src/lib/events';
import { importTeam, listTeam } from '../../src/lib/team';
import type { TeamMember } from '../../src/types/team';
import { mockAccess, SAM_ADMIN } from '../mocks/auth';
import { renderApp } from '../renderApp';

vi.mock('../../src/lib/auth');
vi.mock('../../src/lib/events');
vi.mock('../../src/lib/team');

import { sampleEvent } from '../fixtures/events';

const HACK_NIGHT = sampleEvent({
  id: '1c7a0d3f-8b52-4e6c-9f4d-3a2b1c0d9e8f',
  title: 'Hack Night',
  date: '2026-11-20',
  startTime: '19:30:00',
  location: 'BA201',
});

const SAM: TeamMember = {
  id: '6f1c2b8e-2d1a-4c5e-9b7f-0a1b2c3d4e5f',
  name: 'Sam Rivera',
  role: 'VP Engineering',
  department: 'Engineering',
  isPublic: true,
  photoPath: null,
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

  it('lists every new and updated event on the print order, with what changes, before saving', async () => {
    vi.mocked(listEvents).mockResolvedValue([HACK_NIGHT]);
    renderApp('/events/import');

    await chooseFile('Choose a CSV file', FILE);

    const order = await screen.findByRole('region', { name: 'Print order' });
    expect(order).toHaveTextContent('events.csv');
    expect(within(order).getByRole('link', { name: 'Row 2 Hack Night Updated' })).toHaveAttribute('href', '#import-row-2');
    expect(order).toHaveTextContent('date → Sat, Nov 21');
    expect(within(order).getByRole('link', { name: 'Row 3 CP312 Review New' })).toBeInTheDocument();
    expect(order).toHaveTextContent('Tue, Dec 1 · N2085');
    expect(order).toHaveTextContent('To print1 new event and 1 updated event');
    const press = screen.getByRole('region', { name: 'What the import will print' });
    expect(within(press).getByRole('heading', { name: 'Hack Night' })).toBeInTheDocument();
    expect(within(press).getByRole('heading', { name: 'CP312 Review' })).toBeInTheDocument();
    expect(importEvents).not.toHaveBeenCalled();
  });

  it('opens an event to show every field, the old value struck out next to the new', async () => {
    vi.mocked(listEvents).mockResolvedValue([HACK_NIGHT]);
    renderApp('/events/import');
    await chooseFile('Choose a CSV file', FILE);

    await userEvent.click(await screen.findByRole('button', { name: 'Hack Night: show the details' }));

    const details = screen.getByRole('dialog', { name: 'Hack Night' });
    expect(details).toHaveTextContent('Updated Row 2');
    expect(within(details).getByRole('deletion')).toHaveTextContent('Fri, Nov 20');
    expect(within(details).getByRole('insertion')).toHaveTextContent('Sat, Nov 21');
    expect(details).toHaveTextContent('Room' + 'BA201');

    await userEvent.click(within(details).getByRole('button', { name: 'Back to the events' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows a new event in full, its whole description included', async () => {
    vi.mocked(listEvents).mockResolvedValue([HACK_NIGHT]);
    renderApp('/events/import');
    await chooseFile('Choose a CSV file', [EVENTS_HEADER, ',CP312 Review,2026-12-01,,N2085,Bring your notes and every question you have.']);

    await userEvent.click(await screen.findByRole('button', { name: 'CP312 Review: show the details' }));

    const details = screen.getByRole('dialog', { name: 'CP312 Review' });
    expect(details).toHaveTextContent('New Row 2');
    expect(details).toHaveTextContent('Bring your notes and every question you have.');
    expect(within(details).queryByRole('deletion')).not.toBeInTheDocument();
  });

  it('imports them all at once, then stamps them issued', async () => {
    vi.mocked(listEvents).mockResolvedValue([HACK_NIGHT]);
    vi.mocked(importEvents).mockResolvedValue();
    renderApp('/events/import');
    await chooseFile('Choose a CSV file', FILE);

    await userEvent.click(await screen.findByRole('button', { name: 'Import 2 events' }));

    expect(importEvents).toHaveBeenCalledWith({
      added: [expect.objectContaining({ title: 'CP312 Review', date: '2026-12-01', location: 'N2085' })],
      changed: [{ id: HACK_NIGHT.id, fields: expect.objectContaining({ title: 'Hack Night', date: '2026-11-21', startTime: '19:30:00', location: 'BA201' }) }],
    });
    const done = await screen.findByRole('status');
    expect(done).toHaveTextContent('Imported 1 new event and 1 updated event.');
    expect(within(done).getByRole('link', { name: 'Back to Events' })).toHaveAttribute('href', '/events');
    expect(screen.queryByRole('button', { name: /show the details/ })).not.toBeInTheDocument();
  });

  it('sends the order back with every problem by row, and offers no way to import', async () => {
    vi.mocked(listEvents).mockResolvedValue([HACK_NIGHT]);
    renderApp('/events/import');

    await chooseFile('Choose a CSV file', [EVENTS_HEADER, ',,2026-12-01,,,', '00000000-0000-0000-0000-000000000000,Gone,2026-12-01,,,']);

    expect(await screen.findByRole('alert')).toHaveTextContent("The press won't run this one.");
    const order = screen.getByRole('region', { name: 'Print order' });
    expect(order).toHaveTextContent('Row 2 Give the event a title.');
    expect(order).toHaveTextContent('Row 3 Nothing saved has this id.');
    expect(order).toHaveTextContent("Can't print yet2 problems");
    expect(screen.queryByRole('button', { name: /^Import/ })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Choose the file again')).toBeInTheDocument();
  });

  it('says so when the file matches what is saved', async () => {
    vi.mocked(listEvents).mockResolvedValue([HACK_NIGHT]);
    renderApp('/events/import');

    await chooseFile('Choose a CSV file', [EVENTS_HEADER, `${HACK_NIGHT.id},Hack Night,2026-11-20,7:30PM,BA201,`]);

    expect(await screen.findByText("Every row matches what's saved, so there is nothing to print.")).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Import/ })).not.toBeInTheDocument();
  });

  it('keeps the order and says nothing was changed when the import fails', async () => {
    vi.mocked(listEvents).mockResolvedValue([HACK_NIGHT]);
    vi.mocked(importEvents).mockRejectedValue(new UnavailableError("The import couldn't be saved, so nothing was changed."));
    renderApp('/events/import');
    await chooseFile('Choose a CSV file', FILE);

    await userEvent.click(await screen.findByRole('button', { name: 'Import 2 events' }));

    expect(await screen.findByRole('alert')).toHaveTextContent("The import couldn't be saved, so nothing was changed.");
    expect(screen.getByRole('button', { name: 'Import 2 events' })).toBeEnabled();
    expect(screen.getByRole('region', { name: 'What the import will print' })).toBeInTheDocument();
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

  it('shows new and updated members as crew badges on the order, then imports them', async () => {
    vi.mocked(listTeam).mockResolvedValue([SAM]);
    vi.mocked(importTeam).mockResolvedValue();
    renderApp('/team/import');

    await chooseFile('Choose a CSV file', [
      'id,name,role,department,is_public,github_url,linkedin_url',
      `${SAM.id},Sam Rivera,VP Engineering,Engineering,FALSE,,`,
      ',Alex Chen,,Academics,TRUE,,',
    ]);

    const order = await screen.findByRole('region', { name: 'Print order' });
    expect(within(order).getByRole('link', { name: 'Row 2 Sam Rivera Updated' })).toBeInTheDocument();
    expect(order).toHaveTextContent('on the site → hidden');
    const press = screen.getByRole('region', { name: 'What the import will print' });
    expect(within(press).getByRole('heading', { name: 'Alex Chen' })).toBeInTheDocument();
    expect(within(press).getByRole('heading', { name: 'Sam Rivera' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Import 2 members' }));

    expect(importTeam).toHaveBeenCalledWith({
      added: [{ name: 'Alex Chen', role: null, department: 'Academics', githubUrl: null, linkedinUrl: null, isPublic: true }],
      changed: [
        { id: SAM.id, fields: { name: 'Sam Rivera', role: 'VP Engineering', department: 'Engineering', githubUrl: null, linkedinUrl: null, isPublic: false } },
      ],
    });
    expect(await screen.findByRole('status')).toHaveTextContent('Imported 1 new member and 1 updated member.');
  });

  it('refuses a department the team form refuses', async () => {
    vi.mocked(listTeam).mockResolvedValue([SAM]);
    renderApp('/team/import');

    await chooseFile('Choose a CSV file', ['id,name,role,department,is_public,github_url,linkedin_url', ',Alex Chen,,Science,true,,']);

    expect(await screen.findByRole('region', { name: 'Print order' })).toHaveTextContent('Row 2 Use one of the departments:');
  });
});
