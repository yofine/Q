import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [react(), dts({ include: ['lib'] })],
  define: {
    'process.env': {},
  },
  build: {
    copyPublicDir: false,
    lib: {
      name: 'Q',
      entry: resolve(__dirname, 'lib/index.ts'),
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['react'],
    },
  },
})
