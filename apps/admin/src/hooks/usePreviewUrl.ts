/**
 * A `data:` URL for showing a chosen picture before it is uploaded. The file is read with `FileReader`, so there
 * is no `blob:` URL to release afterwards.
 */
import { useEffect, useState } from 'react';

export function usePreviewUrl(file: File | null): string | null {
  const [preview, setPreview] = useState<{ file: File; url: string } | null>(null);

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setPreview({ file, url: reader.result });
    };
    reader.readAsDataURL(file);
    // A newer file (or leaving the page) cancels a read that hasn't finished.
    return () => reader.abort();
  }, [file]);

  // Only the current file's preview is shown, never one left over from a file chosen earlier.
  return preview?.file === file ? preview.url : null;
}
