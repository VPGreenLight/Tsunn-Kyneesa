import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { websocketChatPlugin } from './src/server/websocketPlugin.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), websocketChatPlugin()],
  server: {
    host: true,
    allowedHosts: true,
  },
})
