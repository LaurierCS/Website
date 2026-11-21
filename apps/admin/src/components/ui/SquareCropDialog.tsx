/**
 * Cropping a chosen photo to a square before it is kept, for photos the site shows in a circle. The photo sits
 * under a round window: drag it to move, use the slider (or the arrow keys on the photo) to zoom. It is the
 * browser's own modal dialog, so focus stays inside and Escape cancels; on phones it sits at the bottom of the
 * screen. Render it only while cropping.
 */
import { useEffect, useId, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { type CropArea, cropToSquare } from '../../lib/crop-image';
import type { CheckedImage } from '../../lib/images';
import { usePreviewUrl } from '../../hooks/usePreviewUrl';
import { Button } from './Button';

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

type SquareCropDialogProps = {
  image: CheckedImage;
  onCropped: (image: CheckedImage) => void;
  /** Called with why it failed, in words for the person, when the photo can't be cropped. */
  onFailed: (reason: string) => void;
  onCancel: () => void;
};

export function SquareCropDialog({ image, onCropped, onFailed, onCancel }: SquareCropDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const zoomId = useId();
  const photoUrl = usePreviewUrl(image.file);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [area, setArea] = useState<CropArea | null>(null);
  const [cropping, setCropping] = useState(false);

  // A modal <dialog> can only be opened from code. Closing it on cleanup lets React's dev double-mount reopen it.
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  async function keepCrop(chosen: CropArea) {
    setCropping(true);
    try {
      onCropped(await cropToSquare(image, chosen));
    } catch {
      onFailed("That photo couldn't be cropped. Try saving it as a JPG or PNG first, then choose it again.");
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      onCancel={(event) => {
        // Escape asks to cancel; the parent decides, so the dialog never closes on its own mid-crop.
        event.preventDefault();
        if (!cropping) onCancel();
      }}
      className="mx-auto mt-auto mb-0 w-full max-w-none border-0 bg-transparent p-0 text-white backdrop:bg-deep/70 sm:mb-auto sm:max-w-lg"
    >
      <div className="grid gap-4 rounded-t-card border border-line bg-card px-5 pt-5 pb-7 shadow-(--shadow-float) sm:rounded-card sm:px-7 sm:py-6">
        <h2 id={titleId} className="text-2xl font-extrabold">
          Crop the photo
        </h2>
        <p className="text-sm text-text-2">It shows in a circle on the site. Drag to move it, and zoom to fit their face.</p>

        <div className="relative h-72 overflow-hidden rounded-field bg-deep sm:h-80">
          {photoUrl && (
            <Cropper
              image={photoUrl}
              crop={position}
              zoom={zoom}
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setPosition}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setArea(pixels)}
            />
          )}
        </div>

        <div className="grid gap-2">
          <label htmlFor={zoomId} className="font-display font-bold">
            Zoom
          </label>
          <input
            id={zoomId}
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="w-full accent-pink"
          />
        </div>

        <div className="mt-1 grid grid-cols-2 gap-3 sm:flex sm:justify-end">
          <Button variant="quiet" size="small" onClick={onCancel} disabled={cropping}>
            Cancel
          </Button>
          {/* Off until the cropper has measured the photo and reported the square to keep. */}
          <Button variant="primary" size="small" disabled={area === null || cropping} onClick={() => area && void keepCrop(area)}>
            {cropping ? 'Cropping…' : 'Use this photo'}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
