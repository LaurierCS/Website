/**
 * The admin's pages and which URL shows each. Every page except the login sits behind `RequireAdmin`; a new
 * section is one `<Route>` inside the admin layout.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { AdminLayout } from './components/layout/AdminLayout';
import { RequireAdmin } from './components/layout/RequireAdmin';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
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
          <Route path={PATHS.home} element={<HomePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={PATHS.home} replace />} />
    </Routes>
  );
}
