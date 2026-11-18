import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/events', label: 'Events' },
  { to: '/team', label: 'Team' },
]

export default function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <div className="header-top">
          <span className="logo">LCS</span>
          <div className="header-user">
            <span className="user-email">Signed in user</span>
            <button type="button" disabled title="Sign out is not wired up yet">
              Sign out
            </button>
          </div>
        </div>
        <nav className="nav" aria-label="Main">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
