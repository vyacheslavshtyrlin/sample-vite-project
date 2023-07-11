import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import dns from 'dns'
import * as path from 'path'

// show localhost
dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [react()],
  server: {
    proxy: {
      '/v1/': {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

