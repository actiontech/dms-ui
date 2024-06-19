import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  base: '/packages/icons/docs-dist/', // test
  publicPath: '/packages/icons/docs-dist/', // test
  themeConfig: {
    name: 'Icon',
    rtl: true
  },
});
