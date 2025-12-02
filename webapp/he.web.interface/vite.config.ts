import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    // Proxy enabled for local API during development - avoids CORS issues
    // Change target to Azure container for remote testing
    proxy: {
      '/api': {
        target: 'http://localhost:5129',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
