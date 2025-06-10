import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/monkeytype': {
        target: 'https://monkeytype.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/monkeytype/, ''),
        secure: false
      }
    }
  }
})
