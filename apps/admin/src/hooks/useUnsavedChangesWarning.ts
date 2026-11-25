/**
 * Warns before someone leaves a form with unsaved changes: in the app through a blocker the page answers, and
 * when closing or reloading the tab through the browser's own "Leave site?" prompt.
 */
import { useEffect } from 'react';
import { type Blocker, useBlocker } from 'react-router';
import { savedNameFrom } from '../lib/ui/saved-notice';

export function useUnsavedChangesWarning(hasChanges: boolean): Blocker {
  // Leaving right after a save carries the "saved" notice; that exit is never blocked.
  const blocker = useBlocker(({ currentLocation, nextLocation }) =>
    hasChanges && currentLocation.pathname !== nextLocation.pathname && savedNameFrom(nextLocation.state) === null,
  );

  useEffect(() => {
    if (!hasChanges) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasChanges]);

  return blocker;
}
