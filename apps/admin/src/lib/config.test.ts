import { loadConfig } from './config';

const VALID = { VITE_SUPABASE_URL: 'https://abc.supabase.co', VITE_SUPABASE_ANON_KEY: 'anon-key' };

describe('loadConfig', () => {
  it('reads the Supabase URL and anon key', () => {
    expect(loadConfig(VALID)).toEqual({ supabaseUrl: 'https://abc.supabase.co', supabaseAnonKey: 'anon-key' });
  });

  it.each([
    ['VITE_SUPABASE_ANON_KEY', { VITE_SUPABASE_URL: VALID.VITE_SUPABASE_URL }],
    ['VITE_SUPABASE_URL', { ...VALID, VITE_SUPABASE_URL: 'not a url' }],
  ])('names %s when it is missing or malformed', (name, env) => {
    expect(() => loadConfig(env)).toThrow(name);
  });
});
