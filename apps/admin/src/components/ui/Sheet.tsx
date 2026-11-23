/**
 * A panel of details over the page: a sheet that rises from the bottom on a phone, a card in the middle on a
 * wider screen. It is the browser's own modal dialog, like `ConfirmDialog`, so focus stays inside, Escape closes
 * it and the page behind can't be clicked. Render it only while it is open.
 */
import { X } from 'lucide-react';
import { type ReactNode, useEffect, useId, useRef } from 'react';
import { Button } from './Button';

type SheetProps = {
  /** A small line above the title, like the row and whether it is new or updated. */
  kicker: ReactNode;
  title: string;
  children: ReactNode;
  /** The button at the bottom that closes it, e.g. "Back to the tickets". */
  closeLabel: string;
  onClose: () => void;
};

export function Sheet({ kicker, title, children, closeLabel, onClose }: SheetProps) {
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
        // Escape asks to close; the parent unmounts it, so it never closes behind React's back.
        event.preventDefault();
        onClose();
      }}
      className="mx-auto mt-auto mb-0 w-full max-w-none border-0 bg-transparent p-0 text-white backdrop:bg-deep/70 sm:mb-auto sm:max-w-xl"
    >
      <div className="grid max-h-[85dvh] gap-4 overflow-y-auto rounded-t-card border border-line bg-slate px-5 pt-3 pb-7 shadow-(--shadow-float) sm:rounded-card sm:px-8 sm:pt-7">
        {/* The grab handle tells phone users this is a sheet over the page. */}
        <span aria-hidden="true" className="mx-auto h-1 w-10 rounded-full bg-line sm:hidden" />
        <div className="flex items-start gap-3">
          <div className="grid flex-1 gap-1">
            <div className="flex items-center gap-2 font-display text-xs font-extrabold tracking-widest text-muted uppercase">
              {kicker}
            </div>
            <h2 id={titleId} className="text-2xl font-extrabold sm:text-3xl">
              {title}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-line transition-colors duration-150 hover:bg-card"
          >
            <X aria-hidden="true" className="size-4.5" />
          </button>
        </div>
        {children}
        <Button variant="quiet" size="small" onClick={onClose} className="mt-2 w-full sm:w-fit sm:justify-self-end">
          {closeLabel}
        </Button>
      </div>
    </dialog>
  );
}
