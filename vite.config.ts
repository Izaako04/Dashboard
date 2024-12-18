import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "https://izaako04.github.io/Dashboard/",
  plugins: [react()],
})