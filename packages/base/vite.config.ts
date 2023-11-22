import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import vitePluginConditionalCompile from 'vite-plugin-conditional-compile';
import { createHtmlPlugin } from 'vite-plugin-html';

// Do not delete it. After deletion, it will be synchronized to dms-ui-ee, causing an error.
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig((config) => {
  const title = 'Action SQLE';

  return {
    plugins: [
      vitePluginConditionalCompile({
        include: [/^.+\/packages\/.+\/.+.(ts|tsx)$/]
      }),
      eslint({
        exclude: ['**/node_modules/**', '**/packages/**/src/api/**/*.ts']
      }),
      react(),
      createHtmlPlugin({
        inject: {
          data: {
            title
          }
        }
      })
    ],
    css: {
      preprocessorOptions: {
        less: {
          // 支持内联 JavaScript
          javascriptEnabled: true
        }
      }
    },
    server: {
      //hot update
      watch: {
        ignored: [
          '!**/node_modules/sqle/**',
          '!**/node_modules/@actiontech/shared/**'
        ]
      },
      host: '0.0.0.0',
      open: true,
      proxy: {
        '^(/v|/sqle/v)': {
          target: 'http://10.186.62.13:27601'
        },
        '^/logo': {
          target: 'http://10.186.62.13:27601'
        }
      },
      cors: true
    }
  };
});
