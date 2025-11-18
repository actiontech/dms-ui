import { defineConfig } from 'dumi';
import { join } from 'path';
import { version } from './package.json';

export default defineConfig({
  outputPath: 'docs-dist',
  publicPath: `/dms-docs/`,
  base: `/dms-docs/`,
  themeConfig: {
    name: 'DMS-Kit',
    nav: [{ title: '组件', link: '/components' }]
  },
  resolve: {
    atomDirs: [{ type: 'components', dir: 'src/components' }]
  },
  // 配置dumi忽略某些文件，仅用于文档生成
  conventionRoutes: {
    // 排除测试文件
    exclude: [
      /\/demo\//,
      /\/demos\//,
      /\/__tests__\//,
      /\/__snapshots__\//,
      /\.test\.(ts|tsx|js|jsx)$/,
      /\.snap$/,
      /\/testUtil\//
    ]
  },
  alias: {
    '@actiontech/dms-kit': join(__dirname, 'src'),
    '@actiontech/icons': join(__dirname, '../icons/src')
  },
  styles: [
    `html, body {
      background: transparent;
    }`,
    // 在base中引入了less文件，其他包括antd reset.css包含box-sizing: border-box，这里需要再重置一下
    // 不然组件在demo中会有一些样式问题
    `*, *::before, *::after {
       box-sizing: border-box;
     }`,
    `.dumi-default-toc {
      display: none !important;
    }
    .dumi-default-doc-layout > main {
      max-width: 100% !important;
    }  
    .dumi-default-sidebar {
      width: 20% !important;
      min-width: 200px !important;
      max-width: 400px !important;
    }
    `
  ],
  mfsu: false,
  hash: true,
  define: {
    VERSION: version
  }
});
