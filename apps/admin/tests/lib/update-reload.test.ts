import { reloadForUpdate, shouldReloadForUpdate } from '../../src/lib/update-reload';

const NOW = Date.parse('2026-11-22T12:00:00Z');

describe('reloading for a new version', () => {
  beforeEach(() => sessionStorage.clear());

  it('reloads when this tab has never reloaded for an update', () => {
    expect(shouldReloadForUpdate(null, NOW)).toBe(true);
  });

  it('waits 10 seconds after a reload before reloading again', () => {
    expect(shouldReloadForUpdate(NOW - 9_999, NOW)).toBe(false);
    expect(shouldReloadForUpdate(NOW - 10_000, NOW)).toBe(true);
  });

  it("reloads once, then not again straight away, so a missing file can't loop", () => {
    const reload = vi.fn();

    expect(reloadForUpdate(reload, NOW)).toBe(true);
    expect(reloadForUpdate(reload, NOW + 2_000)).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);

    expect(reloadForUpdate(reload, NOW + 10_000)).toBe(true);
    expect(reload).toHaveBeenCalledTimes(2);
  });
});
