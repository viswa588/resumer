import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['9gjpq4-5173.csb.app'],
    // OR allow all (use with caution in dev):
    // allowedHosts: 'all'
  }
})
