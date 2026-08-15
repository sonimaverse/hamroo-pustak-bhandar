import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

// Plugin to duplicate index.html as 404.html for GitHub Pages SPA direct routing
function githubPagesSpa(): Plugin {
  return {
    name: 'github-pages-spa',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexHtml = path.join(distDir, 'index.html');
      const html404 = path.join(distDir, '404.html');
      if (fs.existsSync(indexHtml)) {
        fs.copyFileSync(indexHtml, html404);
        console.log('Successfully created dist/404.html copy for GitHub Pages SPA routing');
      }
    },
  };
}

export default defineConfig(() => {
  const basePath = process.env.VITE_BASE_PATH || (process.env.GITHUB_ACTIONS ? '/hamroo-pustak-bhandar/' : '/');
  return {
    base: basePath,
    plugins: [react(), tailwindcss(), githubPagesSpa()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
