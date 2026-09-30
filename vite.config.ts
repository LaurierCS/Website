import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, cpSync } from 'fs'
import { resolve } from 'path'

function copyStaticFiles() {
  return {
    name: 'copy-static-files',
    closeBundle() {
      copyFileSync(resolve('public/sitemap.xml'), resolve('dist/sitemap.xml'))
      copyFileSync(resolve('public/robots.txt'), resolve('dist/robots.txt'))
      copyFileSync(resolve('public/404.html'), resolve('dist/404.html'))
      copyFileSync(resolve('public/favicon.ico'), resolve('dist/favicon.ico'))
      cpSync(resolve('public/favicon'), resolve('dist/favicon'), { recursive: true, force: true })
      cpSync(resolve('public/assets'), resolve('dist/assets'), { recursive: true, force: true })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), copyStaticFiles()],
    build: {
      outDir: 'dist',
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://api.spencerkelly.ca',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'), // Keep /api prefix
        },
      },
    },
    define: {
      'import.meta.env.SUPABASE_URL': JSON.stringify(env.SUPABASE_URL),
      'import.meta.env.SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY),
    },
  }
})