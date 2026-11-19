/** The links between the admin's sections, with the current one marked. A new section is one entry in `SECTIONS`. */
import { NavLink } from 'react-router';
import { PATHS } from '../../paths';

const SECTIONS = [
  { label: 'Events', to: PATHS.events },
  { label: 'Team', to: PATHS.team },
] as const;

export function SectionNav() {
  return (
    <nav aria-label="Sections">
      <ul className="grid grid-cols-2 gap-2 header:flex">
        {SECTIONS.map((section) => (
          <li key={section.to}>
            <NavLink
              to={section.to}
              className={({ isActive }) =>
                `flex min-h-11 items-center justify-center rounded-full px-5 font-display text-lg font-bold ${
                  isActive ? 'bg-yellow text-ink' : 'text-text-2 hover:text-sky'
                }`
              }
            >
              {section.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
