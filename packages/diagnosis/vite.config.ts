import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['../sqle/src/types/common.type.ts']
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true
      }
    }
  },
  server: {
    host: '0.0.0.0',
    open: true,
    proxy: {
      '^(/v|/diagno/v)': {
        target: 'http://10.186.60.59:7603'
      },
      '^/logo': {
        target: 'http://10.186.60.59:7603'
      }
    },
    cors: true
  }
});
