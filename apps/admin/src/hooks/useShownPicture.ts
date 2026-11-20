/**
 * The picture to show for a picture field: the newly chosen file (read for a preview), the saved one, or none
 * when it is being removed. One answer, so the field and anything previewing the result always agree.
 */
import type { PictureChange } from '../lib/images';
import { usePreviewUrl } from './usePreviewUrl';

export function useShownPicture(currentUrl: string | null, change: PictureChange): string | null {
  const previewUrl = usePreviewUrl(change.kind === 'replace' ? change.image.file : null);
  switch (change.kind) {
    case 'replace':
      return previewUrl;
    case 'keep':
      return currentUrl;
    case 'remove':
      return null;
  }
}
