/**
 * The admin's pages and which URL shows each. Every page except the login sits behind `RequireAdmin`, so a
 * signed-out visitor is sent to the login even from an unknown URL. A new section is one route inside the admin
 * layout plus one entry in its nav. The app and the tests both build their router from this list.
 *
 * Each page is its own download, fetched the first time its URL opens, so signing in doesn't load the event
 * form or the team page. The access check and the layout that every page needs load up front.
 */
import { Navigate, type RouteObject } from 'react-router';
import { AdminLayout } from './components/layout/AdminLayout';
import { RequireAdmin } from './components/layout/RequireAdmin';
import { Loader } from './components/ui/Loader';
import { PATHS } from './paths';

// Shown while the first page of a visit downloads.
const OPENING = <Loader label="Opening the admin…" />;

export const routes: RouteObject[] = [
  {
    path: PATHS.login,
    hydrateFallbackElement: OPENING,
    lazy: async () => ({ Component: (await import('./pages/LoginPage')).LoginPage }),
  },
  {
    element: <RequireAdmin />,
    hydrateFallbackElement: OPENING,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to={PATHS.events} replace /> },
          { path: PATHS.events, lazy: async () => ({ Component: (await import('./pages/EventsPage')).EventsPage }) },
          { path: PATHS.newEvent, lazy: async () => ({ Component: (await import('./pages/NewEventPage')).NewEventPage }) },
          { path: PATHS.editEvent, lazy: async () => ({ Component: (await import('./pages/EditEventPage')).EditEventPage }) },
          { path: PATHS.team, lazy: async () => ({ Component: (await import('./pages/TeamPage')).TeamPage }) },
          { path: '*', lazy: async () => ({ Component: (await import('./pages/NotFoundPage')).NotFoundPage }) },
        ],
      },
    ],
  },
];
