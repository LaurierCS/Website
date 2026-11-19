/** Renders the real admin routes at a URL, the way page tests start the app. */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AppRoutes } from '../src/App';

export function renderApp(at: string) {
  // No retries, so a failure shows its error straight away.
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[at]}>
        <AppRoutes />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
