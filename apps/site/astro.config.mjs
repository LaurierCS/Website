import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// Static by default. Pages that read Supabase set `prerender = false`.
export default defineConfig({
  site: 'https://lauriercs.org',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Vite only accepts relative, absolute or alias paths in `import.meta.glob`, so the brand kit is an alias.
      alias: { '@lcs/brand': fileURLToPath(new URL('../../packages/brand', import.meta.url)) },
    },
  },
});
