/**
 * Asks "are you sure?" before something that can't be undone. It is the browser's own modal dialog, so focus
 * stays inside it, Escape cancels and the page behind can't be clicked. Render it only while asking.
 */
import { useEffect, useId, useRef } from 'react';
import { Button } from './Button';

type ConfirmDialogProps = {
  /** Names the thing, e.g. "Delete CP312 Midterm Review?". */
  question: string;
  confirmLabel: string;
  /** Shown on the confirm button while the action runs, e.g. "Deleting…". */
  pendingLabel: string;
  pending: boolean;
  /** Why the action failed, shown in the dialog so the person can try again or cancel. */
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ question, confirmLabel, pendingLabel, pending, error, onConfirm, onCancel }: ConfirmDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // A modal <dialog> can only be opened from code. Closing it on cleanup lets React's dev double-mount reopen it.
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      onCancel={(event) => {
        // Escape asks to cancel; the parent decides, so the dialog never closes on its own mid-action.
        event.preventDefault();
        if (!pending) onCancel();
      }}
      className="m-auto w-full max-w-md rounded-card border-2 border-line bg-card p-6 text-white backdrop:bg-deep/70"
    >
      <h2 id={titleId} className="text-2xl font-extrabold">
        {question}
      </h2>
      <p className="mt-2 text-text-2">This can't be undone.</p>
      {error && (
        <p role="alert" className="mt-4 font-medium text-orange">
          {error} Try again, or cancel.
        </p>
      )}
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="quiet" className="px-5 py-2.5 text-base" onClick={onCancel} disabled={pending}>
          Cancel
        </Button>
        <Button variant="primary" className="px-5 py-2.5 text-base" onClick={onConfirm} disabled={pending}>
          {pending ? pendingLabel : confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
