import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.BUILD_TARGET === 'android' ? './' : '/cred-loan-calculator/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Recharts (largest dependency) into separate chunk
          'recharts': ['recharts'],
          // Split React into separate chunk
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    // Reduce chunk size warning threshold
    chunkSizeWarningLimit: 1000,
    // Use esbuild for minification (faster than terser)
    minify: 'esbuild',
  },
})
