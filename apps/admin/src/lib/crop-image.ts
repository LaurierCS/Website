/**
 * Turning a chosen photo and the square an exec picked on it into the square photo that is uploaded. Team
 * photos show in a circle on the site, so every one is saved the same size and shape.
 */
import type { CheckedImage } from './images';

/** The part of the photo to keep, in the photo's own pixels, as the cropper reports it. */
export type CropArea = Readonly<{ x: number; y: number; width: number; height: number }>;

/** Width and height of a saved team photo: sharp in the site's circles without a heavy download. */
export const PHOTO_SIZE = 600;

/**
 * The cropped square as a 600×600 JPEG. JPEG because every browser can make one; some can't make WebP.
 * @throws Error when the browser can't read the photo or draw it.
 */
export async function cropToSquare(image: CheckedImage, area: CropArea): Promise<CheckedImage> {
  const photo = await createImageBitmap(image.file);
  const canvas = document.createElement('canvas');
  canvas.width = PHOTO_SIZE;
  canvas.height = PHOTO_SIZE;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser cannot draw the photo.');

  // JPEG has no transparency, so a see-through PNG gets a white background instead of a black one.
  context.fillStyle = 'white';
  context.fillRect(0, 0, PHOTO_SIZE, PHOTO_SIZE);
  context.drawImage(photo, area.x, area.y, area.width, area.height, 0, 0, PHOTO_SIZE, PHOTO_SIZE);
  photo.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
  if (!blob) throw new Error('The cropped photo could not be made.');
  // Keep the chosen file's name, so the form can say which photo it is. It is our own 600×600 JPEG, so it
  // always passes `checkImage`'s type and size rules.
  const name = `${image.file.name.replace(/\.[^.]+$/, '')}.jpg`;
  return { file: new File([blob], name, { type: 'image/jpeg' }), extension: 'jpg' };
}
