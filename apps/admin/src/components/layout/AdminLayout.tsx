/**
 * The frame around every admin page: the logo, the "admin" sticker, the section links and the account menu.
 * Below the `header` breakpoint the logo shrinks to the LCS icon and the section links drop to their own row, so
 * nothing overlaps on a phone or tablet.
 */
import { Link, Outlet } from 'react-router';
import { ICON_WHITE, LOGO_LONG_WHITE } from '../../assets/brand';
import { PATHS } from '../../paths';
import { AccountMenu } from './AccountMenu';
import { SectionNav } from './SectionNav';

export function AdminLayout() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-line/60 bg-deep/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-8 header:flex-nowrap">
          <Link to={PATHS.events} className="flex items-center gap-3 rounded-lg" aria-label="LCS Admin, events">
            <img src={ICON_WHITE} alt="" className="h-8 w-auto header:hidden" />
            <img src={LOGO_LONG_WHITE} alt="" className="hidden h-8 w-auto header:block" />
            <span className="-rotate-6 rounded-md bg-yellow px-2 py-0.5 font-display text-sm font-extrabold uppercase tracking-widest text-ink shadow-(--shadow-sticker)">
              Admin
            </span>
          </Link>
          <div className="order-last w-full header:order-none header:mr-auto header:w-auto">
            <SectionNav />
          </div>
          <AccountMenu />
        </div>
      </header>
      <Outlet />
    </div>
  );
}
