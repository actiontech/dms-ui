import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import eslint from 'vite-plugin-eslint';
import vitePluginConditionalCompile from 'vite-plugin-conditional-compile';

// https://vitejs.dev/config/
export default defineConfig((config) => {
  const modes = config.mode.split(',');
  const isProvision = modes.includes('provision');

  return {
    plugins: [
      vitePluginConditionalCompile({ expand: { isProvision } }),

      eslint(),
      react()
    ],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src')
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
      port: 5200,
      host: '0.0.0.0',
      open: true,
      proxy: {
        '^/v': {
          target: 'http://10.186.62.9:27601/'
        }
      },
      cors: true
    }
  };
});
