import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/ppyroath.github.io/',
  plugins: [vue()],
  server: {
    host: true,
  }
})
