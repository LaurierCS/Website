import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// Static by default. Pages that read Supabase set `prerender = false`.
export default defineConfig({
  site: 'https://lauriercs.org',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
