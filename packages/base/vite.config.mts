import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import vitePluginConditionalCompile from 'vite-plugin-conditional-compile';
import { createHtmlPlugin } from 'vite-plugin-html';
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
  const isPROVISION = buildTypes.includes('PROVISION');
  const isDMS = isSQLE && isPROVISION;
  const isMajor = buildTypes.includes('MAJOR');

  const genTitle = () => {
    if (isDMS) {
      return 'DMS';
    }

    if (isSQLE) {
      return 'SQLE';
    }

    if (isPROVISION) {
      return 'provision';
    }

    return 'DMS';
  };

  const title = `Action ${genTitle()}`;

  return {
    plugins: [
      vitePluginConditionalCompile({
        include: [/^.+\/packages\/.+\/.+.(ts|tsx)$/],
        env: {
          ee: isEE,
          ce: isCE,
          sqle: isSQLE,
          provision: isPROVISION,
          dms: isDMS,
          demo: isDemo,
          major: isMajor
        }
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
    resolve: {
      alias: {
        '~': path.resolve(__dirname, '../provision/src')
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
          '!**/node_modules/provision/**',
          '!**/node_modules/@actiontech/shared/**'
        ]
      },
      host: '0.0.0.0',
      open: true,
      proxy: {
        '^(/v|/sqle/v)': {
          target: 'http://10.186.62.13:11000/'
        },
        '^/provision/v': {
          target: 'http://10.186.62.13:11000/'
        },
        '^/logo': {
          target: 'http://10.186.62.13:11000/'
        }
      },
      cors: true
    }
  };
});
