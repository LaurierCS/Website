/**
 * Renders the real admin routes at a URL, with typed fakes for every service. The one way UI tests start the app.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AppRoutes } from '../app/routes';
import { ServicesProvider } from '../app/ServicesProvider';
import { FakeAuthGateway } from './fake-auth-gateway';
import { FakeEventReader } from './fake-event-reader';

type RenderAppOptions = { at: string; auth?: FakeAuthGateway; events?: FakeEventReader };

export function renderApp({ at, auth = new FakeAuthGateway(), events = new FakeEventReader() }: RenderAppOptions) {
  // No retries, so a failure shows its error state straight away.
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  render(
    <ServicesProvider services={{ auth, events }}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[at]}>
          <AppRoutes />
        </MemoryRouter>
      </QueryClientProvider>
    </ServicesProvider>,
  );

  return { auth, events };
}
