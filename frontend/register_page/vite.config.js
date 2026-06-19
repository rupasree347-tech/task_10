import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/records':    'http://localhost:5000',
      '/dashboard':  'http://localhost:5000',
      '/categories': 'http://localhost:5000',
    },
  },
})
