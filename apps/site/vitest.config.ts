/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// Astro's Vite setup, so tests can render .astro components and import .svg files the way pages do. Tests run
// in Node, like the server that renders the pages; a browser-like environment would get the .svg files as
// plain image data instead of components.
export default getViteConfig({
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
