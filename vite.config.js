import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5000,
    host: '0.0.0.0',
    cors: true,
    hmr: {
      host: 'localhost',
      clientPort: 443,
      protocol: 'wss'
    },
    strictPort: true,
    // Allow all hosts and specifically Replit domains
    allowedHosts: [
      'localhost',
      '.replit.dev',
      '.repl.co',
      '.replit.app',
      'd00c9d7c-6c23-4ef3-89b6-12830f2ef8fd-00-3k26319f8rplj.riker.replit.dev'
    ]
  },
});