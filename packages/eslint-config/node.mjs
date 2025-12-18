import globals from 'globals';
import pluginImport from 'eslint-plugin-import';
import { tsBaseConfigs, ignores } from './base.mjs';
import pluginNode from 'eslint-plugin-node';
import { defineConfig } from 'eslint/config';

const nodeConfig = {
  files: ['**/*.{js,mjs,cjs,ts}'],
  plugins: {
    import: pluginImport,
    node: pluginNode
  },
  languageOptions: {
    globals: {
      ...globals.node
    }
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-require-imports': 'warn',
    '@typescript-eslint/no-empty-object-type': 'off'
  }
};
const node = defineConfig([...tsBaseConfigs, nodeConfig, ignores]);

/** @type {import("eslint").Linter.Config[]} */
export default node;
