import { defineConfig } from 'dumi';
import { version } from './package.json';
export default defineConfig({
  outputPath: 'docs-dist',
  publicPath: `/dms-docs/`,
  base: `/dms-docs/`,
  themeConfig: {
    name: 'Icon',
    rtl: true,
    features: {
      codeBox: false
    }
  },
  styles: [
    `.dumi-default-previewer-actions .dumi-default-previewer-action-btn:nth-child(1), 
    .dumi-default-previewer-actions .dumi-default-previewer-action-btn:nth-child(2) { display: none }`
  ],
  define: {
    VERSION: version
  }
});
