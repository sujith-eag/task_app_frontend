import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // For all regular HTTP API requests, path starting with /api will be forwarded
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      // Specifically for Socket.IO WebSocket connections
      '/socket.io': {
        target: 'http://localhost:8000',
        ws: true,
      },
    }
  }
})