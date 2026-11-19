/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Sign-in only returns to localhost:5173 (the redirect URL allowed in Supabase), so fail loudly instead of
  // quietly moving to another port when 5173 is busy.
  server: { port: 5173, strictPort: true },
  // Vite only exposes `VITE_*` variables to the browser by default. The admin's Supabase settings are named
  // DATABASE_URL and DATABASE_KEY, so allow exactly those two prefixes. Anything matching them ends up in the
  // public bundle, so they must only ever hold the project URL and the anon key.
  envPrefix: ['VITE_', 'DATABASE_URL', 'DATABASE_KEY'],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    // Tests check what people read and click, not styles, so CSS isn't processed.
    css: false,
    // Each test starts with empty call history, so "was called with" only sees that test's calls.
    clearMocks: true,
  },
});
