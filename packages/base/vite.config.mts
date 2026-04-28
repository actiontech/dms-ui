import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginConditionalCompile from 'vite-plugin-conditional-compile';
import { createHtmlPlugin } from 'vite-plugin-html';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig(() => {
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
          demo: isDemo
        }
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
      alias: [
        {
          find: /^@actiontech\/dms-kit\/es\/(.*)$/,
          replacement: path.resolve(__dirname, '../dms-kit/src/$1')
        },
        {
          find: '@actiontech/dms-kit',
          replacement: path.resolve(__dirname, '../dms-kit/src')
        },
        {
          find: '~',
          replacement: path.resolve(__dirname, '../provision/src')
        }
      ]
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
      target: 'chrome80',
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
          codeSplitting: {
            groups: [
              {
                test: /[\\/]node_modules[\\/]antd[\\/]/,
                name: 'antd.module'
              },
              {
                test: /[\\/]node_modules[\\/]react[\\/]/,
                name: 'react.module'
              },
              {
                test: /[\\/]node_modules[\\/]lodash[\\/]/,
                name: 'lodash.module'
              },
              {
                test: /[\\/]node_modules[\\/]@ant-design[\\/]icons[\\/]/,
                name: 'antd.icon.module'
              },
              {
                test: /[\\/]node_modules[\\/]@ant-design[\\/]plots[\\/]/,
                name: 'antd.plots'
              },
              {
                test: /[\\/]node_modules[\\/]@actiontech[\\/]shared[\\/]/,
                name: 'actiontech.shared'
              }
            ]
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
          target: 'http://10.186.61.30:11000/'
        },
        '^/provision/v': {
          target: 'http://10.186.61.30:11000/'
        },
        '^/logo': {
          target: 'http://10.186.61.30:11000/'
        }
      },
      cors: true
    }
  };
});
