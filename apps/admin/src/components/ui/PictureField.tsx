/**
 * Choosing a picture: pick a file (or drag one in on a computer), see it before saving, or remove the current
 * one. Only files `checkImage` accepts get through; anything else shows why under the field. Nothing is
 * uploaded here: the field reports a `PictureChange` and saving applies it.
 */
import { useState } from 'react';
import { usePreviewUrl } from '../../hooks/usePreviewUrl';
import { ACCEPTED_IMAGE_TYPES, checkImage, IMAGE_RULES, type PictureChange } from '../../lib/images';
import { Button } from './Button';

type PictureFieldProps = {
  id: string;
  label: string;
  /** The picture saved now, if any. */
  currentUrl: string | null;
  value: PictureChange;
  onChange: (change: PictureChange) => void;
};

export function PictureField({ id, label, currentUrl, value, onChange }: PictureFieldProps) {
  const [problem, setProblem] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const previewUrl = usePreviewUrl(value.kind === 'replace' ? value.image.file : null);
  const shownUrl = value.kind === 'replace' ? previewUrl : value.kind === 'keep' ? currentUrl : null;

  function choose(file: File | undefined) {
    if (!file) return;
    const check = checkImage(file);
    if (check.kind === 'rejected') {
      setProblem(check.reason);
      return;
    }
    setProblem(null);
    onChange({ kind: 'replace', image: check.image });
  }

  return (
    <fieldset>
      <legend className="font-display text-lg font-bold">{label}</legend>
      <div className="mt-2 flex flex-wrap items-start gap-4">
        {shownUrl ? (
          <img
            src={shownUrl}
            alt={value.kind === 'replace' ? 'The new picture' : 'The current picture'}
            className="h-32 w-auto max-w-full rounded-xl object-cover"
          />
        ) : (
          <div className="grid h-32 w-48 place-items-center rounded-xl border-2 border-dashed border-line p-3 text-center text-sm text-muted">
            {value.kind === 'remove' ? 'The picture will be removed when you save.' : 'No picture'}
          </div>
        )}

        <div className="grid gap-2">
          <label
            htmlFor={id}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              choose(event.dataTransfer.files[0]);
            }}
            className={`inline-flex min-h-11 cursor-pointer items-center rounded-xl border-2 border-dashed px-5 py-3 font-display font-bold focus-within:shadow-(--focus-ring) ${
              dragging ? 'border-sky text-sky' : 'border-line text-text-2 hover:border-sky hover:text-sky'
            }`}
          >
            {shownUrl ? 'Choose a different picture' : 'Choose a picture'}
            <span className="hidden sm:inline">&nbsp;or drag one here</span>
            <input
              id={id}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES}
              aria-describedby={problem ? `${id}-rules ${id}-problem` : `${id}-rules`}
              className="sr-only"
              onChange={(event) => {
                choose(event.target.files?.[0]);
                // Clear it so choosing the same file again still counts as a change.
                event.target.value = '';
              }}
            />
          </label>
          {shownUrl && (
            <Button
              variant="quiet"
              className="px-5 py-2 text-base"
              onClick={() => onChange(currentUrl ? { kind: 'remove' } : { kind: 'keep' })}
            >
              Remove picture
            </Button>
          )}
          {value.kind === 'remove' && (
            <Button variant="quiet" className="px-5 py-2 text-base" onClick={() => onChange({ kind: 'keep' })}>
              Keep the current picture
            </Button>
          )}
        </div>
      </div>
      <p id={`${id}-rules`} className="mt-2 text-sm text-text-2">
        {IMAGE_RULES}
      </p>
      {problem && (
        <p id={`${id}-problem`} className="mt-1 text-sm font-medium text-orange">
          {problem}
        </p>
      )}
    </fieldset>
  );
}
