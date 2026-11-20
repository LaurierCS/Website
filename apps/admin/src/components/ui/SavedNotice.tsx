/**
 * The yellow strip that says what was just saved, like `Saved "Hack Night".`, with a button to put it away.
 * Screen readers announce it when it appears.
 */
import { Check, X } from 'lucide-react';

type SavedNoticeProps = {
  message: string;
  onDismiss: () => void;
};

export function SavedNotice({ message, onDismiss }: SavedNoticeProps) {
  return (
    <div className="flex w-fit max-w-full items-center gap-3 rounded-field bg-yellow py-2.5 pr-2.5 pl-4 text-ink shadow-(--shadow-cutout)">
      <span aria-hidden="true" className="grid size-7.5 shrink-0 place-items-center rounded-full bg-ink text-yellow">
        <Check className="size-4" strokeWidth={3} />
      </span>
      <p role="status" className="min-w-0 font-display text-lg font-extrabold">
        {message}
      </p>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onDismiss}
        className="grid size-11 shrink-0 place-items-center rounded-xl transition-colors duration-150 hover:bg-ink/10"
      >
        <X aria-hidden="true" className="size-5" />
      </button>
    </div>
  );
}
