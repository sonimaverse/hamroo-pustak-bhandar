import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// CHANGE this to match your GitHub repo name, e.g. if your repo is
// "hamro-pustak-bhandar" on GitHub, keep "/hamro-pustak-bhandar/".
// If deploying to a user/org page (username.github.io), use "/".
export default defineConfig({
  plugins: [react()],
  base: '/hamro-pustak-bhandar/',
})