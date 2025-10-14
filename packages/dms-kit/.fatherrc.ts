import { defineConfig } from 'father';

export default defineConfig({
  // 排除不需要打包的文件
  sourcemap: false,
  esm: {
    output: 'es',
    transformer: 'babel',
    ignores: [
      'src/**/demo/**',
      'src/**/demos/**',
      'src/**/__tests__/**',
      'src/**/__snapshots__/**',
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
      'src/**/*.snap',
      'src/testUtil/**',
      'src/**/*.md'
    ]
  },
  cjs: {
    output: 'lib',
    transformer: 'babel',
    ignores: [
      'src/**/demo/**',
      'src/**/demos/**',
      'src/**/__tests__/**',
      'src/**/__snapshots__/**',
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
      'src/**/*.snap',
      'src/testUtil/**',
      'src/**/*.md'
    ]
  }
});
