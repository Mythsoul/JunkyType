import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    proxy: {
      '/monkeytype': {
        target: 'https://monkeytype.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/monkeytype/, ''),
        secure: false
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        // Disable caching by adding timestamps to filenames
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
})
