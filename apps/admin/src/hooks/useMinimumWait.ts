/**
 * Whether `ms` milliseconds have passed since the component mounted. For moments that are fun to see but can
 * finish too fast to notice, like the login's "Checking your pass…".
 */
import { useEffect, useState } from 'react';

export function useMinimumWait(ms: number): boolean {
  const [waited, setWaited] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setWaited(true), ms);
    return () => clearTimeout(timer);
  }, [ms]);

  return waited;
}
