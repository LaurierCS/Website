import { loadConfig } from '../../../src/lib/config/config';

const VALID = { DATABASE_URL: 'https://abc.supabase.co', DATABASE_KEY: 'anon-key' };

describe('loadConfig', () => {
  it('reads the Supabase URL and anon key', () => {
    expect(loadConfig(VALID)).toEqual({ supabaseUrl: 'https://abc.supabase.co', supabaseAnonKey: 'anon-key' });
  });

  it.each([
    ['DATABASE_KEY', { DATABASE_URL: VALID.DATABASE_URL }],
    ['DATABASE_URL', { ...VALID, DATABASE_URL: 'not a url' }],
  ])('names %s when it is missing or malformed', (name, env) => {
    expect(() => loadConfig(env)).toThrow(name);
  });
});
