import { defineConfig } from 'father';

export default defineConfig({
  esm: {
    output: 'es',
    transformer: 'babel'
  },
  cjs: {
    output: 'lib',
    transformer: 'babel'
  }
});
