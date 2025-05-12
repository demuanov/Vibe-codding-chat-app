import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5673,
    // You can also specify the host if needed
    // host: '0.0.0.0' // to listen on all network interfaces
  }
})
