/** The frame around every admin page: the logo, the "admin" sticker and the account menu. */
import { Link, Outlet } from 'react-router';
import { LOGO_LONG_WHITE } from '../../assets/brand';
import { PATHS } from '../../paths';
import { AccountMenu } from './AccountMenu';

export function AdminLayout() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-line/60 bg-deep/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <Link to={PATHS.home} className="flex items-center gap-3 rounded-lg" aria-label="LCS Admin, home">
            <img src={LOGO_LONG_WHITE} alt="" className="h-8 w-auto" />
            <span className="-rotate-6 rounded-md bg-yellow px-2 py-0.5 font-display text-sm font-extrabold uppercase tracking-widest text-ink shadow-[2px_3px_0_var(--yellow-ink)]">
              Admin
            </span>
          </Link>
          <AccountMenu />
        </div>
      </header>
      <Outlet />
    </div>
  );
}
