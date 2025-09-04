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
  alias: {
    '@actiontech/dms-kit': join(__dirname, 'src'),
    '@actiontech/icons': join(__dirname, '../icons/src')
  },
  styles: [
    `html, body {
      background: transparent;
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
