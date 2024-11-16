import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: '~', replacement: '/src' }]
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Địa chỉ của backend
        changeOrigin: true
      }
    }
  }
})
