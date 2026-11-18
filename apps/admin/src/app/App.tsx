/**
 * The admin's providers: services, server state, motion preferences and the router.
 */
import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'motion/react';
import { BrowserRouter } from 'react-router';
import { AppRoutes } from './routes';
import type { Services } from './services';
import { ServicesProvider } from './ServicesProvider';

export function App({ services, queryClient }: { services: Services; queryClient: QueryClient }) {
  return (
    <ServicesProvider services={services}>
      <QueryClientProvider client={queryClient}>
        {/* "user" turns movement off for visitors who ask their system for reduced motion. */}
        <MotionConfig reducedMotion="user">
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </MotionConfig>
      </QueryClientProvider>
    </ServicesProvider>
  );
}
