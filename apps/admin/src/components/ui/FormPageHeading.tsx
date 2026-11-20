/**
 * The top of a page that holds a form: a link back to the section, then the page's title with the bracket
 * doodle beside it.
 */
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { DOODLES } from '../../assets/brand';

type FormPageHeadingProps = {
  title: string;
  /** Where the back link goes, and the section's name shown on it, e.g. "Events". */
  back: { to: string; section: string };
};

export function FormPageHeading({ title, back }: FormPageHeadingProps) {
  return (
    <>
      <Link
        to={back.to}
        // "Back to" is spoken, not shown, so it isn't confused with the section's own tab in the header.
        aria-label={`Back to ${back.section}`}
        className="-ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-xl px-2 font-display font-bold text-text-2 transition-[color,translate] duration-150 hover:-translate-x-0.5 hover:text-white"
      >
        <ArrowLeft aria-hidden="true" className="size-4.5" />
        {back.section}
      </Link>
      <div className="mt-4 flex items-center gap-3.5">
        <h1 className="text-5xl font-extrabold sm:text-6xl">{title}</h1>
        <img src={DOODLES.brackets} alt="" className="h-9 w-auto sm:h-11" />
      </div>
    </>
  );
}
