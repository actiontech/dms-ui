import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
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
  ]
});
