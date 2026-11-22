/**
 * Reloading the admin when a new version has gone live under an open tab. Each deploy renames the page files, so
 * a tab opened before it asks for files that no longer exist the first time it opens another page. A reload
 * picks up the new version. It happens at most once every 10 seconds, so a file that is really missing can't
 * reload the page forever; the error screen shows instead.
 */

const LAST_RELOAD_KEY = 'admin.reloadedForUpdateAt';
const RELOAD_GAP_MS = 10_000;

/** Whether to reload now, given when this tab last reloaded for an update (null if it never has). */
export function shouldReloadForUpdate(lastReloadAt: number | null, now: number): boolean {
  return lastReloadAt === null || now - lastReloadAt >= RELOAD_GAP_MS;
}

/**
 * Reloads with `reload` unless this tab already did in the last 10 seconds. Returns whether it reloaded. When the
 * browser won't let the tab remember the time (storage blocked), it doesn't reload, so it can't loop.
 */
export function reloadForUpdate(reload: () => void, now = Date.now()): boolean {
  try {
    const saved = sessionStorage.getItem(LAST_RELOAD_KEY);
    if (!shouldReloadForUpdate(saved === null ? null : Number(saved), now)) return false;
    sessionStorage.setItem(LAST_RELOAD_KEY, String(now));
  } catch {
    return false;
  }
  reload();
  return true;
}
