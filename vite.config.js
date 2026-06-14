import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contact: resolve(__dirname, 'contact.html'),
        finder: resolve(__dirname, 'finder.html'),
        grocerylist: resolve(__dirname, 'grocerylist.html'),
        mealfinder: resolve(__dirname, 'mealfinder.html'),
        mealplanner: resolve(__dirname, 'mealplanner.html'),
      },
    },
  },
});
