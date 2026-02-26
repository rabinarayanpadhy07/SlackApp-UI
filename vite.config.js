import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // [!code ++]
import path from 'path'
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // [!code ++]
  ],
   resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})