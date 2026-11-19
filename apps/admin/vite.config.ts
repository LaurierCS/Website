/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Sign-in only returns to localhost:5173 (the redirect URL allowed in Supabase), so fail loudly instead of
  // quietly moving to another port when 5173 is busy.
  server: { port: 5173, strictPort: true },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    // Each test starts with empty call history, so "was called with" only sees that test's calls.
    clearMocks: true,
  },
});
