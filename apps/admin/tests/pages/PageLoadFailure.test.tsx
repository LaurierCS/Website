import { screen, within } from '@testing-library/react';
import { mockAccess, SAM_ADMIN } from '../mocks/auth';
import { renderApp } from '../renderApp';

vi.mock('../../src/lib/auth');
// The Events page's file can't be loaded, as when a deploy has replaced it under an open tab.
vi.mock('../../src/pages/EventsPage', () => {
  throw new Error('Failed to fetch dynamically imported module');
});

describe('a page that cannot be loaded', () => {
  beforeEach(() => mockAccess(SAM_ADMIN));

  it('shows the error screen with a way to reload, and keeps the header', async () => {
    renderApp('/events');

    const problem = await screen.findByRole('alert');
    expect(problem).toHaveTextContent("This page didn't open.");
    expect(within(problem).getByRole('button', { name: 'Reload' })).toBeEnabled();
    expect(screen.getByRole('link', { name: 'Team' })).toBeInTheDocument();
  });
});
