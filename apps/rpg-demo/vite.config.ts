import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      // Allow Vite to read the workspace symlinks for @pixelore/react source.
      allow: ['..', '../..'],
    },
  },
})
