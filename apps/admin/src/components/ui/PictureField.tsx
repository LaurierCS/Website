/**
 * Choosing a picture: pick a file (or drag one in on a computer), crop it to a square first when the field is
 * `shape="square"`, see it as a taped print before saving, or remove the current one. Only files `checkImage`
 * accepts get through; anything else shows why under the field. Nothing is uploaded here: the field reports a
 * `PictureChange` and saving applies it.
 */
import { RotateCw, Trash, Upload } from 'lucide-react';
import { useState } from 'react';
import { ACCEPTED_IMAGE_TYPES, type CheckedImage, checkImage, fileSize, IMAGE_RULES, type PictureChange } from '../../lib/images';
import { Button } from './Button';
import { buttonClasses } from './button-styles';
import { FieldError } from './FieldError';
import { type DropTargetProps, PictureDropZone } from './PictureDropZone';
import { PicturePrint } from './PicturePrint';
import { SquareCropDialog } from './SquareCropDialog';

type PictureFieldProps = {
  id: string;
  label: string;
  /** "square" crops a chosen picture to a square before keeping it, for photos the site shows in a circle. */
  shape?: 'free' | 'square';
  /** The picture saved now, if any. */
  currentUrl: string | null;
  /** The picture to show for `value`, from `useShownPicture`. */
  shownUrl: string | null;
  value: PictureChange;
  onChange: (change: PictureChange) => void;
};

export function PictureField({ id, label, shape = 'free', currentUrl, shownUrl, value, onChange }: PictureFieldProps) {
  const [problem, setProblem] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  // A square picture waiting to be cropped, before it becomes the field's value.
  const [toCrop, setToCrop] = useState<CheckedImage | null>(null);
  const newFile = value.kind === 'replace' ? value.image.file : null;
  const rulesId = `${id}-rules`;
  const problemId = `${id}-problem`;

  function choose(file: File | undefined) {
    if (!file) return;
    const check = checkImage(file);
    if (check.kind === 'rejected') {
      setProblem(check.reason);
      return;
    }
    setProblem(null);
    if (shape === 'square') setToCrop(check.image);
    else onChange({ kind: 'replace', image: check.image });
  }

  // Files can be dropped on the empty zone, or on "Choose a different picture" when a picture is shown.
  const dropTarget: DropTargetProps = {
    onDragOver: (event) => {
      event.preventDefault();
      setDragging(true);
    },
    onDragLeave: (event) => {
      // Moving onto the target's own icon or text fires a leave too; only leaving the target counts.
      if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
      setDragging(false);
    },
    onDrop: (event) => {
      event.preventDefault();
      setDragging(false);
      choose(event.dataTransfer.files[0]);
    },
  };

  const fileInput = (
    <input
      id={id}
      type="file"
      accept={ACCEPTED_IMAGE_TYPES}
      aria-describedby={problem ? `${rulesId} ${problemId}` : rulesId}
      className="sr-only"
      onChange={(event) => {
        choose(event.target.files?.[0]);
        // Clear it so choosing the same file again still counts as a change.
        event.target.value = '';
      }}
    />
  );

  return (
    <fieldset>
      <legend className="mb-2 font-display text-base font-bold text-white">{label}</legend>

      {shownUrl ? (
        <div className="flex flex-wrap items-start gap-5">
          <PicturePrint url={shownUrl} alt={newFile ? 'The new picture' : 'The current picture'} settle={Boolean(newFile)} />
          <div className="grid min-w-0 gap-2.5">
            <div>
              {newFile && <p className="truncate text-sm font-semibold text-white">{newFile.name}</p>}
              <p className="text-sm font-medium text-text-2">
                {newFile ? `${fileSize(newFile)} · not saved yet` : 'Current picture'}
              </p>
            </div>
            <label
              htmlFor={id}
              {...dropTarget}
              // While a file is dragged over it, a dashed outline marks it as somewhere to drop. An outline, so it
              // never fights the button's own border and colours.
              className={`${buttonClasses('quiet', 'small')} w-fit cursor-pointer focus-within:shadow-(--focus-ring) ${dragging ? 'outline-2 outline-offset-2 outline-sky outline-dashed' : ''}`}
            >
              <Upload aria-hidden="true" className="size-4" />
              Choose a different picture
              {fileInput}
            </label>
            <p id={rulesId} className="sr-only">
              {IMAGE_RULES}
            </p>
            {newFile && currentUrl ? (
              <KeepCurrentButton onClick={() => onChange({ kind: 'keep' })} />
            ) : (
              <Button
                variant="danger-quiet"
                size="small"
                className="w-fit"
                icon={<Trash aria-hidden="true" className="size-4" />}
                // A new picture with nothing saved before goes back to none; a saved picture is marked for removal.
                onClick={() => onChange(newFile ? { kind: 'keep' } : { kind: 'remove' })}
              >
                Remove picture
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <PictureDropZone
            inputId={id}
            rulesId={rulesId}
            dragging={dragging}
            invalid={Boolean(problem)}
            dropTarget={dropTarget}
            fileInput={fileInput}
          />
          {value.kind === 'remove' && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="text-sm font-medium text-text-2">The picture will be removed when you save.</p>
              <KeepCurrentButton onClick={() => onChange({ kind: 'keep' })} />
            </div>
          )}
        </>
      )}

      {problem && <FieldError id={problemId}>{problem}</FieldError>}

      {toCrop && (
        <SquareCropDialog
          image={toCrop}
          onCropped={(image) => {
            setToCrop(null);
            onChange({ kind: 'replace', image });
          }}
          onFailed={(reason) => {
            setToCrop(null);
            setProblem(reason);
          }}
          onCancel={() => setToCrop(null)}
        />
      )}
    </fieldset>
  );
}

function KeepCurrentButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="quiet" size="small" className="w-fit" icon={<RotateCw aria-hidden="true" className="size-4" />} onClick={onClick}>
      Keep the current picture
    </Button>
  );
}
