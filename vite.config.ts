/// <reference types="vitest" />
import { URL, fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import nodePolyfills from 'vite-plugin-node-stdlib-browser'
import vitePluginVercelApi from 'vite-plugin-vercel-api'

export default defineConfig({
  plugins: [nodePolyfills(), react(), vitePluginVercelApi()],
  resolve: {
    alias: [{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }],
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      define: {
        global: 'globalThis',
      },
      supported: {
        bigint: true,
      },
    },
  },
  build: {
    target: ['esnext'],
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
  define: {
    'import.meta.vitest': 'undefined',
  },
})
