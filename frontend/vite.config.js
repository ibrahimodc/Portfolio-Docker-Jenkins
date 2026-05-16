import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Redirige /uploads/* vers le backend Express (images uploadées localement)
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      // Redirige /api/* vers le backend Express
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  }
})
