import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Usamos 'plugin-react' que es el correcto

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()]
})
