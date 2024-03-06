import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import vitePluginConditionalCompile from 'vite-plugin-conditional-compile';
import { createHtmlPlugin } from 'vite-plugin-html';

// Do not delete it. After deletion, it will be synchronized to dms-ui-ee, causing an error.
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig((config) => {
  const buildTypes = process.env.buildType?.split(',') ?? [];
  /*
   * ee and ce mode used to support sqle
   */
  const isCE = buildTypes.includes('ce') && buildTypes.includes('SQLE');
  const isEE = !isCE;
  const isSQLE = buildTypes.includes('SQLE');
  const isDemo = buildTypes.includes('DEMO');
  const title = 'Action SQLE';

  return {
    plugins: [
      vitePluginConditionalCompile({
        include: [/^.+\/packages\/.+\/.+.(ts|tsx)$/],
        env: { ee: isEE, ce: isCE, sqle: isSQLE, demo: isDemo }
      }),
      eslint({
        exclude: [
          '**/node_modules/**',
          '**/packages/**/lib/api/**',
          '!**/packages/**/lib/api/common/**'
        ]
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
    build: {
      rollupOptions: {
        // resolve css in js 'use client' warn
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
            return;
          }
          warn(warning);
        },
        output: {
          minifyInternalExports: true,
          manualChunks: {
            'antd.module': ['antd'],
            'react.module': ['react'],
            'lodash.module': ['lodash'],
            'antd.icon.module': ['@ant-design/icons'],
            'antd.plots': ['@ant-design/plots'],
            'actiontech.shared': ['@actiontech/shared']
          }
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
          target: 'http://10.186.57.12:7601'
        },
        '^/logo': {
          target: 'http://10.186.57.12:7601'
        }
      },
      cors: true
    }
  };
});
