/**
 * The links between the admin's sections, drawn as scrapbook divider tabs. The open section's tab is filled with
 * its own accent and sits raised on its shadow, like a tab pulled up to open the binder there. A new section is
 * one entry in `SECTIONS`.
 */
import { NavLink } from 'react-router';
import { PATHS } from '../../paths';

const TAB_ACCENTS = {
  pink: 'bg-pink',
  sky: 'bg-sky',
  yellow: 'bg-yellow',
  orange: 'bg-orange',
} as const;

const SECTIONS: ReadonlyArray<{ label: string; to: string; accent: keyof typeof TAB_ACCENTS }> = [
  { label: 'Events', to: PATHS.events, accent: 'pink' },
  { label: 'Team', to: PATHS.team, accent: 'sky' },
];

const TAB =
  'flex min-h-11 items-center justify-center rounded-t-xl rounded-b-md px-5 font-display text-lg font-bold ' +
  'transition-[translate,scale,background-color,color] duration-(--dur-fast) ease-(--ease-spring) ' +
  'active:scale-97 motion-reduce:transition-none';

export function SectionNav() {
  return (
    <nav aria-label="Sections">
      <ul className="grid grid-cols-2 gap-2 header:flex">
        {SECTIONS.map((section) => (
          <li key={section.to}>
            <NavLink
              to={section.to}
              className={({ isActive }) =>
                isActive
                  ? `${TAB} ${TAB_ACCENTS[section.accent]} -translate-y-1 text-ink shadow-(--shadow-cutout)`
                  : `${TAB} bg-card text-text-2 hover:-translate-y-0.5 hover:text-white`
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
