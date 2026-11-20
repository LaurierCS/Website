/**
 * Asks "are you sure?" before something that can't be taken back: deleting, or leaving with unsaved changes. It
 * is the browser's own modal dialog, so focus stays inside it, starts on Cancel, Escape cancels and the page
 * behind can't be clicked. A mascot peeks over the top. On phones it sits at the bottom of the screen, near the
 * thumb. Render it only while asking.
 */
import { type LucideIcon, Trash, TriangleAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useId, useRef } from 'react';
import { MASCOTS, type MascotName } from '../../assets/brand';
import { Button } from './Button';

type DialogKind = {
  /** The warning on the chip above the question. */
  chip: string;
  chipIcon: LucideIcon;
  /** The line under the question. */
  body: string;
  /** Drawn on the confirm button, when the action has an icon of its own. */
  confirmIcon: LucideIcon | null;
  mascot: MascotName;
};

const KINDS = {
  delete: { chip: 'Gone for good', chipIcon: Trash, body: "This can't be undone.", confirmIcon: Trash, mascot: 'doug' },
  leave: {
    chip: 'Unsaved changes',
    chipIcon: TriangleAlert,
    body: "Your changes haven't been saved.",
    confirmIcon: null,
    mascot: 'krill',
  },
} as const satisfies Record<string, DialogKind>;

export type ConfirmKind = keyof typeof KINDS;

type ConfirmDialogProps = {
  kind: ConfirmKind;
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

export function ConfirmDialog({ kind, question, confirmLabel, pendingLabel, pending, error, onConfirm, onCancel }: ConfirmDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const bodyId = useId();
  const { chip, chipIcon: ChipIcon, body, confirmIcon: ConfirmIcon, mascot } = KINDS[kind];

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
      aria-describedby={bodyId}
      onCancel={(event) => {
        // Escape asks to cancel; the parent decides, so the dialog never closes on its own mid-action.
        event.preventDefault();
        if (!pending) onCancel();
      }}
      // The dialog itself is only the frame: transparent and unclipped, so the mascot can peek over the panel.
      className="mx-auto mt-auto mb-0 w-full max-w-none overflow-visible border-0 bg-transparent px-0 pt-20 pb-0 text-white backdrop:bg-deep/70 sm:mb-auto sm:max-w-lg"
    >
      <motion.img
        src={MASCOTS[mascot]}
        alt=""
        className="absolute top-0 left-8 h-24 w-auto"
        initial={{ y: 32 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 18, delay: 0.1 }}
      />
      <div className="relative grid gap-3.5 rounded-t-card border border-line bg-card px-5 pt-5 pb-7 shadow-(--shadow-float) sm:rounded-card sm:px-8 sm:py-7">
        {/* The grab handle tells phone users this is a sheet over the page. */}
        <span aria-hidden="true" className="mx-auto h-1 w-10 rounded-full bg-line sm:hidden" />
        <p className="inline-flex w-fit items-center gap-1.5 rounded-tag bg-danger px-2.5 py-1 font-display text-xs font-bold tracking-wide text-danger-ink uppercase">
          <ChipIcon aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
          {chip}
        </p>
        <h2 id={titleId} className="text-2xl font-extrabold sm:text-3xl">
          {question}
        </h2>
        <p id={bodyId} className="text-text-2">
          {body}
        </p>
        {error && (
          <p role="alert" className="font-medium text-danger-soft">
            {error} Try again, or cancel.
          </p>
        )}
        <div className="mt-2.5 grid grid-cols-2 gap-3 sm:flex sm:justify-end">
          <Button variant="quiet" size="small" onClick={onCancel} disabled={pending}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="small"
            icon={ConfirmIcon && <ConfirmIcon aria-hidden="true" className="size-4" strokeWidth={2.5} />}
            onClick={onConfirm}
            disabled={pending}
          >
            {pending ? pendingLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
