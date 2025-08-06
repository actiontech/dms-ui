import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: false,
  minify: true,
  treeshake: true,
  target: 'es2020',
  outDir: 'dist',
  splitting: false
});
