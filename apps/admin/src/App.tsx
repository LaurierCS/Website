/**
 * The admin's pages and which URL shows each. Every page except the login sits behind `RequireAdmin`, so a
 * signed-out visitor is sent to the login even from an unknown URL. A new section is one `<Route>` inside the
 * admin layout plus one entry in its nav.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { AdminLayout } from './components/layout/AdminLayout';
import { RequireAdmin } from './components/layout/RequireAdmin';
import { EventsPage } from './pages/EventsPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { TeamPage } from './pages/TeamPage';
import { PATHS } from './paths';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path={PATHS.login} element={<LoginPage />} />
      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to={PATHS.events} replace />} />
          <Route path={PATHS.events} element={<EventsPage />} />
          <Route path={PATHS.team} element={<TeamPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
