/**
 * The empty picture slot: a dashed zone to click or drop a file onto. While a file is dragged over it, it turns
 * blue and Coco peeks in. The whole zone opens the file picker, through its label.
 */
import { ImageIcon, Upload } from 'lucide-react';
import type { DragEventHandler, ReactNode } from 'react';
import { MASCOTS } from '../../assets/brand';
import { IMAGE_RULES } from '../../lib/ui/images';

/** The drag handlers that make an element accept a dropped file. */
export type DropTargetProps = {
  onDragOver: DragEventHandler;
  onDragLeave: DragEventHandler;
  onDrop: DragEventHandler;
};

type PictureDropZoneProps = {
  inputId: string;
  rulesId: string;
  dragging: boolean;
  invalid: boolean;
  dropTarget: DropTargetProps;
  /** The hidden file input, placed inside the label so the label names it. */
  fileInput: ReactNode;
};

export function PictureDropZone({ inputId, rulesId, dragging, invalid, dropTarget, fileInput }: PictureDropZoneProps) {
  const look = dragging
    ? 'border-blue bg-sky text-ink'
    : `border-dashed text-white hover:bg-deep/40 ${invalid ? 'border-danger' : 'border-line'}`;

  return (
    <div
      {...dropTarget}
      className={`relative grid justify-items-center gap-2.5 rounded-card border-2 px-6 py-7 text-center transition-colors duration-150 focus-within:shadow-(--focus-ring) ${look}`}
    >
      <span
        aria-hidden="true"
        className={`grid size-13 place-items-center rounded-full ${dragging ? 'bg-blue text-white' : 'bg-yellow text-ink'}`}
      >
        {dragging ? <ImageIcon className="size-6" /> : <Upload className="size-6" />}
      </span>
      {/* The label covers the whole zone (its ::after), so a click anywhere opens the file picker. */}
      <label htmlFor={inputId} className="cursor-pointer font-display text-lg font-extrabold after:absolute after:inset-0">
        {dragging ? (
          'Drop it here'
        ) : (
          <>
            <span className="text-sky underline underline-offset-4">Choose a picture</span>
            {/* Phones can't drag files, so they only see "Choose a picture". */}
            <span className="hidden sm:inline"> or drag one here</span>
          </>
        )}
        {fileInput}
      </label>
      <p id={rulesId} className={`text-sm font-medium ${dragging ? 'text-ink-2' : 'text-text-2'}`}>
        {IMAGE_RULES}
      </p>
      {dragging && <img src={MASCOTS.coco} alt="" className="absolute right-4 -bottom-3 h-20 w-auto" />}
    </div>
  );
}
