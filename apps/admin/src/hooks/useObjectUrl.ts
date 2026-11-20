/** A temporary `blob:` URL for showing a chosen file before it is uploaded, released when no longer needed. */
import { useEffect, useState } from 'react';

export function useObjectUrl(file: File | null): string | null {
  const [url, setUrl] = useState<string | null>(null);

  // Made in an effect, not during render, so every URL created is also revoked (React may render twice).
  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
}
