// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  vite: { plugins: [tailwindcss()] },
  // The event posters live in Supabase storage. Allowing its public files lets the build resize them, so the page
  // doesn't download every full-size poster.
  image: {
    remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co', pathname: '/storage/v1/object/public/**' }],
  },
});
