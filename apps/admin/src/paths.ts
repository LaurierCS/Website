/** Every route path in the admin, in one place so links and redirects can't drift apart. */
export const PATHS = {
  login: '/login',
  events: '/events',
  newEvent: '/events/new',
  /** Fill in with React Router's `generatePath(PATHS.editEvent, { id })`. */
  editEvent: '/events/:id',
  team: '/team',
  newMember: '/team/new',
  /** Fill in with React Router's `generatePath(PATHS.editMember, { id })`. */
  editMember: '/team/:id',
} as const;
