import { vi } from 'vitest';
import { getSupabase } from '../../../src/lib/server/supabase';

const STORAGE_BASE = 'https://lcs.supabase.co/storage/v1/object/public';

/** Wires `getSupabase().schema('v2').from(...)` and storage URLs for lib tests. */
export function installV2Supabase(tables: Record<string, unknown>, extra?: Record<string, unknown>) {
  const from = vi.fn((table: string) => tables[table] ?? {});
  vi.mocked(getSupabase).mockReturnValue({
    schema: vi.fn(() => ({ from })),
    storage: {
      from: vi.fn((bucket: string) => ({
        getPublicUrl: vi.fn((path: string) => ({ data: { publicUrl: `${STORAGE_BASE}/${bucket}/${path}` } })),
      })),
    },
    ...extra,
  } as unknown as ReturnType<typeof getSupabase>);
  return from;
}

export { STORAGE_BASE };