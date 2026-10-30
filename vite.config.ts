import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirnameResolved = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: './',  // 使用相对路径，支持 file:// 协议访问
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirnameResolved, 'index.html'),
        table: resolve(__dirnameResolved, 'table.html'),
      },
    },
  },
  server: {
    port: 5000,
    host: '0.0.0.0',
    allowedHosts: true,
    hmr: {
      overlay: true,
      path: '/hot/vite-hmr',
      port: 6000,
      clientPort: 443,
      timeout: 30000,
    },
    watch: {
      usePolling: true,
      interval: 100,
    }
  },
});
