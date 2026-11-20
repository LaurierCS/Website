/**
 * The admin's pages and which URL shows each. Every page except the login sits behind `RequireAdmin`, so a
 * signed-out visitor is sent to the login even from an unknown URL. A new section is one route inside the admin
 * layout plus one entry in its nav. The app and the tests both build their router from this list.
 */
import { Navigate, type RouteObject } from 'react-router';
import { AdminLayout } from './components/layout/AdminLayout';
import { RequireAdmin } from './components/layout/RequireAdmin';
import { EditEventPage } from './pages/EditEventPage';
import { EventsPage } from './pages/EventsPage';
import { LoginPage } from './pages/LoginPage';
import { NewEventPage } from './pages/NewEventPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { TeamPage } from './pages/TeamPage';
import { PATHS } from './paths';

export const routes: RouteObject[] = [
  { path: PATHS.login, element: <LoginPage /> },
  {
    element: <RequireAdmin />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to={PATHS.events} replace /> },
          { path: PATHS.events, element: <EventsPage /> },
          { path: PATHS.newEvent, element: <NewEventPage /> },
          { path: PATHS.editEvent, element: <EditEventPage /> },
          { path: PATHS.team, element: <TeamPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
];
