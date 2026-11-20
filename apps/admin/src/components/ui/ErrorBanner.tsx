/**
 * Why something failed, in a red banner at the top of a form, with what to do next. It takes focus when it
 * appears, so keyboard and screen reader users land on it instead of hunting for it.
 */
import { TriangleAlert } from 'lucide-react';

type ErrorBannerProps = {
  /** What happened, e.g. `"Hack Night" couldn't be saved.` */
  title: string;
  /** What to do next. */
  body: string;
};

// Defined once, outside render: a new ref callback each render would move focus back here while someone types.
function focusOnMount(element: HTMLElement | null) {
  element?.focus();
}

export function ErrorBanner({ title, body }: ErrorBannerProps) {
  return (
    <div
      ref={focusOnMount}
      role="alert"
      tabIndex={-1}
      className="flex items-start gap-3 rounded-field bg-danger px-4 py-3.5 text-danger-ink"
    >
      <span aria-hidden="true" className="grid size-7.5 shrink-0 place-items-center rounded-full bg-danger-ink text-danger">
        <TriangleAlert className="size-4" strokeWidth={2.5} />
      </span>
      <div>
        <p className="font-display text-lg leading-tight font-extrabold">{title}</p>
        <p className="mt-0.5 text-sm font-medium">{body}</p>
      </div>
    </div>
  );
}
