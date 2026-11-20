/**
 * The admin app: server data through TanStack Query and pages from `routes.tsx`. It uses React Router's data
 * router (`createBrowserRouter`), which is what lets a form warn before you leave it with unsaved changes.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'motion/react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { routes } from './routes';

const queryClient = new QueryClient();
const router = createBrowserRouter(routes);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* With "reduce motion" turned on in the device settings, things appear in place instead of moving there. */}
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
      </MotionConfig>
    </QueryClientProvider>
  );
}
