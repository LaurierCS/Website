/**
 * Which screen renders at which URL. A new admin section is one `<Route>` line inside the admin layout.
 */
import { Navigate, Route, Routes } from 'react-router';
import { LoginScreen } from '../features/auth/LoginScreen';
import { HomeScreen } from '../features/home/HomeScreen';
import { AdminLayout } from './AdminLayout';
import { PATHS } from './paths';
import { RequireAdmin } from './RequireAdmin';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={PATHS.login} element={<LoginScreen />} />
      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path={PATHS.home} element={<HomeScreen />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={PATHS.home} replace />} />
    </Routes>
  );
}
