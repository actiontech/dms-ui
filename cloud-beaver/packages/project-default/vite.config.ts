import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { resolve } from 'node:path';
import packageJson from './package.json';
import { createHtmlPlugin } from 'vite-plugin-html';

function withTimestamp(version: string) {
  return `${version}.${new Date()
    .toISOString()
    .substr(0, 19)
    .replace('T', '')
    .split(/[-:]+/)
    .join('')
    .slice(0, -2)}`;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const envServer = process.env['server'] || 'http://localhost:8978';
  const productVersion = isProduction
    ? withTimestamp(packageJson.version)
    : packageJson.version;

  return {
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true
      }),
      viteReact({
        babel: {
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }]
          ]
        }
      }),
      // todo vite plugin 类型问题
      createHtmlPlugin({
        inject: {
          data: {
            title: 'CloudBeaver Community'
          }
        }
      }) as any
    ],
    define: {
      _VERSION_: JSON.stringify(productVersion),
      _DEV_: !isProduction
    },
    server: {
      strictPort: true,
      host: true,
      port: 3021,
      origin: 'http://localhost:3021',
      cors: {
        origin:
          /(^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$|^vscode-webview:\/\/|^vscode-file:\/\/vscode-app)/
      },
      proxy: {
        '/api': {
          target: envServer,
          changeOrigin: true,
          secure: false
        },
        '/auth-external': {
          target: envServer,
          changeOrigin: true,
          secure: false
        },
        '/api/ws': {
          target: envServer?.replace('http:', 'ws:'),
          ws: true,
          rewriteWsOrigin: true,
          secure: false
        }
      }
    }
  };
});
