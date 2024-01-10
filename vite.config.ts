import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://3.36.120.148:3000',
      '/ai': 'http://b963-34-145-79-126.ngrok-free.app'
    }
  }
})
