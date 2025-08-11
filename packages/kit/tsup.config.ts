import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  // 生成 .d.ts。若要彻底规避外部库类型导致的诊断，可将其改为对象并设置 skipDiagnostics
  dts: true,
  clean: true,
  sourcemap: false,
  minify: true,
  treeshake: true,
  target: 'es2020',
  outDir: 'dist',
  splitting: false,
  platform: 'browser',
  external: [
    // Keep peer deps/external UI libs out of the bundle
    'react',
    'react-dom',
    'antd',
    '@ant-design/cssinjs',
    '@mui/material',
    '@mui/system',
    '@emotion/styled',
    '@monaco-editor/react',
    'monaco-editor'
  ],
  esbuildPlugins: [
    {
      name: 'external-worker-query-plugin',
      setup(build) {
        build.onResolve({ filter: /\?worker$/ }, (args) => {
          return { path: args.path, external: true };
        });
      }
    }
  ]
});
