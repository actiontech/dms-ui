import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import * as path from 'path';
import vitePluginConditionalCompile from 'vite-plugin-conditional-compile';

// https://vitejs.dev/config/
export default defineConfig((config) => {
  const buildTypes = process.env.buildType?.split(',') ?? [];
  /*
   * ee and ce mode used to support sqle
   */
  const isEE = buildTypes.includes('ee');
  const isCE = buildTypes.includes('ce');

  const isSQLE = buildTypes.includes('SQLE');

  return {
    plugins: [
      vitePluginConditionalCompile({
        expand: { isCE, isEE, isSQLE }
      }),
      eslint({
        exclude: ['**/node_modules/**', '**/packages/**/src/api/**/*.ts']
      }),
      react()
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
        }
      },
      cors: true
    }
  };
});
